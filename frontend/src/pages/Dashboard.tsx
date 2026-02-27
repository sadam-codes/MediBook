import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Loader2, Calendar, Star, Phone } from 'lucide-react';

const api = axios.create({ baseURL: 'http://localhost:5000' });

api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    const [doctors, setDoctors] = useState<any[]>([]);
    const [allUsers, setAllUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    useEffect(() => {
        if (!user) return;
        if (user.role === 'patient') {
            api.get('/doctors').then(res => {
                setDoctors(res.data);
            }).catch(err => {
                console.error('Failed to fetch doctors:', err);
            }).finally(() => setLoading(false));
        } else if (user.role === 'admin') {
            api.get('/users').then(res => {
                setAllUsers(res.data);
            }).catch(err => {
                console.error('Failed to fetch users:', err);
            }).finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [user]);

    if (!user) {
        return (
            <div className="h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center p-8 bg-white rounded-3xl shadow-xl border border-slate-100">
                    <p className="text-slate-600 font-bold text-lg mb-4">You are not logged in.</p>
                    <button onClick={() => navigate('/login')} className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black">Go to Login</button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-slate-50 overflow-hidden">
            {/* Fixed Top Navigation */}
            <nav className="bg-white shadow-sm z-10 border-b border-gray-100 shrink-0">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black italic shadow-lg shadow-blue-200">M</div>
                        <div className="font-black text-2xl tracking-tight text-slate-900 hidden sm:block">MediBook<span className="text-blue-600 font-black">AI</span></div>
                    </div>

                    <div className="flex items-center space-x-3 sm:space-x-6">
                        <div className="hidden sm:flex flex-col items-end mr-2">
                            <span className="text-sm font-black text-slate-900 leading-tight">Admin Portal</span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
                                Session Active
                            </span>
                        </div>
                        <div className="flex items-center space-x-3 bg-slate-50 px-3 py-2 rounded-2xl border border-slate-100">
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-black text-xs uppercase">
                                {user.firstName[0]}{user.lastName[0]}
                            </div>
                            <span className="hidden md:block text-sm font-black text-slate-700">{user.firstName}</span>
                            <button
                                onClick={handleLogout}
                                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content Area */}
            <main className="flex-1 min-h-0 overflow-y-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-full flex flex-col">

                    {user.role === 'patient' && (
                        <div className="flex-1">
                            <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tight">Available Doctors</h2>
                            {loading ? (
                                <div className="flex justify-center items-center h-48">
                                    <Loader2 className="animate-spin text-blue-600" size={48} />
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
                                    {doctors.map(doc => (
                                        <div key={doc.id} className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 hover:border-blue-200 transition-all hover:shadow-2xl hover:-translate-y-1 group">
                                            <div className="flex items-start justify-between mb-6">
                                                <div>
                                                    <h3 className="text-2xl font-black text-slate-900 leading-tight">Dr. {doc.user?.firstName} {doc.user?.lastName}</h3>
                                                    <p className="text-blue-600 font-bold uppercase text-[10px] tracking-widest mt-1">{doc.specialization}</p>
                                                </div>
                                                <div className="bg-slate-900 text-white px-4 py-2 rounded-2xl text-xs font-black">
                                                    Rs.{doc.consultationFee}
                                                </div>
                                            </div>
                                            <p className="text-slate-500 text-sm mb-8 leading-relaxed font-medium line-clamp-3 italic opacity-80">
                                                "{doc.bio || 'Expert consultation for your health needs.'}"
                                            </p>
                                            <button className="w-full bg-slate-50 group-hover:bg-blue-600 group-hover:text-white text-slate-900 font-black py-5 rounded-[28px] transition-all flex items-center justify-center border-none">
                                                <Calendar size={18} className="mr-3" /> Book Now
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {user.role === 'admin' && (
                        <div className="flex-1 flex flex-col min-h-0">
                            {/* Dashboard Header Card */}
                            <div className="bg-slate-900 rounded-[40px] p-8 sm:p-12 mb-10 overflow-hidden relative shadow-2xl shrink-0">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                    <div>
                                        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2">System Control</h2>
                                        <p className="text-blue-300 font-bold text-sm tracking-widest uppercase">Platform Oversight & Logs</p>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-3xl border border-white/5">
                                            <p className="text-xs font-black text-white/50 uppercase tracking-widest mb-1">Live Users</p>
                                            <p className="text-2xl font-black text-white">{allUsers.length}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Main Data Container */}
                            <div className="flex-1 min-h-0 flex flex-col">
                                {loading ? (
                                    <div className="flex-1 flex justify-center items-center">
                                        <Loader2 className="animate-spin text-blue-600" size={48} />
                                    </div>
                                ) : (
                                    <div className="flex-1 flex flex-col min-h-0">
                                        {/* Desktop: Containerized Internal Scroll Table */}
                                        <div className="hidden md:flex flex-col flex-1 bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
                                            <div className="overflow-y-auto flex-1 custom-scrollbar">
                                                <table className="min-w-full divide-y divide-slate-50">
                                                    <thead className="bg-slate-50/50 sticky top-0 backdrop-blur-md z-10 border-b border-slate-100 text-center">
                                                        <tr>
                                                            <th className="px-10 py-6 text-left text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">User Identity</th>
                                                            <th className="px-10 py-6 text-left text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Role / Permissions</th>
                                                            <th className="px-10 py-6 text-left text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Access Status</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-50 text-center">
                                                        {allUsers.map((u: any) => (
                                                            <tr key={u.id} className="group hover:bg-slate-50 transition-all text-center">
                                                                <td className="px-10 py-6 flex items-center justify-center">
                                                                    <div className="w-12 h-12 rounded-2xl bg-white border-2 border-slate-900/5 group-hover:border-blue-500/20 text-slate-900 flex items-center justify-center font-black text-sm mr-4 transition-all shadow-sm">
                                                                        {u.id}
                                                                    </div>
                                                                    <div className="text-left">
                                                                        <div className="text-base font-black text-slate-900">{u.firstName} {u.lastName}</div>
                                                                        <div className="text-xs font-bold text-slate-400">{u.email}</div>
                                                                    </div>
                                                                </td>
                                                                <td className="px-10 py-6">
                                                                    <span className={`px-5 py-2 inline-flex text-[10px] font-black rounded-2xl uppercase tracking-widest border
                                                                        ${u.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                                                                            u.role === 'doctor' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                                                                'bg-blue-50 text-blue-700 border-blue-100'}`}>
                                                                        {u.role} Access
                                                                    </span>
                                                                </td>
                                                                <td className="px-10 py-6">
                                                                    <div className="flex items-center justify-center">
                                                                        <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full mr-2 shadow-[0_0_12px_rgba(16,185,129,0.5)]"></div>
                                                                        <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Active</span>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                        {/* Mobile: Containerized Internal Scroll Cards */}
                                        <div className="md:hidden flex-1 overflow-y-auto space-y-4 pb-8 h-full pr-1">
                                            {allUsers.map((u: any) => (
                                                <div key={u.id} className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
                                                    <div className="w-16 h-16 rounded-[24px] bg-slate-900 text-white flex items-center justify-center font-black text-xl mb-4 shadow-xl">
                                                        {u.firstName[0]}{u.lastName[0]}
                                                    </div>
                                                    <div className="text-xl font-black text-slate-900 mb-1">{u.firstName} {u.lastName}</div>
                                                    <div className="text-sm font-bold text-slate-400 mb-6">{u.email}</div>

                                                    <div className="w-full pt-6 border-t border-slate-50 flex items-center justify-between">
                                                        <span className={`px-4 py-2 text-[10px] font-black rounded-xl uppercase tracking-widest border
                                                            ${u.role === 'admin' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                                                                u.role === 'doctor' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                                    'bg-blue-100/10 text-blue-600 border-blue-100'}`}>
                                                            {u.role}
                                                        </span>
                                                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                                                            ● Live Now
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
            `}</style>
        </div>
    );
};
