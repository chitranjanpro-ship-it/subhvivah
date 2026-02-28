import { Header } from "@/react-app/components/Header";
import { Footer } from "@/react-app/components/Footer";
import { Button } from "@/react-app/components/ui/button";
import { Input } from "@/react-app/components/ui/input";
import { Textarea } from "@/react-app/components/ui/textarea";

export default function ContactPage() {
  return (
    <div className="min-h-dvh flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <section className="py-12 md:py-16 border-b border-border/50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <h1 className="font-display text-3xl md:text-4xl font-bold bg-gradient-to-r from-saffron to-maroon bg-clip-text text-transparent">
              Contact Us
            </h1>
            <p className="mt-4 text-muted-foreground">
              Have a question or feedback? Send us a message and our team will respond soon.
            </p>
          </div>
        </section>
        <section className="py-12 md:py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
            <div className="grid gap-4">
              <Input placeholder="Full Name" />
              <Input placeholder="Email (optional)" type="email" />
              <Textarea placeholder="Your message" rows={6} />
              <div>
                <Button className="bg-gradient-to-r from-saffron to-maroon text-white">Send Message</Button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              By submitting, you agree that your query may be stored for support and audit purposes.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
