export const plansByTool = {
  Cursor: ["Hobby", "Pro", "Business", "Enterprise"],
  "GitHub Copilot": ["Individual", "Business", "Enterprise"],
  Claude: ["Free", "Pro", "Max", "Team", "Enterprise", "API direct"],
  ChatGPT: ["Plus", "Team", "Enterprise", "API direct"],
  "Anthropic API direct": ["API direct"],
  "OpenAI API direct": ["API direct"],
  Gemini: ["Pro", "Ultra", "API"],
  Windsurf: ["Free", "Pro", "Teams", "Enterprise"]
} as const;

export const supportedTools = Object.keys(plansByTool);

export const useCases = [
  { value: "coding", label: "Coding" },
  { value: "writing", label: "Writing" },
  { value: "data", label: "Data" },
  { value: "research", label: "Research" },
  { value: "mixed", label: "Mixed" }
] as const;
