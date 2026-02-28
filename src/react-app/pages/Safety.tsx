import { Header } from "@/react-app/components/Header";
import { Footer } from "@/react-app/components/Footer";

export default function SafetyPage() {
  return (
    <div className="min-h-dvh flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1"> 
        <section className="py-12 md:py-16 border-b border-border/50"> 
          <div className="max-w-3xl mx-auto px-4 sm:px-6"> 
            <h1 className="font-display text-3xl md:text-4xl font-bold bg-gradient-to-r from-saffron to-maroon bg-clip-text text-transparent"> 
              Safety Tips 
            </h1> 
            <p className="mt-4 text-muted-foreground"> 
              Keep conversations respectful. Avoid sharing phone numbers, emails, or handles. Report unsafe behavior. 
            </p> 
          </div> 
        </section> 
        <section className="py-12 md:py-16"> 
          <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-3 text-sm text-muted-foreground"> 
            <p>Only chat after mutual interest. Stop if anyone pressures for money or contact sharing.</p> 
            <p>Use in-app stages to progress intent with family involvement and audits.</p> 
            <p>Our AI blocks disguised contact sharing and financial negotiation attempts.</p> 
          </div> 
        </section> 
      </main> 
      <Footer /> 
    </div> 
  ); 
} 
