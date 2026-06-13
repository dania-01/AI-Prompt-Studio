export const estimateTokens = (text = "") => Math.ceil(text.length / 4);

export const tokenPercentage = (text = "", maxTokens = 2000) => {
  const tokens = estimateTokens(text);
  return Math.min((tokens / maxTokens) * 100, 100);
};

export const tokenColor = (text = "", maxTokens = 2000) => {
  const pct = tokenPercentage(text, maxTokens);
  if (pct >= 90) return "text-red-500";
  if (pct >= 70) return "text-yellow-500";
  return "text-green-500";
};
