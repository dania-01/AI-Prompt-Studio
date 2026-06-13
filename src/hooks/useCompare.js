"use client";

import { useCallback } from "react";
import { usePromptContext } from "@/context/PromptContext";
import { COMPARE_MODEL_A, COMPARE_MODEL_B } from "@/constants/models";

export function useCompare() {
  const {
    compareMode, setCompareMode, temperature,
    compareResponseA, setCompareResponseA,
    compareResponseB, setCompareResponseB,
    isStreamingA, setIsStreamingA,
    isStreamingB, setIsStreamingB,
    compareErrorA, setCompareErrorA,
    compareErrorB, setCompareErrorB,
    compareWinner, setCompareWinner,
    apiKey,
  } = usePromptContext();

  const toggleCompare = useCallback(() => setCompareMode((prev) => !prev), [setCompareMode]);

  const streamModel = useCallback(async ({ prompt, model, temperature, setData, setStreaming, setErr }) => {
    setStreaming(true);
    setData("");
    setErr(null);

    try {
      const resolvedKey = apiKey || process.env.NEXT_PUBLIC_GROQ_API_KEY;
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resolvedKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [{ role: "user", content: prompt }],
          temperature,
          max_tokens: 1024,
          stream: true,
        }),
      });

      if (!res.ok) {
        const body = await res.text();
        let reason = `API error ${res.status}`;
        try { reason = JSON.parse(body).error?.message ?? reason; } catch { /* ignore */ }
        throw new Error(reason);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n").filter((l) => l.startsWith("data: "));
        for (const line of lines) {
          const data = line.replace("data: ", "");
          if (data === "[DONE]") return;
          try {
            const parsed = JSON.parse(data);
            const word = parsed.choices[0]?.delta?.content || "";
            if (word) setData((prev) => prev + word);
          } catch {
            continue;
          }
        }
      }
    } catch (err) {
      setErr(err.message || "Comparison failed.");
    } finally {
      setStreaming(false);
    }
  }, [apiKey]);

  const runComparison = useCallback(
    async (prompt) => {
      await Promise.all([
        streamModel({
          prompt, model: COMPARE_MODEL_A, temperature,
          setData: setCompareResponseA,
          setStreaming: setIsStreamingA,
          setErr: setCompareErrorA,
        }),
        streamModel({
          prompt, model: COMPARE_MODEL_B, temperature,
          setData: setCompareResponseB,
          setStreaming: setIsStreamingB,
          setErr: setCompareErrorB,
        }),
      ]);
    },
    [streamModel, temperature, setCompareResponseA, setCompareResponseB, setIsStreamingA, setIsStreamingB, setCompareErrorA, setCompareErrorB]
  );

  return {
    compareMode, toggleCompare,
    responseA: compareResponseA,
    responseB: compareResponseB,
    isStreamingA, isStreamingB,
    errorA: compareErrorA,
    errorB: compareErrorB,
    runComparison,
    compareWinner, setCompareWinner,
  };
}
