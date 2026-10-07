/**
 * Single source of content for the whole site.
 * Every string below is taken from the résumé (public/Vishnu-A-S-Resume.pdf).
 * Components only read from this file — edit content here.
 *
 * Not present in the résumé, therefore intentionally absent from the site:
 * GitHub, certifications, achievements/coding-platform stats, project repo links.
 */

export type NavItem = { id: string; label: string };

export const PROFILE = {
  name: "Vishnu A S",
  firstName: "Vishnu",
  initials: "VAS",
  role: "Generative AI Engineer",
  email: "Vishnuashok9811@gmail.com",
  phone: "+91 8122455847",
  phoneHref: "tel:+918122455847",
  location: "Bengaluru, India",
  experience: "4.5 years",
  /** Verbatim — first line of the résumé's Professional Summary. */
  resumeSummary:
    "Generative AI Engineer with 4.5 years of experience designing, developing, and deploying end-to-end LLM-powered applications, including chatbots, document Q&A systems, and enterprise knowledge assistants built on Retrieval Augmented Generation (RAG) architecture.",
  /** Verbatim — a further line from the Professional Summary. */
  summaryExtra:
    "Proficient in integrating LLMs through REST APIs, including Claude models via AWS Bedrock and Azure Open AI.",
  /** Paraphrase of the résumé's own wording ("Solved real-world business problems using Generative AI…"). */
  quote:
    "Using Generative AI to solve real business problems — less manual search, faster document review, better decisions.",
  github: null as string | null,
  linkedin: "https://www.linkedin.com/in/vishnu-as-7734a11ab/",
  linkedinLabel: "linkedin.com/in/vishnu-as-7734a11ab",
  resume: "/Vishnu-A-S-Resume.pdf",
  languages: [
    { name: "English", level: "Advanced knowledge" },
    { name: "Tamil", level: "Working Knowledge" },
    { name: "Malayalam", level: "Native" },
  ],
} as const;

export const NAV: NavItem[] = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];

/* ------------------------------------------------------------------ skills */

export type Skill = {
  name: string;
  symbol: string;
  /** key into TechLogo BRAND or CONCEPT map */
  logo: string;
  /** project ids that mention this skill */
  projects?: string[];
};

export type SkillGroup = { family: string; short: string; skills: Skill[] };

const FRAUD = "fraud-alert";
const CLAIMS = "claim-adjudication";

export const SKILL_GROUPS: SkillGroup[] = [
  {
    family: "Languages & APIs",
    short: "Lang",
    skills: [
      { name: "Python", symbol: "Py", logo: "python" },
      { name: "FastAPI", symbol: "Fa", logo: "fastapi" },
      { name: "Pydantic", symbol: "Pd", logo: "pydantic" },
      { name: "RESTful APIs", symbol: "Ra", logo: "api", projects: [FRAUD] },
    ],
  },
  {
    family: "Generative AI",
    short: "GenAI",
    skills: [
      { name: "Generative AI", symbol: "Ga", logo: "sparkle", projects: [FRAUD, CLAIMS] },
      { name: "Large Language Models (LLMs)", symbol: "Lm", logo: "llm", projects: [FRAUD, CLAIMS] },
      { name: "Prompt Engineering", symbol: "Pe", logo: "prompt", projects: [FRAUD, CLAIMS] },
      { name: "Conversational AI", symbol: "Ca", logo: "chat" },
      { name: "OpenAI GPT-4", symbol: "G4", logo: "openai" },
      { name: "Claude", symbol: "Cl", logo: "claude", projects: [FRAUD] },
      { name: "Tool Calling", symbol: "Tc", logo: "tool" },
    ],
  },
  {
    family: "Agents & Orchestration",
    short: "Agents",
    skills: [
      { name: "Agentic AI", symbol: "Ag", logo: "agent" },
      { name: "AI Agents", symbol: "Ai", logo: "robot" },
      { name: "Multi-Agent Systems", symbol: "Ma", logo: "network" },
      { name: "LangChain", symbol: "Lc", logo: "langchain" },
      { name: "LangGraph", symbol: "Lg", logo: "langgraph", projects: [FRAUD, CLAIMS] },
      { name: "LangSmith", symbol: "Ls", logo: "trace" },
    ],
  },
  {
    family: "Retrieval & Vectors",
    short: "RAG",
    skills: [
      { name: "Retrieval-Augmented Generation (RAG)", symbol: "Rg", logo: "rag", projects: [FRAUD, CLAIMS] },
      { name: "Vector Databases", symbol: "Vd", logo: "database", projects: [FRAUD] },
      { name: "Pinecone", symbol: "Pc", logo: "vector" },
      { name: "FAISS", symbol: "Fs", logo: "vector", projects: [FRAUD] },
      { name: "OpenSearch", symbol: "Os", logo: "opensearch" },
      { name: "Semantic Search", symbol: "Ss", logo: "search" },
      { name: "Embedding Models", symbol: "Em", logo: "embed", projects: [FRAUD, CLAIMS] },
      { name: "SentenceTransformers", symbol: "St", logo: "embed", projects: [FRAUD] },
      { name: "Chunking Strategies", symbol: "Ch", logo: "chunk" },
      { name: "Metadata Filtering", symbol: "Mf", logo: "filter" },
      { name: "RAGAS", symbol: "Rs", logo: "gauge" },
      { name: "OCR (AWS Textract & Tesseract)", symbol: "Oc", logo: "ocr" },
    ],
  },
  {
    family: "AWS",
    short: "AWS",
    skills: [
      { name: "AWS Bedrock", symbol: "Bd", logo: "aws" },
      { name: "AWS Lambda", symbol: "La", logo: "aws", projects: [FRAUD] },
      { name: "Amazon S3", symbol: "S3", logo: "aws", projects: [FRAUD] },
      { name: "API Gateway", symbol: "Gw", logo: "aws", projects: [FRAUD] },
      { name: "Step Functions", symbol: "Sf", logo: "aws" },
    ],
  },
  {
    family: "Azure",
    short: "Azure",
    skills: [
      { name: "Azure OpenAI Service", symbol: "Ao", logo: "azure", projects: [CLAIMS] },
      { name: "Azure AI Search", symbol: "As", logo: "azure", projects: [CLAIMS] },
      { name: "Azure Functions", symbol: "Af", logo: "azure", projects: [CLAIMS] },
      { name: "Azure API Management", symbol: "Am", logo: "azure", projects: [CLAIMS] },
      { name: "Azure Logic Apps", symbol: "Lp", logo: "azure", projects: [CLAIMS] },
      { name: "Azure Blob Storage", symbol: "Bs", logo: "azure", projects: [CLAIMS] },
      { name: "Azure Monitor", symbol: "Mo", logo: "azure", projects: [CLAIMS] },
    ],
  },
  {
    family: "Tools",
    short: "Tools",
    skills: [{ name: "Jira", symbol: "Ji", logo: "jira" }],
  },
];

/* ---------------------------------------------------------------- projects */

export type Project = {
  id: string;
  index: string;
  title: string;
  kicker: string;
  client: string;
  description: string;
  features: string[];
  tech: { name: string; logo: string }[];
  github: string | null;
  ui: "fraud" | "claims";
};

export const PROJECTS: Project[] = [
  {
    id: FRAUD,
    index: "01",
    title: "Banking Fraud Alert System",
    kicker: "AWS · BFSI · HCL Tech",
    client: "Confidential Client (Banking & Financial Services)",
    description:
      "Designed and developed a Generative AI-powered fraud alert system for banking transactions, using LLMs to analyze suspicious activity and generate clear, investigator-ready alert summaries.",
    features: [
      "RAG pipeline contextualizing flagged transactions against historical fraud patterns and compliance policies",
      "FAISS vector database of historical fraud cases for fast similarity search",
      "Embeddings for transaction records via SentenceTransformers",
      "LangGraph pipelines orchestrating prompt chains and alert generation",
      "REST APIs for core banking fraud monitoring systems",
      "Validation and review checks to minimize false positives",
    ],
    tech: [
      { name: "Claude", logo: "claude" },
      { name: "LangGraph", logo: "langgraph" },
      { name: "FAISS", logo: "vector" },
      { name: "SentenceTransformers", logo: "embed" },
      { name: "AWS Lambda", logo: "aws" },
      { name: "S3", logo: "aws" },
      { name: "API Gateway", logo: "aws" },
    ],
    github: null,
    ui: "fraud",
  },
  {
    id: CLAIMS,
    index: "02",
    title: "Healthcare Claim Adjudication Platform",
    kicker: "Azure · Healthcare · LTIMindtree",
    client: "Confidential Client (Healthcare)",
    description:
      "Designed and developed a Generative AI-powered claim adjudication assistant using Azure OpenAI Service to automate the review and decisioning of healthcare insurance claims.",
    features: [
      "RAG pipelines with LangGraph, Azure OpenAI and Azure AI Search over policy documents and claim history",
      "Embedding models for claim forms, medical records and policy documents",
      "Serverless workflows on Azure Functions behind Azure API Management",
      "End-to-end orchestration with Azure Logic Apps",
      "PDF, CSV and relational sources unified via Azure Blob Storage",
      "Prompt engineering for accuracy with lower token usage and cost",
    ],
    tech: [
      { name: "Azure OpenAI", logo: "azure" },
      { name: "LangGraph", logo: "langgraph" },
      { name: "Azure AI Search", logo: "azure" },
      { name: "Azure Functions", logo: "azure" },
      { name: "Logic Apps", logo: "azure" },
      { name: "Blob Storage", logo: "azure" },
      { name: "Azure Monitor", logo: "azure" },
    ],
    github: null,
    ui: "claims",
  },
];

/* -------------------------------------------------------- experience/edu */

export type TimelineStop = {
  kind: "education" | "work";
  year: string;
  title: string;
  place: string;
  detail: string;
};

export const EDUCATION: TimelineStop[] = [
  {
    kind: "education",
    year: "2020",
    title: "Bachelor of Engineering",
    place: "Anna University, Tamil Nadu, India",
    detail: "Graduated 2020.",
  },
];

export const EXPERIENCE: TimelineStop[] = [
  {
    kind: "work",
    year: "Mar 2022 – Jan 2025",
    title: "Senior Software Engineer",
    place: "LTIMindtree · Chennai, India",
    detail:
      "Healthcare Claim Adjudication Platform (Azure) — Generative AI claim adjudication assistant on Azure OpenAI, RAG with LangGraph and Azure AI Search.",
  },
  {
    kind: "work",
    year: "Feb 2025 – Present",
    title: "Generative AI Engineer",
    place: "HCL Tech · Bengaluru, India",
    detail:
      "Banking Fraud Alert System (AWS) — LLM-generated, investigator-ready fraud alert summaries with RAG, FAISS and LangGraph.",
  },
];

/** Empty in the résumé — the sections are not rendered. */
export const CERTIFICATIONS: { title: string; issuer: string; href?: string }[] = [];
export const ACHIEVEMENTS: { label: string; value: number; suffix?: string; caption: string; detail: string; logo: string }[] = [];

/** "What I am" lines on the back of the ID card — all from the résumé. */
export const ID_BACK = [
  "Generative AI Engineer · 4.5 years",
  "Bachelor of Engineering · Anna University, 2020",
  "LLM apps: chatbots, document Q&A, knowledge assistants on RAG",
  "Banking Fraud Alert System · Healthcare Claim Adjudication Platform",
  "Domains: BFSI · Healthcare",
];
