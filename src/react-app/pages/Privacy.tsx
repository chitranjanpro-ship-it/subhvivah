import { Header } from "@/react-app/components/Header";
import { Footer } from "@/react-app/components/Footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-dvh flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <section className="py-12 md:py-16 border-b border-border/50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <h1 className="font-display text-3xl md:text-4xl font-bold bg-gradient-to-r from-saffron to-maroon bg-clip-text text-transparent">
              Privacy Policy
            </h1>
            <p className="mt-4 text-muted-foreground">We follow data minimization and GDPR-style practices. Consent logs are immutable.</p>
          </div>
        </section>
        <section className="py-12 md:py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-4 text-sm text-muted-foreground">
            <p>We collect only what is required to operate the service, secure accounts, and ensure safety.</p>
            <p>Contact information is never sold and remains locked until success conditions are met.</p>
            <p>AI moderation runs on messages to prevent unsafe sharing. Blocked attempts are logged.</p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
