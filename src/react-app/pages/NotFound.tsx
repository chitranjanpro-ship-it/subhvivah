import { Header } from "@/react-app/components/Header";
import { Footer } from "@/react-app/components/Footer";
import { Button } from "@/react-app/components/ui/button";
import { Link } from "react-router";

export default function NotFoundPage() {
  return (
    <div className="min-h-dvh flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <section className="py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-4">
            <h1 className="font-display text-4xl font-bold">Page Not Found</h1>
            <p className="text-muted-foreground">The page you’re looking for doesn’t exist.</p>
            <Button asChild className="bg-gradient-to-r from-saffron to-maroon text-white">
              <Link to="/">Go Home</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
