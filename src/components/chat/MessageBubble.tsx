import { cn } from "@/lib/utils";

export type ChatMessage = {
  id: string;
  role: "user" | "ai";
  text: string;
  error?: boolean;
};

export function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  if (message.error) {
    return (
      <div className="flex justify-start animate-fade-in">
        <div className="rounded-2xl rounded-bl-sm border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm text-destructive max-w-[80%]">
          {message.text}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex animate-fade-in", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "px-4 py-2.5 text-sm max-w-[80%] leading-relaxed",
          isUser
            ? "bg-primary text-primary-foreground rounded-2xl rounded-br-sm"
            : "bg-muted text-foreground rounded-2xl rounded-bl-sm",
        )}
      >
        {message.text}
      </div>
    </div>
  );
}
