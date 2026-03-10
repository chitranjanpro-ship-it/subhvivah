"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/auth.store";
import { MessageSquare, User, Search, Clock } from "lucide-react";
import Link from "next/link";
import UserLayout from "../dashboard/layout";

export default function MessagesPage() {
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await api.get("/chats");
        setChats(response.data.chats);
      } catch (error) {
        console.error("Failed to fetch chats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchChats();
  }, []);

  return (
    <UserLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Your Conversations</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search chats..." 
              className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-20 text-center text-gray-500">Loading your messages...</div>
          ) : chats.length > 0 ? (
            <div className="divide-y divide-gray-50">
              {chats.map((participant) => (
                <Link 
                  key={participant.chat.id} 
                  href={`/messages/${participant.chat.id}`}
                  className="flex items-center gap-4 p-6 hover:bg-gray-50 transition-colors group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-xl overflow-hidden">
                    {participant.chat.participants[0]?.user.profiles[0]?.photos[0]?.url ? (
                      <img 
                        src={participant.chat.participants[0].user.profiles[0].photos[0].url} 
                        alt="" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      participant.chat.participants[0]?.user.profiles[0]?.name?.charAt(0) || "U"
                    )}
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-bold text-gray-900 truncate group-hover:text-primary-600 transition-colors">
                        {participant.chat.participants[0]?.user.profiles[0]?.name || "Anonymous User"}
                      </div>
                      <div className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(participant.chat.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 truncate">
                      {participant.chat.messages[0]?.content || "Start a conversation..."}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-20 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-400">
                <MessageSquare className="w-8 h-8" />
              </div>
              <div className="text-gray-900 font-bold mb-1">No messages yet</div>
              <div className="text-gray-500 text-sm mb-6">Find matches and start a conversation!</div>
              <Link href="/search" className="bg-primary-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-primary-700 transition-colors inline-block">
                Browse Profiles
              </Link>
            </div>
          )}
        </div>
      </div>
    </UserLayout>
  );
}
