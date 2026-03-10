"use client";

import Link from "next/link";
import { Heart, CheckCircle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-inherit transition-colors duration-300">
      <header className="fixed top-0 w-full z-50 card-style border-b border-inherit backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary flex items-center gap-2">
            <Heart className="fill-primary" />
            <span>Subhvivah</span>
          </Link>
          <nav className="flex items-center gap-8">
            <Link href="/" className="text-inherit opacity-70 hover:opacity-100 font-medium transition-opacity">Home</Link>
            <Link href="/login" className="text-inherit opacity-70 hover:opacity-100 font-medium transition-opacity">Login</Link>
          </nav>
        </div>
      </header>

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="aspect-[4/5] bg-primary/5 rounded-[3rem] overflow-hidden shadow-2xl relative border border-primary/10 group">
                <img 
                  src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1000&auto=format&fit=crop" 
                  alt="Traditional Indian Wedding" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent opacity-60" />
              </div>
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-primary rounded-[2.5rem] flex items-center justify-center p-6 text-primary-foreground text-center shadow-xl border-4 border-background">
                <div className="space-y-1">
                  <div className="text-4xl font-black uppercase tracking-tighter leading-none">100%</div>
                  <div className="text-[10px] font-black uppercase tracking-widest opacity-80">Authentic Matches</div>
                </div>
              </div>
              {/* Decorative background shape */}
              <div className="absolute -inset-4 bg-primary/5 rounded-[3.5rem] -z-10 translate-x-4 translate-y-4" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-10"
            >
              <div className="space-y-4">
                <div className="inline-block px-4 py-1.5 bg-primary/10 rounded-full text-[10px] font-black text-primary uppercase tracking-widest">About Our Platform</div>
                <h1 className="text-5xl lg:text-6xl font-black text-inherit tracking-tight leading-[1.1]">
                  Preserving <span className="text-primary">Traditions</span> for the Modern Age
                </h1>
              </div>

              <div className="space-y-6 text-lg text-inherit opacity-80 leading-relaxed font-medium">
                <p>
                  Founded with the goal of revolutionizing the Indian matrimonial landscape, <span className="text-primary font-bold">Subhvivah</span> combines deep-rooted family values with state-of-the-art technology.
                </p>
                <p>
                  We believe that marriage is the most sacred bond in our culture. Our platform is designed to facilitate meaningful connections while ensuring the highest standards of safety, privacy, and verification for every user.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { title: "Manual Review", desc: "Every profile checked by humans" },
                  { title: "AI-Powered", desc: "Advanced matching algorithms" },
                  { title: "Privacy First", desc: "Your data is always protected" },
                  { title: "Family Focused", desc: "Support for parents and relatives" }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 p-5 rounded-2xl card-style border border-inherit hover:border-primary/30 transition-all group">
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

              <div className="pt-6">
                <Link href="/register" className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary/20 active:scale-[0.98]">
                  Start Your Journey
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <footer className="card-style border-t border-inherit py-10 mt-20">
        <div className="container mx-auto px-4 text-center">
          <div className="text-xs font-black opacity-40 uppercase tracking-[0.2em]">
            © 2026 S & S Software Development and Engineering, Jamshedpur, India. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
