import { Link } from "react-router";
import { Button } from "@/react-app/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/react-app/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/react-app/components/ui/avatar";
import { Heart, Menu, X, User, LogOut, Settings, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@getmocha/users-service/react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isPending, redirectToLogin, logout } = useAuth();
  const [showHindi, setShowHindi] = useState(false);

  const handleLogin = async () => {
    await redirectToLogin();
  };

  const handleLogout = async () => {
    await logout();
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  useEffect(() => {
    const intervalMs = 5000;
    const id = window.setInterval(() => {
      setShowHindi((prev) => !prev);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group" aria-label="SubhVivah Home">
            <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-saffron to-maroon flex items-center justify-center shadow-lg shadow-saffron/20 overflow-hidden">
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
              <Heart className="relative w-5 h-5 text-white fill-white" />
            </div>
            <span className="font-display text-xl font-bold bg-gradient-to-r from-saffron to-maroon bg-clip-text text-transparent" aria-live="polite">
              {showHindi ? "शुभ विवाह" : "SubhVivah"}
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-saffron transition-colors">
              Home
            </Link>
            <Link to="/browse" className="text-sm font-medium text-muted-foreground hover:text-saffron transition-colors">
              Browse Profiles
            </Link>
            <Link to="/about" className="text-sm font-medium text-muted-foreground hover:text-saffron transition-colors">
              About Us
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {isPending ? (
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10 border-2 border-saffron/30">
                      <AvatarImage 
                        src={user.google_user_data?.picture || undefined} 
                        alt={user.google_user_data?.name || "User"} 
                      />
                      <AvatarFallback className="bg-gradient-to-br from-saffron to-maroon text-white">
                        {getInitials(user.google_user_data?.name)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center gap-2 p-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.google_user_data?.picture || undefined} />
                      <AvatarFallback className="bg-gradient-to-br from-saffron to-maroon text-white text-xs">
                        {getInitials(user.google_user_data?.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-0.5">
                      <p className="text-sm font-medium">{user.google_user_data?.name}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-[180px]">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/my-profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      My Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button asChild variant="ghost" className="text-muted-foreground hover:text-saffron">
                  <Link to="/signin">Sign In</Link>
                </Button>
                <Button asChild className="bg-gradient-to-r from-saffron to-maroon hover:opacity-90 text-white shadow-lg shadow-saffron/25">
                  <Link to="/register">Register Free</Link>
                </Button>
              </>
            )}
          </div>

          <button
            className="md:hidden p-2 text-muted-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/50">
            <nav className="flex flex-col gap-2">
              <Link to="/" className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-saffron transition-colors">
                Home
              </Link>
              <Link to="/browse" className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-saffron transition-colors">
                Browse Profiles
              </Link>
              <Link to="/about" className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-saffron transition-colors">
                About Us
              </Link>
              {user ? (
                <>
                  <div className="flex items-center gap-3 px-4 py-2 border-t border-border/50 mt-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.google_user_data?.picture || undefined} />
                      <AvatarFallback className="bg-gradient-to-br from-saffron to-maroon text-white text-xs">
                        {getInitials(user.google_user_data?.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{user.google_user_data?.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <Link to="/my-profile" className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-saffron">
                    My Profile
                  </Link>
                  <button 
                    onClick={handleLogout} 
                    className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 text-left"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="flex gap-2 px-4 pt-2">
                  <Link
                    to="/signin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 inline-flex items-center justify-center h-10 rounded-md border border-border text-foreground hover:text-saffron"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 inline-flex items-center justify-center h-10 rounded-md text-white bg-gradient-to-r from-saffron to-maroon"
                  >
                    Register
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
