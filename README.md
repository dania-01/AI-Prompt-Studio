# AI Prompt Studio

A free, browser-based AI prompt studio powered by **Groq's LPU™ inference** — stream real-time responses, compare models side by side, save your best prompts, and export your work. No account. No cost. Just results.

---

## Features

### Core Experience

| Feature | Description |
|---|---|
| **Real-Time Streaming** | Watch responses generate word by word. Groq's LPU™ delivers up to 10× faster inference than GPU-based APIs. |
| **Side-by-Side Compare** | Send one prompt to two models simultaneously and compare quality, speed, and style in a split view. |
| **Conversation History** | Every chat is auto-saved locally. Search across conversations, star favourites, rename, and organise into folders. |
| **Voice Input** | Click the mic and speak your prompt. Transcribed instantly via the browser's Web Speech API — no third-party service. |
| **Prompt Library** | Save prompts with a single click. Tag, search, and reuse them across any conversation. |

### Models

All 7 models run on Groq's LPU™ hardware for ultra-low latency:

| Model | Strength |
|---|---|
| **Llama 3.3 70B** | Complex reasoning, detailed answers |
| **Llama 3.1 8B ⚡** | Lightweight, instant responses |
| **DeepSeek R1 70B** | Step-by-step reasoning |
| **Gemma 2 9B** | Strong instruction following (Google) |
| **Mixtral 8×7B** | Multilingual, mixture-of-experts |
| **Qwen QwQ 32B** | Advanced reasoning (Alibaba Cloud) |
| **Llama 3.2 Vision** | Image + text input support |

### Studio Tools

- **Fine-Tune Creativity** — Switch between Precise, Balanced, and Creative modes; control response length
- **Pin & React** — Pin important AI responses to keep them visible; thumbs-up / thumbs-down to rate answers
- **Share & Export** — Share via encoded URL link, or export as `.txt`, Markdown, or print to PDF
- **Slash Commands** — Type `/` in the prompt box to open the command palette (`/compare`, `/library`, `/clear`)
- **Bring Your Own Key** — Optionally supply your own Groq API key via Settings; it stays in your browser — never sent to any server
- **Resizable Sidebar** — Drag the sidebar edge to any width between 200 px and 480 px
- **Dark & Light Mode** — Beautiful in both themes; preference persists automatically across sessions

---

## Tech Stack

### Framework & Language

| Tool | Version | Role |
|---|---|---|
| [Next.js](https://nextjs.org) | 16.x (App Router) | Full-stack React framework |
| [React](https://react.dev) | 19.x | UI library |
| JavaScript (JSX) | ES2023 | Language |

### Styling

| Tool | Version | Role |
|---|---|---|
| [Tailwind CSS](https://tailwindcss.com) | v4 | Utility-first styling |
| CSS Custom Properties | — | Design tokens (`src/styles/tokens.css`) |

### Animation

| Tool | Version | Role |
|---|---|---|
| [Framer Motion](https://www.framer.com/motion) | 12.x | Page transitions, card animations, scroll-driven features |
| Canvas API | Native | Particle field neural animation on landing page |

### AI & APIs

| Tool | Role |
|---|---|
| [Groq SDK](https://console.groq.com) | Streaming inference API client |
| Web Speech API | Browser-native voice input transcription |

### Icons & UI

| Tool | Role |
|---|---|
| [Lucide React](https://lucide.dev) | Icon library |

### State & Storage

| Approach | Role |
|---|---|
| React Context API | Global state (conversations, theme, toast) |
| `localStorage` | Conversation history, prompt library, API key, theme preference |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A free [Groq API key](https://console.groq.com) (optional — the app ships with a shared key for demo use)

### Installation

```bash
git clone https://github.com/dania-01/AI-Prompt-Studio.git
cd AI-Prompt-Studio
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

---

## Project Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── page.jsx          # Landing page
│   ├── studio/           # Studio app
│   └── models/           # Models explorer
├── components/           # Shared UI components
├── sections/
│   └── landing/          # Landing page sections (Hero, Features, HowItWorks, Models, Footer)
├── pages-view/           # Full page view components
├── context/              # React Context providers (Prompt, Theme, Toast)
├── hooks/                # Custom hooks (streaming, history, compare)
├── constants/            # Model definitions
├── utils/                # Groq client, export, token counter
├── styles/               # Design tokens
└── validation/           # Prompt validation schemas
```

---

## Environment Variables

The app works out of the box without any setup. To use your own Groq API key:

1. Open the Studio
2. Click the **Settings** icon
3. Enter your key — it is stored in `localStorage` only

Alternatively, create a `.env.local` file:

```env
NEXT_PUBLIC_GROQ_API_KEY=your_key_here
```

---

## License

MIT — free to use, modify, and distribute.
