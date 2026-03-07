"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { Heart, Loader2, Eye, EyeOff, ChevronDown, MapPin, Upload, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/axios";

const roles = [
  { id: "BRIDE", label: "Bride" },
  { id: "GROOM", label: "Groom" },
  { id: "DIVORCED_BRIDE", label: "Divorced Bride" },
  { id: "DIVORCED_GROOM", label: "Divorced Groom" },
  { id: "WIDOW", label: "Widow" },
  { id: "WIDOWER", label: "Widower" },
  { id: "PARENT", label: "Parent" },
  { id: "SIBLING", label: "Sibling" },
  { id: "FRIEND", label: "Friend" },
  { id: "GUARDIAN", label: "Guardian" },
  { id: "RELATIVE", label: "Relative" },
  { id: "MARRIAGE_BROKER", label: "Marriage Broker" },
];

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading: isRegistering } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [regMethod, setRegMethod] = useState<'manual' | 'ai'>('manual');
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    phone: "",
    role: "BRIDE",
    referrerEmail: "",
    name: "",
    age: "",
    religion: "",
    location: "",
  });

  const handleBiodataUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsing(true);
    const uploadData = new FormData();
    uploadData.append('biodata', file);

    try {
      toast.loading("AI is parsing your document...", { id: 'ai-parse' });
      const response = await api.post('/ai/parse-biodata', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const parsedData = response.data.data;
      setFormData(prev => ({
        ...prev,
        name: parsedData.name || "",
        age: parsedData.age?.toString() || "",
        religion: parsedData.religion || "",
        location: parsedData.location || "",
        role: parsedData.gender === "FEMALE" ? "BRIDE" : "GROOM"
      }));
      
      setRegMethod('manual'); // Switch to manual to show the auto-filled data
      toast.success("Details extracted! Please review and complete.", { id: 'ai-parse' });
    } catch (error) {
      toast.error("AI parsing failed. Please fill details manually.", { id: 'ai-parse' });
    } finally {
      setIsParsing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(formData);
      toast.success("Registration successful!");
      router.push("/dashboard/create-profile");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-primary-50 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-secondary-50 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="max-w-md w-full space-y-8 bg-white/80 backdrop-blur-xl p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/20 relative z-10">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-primary-600 text-3xl font-bold hover:scale-105 transition-transform">
            <Heart className="fill-primary-600 w-8 h-8" />
            <span>Subhvivah</span>
          </Link>
          <h2 className="mt-8 text-3xl font-extrabold text-gray-900 tracking-tight">Create your account</h2>
          <p className="mt-3 text-sm text-gray-500 font-medium">
            Choose your preferred registration method
          </p>
        </div>

        {/* Method Switcher */}
        <div className="flex bg-gray-100 p-1 rounded-2xl border border-gray-200 mt-8">
          <button 
            onClick={() => setRegMethod('manual')}
            className={`flex-grow py-3 rounded-xl font-bold text-sm transition-all ${regMethod === 'manual' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Manual Entry
          </button>
          <button 
            onClick={() => setRegMethod('ai')}
            className={`flex-grow py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${regMethod === 'ai' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Sparkles className="w-4 h-4" />
            AI Upload
          </button>
        </div>

        {regMethod === 'ai' ? (
          <div className="mt-8 p-6 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl border border-primary-100/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">AI Registration</h3>
                <p className="text-xs text-gray-500 font-medium">Upload documents to auto-fill</p>
              </div>
            </div>
            <label className="group relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-primary-200 rounded-xl hover:bg-white/50 transition-all cursor-pointer">
              <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                <Upload className="w-10 h-10 text-primary-400 group-hover:scale-110 transition-transform mb-3" />
                <p className="text-sm font-bold text-primary-600">Click to upload document</p>
                <p className="text-[10px] text-gray-400 font-medium mt-2 uppercase tracking-tighter max-w-[200px]">Supports PDF, DOC, JPG, PNG, JPEG (Max 5MB)</p>
              </div>
              <input 
                type="file" 
                className="hidden" 
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" 
                onChange={handleBiodataUpload} 
                disabled={isParsing} 
              />
              {isParsing && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
                    <span className="text-xs font-bold text-primary-600">Analyzing...</span>
                  </div>
                </div>
              )}
            </label>
            <p className="mt-4 text-[10px] text-gray-400 text-center font-medium italic">
              * AI will extract details and switch to manual view for review.
            </p>
          </div>
        ) : (
          <form className="mt-10 space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Full Name <span className="text-primary-600">*</span></label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3.5 border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 sm:text-sm bg-gray-50/50"
                  placeholder="Rahul Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Age <span className="text-primary-600">*</span></label>
                <input
                  type="number"
                  required
                  className="w-full px-4 py-3.5 border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 sm:text-sm bg-gray-50/50"
                  placeholder="28"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Account Type <span className="text-primary-600">*</span></label>
              <div className="relative">
                <select
                  className="mt-1 block w-full px-4 py-3.5 border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 sm:text-sm bg-gray-50/50 appearance-none cursor-pointer pr-10"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>{role.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Email address <span className="text-primary-600">*</span></label>
              <input
                type="email"
                required
                className="mt-1 block w-full px-4 py-3.5 border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 sm:text-sm bg-gray-50/50"
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Phone Number <span className="text-primary-600">*</span></label>
              <input
                type="tel"
                required
                className="mt-1 block w-full px-4 py-3.5 border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 sm:text-sm bg-gray-50/50"
                placeholder="+91 00000 00000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Password <span className="text-primary-600">*</span></label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="mt-1 block w-full px-4 py-3.5 border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 sm:text-sm bg-gray-50/50 pr-12"
                  placeholder="Min. 8 characters"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Location / Country <span className="text-primary-600">*</span></label>
              <div className="relative">
                <input
                  type="text"
                  required
                  className="mt-1 block w-full px-4 py-3.5 border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 sm:text-sm bg-gray-50/50"
                  placeholder="City, State, Country"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
                <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isRegistering}
                className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-2xl text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-500/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-primary-500/20"
              >
                {isRegistering ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Creating account...</span>
                  </div>
                ) : "Sign up"}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Footer link */}
      <div className="absolute bottom-8 text-center w-full">
        <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 transition-colors font-medium">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
