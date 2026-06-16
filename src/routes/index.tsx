import { createFileRoute } from "@tanstack/react-router";
import { ChatWidget } from "@/components/chat/ChatWidget";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Spur — Modern Essentials" },
      { name: "description", content: "Shop curated modern essentials at Spur. Live AI support, fast shipping, easy returns." },
      { property: "og:title", content: "Spur — Modern Essentials" },
      { property: "og:description", content: "Shop curated modern essentials at Spur. Live AI support, fast shipping, easy returns." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-semibold tracking-tight text-lg">spur.</div>
          <nav className="hidden sm:flex gap-8 text-sm text-muted-foreground">
            <a className="hover:text-foreground transition-colors" href="#">Shop</a>
            <a className="hover:text-foreground transition-colors" href="#">Collections</a>
            <a className="hover:text-foreground transition-colors" href="#">About</a>
          </nav>
          <div className="text-sm text-muted-foreground">Cart (0)</div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-24">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            New Fall Collection — Live now
          </div>
          <h1 className="text-5xl sm:text-6xl font-semibold tracking-tight leading-[1.05] mb-6">
            Essentials, <span className="text-primary">reimagined</span>.
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Thoughtfully designed pieces for everyday life. Need help finding something? Chat with our AI support — bottom right.
          </p>
          <div className="flex gap-3">
            <button className="rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm font-medium hover:opacity-90 transition-opacity">
              Shop now
            </button>
            <button className="rounded-full border border-border px-6 py-3 text-sm font-medium hover:bg-muted transition-colors">
              Browse collections
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-20">
          {["Knitwear", "Outerwear", "Accessories"].map((c) => (
            <div
              key={c}
              className="aspect-[4/5] rounded-2xl bg-muted flex items-end p-5 text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer"
            >
              {c}
            </div>
          ))}
        </div>
      </main>

      <ChatWidget />
    </div>
  );
}
