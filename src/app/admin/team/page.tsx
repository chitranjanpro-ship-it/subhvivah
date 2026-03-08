"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { UserPlus, Shield, Mail, BadgeCheck, Trash2, MoreVertical, X, Sparkles, Briefcase } from "lucide-react";
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
    <div className="p-12 text-center">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-600 border-t-transparent"></div>
      <p className="mt-4 text-gray-500 font-bold">Loading team members...</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Admin Team</h1>
          <p className="text-gray-500 font-medium">Manage sub-admins and their assigned verticals.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/20 active:scale-95"
        >
          <UserPlus className="w-5 h-5" />
          Add Member
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {team.map((member) => (
          <div key={member.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary-50 rounded-bl-[4rem] -z-10 group-hover:scale-110 transition-transform" />
            
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 rounded-2xl bg-white shadow-lg flex items-center justify-center text-primary-600">
                <Shield className="w-7 h-7" />
              </div>
              <button 
                onClick={() => handleDelete(member.id)}
                className="p-2 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-gray-900 truncate">{member.email}</h3>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  member.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {member.role}
                </span>
                {member.vertical && (
                  <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-[10px] font-black uppercase tracking-wider">
                    {member.vertical}
                  </span>
                )}
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                <BadgeCheck className="w-4 h-4 text-green-500" />
                Active Member
              </div>
              <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                ID: {member.id.slice(0, 8)}
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