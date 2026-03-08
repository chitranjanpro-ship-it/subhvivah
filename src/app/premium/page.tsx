"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Heart, CheckCircle, ArrowLeft, Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import api from "@/lib/axios";
import toast from "react-hot-toast";

const plans = [
  { 
    name: "Free", 
    price: "0", 
    features: ["Limited Chat", "Search Profiles", "Basic Filters"],
    recommended: false
  },
  { 
    name: "Gold", 
    price: "999", 
    features: ["Unlimited Chat", "Contact Reveal", "Profile Boost", "Verified Badge"], 
    recommended: true 
  },
  { 
    name: "Diamond", 
    price: "1999", 
    features: ["Personalized Matchmaker", "Priority Support", "Featured Profile", "Unlimited Everything"],
    recommended: false
  }
];

export default function PremiumPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuthStore();
  const [subscribing, setSubscribing] = useState<string | null>(null);

  const handleChoosePlan = async (planName: string) => {
    if (!user) {
      toast.error("Please login to choose a plan");
      router.push("/login?redirect=/premium");
      return;
    }

    if (planName === "Free") {
      router.push("/dashboard");
      return;
    }

    try {
      setSubscribing(planName);
      await api.post("/subscriptions", { planName });
      toast.success(`Successfully subscribed to ${planName} plan!`);
      router.push("/dashboard");
    } catch (error) {
      toast.error("Subscription failed. Please try again.");
    } finally {
      setSubscribing(null);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-600 transition-colors mb-12 font-bold group">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        <div className="text-center max-w-3xl mx-auto mb-16">
          <Heart className="w-12 h-12 text-primary-600 mx-auto mb-6 fill-primary-600" />
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">Upgrade Your Journey</h1>
          <p className="text-xl text-gray-600 font-medium">Find your soulmate faster with Subhvivah Premium features.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-10 rounded-[2.5rem] border ${plan.recommended ? 'border-primary-600 shadow-2xl shadow-primary-500/20 scale-105 relative z-10 bg-white' : 'border-gray-100 bg-white/80 backdrop-blur-xl'} transition-all hover:translate-y-[-8px]`}
            >
              {plan.recommended && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-primary-600 text-white px-8 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] shadow-xl shadow-primary-500/40">
                  Best Value
                </div>
              )}
              
              <h3 className="text-2xl font-black mb-6 text-gray-900 tracking-tight">{plan.name}</h3>
              
              <div className="flex items-baseline gap-1 mb-10">
                <span className="text-lg font-bold text-gray-400">₹</span>
                <span className="text-6xl font-black text-gray-900 tracking-tighter">{plan.price}</span>
                <span className="text-lg font-bold text-gray-400">/mo</span>
              </div>

              <div className="h-px w-full bg-gray-100 mb-10" />

              <ul className="space-y-6 mb-12">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-center gap-4 text-sm text-gray-600 font-bold">
                    <div className="w-6 h-6 rounded-full bg-primary-50 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-primary-600" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => handleChoosePlan(plan.name)}
                disabled={subscribing !== null}
                className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all active:scale-[0.95] flex items-center justify-center gap-2 ${
                  plan.recommended 
                    ? 'bg-primary-600 text-white shadow-2xl shadow-primary-500/30 hover:bg-primary-700' 
                    : 'bg-gray-900 text-white hover:bg-black shadow-xl shadow-gray-900/10'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {subscribing === plan.name ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  `Select ${plan.name}`
                )}
              </button>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 text-center text-gray-400 text-sm font-bold uppercase tracking-widest">
          Secure payment processing • No hidden fees • Cancel anytime
        </div>
      </div>
    </div>
  );
}
