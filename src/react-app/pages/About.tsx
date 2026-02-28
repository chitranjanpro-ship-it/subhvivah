import { Header } from "@/react-app/components/Header";
import { Footer } from "@/react-app/components/Footer";
import { Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-dvh flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <section className="py-12 md:py-16 border-b border-border/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <h1 className="font-display text-3xl md:text-4xl font-bold bg-gradient-to-r from-saffron to-maroon bg-clip-text text-transparent">
              About SubhVivah
            </h1>
            <p className="mt-4 text-muted-foreground">
              We build a trusted, consent-first matrimonial experience focused on families, transparency, and safety. 
              Contact details are never sold. Real access is granted only after mutual intent and verified success steps.
            </p>
          </div>
        </section>
        <section className="py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
            <div className="p-6 rounded-xl border border-border/60 bg-muted/30">
              <h2 className="text-xl font-semibold">Our Promise</h2>
              <p className="mt-2 text-muted-foreground">
                Calm, marriage-focused design. AI moderation to prevent contact leakage and exploitation. 
                Families can participate with structured privacy.
              </p>
            </div>
            <div className="p-6 rounded-xl border border-border/60 bg-muted/30">
              <h2 className="text-xl font-semibold">Ethical Monetization</h2>
              <p className="mt-2 text-muted-foreground">
                Pay-after-success only. No subscriptions for unlocking contacts. Sponsorship options available for those in need.
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              Made with <Heart className="inline w-4 h-4 text-maroon fill-maroon" /> for families seeking genuine matrimonial connections.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
