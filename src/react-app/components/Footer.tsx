import { Link } from "react-router";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";

export function Footer() {
  const [showHindi, setShowHindi] = useState(false);

  useEffect(() => {
    const intervalMs = 5000;
    const id = window.setInterval(() => setShowHindi((p) => !p), intervalMs);
    return () => window.clearInterval(id);
  }, []);

  return (
    <footer className="bg-gradient-to-b from-muted/30 to-muted/50 border-t border-border/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-saffron to-maroon flex items-center justify-center overflow-hidden">
                <img 
                  src="/logo.png" 
                  alt="SubhVivah" 
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${showHindi ? "opacity-0" : "opacity-100"}`}
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display='none'; }} 
                />
                <img 
                  src="/logo-hindi.png" 
                  alt="शुभ विवाह" 
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${showHindi ? "opacity-100" : "opacity-0"}`}
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display='none'; }} 
                />
                <Heart className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="font-display text-xl font-bold bg-gradient-to-r from-saffron to-maroon bg-clip-text text-transparent" aria-live="polite">
                {showHindi ? "शुभ विवाह" : "SubhVivah"}
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Connecting hearts across communities. Find your perfect match with SubhVivah.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-muted-foreground hover:text-saffron transition-colors">Home</Link></li>
              <li><Link to="/browse" className="text-muted-foreground hover:text-saffron transition-colors">Browse Profiles</Link></li>
              <li><Link to="/about" className="text-muted-foreground hover:text-saffron transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-saffron transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Communities</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/community/brahmin" className="text-muted-foreground hover:text-saffron transition-colors">Brahmin</Link></li>
              <li><Link to="/community/rajput" className="text-muted-foreground hover:text-saffron transition-colors">Rajput</Link></li>
              <li><Link to="/community/gujarati" className="text-muted-foreground hover:text-saffron transition-colors">Gujarati</Link></li>
              <li><Link to="/community/punjabi" className="text-muted-foreground hover:text-saffron transition-colors">Punjabi</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/help" className="text-muted-foreground hover:text-saffron transition-colors">Help Center</Link></li>
              <li><Link to="/privacy" className="text-muted-foreground hover:text-saffron transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-muted-foreground hover:text-saffron transition-colors">Terms of Service</Link></li>
              <li><Link to="/safety" className="text-muted-foreground hover:text-saffron transition-colors">Safety Tips</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/50 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} SubhVivah. All rights reserved.</p>
          <p>Made with <Heart className="w-4 h-4 inline text-maroon fill-maroon" /> in India</p>
        </div>
      </div>
    </footer>
  );
}
