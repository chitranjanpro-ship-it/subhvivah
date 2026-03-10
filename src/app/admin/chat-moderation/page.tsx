"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Shield, AlertCircle, Trash2, Eye, User, Clock, MessageSquare, Filter, RefreshCw, BadgeCheck } from "lucide-react";
import toast from "react-hot-toast";
import AdminLayout from "../layout";

export default function ChatModerationPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("ALL");

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await api.get("/admin/chat-moderation");
      setEvents(response.data.events);
    } catch (error) {
      console.error("Failed to fetch moderation events", error);
      toast.error("Could not load moderation logs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const filteredEvents = events.filter(e => filter === "ALL" || e.type === filter);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Shield className="text-primary-600" />
              Chat Safety & Moderation
            </h1>
            <p className="text-gray-500 text-sm">Monitor AI-flagged messages and security violations.</p>
          </div>
          <button 
            onClick={fetchEvents}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="text-xs font-bold text-gray-400 uppercase mb-1 tracking-wider">Total Flags</div>
            <div className="text-2xl font-bold text-gray-900">{events.length}</div>
          </div>
          <div className="bg-red-50 p-6 rounded-2xl shadow-sm border border-red-100">
            <div className="text-xs font-bold text-red-400 uppercase mb-1 tracking-wider">Scam Attempts</div>
            <div className="text-2xl font-bold text-red-700">
              {events.filter(e => e.type === 'SCAM_ATTEMPT').length}
            </div>
          </div>
          <div className="bg-orange-50 p-6 rounded-2xl shadow-sm border border-orange-100">
            <div className="text-xs font-bold text-orange-400 uppercase mb-1 tracking-wider">Contact Sharing</div>
            <div className="text-2xl font-bold text-orange-700">
              {events.filter(e => e.type === 'CONTACT_SHARING').length}
            </div>
          </div>
          <div className="bg-blue-50 p-6 rounded-2xl shadow-sm border border-blue-100">
            <div className="text-xs font-bold text-blue-400 uppercase mb-1 tracking-wider">Blocked Messages</div>
            <div className="text-2xl font-bold text-blue-700">
              {events.filter(e => e.actionTaken === 'BLOCKED').length}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select 
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="text-sm font-bold text-gray-700 bg-transparent border-none focus:ring-0 cursor-pointer"
              >
                <option value="ALL">All Events</option>
                <option value="SCAM_ATTEMPT">Scam Attempt</option>
                <option value="CONTACT_SHARING">Contact Sharing</option>
                <option value="ABUSIVE_LANGUAGE">Abusive Language</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Time</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">User / Chat</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Violation</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Content</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">Loading events...</td>
                  </tr>
                ) : filteredEvents.length > 0 ? (
                  filteredEvents.map((event) => (
                    <tr key={event.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock className="w-4 h-4" />
                          {new Date(event.createdAt).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <div className="font-bold text-gray-900 text-sm">{event.user.email}</div>
                          <div className="text-xs text-gray-400 flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" />
                            ID: {event.chatId.substring(0, 8)}...
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                          event.type === 'SCAM_ATTEMPT' ? 'bg-red-100 text-red-700' :
                          event.type === 'CONTACT_SHARING' ? 'bg-orange-100 text-orange-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {event.type.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-700 max-w-xs truncate font-medium bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 italic">
                          "{event.content}"
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider ${
                          event.actionTaken === 'BLOCKED' ? 'text-red-600' : 'text-orange-600'
                        }`}>
                          <BadgeCheck className="w-3.5 h-3.5" />
                          {event.actionTaken}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500 italic">No security events found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
