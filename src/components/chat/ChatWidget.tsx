import { useEffect, useRef, useState, type FormEvent } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { sendMessageToAPI, fetchChatHistory } from "@/lib/sendMessageToAPI";
import { MessageBubble, type ChatMessage } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "ai",
      text: "Hi there! 👋 Welcome to Spur Support. How can we help you today?",
    },
  ]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadHistory() {
      try {
        const history = await fetchChatHistory();
        if (history && history.length > 0) {
          setMessages(history);
        }
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
    loadHistory();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isSending, open]);

  useEffect(() => {
    if (open && !isSending) inputRef.current?.focus();
  }, [open, isSending]);

  async function handleSend(e?: FormEvent) {
    e?.preventDefault();
    const text = input.trim();
    if (!text || isSending) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      text,
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setIsSending(true);

    try {
      const reply = await sendMessageToAPI(text);
      setMessages((m) => [
        ...m,
        { id: crypto.randomUUID(), role: "ai", text: reply },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          id: crypto.randomUUID(),
          role: "ai",
          text: "Network error, please try again.",
          error: true,
        },
      ]);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <>
      {/* Panel */}
      <div
        className={cn(
          "fixed z-50 bottom-24 right-6 w-[min(calc(100vw-2rem),24rem)] h-[min(calc(100vh-8rem),36rem)]",
          "origin-bottom-right transition-all duration-300 ease-out",
          open
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-95 pointer-events-none",
        )}
        aria-hidden={!open}
      >
        <div
          className="flex flex-col h-full rounded-2xl bg-card border border-border overflow-hidden"
          style={{ boxShadow: "var(--shadow-widget)" }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3.5 text-primary-foreground"
            style={{
              background:
                "linear-gradient(135deg, var(--primary), var(--brand-glow))",
            }}
          >
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-white/15 backdrop-blur flex items-center justify-center font-semibold text-sm">
                S
              </div>
              <div>
                <div className="font-semibold text-sm leading-tight">Spur Support</div>
                <div className="flex items-center gap-1.5 text-xs opacity-90">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inset-0 rounded-full bg-green-400 opacity-75" />
                    <span className="relative rounded-full h-2 w-2 bg-green-400" />
                  </span>
                  Online
                </div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="rounded-full p-1.5 hover:bg-white/15 transition-colors"
              aria-label="Close chat"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-background"
          >
            {messages.map((m) => (
              <MessageBubble key={m.id} message={m} />
            ))}
            {isSending && <TypingIndicator />}
          </div>

          {/* Input */}
          <form
            onSubmit={handleSend}
            className="border-t border-border bg-card p-3 flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isSending}
              placeholder={isSending ? "Agent is typing..." : "Type your message..."}
              className="flex-1 rounded-full bg-muted px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={isSending || !input.trim()}
              className="rounded-full bg-primary text-primary-foreground h-10 w-10 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity shrink-0"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Floating button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed z-50 bottom-6 right-6 h-14 w-14 rounded-full text-primary-foreground flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
        style={{
          background: "linear-gradient(135deg, var(--primary), var(--brand-glow))",
          boxShadow: "var(--shadow-widget)",
        }}
        aria-label={open ? "Close chat" : "Open chat"}
      >
        <div className="relative h-6 w-6">
          <MessageCircle
            className={cn(
              "absolute inset-0 h-6 w-6 transition-all duration-200",
              open ? "opacity-0 rotate-90 scale-50" : "opacity-100 rotate-0 scale-100",
            )}
          />
          <X
            className={cn(
              "absolute inset-0 h-6 w-6 transition-all duration-200",
              open ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-50",
            )}
          />
        </div>
      </button>
    </>
  );
}
