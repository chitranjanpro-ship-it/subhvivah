import { Header } from "@/react-app/components/Header";
import { Footer } from "@/react-app/components/Footer";

export default function HelpPage() {
  return (
    <div className="min-h-dvh flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <section className="py-12 md:py-16 border-b border-border/50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <h1 className="font-display text-3xl md:text-4xl font-bold bg-gradient-to-r from-saffron to-maroon bg-clip-text text-transparent">
              Help Center
            </h1>
            <p className="mt-4 text-muted-foreground">
              Learn how SubhVivah works: profile creation, consent-based chat, family verification, and success steps.
            </p>
          </div>
        </section>
        <section className="py-12 md:py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
            <div>
              <h2 className="text-xl font-semibold">Journey</h2>
              <p className="text-muted-foreground mt-2">Profile → Interest → Consent → Chat → Intent → Success. No contact leakage.</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold">Chat Unlock</h2>
              <p className="text-muted-foreground mt-2">Mutual interest required. AI moderation prevents contact sharing and financial negotiation.</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold">Pay-After-Success</h2>
              <p className="text-muted-foreground mt-2">Payment is requested only when both sides confirm readiness with family approval.</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
