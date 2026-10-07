#!/usr/bin/env python3
"""
build-hero-assets.py — turn the raw intro video into the seamless hero loop.

Requires: ffmpeg + ffprobe on PATH, Python 3.9+, numpy.

Usage
-----
  python3 scripts/build-hero-assets.py --video path/to/intro.mp4 \
      [--photo path/to/photo.jpg] [--crop W:H:X:Y] [--seconds 10] [--fade 0.5]

Outputs (written to public/):
  hero/hero.mp4        H.264 yuv420p, CRF 24, preset slow, AAC 96k, +faststart
  hero/hero.webm       VP9 CRF 36, Opus 80k
  hero/hero-poster.webp first frame of the loop (video poster / LCP image)
  portrait-bust.webp   480x600 head-to-shirt still (from --photo, or the sharpest frame)
  og.jpg               1200x630 social preview

How the loop works
------------------
Let L = clip length (first ~10 s) and F = fade length (0.5 s).
  main = source[F : L]           (length L-F)
  head = source[0 : F]
The last F seconds of `main` (source[L-F : L]) are cross-faded into `head`.
The result is L-F seconds long, starts at source[F] and ends on source[F-ε],
so when the <video> loops it continues without a visible jump.
Audio gets the identical treatment, sample-accurately in numpy (equal-power
curve) — ffmpeg's acrossfade is avoided because it can drop the audio track.
Nothing is stretched or retimed, so lips stay in sync.
"""
from __future__ import annotations

import argparse
import json
import shutil
import subprocess
import sys
import tempfile
import wave
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"
OUT_W, OUT_H = 768, 960          # hero aspect 768/960 = 0.8
WHITEN = "colorlevels=rimax=0.98:gimax=0.98:bimax=0.98"


def run(cmd: list[str], **kw) -> subprocess.CompletedProcess:
    print("  $", " ".join(str(c) for c in cmd)[:220])
    return subprocess.run(cmd, check=True, **kw)


def probe(path: Path) -> dict:
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_streams", "-show_format", "-of", "json", str(path)],
        check=True, capture_output=True, text=True,
    ).stdout
    return json.loads(out)


def read_frames(path: Path, w: int, h: int, times: list[float], scale: int = 4) -> list[np.ndarray]:
    """Grab small grayscale frames at the given timestamps."""
    sw, sh = w // scale, h // scale
    frames = []
    for t in times:
        raw = subprocess.run(
            ["ffmpeg", "-v", "error", "-ss", f"{t:.3f}", "-i", str(path), "-frames:v", "1",
             "-vf", f"scale={sw}:{sh}", "-f", "rawvideo", "-pix_fmt", "gray", "-"],
            check=True, capture_output=True,
        ).stdout
        if len(raw) == sw * sh:
            frames.append(np.frombuffer(raw, np.uint8).reshape(sh, sw))
    return frames


def detect_crop(path: Path, w: int, h: int, dur: float) -> str:
    """Find the person against the light backdrop and return a centred W:H:X:Y crop (aspect 0.8)."""
    scale = 4
    frames = read_frames(path, w, h, list(np.linspace(0.2, max(dur - 0.3, 0.3), 12)), scale)
    if not frames:
        sys.exit("Could not read frames for crop detection; pass --crop W:H:X:Y")
    union = np.zeros_like(frames[0], dtype=bool)
    for f in frames:
        bg = np.median(np.concatenate([f[:, :8].ravel(), f[:, -8:].ravel()]))
        union |= f < (bg - 28)          # anything clearly darker than the backdrop
    ys, xs = np.nonzero(union)
    if len(xs) < 50:
        sys.exit("Person not found automatically; pass --crop W:H:X:Y")
    # trim stray specks: use 0.5/99.5 percentiles
    x0, x1 = np.percentile(xs, [0.5, 99.5]) * scale
    y0, y1 = np.percentile(ys, [0.2, 99.8]) * scale
    pad = 0.04 * h
    ch = min(h, (y1 - y0) + 2 * pad)
    cw = ch * OUT_W / OUT_H
    if cw > w:
        cw, ch = w, w * OUT_H / OUT_W
    cx = (x0 + x1) / 2
    cy = (y0 + y1) / 2
    x = int(np.clip(cx - cw / 2, 0, w - cw))
    y = int(np.clip(cy - ch / 2, 0, h - ch))
    cw, ch = int(cw) // 2 * 2, int(ch) // 2 * 2
    crop = f"{cw}:{ch}:{x}:{y}"
    print(f"  detected person bbox x={x0:.0f}-{x1:.0f} y={y0:.0f}-{y1:.0f} -> crop={crop}")
    return crop


def read_audio(path: Path, start: float, length: float, sr: int, ch: int) -> np.ndarray:
    raw = subprocess.run(
        ["ffmpeg", "-v", "error", "-ss", f"{start:.6f}", "-t", f"{length:.6f}", "-i", str(path),
         "-vn", "-ac", str(ch), "-ar", str(sr), "-f", "f32le", "-"],
        check=True, capture_output=True,
    ).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, ch).copy()


def loop_audio(path: Path, L: float, F: float, sr: int, ch: int) -> np.ndarray:
    full = read_audio(path, 0.0, L, sr, ch)
    n_total = int(round(L * sr))
    n_fade = int(round(F * sr))
    if len(full) < n_total:  # pad if the stream is a hair short
        full = np.vstack([full, np.zeros((n_total - len(full), ch), np.float32)])
    full = full[:n_total]
    main = full[n_fade:]                 # source[F:L]
    head = full[:n_fade]                 # source[0:F]
    tail = main[-n_fade:]
    t = np.linspace(0.0, 1.0, n_fade, endpoint=False, dtype=np.float32)[:, None]
    fade_out = np.cos(t * np.pi / 2)     # equal-power
    fade_in = np.sin(t * np.pi / 2)
    blended = tail * fade_out + head * fade_in
    out = np.vstack([main[:-n_fade], blended])
    peak = float(np.max(np.abs(out))) or 1.0
    if peak > 0.999:
        out *= 0.999 / peak
    return out


def write_wav(path: Path, data: np.ndarray, sr: int) -> None:
    pcm = (np.clip(data, -1, 1) * 32767).astype("<i2")
    with wave.open(str(path), "wb") as w:
        w.setnchannels(data.shape[1])
        w.setsampwidth(2)
        w.setframerate(sr)
        w.writeframes(pcm.tobytes())


def sharpest_frame_time(path: Path, w: int, h: int, dur: float) -> float:
    times = list(np.linspace(0.3, max(dur - 0.3, 0.3), 20))
    frames = read_frames(path, w, h, times, scale=2)
    best, best_t = -1.0, times[0]
    for t, f in zip(times, frames):
        g = f.astype(np.float32)
        lap = g[1:-1, 1:-1] * 4 - g[:-2, 1:-1] - g[2:, 1:-1] - g[1:-1, :-2] - g[1:-1, 2:]
        v = float(lap.var())
        if v > best:
            best, best_t = v, t
    return best_t


def find_font() -> str | None:
    for p in [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        "/Library/Fonts/Arial Bold.ttf",
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
        "C:/Windows/Fonts/arialbd.ttf",
    ]:
        if Path(p).exists():
            return p
    return None


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--video", required=True, type=Path)
    ap.add_argument("--photo", type=Path, help="optional portrait photo for the ID card")
    ap.add_argument("--photo-crop", help="W:H:X:Y crop on the photo (aspect 0.8). Auto-centred if omitted")
    ap.add_argument("--crop", help="W:H:X:Y crop on the video. Auto-detected if omitted")
    ap.add_argument("--seconds", type=float, default=10.0)
    ap.add_argument("--fade", type=float, default=0.5)
    ap.add_argument("--name", default="", help="text for og.jpg (optional)")
    args = ap.parse_args()

    for tool in ("ffmpeg", "ffprobe"):
        if not shutil.which(tool):
            sys.exit(f"{tool} not found on PATH")

    src: Path = args.video
    info = probe(src)
    v = next(s for s in info["streams"] if s["codec_type"] == "video")
    a = next((s for s in info["streams"] if s["codec_type"] == "audio"), None)
    w, h = int(v["width"]), int(v["height"])
    dur = float(info["format"]["duration"])
    num, den = (int(x) for x in v["r_frame_rate"].split("/"))
    fps = num / den
    L = min(args.seconds, dur)
    F = args.fade
    print(f"source {w}x{h} @ {fps:.3f}fps, {dur:.2f}s -> loop {L - F:.2f}s (fade {F}s)")

    crop = args.crop or detect_crop(src, w, h, L)
    vf_base = f"crop={crop},scale={OUT_W}:{OUT_H}:flags=lanczos,{WHITEN},format=yuv420p"

    (PUBLIC / "hero").mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as td:
        tmp = Path(td)
        # ---- audio ----------------------------------------------------------
        wav = tmp / "loop.wav"
        if a:
            sr = int(a.get("sample_rate", 48000))
            ch = min(int(a.get("channels", 2)), 2)
            write_wav(wav, loop_audio(src, L, F, sr, ch), sr)

        # ---- video (xfade) --------------------------------------------------
        fc = (
            f"[0:v]fps={fps},{vf_base},split=2[a][b];"
            f"[a]trim=start={F}:end={L},setpts=PTS-STARTPTS[main];"
            f"[b]trim=start=0:end={F},setpts=PTS-STARTPTS[head];"
            f"[main][head]xfade=transition=fade:duration={F}:offset={L - 2 * F}[v]"
        )
        common_in = ["-i", str(src)] + (["-i", str(wav)] if a else [])
        maps = ["-map", "[v]"] + (["-map", "1:a", "-shortest"] if a else [])

        run(["ffmpeg", "-y", "-v", "error", *common_in, "-filter_complex", fc, *maps,
             "-c:v", "libx264", "-preset", "slow", "-crf", "24", "-pix_fmt", "yuv420p",
             "-profile:v", "high", "-movflags", "+faststart",
             *(["-c:a", "aac", "-b:a", "96k"] if a else ["-an"]),
             str(PUBLIC / "hero" / "hero.mp4")])
        run(["ffmpeg", "-y", "-v", "error", *common_in, "-filter_complex", fc, *maps,
             "-c:v", "libvpx-vp9", "-crf", "36", "-b:v", "0", "-row-mt", "1", "-deadline", "good",
             "-cpu-used", "2", "-pix_fmt", "yuv420p",
             *(["-c:a", "libopus", "-b:a", "80k"] if a else ["-an"]),
             str(PUBLIC / "hero" / "hero.webm")])

        # ---- poster (first frame of the loop, used until the video can play) --
        run(["ffmpeg", "-y", "-v", "error", "-i", str(PUBLIC / "hero" / "hero.mp4"), "-frames:v", "1",
             "-quality", "80", str(PUBLIC / "hero" / "hero-poster.webp")])

        # ---- portrait -------------------------------------------------------
        bust = PUBLIC / "portrait-bust.webp"
        if args.photo:
            pi = probe(args.photo)["streams"][0]
            pw, ph = int(pi["width"]), int(pi["height"])
            if args.photo_crop:
                pcrop = args.photo_crop
            else:
                ch_ = ph
                cw_ = int(ch_ * 0.8)
                if cw_ > pw:
                    cw_, ch_ = pw, int(pw / 0.8)
                pcrop = f"{cw_}:{ch_}:{(pw - cw_) // 2}:0"
            run(["ffmpeg", "-y", "-v", "error", "-i", str(args.photo), "-vf",
                 f"crop={pcrop},scale=480:600:flags=lanczos,{WHITEN}",
                 "-quality", "88", str(bust)])
        else:
            t = sharpest_frame_time(src, w, h, L)
            cw_, ch_, cx_, cy_ = (int(x) for x in crop.split(":"))
            # head-to-shirt: top ~38% of the person crop, centred
            bh = int(ch_ * 0.38)
            bw = int(bh * 0.8)
            bx = cx_ + (cw_ - bw) // 2
            run(["ffmpeg", "-y", "-v", "error", "-ss", f"{t:.3f}", "-i", str(src), "-frames:v", "1",
                 "-vf", f"crop={bw}:{bh}:{bx}:{cy_},scale=480:600:flags=lanczos,{WHITEN}",
                 "-quality", "88", str(bust)])

        # ---- og.jpg ---------------------------------------------------------
        t = sharpest_frame_time(src, w, h, L)
        font = find_font()
        draw = ""
        if font and args.name:
            safe = args.name.replace(":", r"\:").replace("'", "")
            draw = (f",drawtext=fontfile='{font}':text='{safe}':x=80:y=(h/2)-70:"
                    f"fontsize=72:fontcolor=0x0d0d0d")
        run(["ffmpeg", "-y", "-v", "error", "-ss", f"{t:.3f}", "-i", str(src), "-frames:v", "1",
             "-vf",
             f"crop={crop},scale=-2:630:flags=lanczos,{WHITEN},"
             f"pad=1200:630:(ow-iw)-80:0:color=0xffffff{draw}",
             "-q:v", "3", str(PUBLIC / "og.jpg")])

    for p in [PUBLIC / "hero" / "hero.mp4", PUBLIC / "hero" / "hero.webm", PUBLIC / "hero" / "hero-poster.webp",
              PUBLIC / "portrait-bust.webp",
              PUBLIC / "og.jpg"]:
        print(f"  ✓ {p.relative_to(ROOT)}  {p.stat().st_size / 1024:.0f} kB")


if __name__ == "__main__":
    main()
