"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/auth.store";
import { Briefcase, Clock, AlertCircle, CheckCircle, Plus, X, User, Shield, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

const priorities = ["LOW", "MEDIUM", "HIGH", "URGENT"];
const verticals = ["VERIFICATION", "SUPPORT", "SALES", "CONTENT", "FINANCE"];

export default function AdminTasksPage() {
  const { user } = useAuthStore();
  const [tasks, setTasks] = useState<any[]>([]);
  const [team, setTeam] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignedToId: "",
    vertical: "VERIFICATION",
    priority: "MEDIUM",
    dueDate: ""
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tasksRes, teamRes] = await Promise.all([
        api.get("/admin/tasks"),
        user?.role === 'ADMIN' ? api.get("/admin/team") : Promise.resolve({ data: { team: [] } })
      ]);
      setTasks(tasksRes.data.tasks);
      setTeam(teamRes.data.team);
    } catch (error) {
      toast.error("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/admin/tasks", newTask);
      toast.success("Task assigned successfully");
      setShowModal(false);
      fetchData();
    } catch (error) {
      toast.error("Failed to assign task");
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.put(`/admin/tasks/${id}`, { status });
      toast.success("Task updated");
      fetchData();
    } catch (error) {
      toast.error("Update failed");
    }
  };

  if (loading) return (
    <div className="p-12 text-center">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-600 border-t-transparent"></div>
      <p className="mt-4 text-gray-500 font-bold">Loading tasks...</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            {user?.role === 'ADMIN' ? 'Vertical Task Delegation' : 'My Assigned Tasks'}
          </h1>
          <p className="text-gray-500 font-medium">
            {user?.role === 'ADMIN' ? 'Distribute tasks to your team members.' : `Review and complete tasks for ${user?.vertical} team.`}
          </p>
        </div>
        {user?.role === 'ADMIN' && (
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/20 active:scale-95"
          >
            <Plus className="w-5 h-5" />
            Assign Task
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {['PENDING', 'IN_PROGRESS', 'COMPLETED'].map((status) => (
          <div key={status} className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${status === 'PENDING' ? 'bg-orange-500' : status === 'IN_PROGRESS' ? 'bg-blue-500' : 'bg-green-500'}`} />
                {status.replace('_', ' ')}
              </h2>
              <span className="text-[10px] font-black text-gray-300 bg-gray-50 px-2 py-0.5 rounded-full">
                {tasks.filter(t => t.status === status).length}
              </span>
            </div>

            <div className="space-y-4">
              {tasks.filter(t => t.status === status).map((task) => (
                <div key={task.id} className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all group border-l-4" style={{ borderLeftColor: task.priority === 'URGENT' ? '#ef4444' : task.priority === 'HIGH' ? '#f97316' : '#3b82f6' }}>
                  <div className="flex justify-between items-start mb-3">
                    <span className="px-2 py-0.5 bg-gray-50 text-[10px] font-black text-gray-500 rounded-full uppercase tracking-tighter">
                      {task.vertical}
                    </span>
                    <span className={`text-[10px] font-black uppercase tracking-tighter ${task.priority === 'URGENT' ? 'text-red-600' : 'text-gray-400'}`}>
                      {task.priority}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">{task.title}</h3>
                  <p className="text-xs text-gray-500 font-medium line-clamp-2 mb-4">{task.description}</p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary-50 flex items-center justify-center text-primary-600">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[10px] font-bold text-gray-600 truncate max-w-[80px]">{task.assignedTo.email}</span>
                    </div>
                    
                    {status !== 'COMPLETED' && (
                      <button 
                        onClick={() => updateStatus(task.id, status === 'PENDING' ? 'IN_PROGRESS' : 'COMPLETED')}
                        className="p-1.5 hover:bg-primary-50 text-primary-600 rounded-lg transition-all"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {tasks.filter(t => t.status === status).length === 0 && (
                <div className="py-12 border-2 border-dashed border-gray-50 rounded-[2rem] flex flex-col items-center justify-center text-gray-300">
                  <Briefcase className="w-8 h-8 mb-2 opacity-20" />
                  <p className="text-[10px] font-black uppercase tracking-widest">No tasks</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl border border-white/20 animate-in zoom-in duration-300">
            <form onSubmit={handleCreate} className="p-10">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">Assign New Task</h2>
                  <p className="text-sm text-gray-500 font-medium">Delegate work to your sub-admins.</p>
                </div>
                <button type="button" onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">Task Title</label>
                  <input
                    type="text"
                    required
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-medium"
                    placeholder="e.g., Review IDs from Jharkhand"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">Description</label>
                  <textarea
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-medium min-h-[100px]"
                    placeholder="Provide details about the task..."
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">Assign To</label>
                    <select
                      required
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold text-sm"
                      value={newTask.assignedToId}
                      onChange={(e) => setNewTask({ ...newTask, assignedToId: e.target.value })}
                    >
                      <option value="">Select Member</option>
                      {team.map(m => (
                        <option key={m.id} value={m.id}>{m.email} ({m.vertical})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">Vertical</label>
                    <select
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold text-sm"
                      value={newTask.vertical}
                      onChange={(e) => setNewTask({ ...newTask, vertical: e.target.value })}
                    >
                      {verticals.map(v => (
                        <option key={v} value={v}>{v}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">Priority</label>
                    <select
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold text-sm"
                      value={newTask.priority}
                      onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                    >
                      {priorities.map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">Due Date</label>
                    <input
                      type="date"
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold text-sm"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              
              <button 
                type="submit"
                className="w-full mt-8 py-5 rounded-2xl font-black text-sm uppercase tracking-widest bg-primary-600 text-white hover:bg-primary-700 shadow-xl shadow-primary-500/30 transition-all active:scale-[0.98]"
              >
                Assign Task Now
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}