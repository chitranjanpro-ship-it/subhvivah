"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { UserPlus, Shield, Mail, BadgeCheck, Trash2, MoreVertical, X, Sparkles, Briefcase, Heart } from "lucide-react";
import toast from "react-hot-toast";

const verticals = ["VERIFICATION", "SUPPORT", "SALES", "CONTENT", "FINANCE"];

export default function AdminTeamPage() {
  const [team, setTeam] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newMember, setNewMember] = useState({
    email: "",
    password: "",
    role: "SUB_ADMIN",
    vertical: "VERIFICATION"
  });

  const fetchTeam = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/team");
      setTeam(response.data.team);
    } catch (error) {
      toast.error("Failed to fetch team members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/admin/team", newMember);
      toast.success("Team member added successfully");
      setShowModal(false);
      fetchTeam();
    } catch (error) {
      toast.error("Failed to add member");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this team member?")) return;
    try {
      await api.delete(`/admin/team/${id}`);
      toast.success("Member removed");
      fetchTeam();
    } catch (error) {
      toast.error("Removal failed");
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <Heart className="w-12 h-12 text-primary animate-pulse fill-primary" />
        <p className="opacity-50 font-bold">Verifying Team...</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Admin Team</h1>
          <p className="opacity-50 font-medium">Manage sub-admins and their assigned verticals.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-lg shadow-primary/20 active:scale-95"
        >
          <UserPlus className="w-4 h-4" />
          Add Member
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {team.map((member) => (
          <div key={member.id} className="card-style p-6 rounded-[2rem] shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-[4rem] -z-10 group-hover:scale-110 transition-transform" />
            
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 rounded-2xl bg-card shadow-lg flex items-center justify-center text-primary">
                <Shield className="w-7 h-7" />
              </div>
              <button 
                onClick={() => handleDelete(member.id)}
                className="p-2 text-inherit opacity-20 hover:opacity-100 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1">
              <div className="font-black text-lg truncate">{member.email}</div>
              <div className="flex items-center gap-2">
                <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest">
                  {member.vertical}
                </div>
                <div className="px-3 py-1 bg-inherit border border-inherit rounded-full text-[10px] font-black opacity-40 uppercase tracking-widest">
                  {member.role}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl border border-white/20 animate-in zoom-in duration-300">
            <form onSubmit={handleCreate} className="p-10">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">Add Team Member</h2>
                  <p className="text-sm text-gray-500 font-medium">Create credentials for sub-admins.</p>
                </div>
                <button type="button" onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Email Address</label>
                  <input
                    type="email"
                    required
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all font-medium"
                    placeholder="admin@subhvivah.com"
                    value={newMember.email}
                    onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Password</label>
                  <input
                    type="password"
                    required
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all font-medium"
                    placeholder="••••••••"
                    value={newMember.password}
                    onChange={(e) => setNewMember({ ...newMember, password: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Role</label>
                    <select
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all font-bold text-sm"
                      value={newMember.role}
                      onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                    >
                      <option value="SUB_ADMIN">Sub Admin</option>
                      <option value="ADMIN">Full Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Vertical</label>
                    <select
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all font-bold text-sm"
                      value={newMember.vertical}
                      onChange={(e) => setNewMember({ ...newMember, vertical: e.target.value })}
                    >
                      {verticals.map(v => (
                        <option key={v} value={v}>{v}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              
              <button 
                type="submit"
                className="w-full mt-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest bg-primary-600 text-white hover:bg-primary-700 shadow-xl shadow-primary-500/30 transition-all active:scale-[0.98]"
              >
                Confirm & Add Member
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}