import { Header } from "@/react-app/components/Header";
import { Footer } from "@/react-app/components/Footer";

export default function TermsPage() {
  return (
    <div className="min-h-dvh flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <section className="py-12 md:py-16 border-b border-border/50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <h1 className="font-display text-3xl md:text-4xl font-bold bg-gradient-to-r from-saffron to-maroon bg-clip-text text-transparent">
              Terms of Service
            </h1>
            <p className="mt-4 text-muted-foreground">
              Use of SubhVivah implies honest marital intent. Contact sharing outside the platform is prohibited.
            </p>
          </div>
        </section>
        <section className="py-12 md:py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-4 text-sm text-muted-foreground">
            <p>Chat is consent-based only. Attempts to bypass are blocked and may lead to account restrictions.</p>
            <p>Payments, when applicable, occur only after verified success steps.</p>
            <p>Disputes are handled with full audit logs and consent records.</p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
