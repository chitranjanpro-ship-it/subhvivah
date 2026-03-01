import { Header } from "@/react-app/components/Header";
import { Footer } from "@/react-app/components/Footer";
import { useEffect, useState } from "react";
import { Input } from "@/react-app/components/ui/input";
import { Textarea } from "@/react-app/components/ui/textarea";
import { Button } from "@/react-app/components/ui/button";

type CMSItem = { id: string; title: string; body: string; created_at: string };

export default function AdminCMSPage() {
  const [items, setItems] = useState<CMSItem[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem("subhvivah_cms");
    if (raw) setItems(JSON.parse(raw));
  }, []);
  const persist = (list: CMSItem[]) => {
    localStorage.setItem("subhvivah_cms", JSON.stringify(list));
    setItems(list);
  };
  const add = () => {
    if (!title.trim() || !body.trim()) return;
    const next: CMSItem[] = [{ id: String(Date.now()), title: title.trim(), body: body.trim(), created_at: new Date().toISOString() }, ...items];
    persist(next); setTitle(""); setBody("");
  };
  const del = (id: string) => persist(items.filter(i => i.id !== id));

  return (
    <div className="min-h-dvh flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <section className="py-12 md:py-16 border-b border-border/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <h1 className="font-display text-3xl md:text-4xl font-bold bg-gradient-to-r from-saffron to-maroon bg-clip-text text-transparent">
              Admin CMS (Local Demo)
            </h1>
            <p className="mt-3 text-muted-foreground">Create simple content entries stored in your browser for demonstration. Integrate real backend later.</p>
          </div>
        </section>
        <section className="py-10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-4">
            <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <Textarea rows={6} placeholder="Body" value={body} onChange={(e) => setBody(e.target.value)} />
            <div><Button onClick={add} className="bg-gradient-to-r from-saffron to-maroon text-white">Add Entry</Button></div>
            <div className="space-y-4">
              {items.map(i => (
                <div key={i.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">{i.title}</div>
                    <Button variant="outline" onClick={() => del(i.id)}>Delete</Button>
                  </div>
                  <div className="text-sm text-muted-foreground mt-2 whitespace-pre-wrap">{i.body}</div>
                  <div className="text-xs text-muted-foreground mt-1">Created: {new Date(i.created_at).toLocaleString()}</div>
                </div>
              ))}
              {items.length === 0 && <div className="text-sm text-muted-foreground">No content yet.</div>}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
