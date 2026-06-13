import { z } from "zod";

export const promptSchema = z.object({
  prompt: z
    .string()
    .min(3, "Prompt must be at least 3 characters")
    .max(2000, "Prompt must be 2000 characters or fewer"),
  model: z.string().min(1, "Please select a model"),
  temperature: z
    .number()
    .min(0, "Temperature must be at least 0")
    .max(1, "Temperature must be at most 1"),
});

export const validatePrompt = (data) => {
  const result = promptSchema.safeParse(data);
  if (result.success) return { valid: true, errors: {} };
  const errors = {};
  result.error.issues.forEach((issue) => {
    const key = issue.path[0];
    if (key) errors[key] = issue.message;
  });
  return { valid: false, errors };
};
