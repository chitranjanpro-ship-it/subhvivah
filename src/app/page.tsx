"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Shield, Users, Award, CheckCircle, Moon, Sun, Monitor, ArrowRight } from "lucide-react";
import { useEffect } from "react";
import { useThemeStore } from "@/store/theme.store";
import { useAuthStore } from "@/store/auth.store";

const ThemeToggle = () => {
  const { mode, setMode } = useThemeStore();
  
  return (
    <div className="flex bg-gray-100 p-1 rounded-full border border-gray-200">
      <button 
        type="button"
        onClick={() => setMode('light')}
        className={`p-1.5 rounded-full transition-all ${mode === 'light' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
      >
        <Sun className="w-4 h-4" />
      </button>
      <button 
        type="button"
        onClick={() => setMode('dark')}
        className={`p-1.5 rounded-full transition-all ${mode === 'dark' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
      >
        <Moon className="w-4 h-4" />
      </button>
    </div>
  );
};

export default function LandingPage() {
  useEffect(() => {
    useAuthStore.getState().checkAuth();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary-600 flex items-center gap-2">
            <Heart className="fill-primary-600" />
            <span>Subhvivah</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-gray-600 hover:text-primary-600 transition-colors font-medium">Features</Link>
            <Link href="#premium" className="text-gray-600 hover:text-primary-600 transition-colors font-medium">Premium</Link>
            <Link href="#about" className="text-gray-600 hover:text-primary-600 transition-colors font-medium">About Us</Link>
          </nav>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/login" className="text-gray-600 hover:text-primary-600 font-medium">Login</Link>
            <Link href="/register" className="bg-primary-600 text-white px-6 py-2 rounded-full font-medium hover:bg-primary-700 transition-colors">
              Join Free
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow pt-16">
        <section className="relative py-20 lg:py-32 overflow-hidden bg-gradient-to-b from-primary-50 to-white">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl lg:text-6xl font-extrabold text-gray-900 mb-6"
              >
                Find Your <span className="text-primary-600">Soulmate</span> with Tradition & Trust
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xl text-gray-600 mb-10"
              >
                The most serious and family-oriented matrimonial platform for those who believe in lifelong companionship.
              </motion.p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/register" className="w-full sm:w-auto bg-primary-600 text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-primary-700 transition-all transform hover:scale-105 shadow-lg">
                  Create Your Profile
                </Link>
                <Link href="/search" className="w-full sm:w-auto bg-white text-gray-900 border-2 border-gray-200 px-8 py-4 rounded-full text-lg font-bold hover:border-primary-600 hover:text-primary-600 transition-all">
                  Browse Profiles
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Why Choose Subhvivah?</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">We prioritize your safety and family values above all else.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: Shield, title: "AI-Verified Profiles", desc: "Every profile undergoes strict AI monitoring and OCR scanning to ensure authenticity." },
                { icon: Users, title: "Family-Oriented", desc: "Designed for serious marriage matchmaking with multi-role management for parents and relatives." },
                { icon: Award, title: "Premium Experience", desc: "Unlock unlimited chats, contact reveals, and profile boosts with our premium plans." }
              ].map((feature, i) => (
                <div key={i} className="p-8 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mb-6">
                    <Shield className="w-8 h-8 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="premium" className="py-24">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 tracking-tight">Premium Membership</h2>
            <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">Get exclusive benefits and find your match faster with our premium plans.</p>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: "Free", price: "0", features: ["Limited Chat", "Search Profiles", "Basic Filters"] },
                { title: "Gold", price: "999", features: ["Unlimited Chat", "Contact Reveal", "Profile Boost", "Verified Badge"], recommended: true },
                { title: "Diamond", price: "1999", features: ["Personalized Matchmaker", "Priority Support", "Featured Profile", "Unlimited Everything"] }
              ].map((plan, i) => (
                <div key={i} className={`p-8 rounded-[2rem] border ${plan.recommended ? 'border-primary-600 shadow-2xl shadow-primary-500/20 scale-105 relative z-10 bg-white' : 'border-gray-100 bg-white/50 backdrop-blur-sm'} transition-all hover:translate-y-[-4px]`}>
                  {plan.recommended && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary-600 text-white px-6 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-primary-500/40">Recommended</div>}
                  <h3 className="text-2xl font-black mb-4 text-gray-900 tracking-tight">{plan.title}</h3>
                  <div className="flex items-baseline justify-center gap-1 mb-8">
                    <span className="text-sm font-bold text-gray-400">₹</span>
                    <span className="text-5xl font-black text-gray-900 tracking-tighter">{plan.price}</span>
                    <span className="text-sm font-bold text-gray-400">/mo</span>
                  </div>
                  <div className="h-px w-full bg-gray-100 mb-8" />
                  <ul className="space-y-5 mb-10 text-left">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-center gap-3 text-sm text-gray-600 font-bold">
                        <div className="w-5 h-5 rounded-full bg-primary-50 flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="w-3 h-3 text-primary-600" />
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link 
                    href="/premium"
                    className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-[0.98] text-center flex items-center justify-center ${plan.recommended ? 'bg-primary-600 text-white shadow-xl shadow-primary-500/30 hover:bg-primary-700' : 'bg-gray-900 text-white hover:bg-gray-800 shadow-lg shadow-gray-900/10'}`}
                  >
                    Choose {plan.title}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="py-24 bg-white relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 rounded-full blur-3xl opacity-30 -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary-50 rounded-full blur-3xl opacity-30 translate-y-1/2 -translate-x-1/2" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div className="relative group">
                <div className="aspect-[4/5] bg-primary-100 rounded-[3rem] overflow-hidden shadow-2xl relative transition-transform duration-700 group-hover:scale-[1.02]">
                  <img 
                    src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1000&auto=format&fit=crop" 
                    alt="Traditional Indian Bride and Groom" 
                    className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-900/40 via-transparent to-transparent opacity-60" />
                  
                  {/* Floating Stats */}
                  <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-[2rem] shadow-2xl border border-gray-100 hidden md:block animate-bounce-slow">
                    <div className="text-4xl font-black text-primary-600 mb-1 tracking-tighter">10k+</div>
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Happy Marriages</div>
                  </div>
                  
                  <div className="absolute top-8 left-8 bg-white/20 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/30 hidden md:block">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-xs font-black text-white uppercase tracking-widest">Verified Profiles</span>
                    </div>
                  </div>
                </div>
                
                {/* Decorative border */}
                <div className="absolute -inset-4 border-2 border-primary-200 rounded-[3.5rem] -z-10 translate-x-4 translate-y-4 opacity-50" />
              </div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                <div className="space-y-4">
                  <div className="inline-block px-4 py-1.5 bg-primary-50 rounded-full text-[10px] font-black text-primary-600 uppercase tracking-widest">Our Story</div>
                  <h2 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight leading-[1.1]">
                    Preserving Traditions in a <span className="text-primary-600">Digital World</span>
                  </h2>
                </div>

                <div className="space-y-6">
                  <p className="text-lg text-gray-600 leading-relaxed font-medium">
                    Founded in the heart of Jamshedpur, <span className="text-primary-600 font-bold">Subhvivah</span> was born from a simple yet profound vision: to bring the authenticity of traditional Indian matchmaking to the convenience of the modern age.
                  </p>
                  <p className="text-lg text-gray-600 leading-relaxed font-medium">
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
                    <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50/50 hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-gray-100 group">
                      <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-primary-600 group-hover:scale-110 transition-transform">
                        <CheckCircle className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-black text-gray-900 text-sm tracking-tight">{item.title}</div>
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4">
                  <Link href="/register" className="inline-flex items-center gap-3 bg-gray-900 text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gray-800 transition-all shadow-xl shadow-gray-900/20 active:scale-[0.98]">
                    Start Your Journey
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="bg-primary-600 py-16 text-white">
          <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">50k+</div>
              <div className="text-primary-100">Active Profiles</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10k+</div>
              <div className="text-primary-100">Successful Matches</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100%</div>
              <div className="text-primary-100">AI Verified</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-primary-100">Support</div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-50 pt-16 pb-8 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <Link href="/" className="text-2xl font-bold text-primary-600 flex items-center gap-2 mb-6">
                <Heart className="fill-primary-600" />
                <span>Subhvivah</span>
              </Link>
              <p className="text-gray-600 mb-6 max-w-sm">
                Subhvivah is Jamshedpur's leading matrimonial platform, committed to bringing families together through secure and traditional matchmaking.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-6">Quick Links</h4>
              <ul className="space-y-4">
                <li><Link href="/search" className="text-gray-600 hover:text-primary-600">Search Profiles</Link></li>
                <li><Link href="/premium" className="text-gray-600 hover:text-primary-600">Premium Plans</Link></li>
                <li><Link href="/about" className="text-gray-600 hover:text-primary-600">About Us</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-6">Support</h4>
              <ul className="space-y-4">
                <li><Link href="/contact" className="text-gray-600 hover:text-primary-600">Contact Us</Link></li>
                <li><Link href="/privacy" className="text-gray-600 hover:text-primary-600">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-gray-600 hover:text-primary-600">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
            © 2026 S & S Software Development and Engineering, Jamshedpur, India. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
