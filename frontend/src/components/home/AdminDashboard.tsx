import React, { useState, useRef, useEffect } from 'react';
import { Loader2, Trash2, Edit3, ChevronDown, ShieldCheck, UserCheck, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AdminDashboardProps {
    allUsers: any[];
    loading: boolean;
    onRoleUpdate: (userId: number, newRole: string) => void;
    onDeleteUser: (userId: number) => void;
}

const RoleDropdown = ({ currentRole, onUpdate }: { currentRole: string; onUpdate: (role: string) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const roles = [
        { value: 'patient', label: 'Patient', icon: UserCheck, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
        { value: 'doctor', label: 'Doctor', icon: ShieldCheck, color: 'text-sky-600', bg: 'bg-sky-50', border: 'border-sky-100' },
        { value: 'admin', label: 'Admin', icon: Settings, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
    ];

    const current = roles.find(r => r.value === currentRole) || roles[0];

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center justify-between px-4 py-2 rounded-xl border transition-all duration-200 min-w-[160px] group
                    ${current.bg} ${current.border} hover:shadow-md active:scale-[0.98]`}
            >
                <div className="flex items-center space-x-2">
                    <current.icon size={14} className={current.color} />
                    <span className={`text-[11px] font-black uppercase tracking-wider ${current.color}`}>{current.label}</span>
                </div>
                <div className="flex items-center space-x-2 border-l border-gray-200/50 pl-2 ml-2">
                    <Edit3 size={12} className="text-gray-400 group-hover:text-gray-600" />
                    <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.1 }}
                        className="absolute z-50 mt-2 w-full bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden py-1"
                    >
                        {roles.map((role) => (
                            <button
                                key={role.value}
                                onClick={() => {
                                    onUpdate(role.value);
                                    setIsOpen(false);
                                }}
                                className={`w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left
                                    ${currentRole === role.value ? 'bg-gray-50/50' : ''}`}
                            >
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${role.bg}`}>
                                    <role.icon size={16} className={role.color} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-black text-gray-900 uppercase tracking-tight">{role.label}</span>
                                    {currentRole === role.value && (
                                        <span className="text-[9px] font-bold text-sky-500 uppercase font-normal">Current Level</span>
                                    )}
                                </div>
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const AdminDashboard: React.FC<AdminDashboardProps> = ({ allUsers, loading, onRoleUpdate, onDeleteUser }) => {
    return (
        <div className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 min-h-0 flex flex-col">
                {loading ? (
                    <div className="flex-1 flex justify-center items-center">
                        <Loader2 className="animate-spin text-sky-600" size={48} />
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col min-h-0">
                        <div className="hidden md:flex flex-col flex-1 bg-white rounded-[20px] shadow-sm border border-gray-100 overflow-hidden">
                            <div className="overflow-y-auto flex-1 custom-scrollbar">
                                <table className="min-w-full divide-y divide-gray-50">
                                    <thead className="bg-gray-50/50 sticky top-0 backdrop-blur-xl z-10">
                                        <tr>
                                            <th className="px-10 py-10 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]"># Identity</th>
                                            <th className="px-10 py-10 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">User Authentication</th>
                                            <th className="px-10 py-10 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Permission Level</th>
                                            <th className="px-10 py-10 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Registered</th>
                                            <th className="px-10 py-10 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Access</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {allUsers.map((u: any, i: number) => (
                                            <tr key={u.id} className="group hover:bg-gray-50/80 transition-all duration-300">
                                                {/* Identity */}
                                                <td className="px-10 py-8">
                                                    <span className="font-black text-gray-300 text-xs tracking-widest">ID/{String(i + 1).padStart(0, '0')}</span>
                                                </td>

                                                {/* User Authentication (Profile + Name/Email) */}
                                                <td className="px-10 py-8 text-left">
                                                    <div className="flex items-center space-x-5">
                                                        <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-slate-100/50 shrink-0 bg-slate-50 flex items-center justify-center">
                                                            {u.profileImage ? (
                                                                <img
                                                                    src={u.profileImage.startsWith('http') ? u.profileImage : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}${u.profileImage}`}
                                                                    alt={u.fullName}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            ) : (
                                                                <span className="text-slate-400 font-black text-sm uppercase font-normal">{u.fullName?.charAt(0)}</span>
                                                            )}
                                                        </div>
                                                        <div className="text-left">
                                                            <div className="text-base font-black text-gray-900 leading-tight uppercase tracking-tight">{u.fullName}</div>
                                                            <div className="text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase font-normal">{u.email}</div>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Permission Level (Role) */}
                                                <td className="px-10 py-8 text-left">
                                                    <RoleDropdown
                                                        currentRole={u.role}
                                                        onUpdate={(role) => onRoleUpdate(u.id, role)}
                                                    />
                                                </td>

                                                {/* Registered Date */}
                                                <td className="px-10 py-8 text-left text-center">
                                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none font-normal">
                                                        {new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </span>
                                                </td>

                                                {/* Access (Status + Delete) */}
                                                <td className="px-10 py-8 text-left">
                                                    <div className="flex items-center justify-between">

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
