export const MODELS = [
  {
    id: "llama-3.3-70b-versatile",
    label: "Llama 3.3 70B",
    description: "Most capable — best for complex reasoning and detailed answers",
  },
  {
    id: "llama-3.1-8b-instant",
    label: "Llama 3.1 8B ⚡",
    description: "Lightweight and instant — ideal for quick responses",
  },
  {
    id: "deepseek-r1-distill-llama-70b",
    label: "DeepSeek R1 70B",
    description: "Reasoning-focused model — great for step-by-step problems",
  },
  {
    id: "gemma2-9b-it",
    label: "Gemma 2 9B",
    description: "Google's efficient model — strong instruction following",
  },
  {
    id: "mixtral-8x7b-32768",
    label: "Mixtral 8×7B",
    description: "Mixture-of-experts — strong multilingual performance",
  },
  {
    id: "qwen-qwq-32b",
    label: "Qwen QwQ 32B",
    description: "Strong reasoning model from Alibaba Cloud",
  },
  {
    id: "llama-3.2-11b-vision-preview",
    label: "Llama 3.2 Vision",
    description: "Supports image attachments — free tier included",
    vision: true,
  },
];

export const DEFAULT_MODEL = MODELS[0].id;
export const COMPARE_MODEL_A = MODELS[0].id;
export const COMPARE_MODEL_B = MODELS[1].id;
export const VISION_MODEL_ID = "llama-3.2-11b-vision-preview";
