import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { PromptProvider } from "@/context/PromptContext";
import { ToastProvider } from "@/context/ToastContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  title: "AI Prompt Studio — Powered by Groq",
  description: "Stream real-time AI responses, compare models side-by-side, and craft perfect prompts. Free, no login required.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} h-full`} data-scroll-behavior="smooth">
      <body className="min-h-full font-sans antialiased">
        <ThemeProvider>
          <PromptProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </PromptProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
