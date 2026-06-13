"use client";

import { useState, useCallback } from "react";
import { usePromptContext } from "@/context/PromptContext";
import { useStreamingResponse } from "@/hooks/useStreamingResponse";
import { usePromptHistory } from "@/hooks/usePromptHistory";
import { validatePrompt } from "@/validation/promptSchema";

export function usePrompt() {
  const { prompt, setPrompt, model, temperature, maxTokens, attachment, setAttachment, messages } = usePromptContext();
  const { startStream, clearMessages, stopGeneration } = useStreamingResponse();
  const { addToHistory } = usePromptHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const handleSubmit = useCallback(
    async (overridePrompt) => {
      const submittedPrompt = overridePrompt ?? prompt;
      const { valid, errors } = validatePrompt({ prompt: submittedPrompt, model, temperature });
      if (!valid) { setValidationErrors(errors); return; }
      setValidationErrors({});
      setError(null);
      setIsLoading(true);
      const previousMessages = messages;

      try {
        await startStream({ prompt: submittedPrompt, model, temperature, maxTokens, attachment, previousMessages });
        addToHistory({ prompt: submittedPrompt, model, temperature, timestamp: Date.now() });
        setPrompt("");
        setAttachment(null);
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setIsLoading(false);
      }
    },
    [prompt, model, temperature, maxTokens, attachment, messages, startStream, addToHistory, setPrompt, setAttachment]
  );

  const reset = useCallback(() => {
    clearMessages();
    setError(null);
    setValidationErrors({});
  }, [clearMessages]);

  return { prompt, setPrompt, handleSubmit, isLoading, error, validationErrors, reset, stopGeneration };
}
