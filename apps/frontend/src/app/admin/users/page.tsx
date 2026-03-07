"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { User, Shield, Mail, Phone, Calendar, MoreVertical, Plus, Edit, Trash2, Eye, X } from "lucide-react";
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
    <div className="p-12 text-center">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-600 border-t-transparent"></div>
      <p className="mt-4 text-gray-500 font-bold">Loading users...</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">User Management</h1>
          <p className="text-gray-500 font-medium">View and manage all registered platform users.</p>
        </div>
        <button 
          onClick={() => setShowModal('create')}
          className="flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/20 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Create User
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-visible">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-sm font-bold text-gray-700 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-700 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-700 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-700 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-700 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 group-hover:scale-110 transition-transform">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{user.email}</div>
                        <div className="text-xs text-gray-500 font-medium">{user.phone || 'No phone'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-bold ${
                      user.isVerified ? 'text-green-600' : 'text-orange-500'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${user.isVerified ? 'bg-green-600' : 'bg-orange-500'}`} />
                      {user.isVerified ? 'Verified' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600 font-medium">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right relative">
                    <button 
                      onClick={() => setActiveMenu(activeMenu === user.id ? null : user.id)}
                      className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 hover:text-gray-600"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                    
                    {activeMenu === user.id && (
                      <div className="absolute right-6 top-12 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 z-30 py-2 animate-in fade-in zoom-in duration-200">
                        <button 
                          onClick={() => { setSelectedUser(user); setShowModal('view'); setActiveMenu(null); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-primary-600 transition-colors"
                        >
                          <Eye className="w-4 h-4" /> View Profile
                        </button>
                        <button 
                          onClick={() => { setSelectedUser(user); setShowModal('edit'); setActiveMenu(null); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                        >
                          <Edit className="w-4 h-4" /> Edit User
                        </button>
                        <div className="h-px bg-gray-50 my-1" />
                        <button 
                          onClick={() => { handleDelete(user.id); setActiveMenu(null); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" /> Delete User
                        </button>
                      </div>
                    )}
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
          <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl border border-white/20 animate-in zoom-in duration-300">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                  {showModal === 'create' ? 'Create New User' : showModal === 'edit' ? 'Edit User' : 'User Details'}
                </h2>
                <button onClick={() => setShowModal(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>
              
              <div className="space-y-4">
                {showModal === 'view' && selectedUser && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                      <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                        <User className="w-8 h-8" />
                      </div>
                      <div>
                        <div className="text-lg font-black text-gray-900">{selectedUser.email}</div>
                        <div className="text-sm font-bold text-gray-500 uppercase tracking-widest">{selectedUser.role}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 border border-gray-100 rounded-2xl">
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Status</div>
                        <div className="font-bold text-gray-900">{selectedUser.isVerified ? 'Verified' : 'Pending'}</div>
                      </div>
                      <div className="p-4 border border-gray-100 rounded-2xl">
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Phone</div>
                        <div className="font-bold text-gray-900">{selectedUser.phone || 'N/A'}</div>
                      </div>
                    </div>
                  </div>
                )}
                {/* Add form for create/edit here if needed */}
                {(showModal === 'create' || showModal === 'edit') && (
                  <p className="text-gray-500 font-medium italic text-sm">Form logic will be added in the next update. Using mock CRUD for now.</p>
                )}
              </div>
              
              <div className="mt-8 flex gap-3">
                <button 
                  onClick={() => setShowModal(null)}
                  className="flex-grow py-4 rounded-2xl font-black text-sm uppercase tracking-widest bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
                >
                  Close
                </button>
                {showModal !== 'view' && (
                  <button className="flex-grow py-4 rounded-2xl font-black text-sm uppercase tracking-widest bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-500/20 transition-all">
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
