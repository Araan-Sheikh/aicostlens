export const toolNames = [
  "Cursor",
  "GitHub Copilot",
  "Claude",
  "ChatGPT",
  "Anthropic API direct",
  "OpenAI API direct",
  "Gemini",
  "Windsurf"
] as const;

export type ToolName = (typeof toolNames)[number];

export const plansByTool: Record<ToolName, readonly string[]> = {
  Cursor: ["Hobby", "Pro", "Business", "Enterprise"],
  "GitHub Copilot": ["Individual", "Business", "Enterprise"],
  Claude: ["Free", "Pro", "Max", "Team", "Enterprise", "API direct"],
  ChatGPT: ["Plus", "Team", "Enterprise", "API direct"],
  "Anthropic API direct": ["API direct"],
  "OpenAI API direct": ["API direct"],
  Gemini: ["Pro", "Ultra", "API"],
  Windsurf: ["Free", "Pro", "Teams", "Enterprise"]
} as const;

export const supportedTools = toolNames;

export const useCaseValues = ["coding", "writing", "data", "research", "mixed"] as const;

export type UseCase = (typeof useCaseValues)[number];

export const useCases: ReadonlyArray<{ value: UseCase; label: string }> = [
  { value: "coding", label: "Coding" },
  { value: "writing", label: "Writing" },
  { value: "data", label: "Data" },
  { value: "research", label: "Research" },
  { value: "mixed", label: "Mixed" }
] as const;
