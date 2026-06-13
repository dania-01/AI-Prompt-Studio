import axios from "axios";

const GROQ_BASE_URL = "https://api.groq.com/openai/v1";

export const groqAxios = axios.create({
  baseURL: GROQ_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}`,
  },
});

export const buildChatBody = (prompt, model, temperature = 0.7, stream = false) => ({
  model,
  messages: [{ role: "user", content: prompt }],
  temperature,
  max_tokens: 1024,
  stream,
});

export const fetchGroqNonStreaming = async (prompt, model, temperature = 0.7) => {
  const { data } = await groqAxios.post("/chat/completions", buildChatBody(prompt, model, temperature, false));
  return data.choices[0]?.message?.content ?? "";
};
