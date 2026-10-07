/**
 * TechLogo — real brand marks (public/logos/*.svg, see public/logos/LICENSE.md)
 * or custom thin line icons for concepts. Server-safe (no client JS).
 */

export const BRAND: Record<string, { src: string; color: string; label: string }> = {
  python: { src: "/logos/python.svg", color: "#3776AB", label: "Python" },
  fastapi: { src: "/logos/fastapi.svg", color: "#009688", label: "FastAPI" },
  pydantic: { src: "/logos/pydantic.svg", color: "#E92063", label: "Pydantic" },
  langchain: { src: "/logos/langchain.svg", color: "#1C3C3C", label: "LangChain" },
  langgraph: { src: "/logos/langgraph.svg", color: "#1C3C3C", label: "LangGraph" },
  opensearch: { src: "/logos/opensearch.svg", color: "#005EB8", label: "OpenSearch" },
  jira: { src: "/logos/jira.svg", color: "#0052CC", label: "Jira" },
  claude: { src: "/logos/claude.svg", color: "#D97757", label: "Claude" },
  openai: { src: "/logos/openai.svg", color: "#0D0D0D", label: "OpenAI" },
  aws: { src: "/logos/aws.svg", color: "#FF9900", label: "Amazon Web Services" },
  azure: { src: "/logos/azure.svg", color: "#0078D4", label: "Microsoft Azure" },
};

/** 24×24 line icons, stroke = currentColor */
export const CONCEPT: Record<string, string> = {
  api: "M7 8l-4 4 4 4M17 8l4 4-4 4M14 5l-4 14",
  sparkle: "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 16l.7 1.8 1.8.7-1.8.7L19 21l-.7-1.8-1.8-.7 1.8-.7z",
  llm: "M4 6h16v12H4zM8 10h8M8 14h5M4 9h16",
  prompt: "M4 5h16v14H4zM7 10l3 2-3 2M12 15h5",
  chat: "M4 5h13v9H9l-4 4v-4H4zM9 9h5M9 12h3M17 9h3v8h-1v3l-3-3h-5",
  tool: "M14.5 5.5a4 4 0 0 0-5 5L4 16v4h4l5.5-5.5a4 4 0 0 0 5-5l-2.5 2.5-2.5-.5-.5-2.5z",
  agent: "M12 3a3 3 0 1 1 0 6 3 3 0 0 1 0-6zM6 21v-3a6 6 0 0 1 12 0v3M18 7l2-2M6 7L4 5",
  robot: "M6 9h12v10H6zM12 5v4M9 13h.01M15 13h.01M9.5 16h5M3 13v3M21 13v3M12 4a1 1 0 1 1 0 .01",
  network: "M12 4a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM5 16a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM19 16a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM12 8v4M12 12l-6 4.5M12 12l6 4.5M7 18h10",
  trace: "M3 12h4l2-6 4 12 2-6h6",
  rag: "M5 4h9l4 4v12H5zM14 4v4h4M8 12h7M8 15h4M16.5 16.5l3 3M15 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  database: "M5 6c0-1.7 3.1-3 7-3s7 1.3 7 3-3.1 3-7 3-7-1.3-7-3zM5 6v12c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3",
  vector: "M4 20L20 4M4 20l6-1M4 20l1-6M8 8h.01M16 16h.01M6 12h.01M12 18h.01M17 10h.01",
  search: "M10.5 4a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13zM20 20l-4.8-4.8M8 10.5h5M10.5 8v5",
  embed: "M4 7h4v4H4zM4 15h4v2H4zM10 9h10M10 16h7M10 6h4M10 13h6",
  chunk: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  filter: "M4 5h16l-6 7v6l-4 2v-8z",
  gauge: "M4 17a8 8 0 1 1 16 0M12 17l4-5M8 17h.01M12 9v1M7.5 11l.7.7M16.5 11l-.7.7",
  ocr: "M4 8V5h3M17 5h3v3M20 16v3h-3M7 19H4v-3M8 9h8M8 12h8M8 15h5",
};

export function isBrand(key: string): boolean {
  return key in BRAND;
}

export default function TechLogo({
  name,
  size = 24,
  className = "",
  decorative = true,
}: {
  name: string;
  size?: number;
  className?: string;
  decorative?: boolean;
}) {
  const b = BRAND[name];
  if (b) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={b.src}
        width={size}
        height={size}
        alt={decorative ? "" : b.label}
        aria-hidden={decorative || undefined}
        className={className}
        loading="lazy"
        decoding="async"
        style={{ width: size, height: size, objectFit: "contain" }}
      />
    );
  }
  const d = CONCEPT[name] ?? CONCEPT.sparkle;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={size > 60 ? 0.9 : 1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}
