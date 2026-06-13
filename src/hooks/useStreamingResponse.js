"use client";

import { useCallback } from "react";
import { usePromptContext } from "@/context/PromptContext";

export function useStreamingResponse() {
  const {
    messages, setMessages, resetMessages,
    isStreaming, setIsStreaming,
    abortRef,
    systemPrompt,
    apiKey,
    trackPromptSent,
  } = usePromptContext();

  const clearMessages = useCallback(() => resetMessages(), [resetMessages]);

  const stopGeneration = useCallback(() => {
    abortRef.current?.abort();
  }, [abortRef]);

  const startStream = useCallback(
    async ({ prompt, model, temperature = 0.7, maxTokens = 1024, attachment = null, previousMessages = [] }) => {
      // Cancel any in-flight request
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setIsStreaming(true);
      const startTime = Date.now();
      const assistantId = `assistant-${startTime}`;

      const userMsg = {
        id: `user-${startTime}`,
        role: "user",
        content: prompt,
        attachmentUrl: attachment,
        timestamp: startTime,
      };
      const assistantMsg = {
        id: assistantId,
        role: "assistant",
        content: "",
        model,
        timestamp: startTime,
      };

      setMessages((prev) => [...prev, userMsg, assistantMsg]);

      // Build API messages: optional system prompt + full history + new user turn
      const apiMessages = [
        ...(systemPrompt.trim() ? [{ role: "system", content: systemPrompt.trim() }] : []),
        ...previousMessages.map((m) => ({ role: m.role, content: m.content })),
        {
          role: "user",
          content: attachment
            ? [
                { type: "text", text: prompt },
                { type: "image_url", image_url: { url: attachment } },
              ]
            : prompt,
        },
      ];

      try {
        const resolvedKey = apiKey || process.env.NEXT_PUBLIC_GROQ_API_KEY;
        trackPromptSent();
        const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          signal: controller.signal,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resolvedKey}`,
          },
          body: JSON.stringify({ model, messages: apiMessages, temperature, max_tokens: maxTokens, stream: true }),
        });

        if (!res.ok) {
          const errBody = await res.text();
          throw new Error(`Groq API error ${res.status}: ${errBody}`);
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
            if (data === "[DONE]") {
              setMessages((prev) => {
                const copy = [...prev];
                const last = copy[copy.length - 1];
                if (last?.id === assistantId) {
                  copy[copy.length - 1] = { ...last, responseTime: Date.now() - startTime };
                }
                return copy;
              });
              return;
            }
            try {
              const parsed = JSON.parse(data);
              const word = parsed.choices[0]?.delta?.content || "";
              if (word) {
                setMessages((prev) => {
                  const copy = [...prev];
                  const last = copy[copy.length - 1];
                  if (last?.id === assistantId) {
                    copy[copy.length - 1] = { ...last, content: last.content + word };
                  }
                  return copy;
                });
              }
            } catch {
              continue;
            }
          }
        }
        setMessages((prev) => {
          const copy = [...prev];
          const last = copy[copy.length - 1];
          if (last?.id === assistantId) {
            copy[copy.length - 1] = { ...last, responseTime: Date.now() - startTime };
          }
          return copy;
        });
      } catch (err) {
        if (err.name === "AbortError") {
          // User stopped — mark as complete with whatever was streamed
          setMessages((prev) => {
            const copy = [...prev];
            const last = copy[copy.length - 1];
            if (last?.id === assistantId && last.content) {
              copy[copy.length - 1] = { ...last, responseTime: Date.now() - startTime, stopped: true };
            } else if (last?.id === assistantId) {
              copy.pop(); // remove empty assistant bubble
            }
            return copy;
          });
        } else {
          setMessages((prev) => {
            const copy = [...prev];
            const last = copy[copy.length - 1];
            if (last?.id === assistantId) {
              copy[copy.length - 1] = { ...last, error: err.message || "Streaming failed." };
            }
            return copy;
          });
        }
      } finally {
        setIsStreaming(false);
        abortRef.current = null;
      }
    },
    [setMessages, setIsStreaming, abortRef, systemPrompt, apiKey, trackPromptSent]
  );

  return { messages, isStreaming, startStream, clearMessages, stopGeneration };
}
