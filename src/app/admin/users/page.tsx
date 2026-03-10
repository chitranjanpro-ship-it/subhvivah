"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { User, Shield, Mail, Phone, Calendar, MoreVertical, Plus, Edit, Trash2, Eye, X, Heart, Search } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState<'create' | 'edit' | 'view' | null>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/users");
      setUsers(response.data.users);
    } catch (error) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/admin/users/${id}`);
      toast.success("User deleted");
      fetchUsers();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <Heart className="w-12 h-12 text-primary animate-pulse fill-primary" />
        <p className="opacity-50 font-bold">Loading User Database...</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tight">User Management</h1>
          <p className="opacity-50 font-medium">Review and manage platform members.</p>
        </div>
      </div>

      <div className="card-style rounded-[2.5rem] shadow-sm overflow-hidden border border-inherit">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-primary/5 border-b border-inherit">
                <th className="px-6 py-5 text-xs font-black opacity-40 uppercase tracking-widest">User</th>
                <th className="px-6 py-5 text-xs font-black opacity-40 uppercase tracking-widest">Role</th>
                <th className="px-6 py-5 text-xs font-black opacity-40 uppercase tracking-widest">Vertical</th>
                <th className="px-6 py-5 text-xs font-black opacity-40 uppercase tracking-widest">Status</th>
                <th className="px-6 py-5 text-xs font-black opacity-40 uppercase tracking-widest">Joined</th>
                <th className="px-6 py-5 text-right text-xs font-black opacity-40 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-inherit">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-primary/5 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="font-bold">{user.email}</div>
                    <div className="text-[10px] opacity-40 font-black uppercase tracking-tighter">{user.id}</div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      user.role === 'ADMIN' ? 'bg-purple-500/10 text-purple-500' : 'bg-blue-500/10 text-blue-500'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-xs font-bold opacity-60">
                      {user.vertical || '-'}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-bold ${
                      user.isVerified ? 'text-green-500' : 'text-orange-500'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${user.isVerified ? 'bg-green-500' : 'bg-orange-500'}`} />
                      {user.isVerified ? 'Verified' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-sm opacity-60 font-medium">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-5 text-right relative">
                    <button 
                      onClick={() => handleDelete(user.id)}
                      className="p-2.5 text-inherit opacity-20 hover:opacity-100 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Basic Modal Backdrop */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="card-style rounded-[2rem] w-full max-w-lg shadow-2xl border border-inherit animate-in zoom-in duration-300">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black tracking-tight">
                  {showModal === 'create' ? 'Create New User' : showModal === 'edit' ? 'Edit User' : 'User Details'}
                </h2>
                <button onClick={() => setShowModal(null)} className="p-2 hover:bg-primary/10 rounded-full transition-colors">
                  <X className="w-6 h-6 opacity-40" />
                </button>
              </div>
              
              <div className="space-y-4">
                {showModal === 'view' && selectedUser && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-2xl border border-inherit">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <User className="w-8 h-8" />
                      </div>
                      <div>
                        <div className="text-lg font-black">{selectedUser.email}</div>
                        <div className="text-sm font-bold opacity-40 uppercase tracking-widest">{selectedUser.role}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 border border-inherit rounded-2xl bg-primary/5">
                        <div className="text-[10px] font-black opacity-40 uppercase tracking-widest mb-1">Status</div>
                        <div className="font-bold">{selectedUser.isVerified ? 'Verified' : 'Pending'}</div>
                      </div>
                      <div className="p-4 border border-inherit rounded-2xl bg-primary/5">
                        <div className="text-[10px] font-black opacity-40 uppercase tracking-widest mb-1">Phone</div>
                        <div className="font-bold">{selectedUser.phone || 'N/A'}</div>
                      </div>
                    </div>
                  </div>
                )}
                {/* Add form for create/edit here if needed */}
                {(showModal === 'create' || showModal === 'edit') && (
                  <p className="opacity-40 font-medium italic text-sm">Form logic will be added in the next update. Using mock CRUD for now.</p>
                )}
              </div>
              
              <div className="mt-8 flex gap-3">
                <button 
                  onClick={() => setShowModal(null)}
                  className="flex-grow py-4 rounded-2xl font-black text-sm uppercase tracking-widest bg-primary/5 hover:bg-primary/10 transition-all"
                >
                  Close
                </button>
                {showModal !== 'view' && (
                  <button className="flex-grow py-4 rounded-2xl font-black text-sm uppercase tracking-widest bg-primary text-primary-foreground hover:scale-105 shadow-lg shadow-primary/20 transition-all active:scale-95">
                    Save Changes
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
