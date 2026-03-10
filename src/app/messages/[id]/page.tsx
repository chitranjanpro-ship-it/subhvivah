"use client";

import { useEffect, useState, useRef } from "react";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/auth.store";
import { MessageSquare, User, Send, ArrowLeft, Loader2, Sparkles, ShieldCheck, AlertCircle, Info, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import UserLayout from "../../dashboard/layout";

export default function ChatPage({ params }: { params: { id: string } }) {
  const { user } = useAuthStore();
  const router = useRouter();
  const [messages, setMessages] = useState<any[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [suggestionCategory, setSuggestionCategory] = useState<string>("STARTER");
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [moderationWarning, setModerationWarning] = useState<string | null>(null);
  const [alternativeSuggestion, setAlternativeSuggestion] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await api.get(`/chats/${params.id}/messages`);
        setMessages(response.data.messages);
        
        // If no messages, suggest starters
        if (response.data.messages.length === 0) {
          fetchSuggestions("STARTER");
        } else {
          // Check if last message was from other user, then suggest replies
          const lastMsg = response.data.messages[response.data.messages.length - 1];
          if (lastMsg.senderId !== user?.id) {
            fetchSuggestions("REPLY");
          } else {
            fetchSuggestions("ICEBREAKER");
          }
        }
      } catch (error) {
        console.error("Failed to fetch messages", error);
        toast.error("Could not load messages.");
      } finally {
        setLoading(false);
        setTimeout(scrollToBottom, 100);
      }
    };
    fetchMessages();

    // Poll for new messages every 5 seconds
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [params.id, user?.id]);

  const fetchSuggestions = async (category: string) => {
    setLoadingSuggestions(true);
    setSuggestionCategory(category);
    try {
      const response = await api.get(`/ai/chat-suggestions?category=${category}`);
      setSuggestions(response.data.suggestions);
    } catch (error) {
      console.error("Failed to fetch suggestions", error);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!content.trim() || sending) return;

    setSending(true);
    setModerationWarning(null);
    setAlternativeSuggestion(null);

    try {
      const response = await api.post(`/chats/${params.id}/messages`, { content });
      setMessages([...messages, response.data.message]);
      setContent("");
      setTimeout(scrollToBottom, 100);
      
      // Update suggestions to follow-up or icebreakers
      fetchSuggestions("ICEBREAKER");
    } catch (error: any) {
      console.error("Failed to send message", error);
      if (error.response?.data?.message) {
        setModerationWarning(error.response.data.message);
        if (error.response.data.alternative) {
          setAlternativeSuggestion(error.response.data.alternative);
        }
      } else {
        toast.error("Failed to send message.");
      }
    } finally {
      setSending(false);
    }
  };

  const useSuggestion = (suggestion: string) => {
    setContent(suggestion);
    setModerationWarning(null);
  };

  return (
    <UserLayout>
      <div className="max-w-4xl mx-auto h-[calc(100vh-12rem)] flex flex-col">
        {/* Header */}
        <div className="bg-white p-4 rounded-t-3xl border-b border-gray-100 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <Link href="/messages" className="p-2 hover:bg-gray-50 rounded-xl transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-500" />
            </Link>
            <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600 font-bold">
              <User className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-gray-900 flex items-center gap-2">
                Chat Session
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-bold">
                  <ShieldCheck className="w-3 h-3" />
                  AI SECURE
                </span>
              </div>
              <div className="text-xs text-gray-400">Online</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => fetchSuggestions("TOPIC")}
              className="p-2 text-primary-600 hover:bg-primary-50 rounded-xl transition-colors flex items-center gap-1.5 text-xs font-bold"
            >
              <Sparkles className="w-4 h-4" />
              TOPIC GUIDANCE
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-grow overflow-y-auto p-6 bg-white/50 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center h-full text-gray-400">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : messages.length > 0 ? (
            messages.map((msg, i) => (
              <div 
                key={msg.id} 
                className={`flex ${msg.senderId === user?.id ? "justify-end" : "justify-start"}`}
              >
                <div 
                  className={`max-w-[70%] p-4 rounded-2xl shadow-sm text-sm ${
                    msg.senderId === user?.id 
                      ? "bg-primary-600 text-white rounded-br-none" 
                      : "bg-white text-gray-800 border border-gray-100 rounded-bl-none"
                  }`}
                >
                  {msg.content}
                  <div className={`text-[10px] mt-1 opacity-60 ${msg.senderId === user?.id ? "text-right" : "text-left"}`}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center">
                <Sparkles className="w-8 h-8" />
              </div>
              <div>
                <div className="font-bold text-gray-900">Start a conversation!</div>
                <div className="text-gray-500 text-sm">Be the first to say hello.</div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* AI Suggestions */}
        <div className="bg-white/80 backdrop-blur-sm p-4 border-t border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs font-bold text-primary-600 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              AI Suggestions: {suggestionCategory.replace('_', ' ')}
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => fetchSuggestions("STARTER")}
                className={`text-[10px] font-bold px-2 py-1 rounded-lg transition-colors ${suggestionCategory === 'STARTER' ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                Starters
              </button>
              <button 
                onClick={() => fetchSuggestions("ICEBREAKER")}
                className={`text-[10px] font-bold px-2 py-1 rounded-lg transition-colors ${suggestionCategory === 'ICEBREAKER' ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                Icebreakers
              </button>
              <button 
                onClick={() => fetchSuggestions("REPLY")}
                className={`text-[10px] font-bold px-2 py-1 rounded-lg transition-colors ${suggestionCategory === 'REPLY' ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                Replies
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {loadingSuggestions ? (
              <div className="w-full flex justify-center py-2">
                <Loader2 className="w-4 h-4 animate-spin text-primary-600" />
              </div>
            ) : suggestions.length > 0 ? (
              suggestions.map((s, i) => (
                <button 
                  key={i}
                  onClick={() => useSuggestion(s)}
                  className="px-4 py-2 bg-gray-50 hover:bg-primary-50 border border-gray-100 hover:border-primary-200 text-gray-700 hover:text-primary-700 text-sm rounded-xl transition-all font-medium text-left"
                >
                  {s}
                </button>
              ))
            ) : (
              <div className="text-xs text-gray-400 italic">No suggestions available.</div>
            )}
          </div>
        </div>

        {/* Input & Moderation */}
        <div className="bg-white p-6 rounded-b-3xl border-t border-gray-100">
          {moderationWarning && (
            <div className="mb-4 p-4 bg-red-50 border border-red-100 rounded-2xl flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-red-100 text-red-600 rounded-lg">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-bold text-red-800">AI Security Warning</div>
                  <div className="text-xs text-red-600 mt-0.5">{moderationWarning}</div>
                </div>
              </div>
              {alternativeSuggestion && (
                <div className="bg-white/50 p-3 rounded-xl border border-red-200 flex flex-col gap-2">
                  <div className="text-[10px] font-bold text-red-700 uppercase flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Recommended Alternative
                  </div>
                  <div className="text-xs text-gray-700">{alternativeSuggestion}</div>
                  <button 
                    onClick={() => useSuggestion(alternativeSuggestion)}
                    className="self-start text-[10px] font-bold text-primary-600 hover:text-primary-700 uppercase"
                  >
                    Use this instead
                  </button>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSendMessage} className="flex gap-3">
            <input 
              type="text" 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Type your message respectfully..." 
              className="flex-grow bg-gray-50 border border-gray-200 rounded-2xl px-6 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm transition-all"
            />
            <button 
              type="submit"
              disabled={sending || !content.trim()}
              className="bg-primary-600 text-white p-3 rounded-2xl font-bold hover:bg-primary-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary-500/20"
            >
              {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </form>
          <div className="mt-3 flex items-center justify-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
            <ShieldCheck className="w-3 h-3 text-green-500" />
            End-to-end encrypted & AI monitored for safety
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
