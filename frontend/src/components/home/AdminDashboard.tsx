import React from 'react';
import { Loader2, Trash2 } from 'lucide-react';

interface AdminDashboardProps {
    allUsers: any[];
    loading: boolean;
    onRoleUpdate: (userId: number, newRole: string) => void;
    onDeleteUser: (userId: number) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ allUsers, loading, onRoleUpdate, onDeleteUser }) => {
    return (
        <div className="flex-1 flex flex-col min-h-0">

            <div className="flex-1 min-h-0 flex flex-col">
                {loading ? (
                    <div className="flex-1 flex justify-center items-center">
                        <Loader2 className="animate-spin text-emerald-600" size={48} />
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col min-h-0">
                        <div className="hidden md:flex flex-col flex-1 bg-white rounded-[20px] shadow-sm border border-gray-100 overflow-hidden">
                            <div className="overflow-y-auto flex-1 custom-scrollbar">
                                <table className="min-w-full divide-y divide-gray-50">
                                    <thead className="bg-gray-50/50 sticky top-0 backdrop-blur-xl z-10">
                                        <tr>
                                            <th className="px-14 py-10 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]"># Identity</th>
                                            <th className="px-14 py-10 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">User Authentication</th>
                                            <th className="px-14 py-10 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Permission Level</th>
                                            <th className="px-14 py-10 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Access</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {allUsers.map((u: any, i: number) => (
                                            <tr key={u.id} className="group hover:bg-gray-50/80 transition-all duration-300">
                                                <td className="px-14 py-8">
                                                    <span className="font-black text-gray-300 text-xs tracking-widest">ID/{String(i + 1).padStart(3, '0')}</span>
                                                </td>
                                                <td className="px-14 py-8 text-left">
                                                    <div className="flex items-center space-x-5">

                                                        <div className="text-left">
                                                            <div className="text-base font-black text-gray-900 leading-tight uppercase tracking-tight">{u.fullName}</div>
                                                            <div className="text-[10px] font-bold text-gray-400 tracking-[0.2em] italic uppercase">{u.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-14 py-8 text-left">
                                                    <div className="relative inline-block">
                                                        <select
                                                            value={u.role}
                                                            onChange={(e) => onRoleUpdate(u.id, e.target.value)}
                                                            className={`appearance-none px-6 py-2.5 text-[10px] font-black rounded-2xl uppercase tracking-[0.2em] border transition-all cursor-pointer min-w-[160px] text-center
                                                                ${u.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-100 hover:bg-purple-100' :
                                                                    u.role === 'doctor' ? 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100' :
                                                                        'bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100'}`}
                                                        >
                                                            <option value="patient">Patient Clear</option>
                                                            <option value="doctor">MD Medical</option>
                                                            <option value="admin">Root System</option>
                                                        </select>
                                                    </div>
                                                </td>
                                                <td className="px-14 py-8 text-left">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.8)] animate-pulse" />
                                                            <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest italic opacity-40 group-hover:opacity-100 transition-opacity">Authenticated</span>
                                                        </div>
                                                        <button onClick={() => onDeleteUser(u.id)} className="p-2.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300">
                                                            <Trash2 size={20} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
            `}</style>
        </div>
    );
};

export default AdminDashboard;
