"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Shield, CheckCircle, XCircle, Eye, User, FileText, Calendar, MapPin } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminVerificationsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  const fetchRequests = async () => {
    try {
      const response = await api.get("/admin/verification-requests");
      setRequests(response.data.requests);
    } catch (error) {
      console.error("Failed to fetch requests", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleVerify = async (id: string, status: string) => {
    try {
      await api.put(`/admin/verify-profile/${id}`, { status });
      toast.success(`Profile ${status.toLowerCase()} successfully`);
      fetchRequests();
      setSelectedRequest(null);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  if (loading) return <div className="p-8 text-center font-bold">Loading requests...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Verification Requests</h1>
        <p className="text-slate-500 font-bold">Review and approve user profile verifications.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-50 bg-slate-50/50">
            <h2 className="font-black text-slate-900 uppercase tracking-widest text-xs">Pending Requests ({requests.length})</h2>
          </div>
          <div className="divide-y divide-slate-50">
            {requests.map((req) => (
              <div 
                key={req.id} 
                className={`p-6 flex items-center justify-between hover:bg-slate-50 transition-all cursor-pointer ${selectedRequest?.id === req.id ? 'bg-primary-50/50' : ''}`}
                onClick={() => setSelectedRequest(req)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-black text-slate-900">{req.name}</div>
                    <div className="text-xs text-slate-500 font-bold">{req.user?.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button className="p-2 hover:bg-white rounded-xl transition-colors text-primary-600 shadow-sm border border-transparent hover:border-primary-100">
                    <Eye className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
            {requests.length === 0 && (
              <div className="p-20 text-center text-slate-400 font-bold">
                No pending requests at the moment.
              </div>
            )}
          </div>
        </div>

        <div className="space-y-8">
          {selectedRequest ? (
            <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 p-8 sticky top-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Review Profile</h2>
                <div className="px-4 py-1.5 bg-primary-50 text-primary-600 rounded-full text-xs font-black uppercase tracking-widest">
                  Pending
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</p>
                  <p className="font-bold text-slate-900">{selectedRequest.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Age</p>
                  <p className="font-bold text-slate-900">{selectedRequest.age} Years</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Religion</p>
                  <p className="font-bold text-slate-900">{selectedRequest.religion}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</p>
                  <p className="font-bold text-slate-900">{selectedRequest.location}</p>
                </div>
              </div>

              <div className="space-y-4 mb-10">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verification Documents</p>
                <div className="grid grid-cols-2 gap-4">
                  {selectedRequest.documents?.map((doc: any, i: number) => (
                    <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
                      <FileText className="w-5 h-5 text-primary-600" />
                      <div className="text-xs font-bold text-slate-600 truncate">{doc.type}</div>
                    </div>
                  ))}
                  {(!selectedRequest.documents || selectedRequest.documents.length === 0) && (
                    <div className="col-span-2 p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-xs font-bold">
                      No documents uploaded.
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-4 mt-auto">
                <button 
                  onClick={() => handleVerify(selectedRequest.id, 'APPROVED')}
                  className="flex-grow bg-green-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve
                </button>
                <button 
                  onClick={() => handleVerify(selectedRequest.id, 'REJECTED')}
                  className="flex-grow bg-red-50 text-red-600 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-red-100 transition-all flex items-center justify-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  Reject
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-20 text-center gap-4">
              <Shield className="w-16 h-12 text-slate-200" />
              <div>
                <p className="text-lg font-black text-slate-400">No Request Selected</p>
                <p className="text-sm text-slate-400 font-bold">Select a user from the list to start reviewing their profile.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
