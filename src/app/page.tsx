"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Shield, Users, Award, CheckCircle, Moon, Sun, Monitor, ArrowRight, Sparkles, Crown, Flower, Sunset, Trees, Waves, Zap, History } from "lucide-react";
import { useEffect } from "react";
import { useThemeStore, ThemeMode } from "@/store/theme.store";
import { useAuthStore } from "@/store/auth.store";

const ThemeToggle = () => {
  const { mode, setMode } = useThemeStore();
  const themes: { mode: ThemeMode; icon: any }[] = [
    { mode: 'light', icon: Sun },
    { mode: 'dark', icon: Moon },
    { mode: 'glass', icon: Sparkles },
    { mode: 'royal', icon: Crown },
    { mode: 'traditional', icon: Flower },
    { mode: 'sunset', icon: Sunset },
    { mode: 'forest', icon: Trees },
    { mode: 'ocean', icon: Waves },
    { mode: 'minimal', icon: Zap },
    { mode: 'vintage', icon: History },
  ];

  return (
    <div className="flex bg-primary/5 p-1 rounded-xl border border-primary/10">
      {themes.map((t) => (
        <button
          key={t.mode}
          onClick={() => setMode(t.mode)}
          className={`p-1.5 rounded-lg transition-all ${mode === t.mode ? 'bg-primary text-primary-foreground shadow-sm' : 'text-primary opacity-40 hover:opacity-100'}`}
          title={t.mode}
        >
          <t.icon className="w-3.5 h-3.5" />
        </button>
      ))}
    </div>
  );
};

export default function LandingPage() {
  useEffect(() => {
    useAuthStore.getState().checkAuth();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-inherit transition-colors duration-300">
      <header className="fixed top-0 w-full z-50 card-style border-b border-inherit backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary flex items-center gap-2">
            <Heart className="fill-primary" />
            <span>Subhvivah</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-inherit opacity-70 hover:opacity-100 transition-opacity font-medium">Features</Link>
            <Link href="#premium" className="text-inherit opacity-70 hover:opacity-100 transition-opacity font-medium">Premium</Link>
            <Link href="/about" className="text-inherit opacity-70 hover:opacity-100 transition-opacity font-medium">About Us</Link>
          </nav>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/login" className="text-inherit opacity-70 hover:opacity-100 font-medium transition-opacity">Login</Link>
            <Link href="/register" className="bg-primary text-primary-foreground px-6 py-2 rounded-full font-medium hover:scale-105 transition-all">
              Join Free
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow pt-16">
        <section className="relative py-20 lg:py-32 overflow-hidden bg-inherit">
          <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-10">
            <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] bg-primary rounded-full blur-3xl" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] bg-primary rounded-full blur-3xl" />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl lg:text-6xl font-extrabold text-inherit mb-6 tracking-tight leading-tight"
              >
                Find Your <span className="text-primary">Soulmate</span> with Tradition & Trust
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xl text-inherit opacity-70 mb-10"
              >
                The most serious and family-oriented matrimonial platform for those who believe in lifelong companionship.
              </motion.p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/register" className="w-full sm:w-auto bg-primary text-primary-foreground px-10 py-5 rounded-2xl text-lg font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary/20">
                  Create Your Profile
                </Link>
                <Link href="/search" className="w-full sm:w-auto card-style border-2 border-inherit px-10 py-5 rounded-2xl text-lg font-black uppercase tracking-widest hover:border-primary hover:text-primary transition-all">
                  Browse Profiles
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-24 bg-inherit">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-black text-inherit mb-4 tracking-tight">Why Choose Subhvivah?</h2>
              <p className="text-inherit opacity-60 max-w-2xl mx-auto font-medium">We prioritize your safety and family values above all else.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: Shield, title: "AI-Verified Profiles", desc: "Every profile undergoes strict AI monitoring and OCR scanning to ensure authenticity." },
                { icon: Users, title: "Family-Oriented", desc: "Designed for serious marriage matchmaking with multi-role management for parents and relatives." },
                { icon: Award, title: "Premium Experience", desc: "Unlock unlimited chats, contact reveals, and profile boosts with our premium plans." }
              ].map((feature, i) => (
                <div key={i} className="p-10 rounded-[2.5rem] card-style border border-inherit shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-black text-inherit mb-4 tracking-tight">{feature.title}</h3>
                  <p className="text-inherit opacity-60 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="premium" className="py-24 bg-inherit">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl lg:text-4xl font-black text-inherit mb-6 tracking-tight">Premium Membership</h2>
            <p className="text-lg text-inherit opacity-60 mb-12 max-w-2xl mx-auto font-medium">Get exclusive benefits and find your match faster with our premium plans.</p>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: "Free", price: "0", features: ["Limited Chat", "Search Profiles", "Basic Filters"] },
                { title: "Gold", price: "999", features: ["Unlimited Chat", "Contact Reveal", "Profile Boost", "Verified Badge"], recommended: true },
                { title: "Diamond", price: "1999", features: ["Personalized Matchmaker", "Priority Support", "Featured Profile", "Unlimited Everything"] }
              ].map((plan, i) => (
                <div key={i} className={`p-10 rounded-[2.5rem] card-style border-2 transition-all hover:shadow-2xl flex flex-col ${plan.recommended ? 'border-primary shadow-xl scale-105 relative z-10' : 'border-inherit opacity-80'}`}>
                  {plan.recommended && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-6 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/40">Recommended</div>}
                  <h3 className="text-2xl font-black mb-4 text-inherit tracking-tight">{plan.title}</h3>
                  <div className="flex items-baseline justify-center gap-1 mb-8">
                    <span className="text-sm font-bold opacity-40">₹</span>
                    <span className="text-5xl font-black text-inherit tracking-tighter">{plan.price}</span>
                    <span className="text-sm font-bold opacity-40">/mo</span>
                  </div>
                  <div className="h-px w-full bg-inherit opacity-10 mb-8" />
                  <ul className="space-y-5 mb-10 text-left flex-grow">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-center gap-3 text-sm text-inherit opacity-70 font-bold">
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="w-3 h-3 text-primary" />
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link 
                    href="/premium"
                    className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-[0.98] text-center flex items-center justify-center ${plan.recommended ? 'bg-primary text-primary-foreground shadow-xl shadow-primary/20 hover:scale-105' : 'bg-inherit border-2 border-inherit hover:border-primary hover:text-primary shadow-lg shadow-black/5'}`}
                  >
                    Choose {plan.title}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="py-24 bg-inherit relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary opacity-5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div className="relative group">
                <div className="aspect-[4/5] bg-primary/5 rounded-[3rem] overflow-hidden shadow-2xl relative transition-transform duration-700 group-hover:scale-[1.02] border border-primary/10">
                  <img 
                    src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1000&auto=format&fit=crop" 
                    alt="Traditional Indian Bride and Groom" 
                    className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent opacity-60" />
                  
                  {/* Floating Stats */}
                  <div className="absolute -bottom-6 -right-6 card-style p-6 rounded-[2rem] shadow-2xl border border-primary/10 hidden md:block">
                    <div className="text-4xl font-black text-primary mb-1 tracking-tighter">10k+</div>
                    <div className="text-[10px] font-black opacity-40 uppercase tracking-widest">Happy Marriages</div>
                  </div>
                  
                  <div className="absolute top-8 left-8 bg-primary/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20 hidden md:block">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-xs font-black text-inherit uppercase tracking-widest">Verified Profiles</span>
                    </div>
                  </div>
                </div>
                
                {/* Decorative background shape */}
                <div className="absolute -inset-4 bg-primary/5 rounded-[3.5rem] -z-10 translate-x-4 translate-y-4" />
              </div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                <div className="space-y-4">
                  <div className="inline-block px-4 py-1.5 bg-primary/10 rounded-full text-[10px] font-black text-primary uppercase tracking-widest">Our Story</div>
                  <h2 className="text-4xl lg:text-5xl font-black text-inherit tracking-tight leading-[1.1]">
                    Preserving Traditions in a <span className="text-primary">Digital World</span>
                  </h2>
                </div>

                <div className="space-y-6">
                  <p className="text-lg text-inherit opacity-70 leading-relaxed font-medium">
                    Founded in the heart of Jamshedpur, <span className="text-primary font-bold">Subhvivah</span> was born from a simple yet profound vision: to bring the authenticity of traditional Indian matchmaking to the convenience of the modern age.
                  </p>
                  <p className="text-lg text-inherit opacity-70 leading-relaxed font-medium">
                    We understand that marriage in India isn't just a union of two individuals, but a coming together of two families. That's why we've built a platform that respects these values while utilizing cutting-edge AI to ensure your safety and success.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {[
                    { title: "Manual Review", desc: "Every profile checked" },
                    { title: "AI-Powered", desc: "Smart matching tech" },
                    { title: "Privacy First", desc: "Secure communication" },
                    { title: "Family Focused", desc: "Multi-role support" }
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4 p-5 rounded-2xl card-style border border-inherit hover:border-primary transition-all group">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <CheckCircle className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-black text-inherit text-sm tracking-tight">{item.title}</div>
                        <div className="text-[10px] font-bold opacity-40 uppercase tracking-tighter">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4">
                  <Link href="/register" className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary/20 active:scale-[0.98]">
                    Start Your Journey
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="bg-primary py-20 text-primary-foreground relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          </div>
          <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-12 text-center relative z-10">
            {[
              { label: "Active Profiles", value: "50k+" },
              { label: "Successful Matches", value: "10k+" },
              { label: "AI Verified", value: "100%" },
              { label: "Support", value: "24/7" }
            ].map((stat, i) => (
              <div key={i} className="space-y-2">
                <div className="text-5xl font-black tracking-tighter">{stat.value}</div>
                <div className="text-xs font-black uppercase tracking-widest opacity-80">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="card-style border-t border-inherit pt-20 pb-10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-16 mb-20">
            <div className="col-span-1 md:col-span-2">
              <Link href="/" className="text-3xl font-black text-primary flex items-center gap-3 mb-8">
                <Heart className="fill-primary w-8 h-8" />
                <span>SUBHVIVAH</span>
              </Link>
              <p className="text-lg text-inherit opacity-60 mb-8 max-w-md leading-relaxed">
                Subhvivah is Jamshedpur's leading matrimonial platform, committed to bringing families together through secure and traditional matchmaking.
              </p>
            </div>
            <div>
              <h4 className="font-black text-inherit uppercase tracking-widest text-xs mb-8">Quick Links</h4>
              <ul className="space-y-4">
                <li><Link href="/search" className="text-inherit opacity-60 hover:text-primary transition-colors font-bold">Search Profiles</Link></li>
                <li><Link href="/premium" className="text-inherit opacity-60 hover:text-primary transition-colors font-bold">Premium Plans</Link></li>
                <li><Link href="/about" className="text-inherit opacity-60 hover:text-primary transition-colors font-bold">About Us</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black text-inherit uppercase tracking-widest text-xs mb-8">Legal & Support</h4>
              <ul className="space-y-4">
                <li><Link href="/contact" className="text-inherit opacity-60 hover:text-primary transition-colors font-bold">Contact Us</Link></li>
                <li><Link href="/privacy" className="text-inherit opacity-60 hover:text-primary transition-colors font-bold">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-inherit opacity-60 hover:text-primary transition-colors font-bold">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-10 border-t border-inherit text-center text-[10px] font-black opacity-30 uppercase tracking-[0.2em]">
            © 2026 S & S Software Development and Engineering, Jamshedpur, India. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
