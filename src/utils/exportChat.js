export const exportChatAsTxt = (prompt, response, model) => {
  const timestamp = new Date().toLocaleString();
  const content = [
    "AI Prompt Studio — Conversation Export",
    `Exported: ${timestamp}`,
    `Model: ${model}`,
    "",
    "=== PROMPT ===",
    prompt,
    "",
    "=== RESPONSE ===",
    response,
    "",
  ].join("\n");
  triggerDownload(content, "text/plain", `prompt-studio-${Date.now()}.txt`);
};

export const exportConversationAsMarkdown = (messages, model) => {
  const timestamp = new Date().toLocaleString();
  const lines = [
    `# AI Prompt Studio — Conversation`,
    ``,
    `> **Exported:** ${timestamp}  `,
    `> **Model:** ${model}`,
    ``,
    `---`,
    ``,
  ];
  for (const msg of messages) {
    if (msg.role === "user") {
      lines.push(`### You`, ``, msg.content, ``, `---`, ``);
    } else if (msg.role === "assistant" && msg.content) {
      lines.push(`### Assistant`, ``, msg.content, ``, `---`, ``);
    }
  }
  triggerDownload(lines.join("\n"), "text/markdown", `conversation-${Date.now()}.md`);
};

export const exportConversationAsPDF = (messages, model) => {
  const timestamp = new Date().toLocaleString();
  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>AI Prompt Studio Export</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: system-ui, -apple-system, sans-serif; max-width: 760px; margin: 40px auto; padding: 0 24px; color: #18181b; line-height: 1.6; }
  h1 { color: #7c3aed; font-size: 1.3rem; border-bottom: 2px solid #ede9fe; padding-bottom: 10px; }
  .meta { color: #71717a; font-size: 0.82rem; margin-bottom: 28px; }
  .msg { margin-bottom: 20px; }
  .role { font-weight: 700; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 8px; padding: 3px 8px; border-radius: 4px; display: inline-block; }
  .user .role { background: #ede9fe; color: #7c3aed; }
  .assistant .role { background: #d1fae5; color: #059669; }
  .content { background: #fafafa; border: 1px solid #e4e4e7; border-radius: 10px; padding: 14px 18px; white-space: pre-wrap; font-size: 0.88rem; line-height: 1.65; }
  hr { border: none; border-top: 1px solid #e4e4e7; margin: 16px 0; }
  @media print { body { margin: 20px; } }
</style>
</head>
<body>
<h1>AI Prompt Studio — Export</h1>
<div class="meta">Exported: ${timestamp} · Model: ${model}</div>
${messages
  .filter((m) => (m.role === "user" || m.role === "assistant") && m.content)
  .map(
    (m) => `
<div class="msg ${m.role}">
  <div class="role">${m.role === "user" ? "You" : "Assistant"}</div>
  <div class="content">${escapeHtml(m.content)}</div>
</div><hr>`
  )
  .join("")}
</body>
</html>`;

  const w = window.open("", "_blank");
  if (!w) return;
  w.document.write(html);
  w.document.close();
  setTimeout(() => w.print(), 600);
};

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function triggerDownload(content, mimeType, filename) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
