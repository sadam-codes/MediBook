import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Loader2, Calendar, UserPlus, Star, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import doctorimage from '../assets/mendoctor.jpg';

const api = axios.create({ baseURL: 'http://localhost:5000' });

api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export const Home: React.FC = () => {
    const navigate = useNavigate();
    const user = React.useMemo(() => {
        const userString = localStorage.getItem('user');
        return userString ? JSON.parse(userString) : null;
    }, []);

    const [doctors, setDoctors] = useState<any[]>([]);
    const [allUsers, setAllUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        fetchData();
    }, [user?.id, user?.role]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (user.role === 'patient') {
                const res = await api.get('/doctors');
                setDoctors(res.data);
            } else if (user.role === 'admin') {
                const res = await api.get('/users');
                setAllUsers(res.data);
            }
        } catch (err) {
            console.error('Failed to fetch data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleUpdate = async (userId: number, newRole: string) => {
        try {
            await api.patch(`/users/${userId}/role`, { role: newRole });
            toast.success(`Role updated to ${newRole}`);
            fetchData(); // Refresh list
        } catch (err: any) {
            console.error('Failed to update role:', err);
            toast.error(err.response?.data?.message || 'Failed to update role');
        }
    };

    const handleDeleteUser = async (userId: number) => {
        if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
        try {
            await api.delete(`/users/${userId}`);
            toast.success('User deleted successfully');
            fetchData(); // Refresh list
        } catch (err: any) {
            console.error('Failed to delete user:', err);
            toast.error(err.response?.data?.message || 'Failed to delete user');
        }
    };

    if (!user) return null;

    return (
        <React.Fragment>
            {user.role === 'patient' && !user.hasPatientProfile && (
                <div className="flex-1 flex flex-col pt-2 pb-12">
                    <div className="bg-white rounded-[32px] p-8 md:p-12 mb-12 shadow-sm border border-gray-200 flex flex-col lg:flex-row items-center gap-12">
                        <div className="flex-1 lg:w-3/5 text-center lg:text-left pl-0 lg:pl-6">
                            <h1 className="text-4xl lg:text-[3rem] font-black text-gray-900 mb-6 tracking-tight leading-[1.1]">
                                Your Health, <br /><span className="text-emerald-600">Our Priority.</span>
                            </h1>

                            <p className="text-gray-500 text-lg md:text-xl mb-6 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                                Join thousands of satisfied patients who trust our platform for safe,
                                reliable, and professional healthcare services.
                            </p>

                            <p className="text-sm text-gray-400 mb-10 max-w-xl mx-auto lg:mx-0">
                                ✔ No hidden charges <br />  ✔ Trusted specialists  <br />  ✔ Secure booking process
                            </p>

                            <button
                                onClick={() => navigate('/complete-profile')}
                                className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 transition-all text-lg"
                            >
                                Book Session
                            </button>
                        </div>
                        <div className="flex-1 lg:w-2/5 w-full relative flex items-center justify-center">
                            <div className="absolute inset-0 bg-emerald-600/5 rounded-[32px] transform rotate-3 scale-105"></div>
                            <img
                                src={doctorimage}
                                alt="Doctor talking to patient"
                                className="relative w-full object-center rounded-[32px] shadow-2xl border-4 border-white"
                            />
                        </div>
                    </div>

                    {/* Reviews Section */}
                    <div className="mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center tracking-tight">Check out reviews from satisfied customers.</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { name: "Mateen", role: "Patient", text: "Incredible experience. I found a specialist within minutes and booked an appointment seamlessly. The doctors are top-notch.", rating: 5 },
                                { name: "Shehr Bano", role: "Patient", text: "The platform is so easy to use. Highly professional doctors and a very clean booking system. It saved me a lot of time!", rating: 5 },
                                { name: "Shanza.", role: "Patient", text: "I love how I can see the doctor's complete profile and fee before booking. Very transparent and trustworthy service.", rating: 4 }
                            ].map((review, i) => (
                                <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col hover:shadow-md transition-shadow">

                                    <p className="text-gray-600 mb-6 italic flex-1 leading-relaxed">"{review.text}"</p>
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-700 font-bold mr-2 border border-emerald-100">
                                            {review.name[0]}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 text-sm">{review.name}</p>
                                            <p className="text-gray-500 text-xs">{review.role}</p>
                                        </div>
                                        <div className="flex text-yellow-400 mb-4 px-2">
                                            {[...Array(review.rating)].map((_, i) => <Star key={i} size={16} className="fill-current" />)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Short Footer */}
                    <footer className="mt-auto border-t border-gray-200 pt-8 pb-4 flex flex-col md:flex-row items-center justify-between text-gray-500 text-sm">
                        <div className="flex items-center space-x-2 mb-4 md:mb-0">
                            <div className="font-bold text-gray-900">MediBook<span className="text-emerald-600">AI</span></div>
                            <span>© 2026 All rights reserved.</span>
                        </div>
                        <div className="flex space-x-6">
                            <a href="#" className="hover:text-gray-900 transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-gray-900 transition-colors">Terms of Service</a>
                            <a href="#" className="hover:text-gray-900 transition-colors">Contact Support</a>
                        </div>
                    </footer>
                </div>
            )}

            {user.role === 'patient' && user.hasPatientProfile && (
                <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 tracking-tight">Available Doctors</h2>
                    {loading ? (
                        <div className="flex justify-center items-center h-48">
                            <Loader2 className="animate-spin text-emerald-600" size={32} />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
                            {doctors.map(doc => (
                                <div key={doc.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-emerald-300 transition-all hover:shadow-md flex flex-col">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 leading-tight">Dr. {doc.user?.firstName} {doc.user?.lastName}</h3>
                                            <p className="text-emerald-600 font-semibold uppercase text-xs tracking-wide mt-1">{doc.specialization}</p>
                                        </div>
                                        <div className="bg-gray-100 text-gray-800 px-3 py-1 rounded-md text-xs font-semibold">
                                            Rs.{doc.consultationFee}
                                        </div>
                                    </div>
                                    <p className="text-gray-600 text-sm mb-6 flex-1 line-clamp-3">
                                        {doc.bio || 'Expert consultation for your health needs.'}
                                    </p>
                                    <button className="w-full bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center mt-auto border border-emerald-100 hover:border-emerald-600">
                                        <Calendar size={16} className="mr-2" /> Book Now
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {user.role === 'doctor' && (
                <div className="flex-1 flex flex-col min-h-0">
                    <div className="bg-emerald-900 rounded-xl p-8 mb-8 overflow-hidden relative shadow-lg shrink-0">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                            <div>
                                <h2 className="text-2xl font-bold text-white tracking-tight mb-1">Welcome back, Dr. {user.firstName}</h2>
                                <p className="text-emerald-200 font-medium text-sm tracking-wide">Here is your daily overview</p>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-lg border border-white/10">
                                    <p className="text-xs font-semibold text-emerald-100 uppercase tracking-wider mb-1">Today's Appointments</p>
                                    <p className="text-2xl font-bold text-white">0</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Dashboard Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Upcoming Appointments</h3>
                            <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-gray-100 rounded-xl bg-gray-50">
                                <Calendar size={32} className="text-gray-300 mb-2" />
                                <p className="text-gray-500 text-sm font-medium">No appointments scheduled today.</p>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Patients</h3>
                            <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-gray-100 rounded-xl bg-gray-50">
                                <UserPlus size={32} className="text-gray-300 mb-2" />
                                <p className="text-gray-500 text-sm font-medium">You haven't seen any patients yet.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {user.role === 'admin' && (
                <div className="flex-1 flex flex-col min-h-0">
                    {/* Dashboard Header Card */}
                    <div className="bg-emerald-600 rounded-xl p-8 mb-8 overflow-hidden relative shadow-lg shrink-0">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                            <div>
                                <h2 className="text-2xl font-bold text-white tracking-tight mb-1">System Control</h2>
                                <p className="text-white font-medium text-sm tracking-wide">Platform Oversight & Logs</p>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-lg border border-white/10">
                                    <p className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">Total Users</p>
                                    <p className="text-2xl font-bold text-white">{allUsers.length}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Data Container */}
                    <div className="flex-1 min-h-0 flex flex-col">
                        {loading ? (
                            <div className="flex-1 flex justify-center items-center">
                                <Loader2 className="animate-spin text-emerald-600" size={48} />
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col min-h-0">
                                {/* Desktop: Containerized Internal Scroll Table */}
                                <div className="hidden md:flex flex-col flex-1 bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
                                    <div className="overflow-y-auto flex-1 custom-scrollbar">
                                        <table className="min-w-full divide-y divide-slate-50">
                                            <thead className="bg-slate-50/50 sticky top-0 backdrop-blur-md z-10 border-b border-slate-100">
                                                <tr>
                                                    <th className="px-10 py-6 text-left text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]"># Identity</th>
                                                    <th className="px-10 py-6 text-left text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">User Profile</th>
                                                    <th className="px-10 py-6 text-left text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Role / Permissions</th>
                                                    <th className="px-10 py-6 text-left text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Access Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50">
                                                {allUsers.map((u: any, i: number) => (
                                                    <tr key={u.id} className="group hover:bg-slate-50 transition-all">
                                                        <td className="px-10 py-6">
                                                            <div className="w-10 h-10 rounded-xl bg-slate-900/5 text-slate-400 flex items-center justify-center font-bold text-xs transition-all">
                                                                {String(i + 1).padStart(2, '0')}
                                                            </div>
                                                        </td>
                                                        <td className="px-10 py-6">
                                                            <div className="flex items-center">

                                                                <div className="text-left">
                                                                    <div className="text-sm font-black text-slate-900 leading-tight">{u.firstName} {u.lastName}</div>
                                                                    <div className="text-[11px] font-bold text-slate-400">{u.email}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-10 py-6">
                                                            <div className="relative group/select inline-block">
                                                                <select
                                                                    value={u.role}
                                                                    onChange={(e) => handleRoleUpdate(u.id, e.target.value)}
                                                                    className={`appearance-none px-5 py-2 text-[10px] font-black rounded-2xl uppercase tracking-widest border transition-all cursor-pointer pr-8
                                                                        ${u.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-100 hover:bg-purple-100' :
                                                                            u.role === 'doctor' ? 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100' :
                                                                                'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100'}`}
                                                                >
                                                                    <option value="patient">Patient Access</option>
                                                                    <option value="doctor">Doctor Access</option>
                                                                    <option value="admin">Admin Access</option>
                                                                </select>
                                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="19 9l-7 7-7-7" /></svg>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-10 py-6">
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center">
                                                                    <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full mr-2 shadow-[0_0_12px_rgba(16,185,129,0.5)]"></div>
                                                                    <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Active</span>
                                                                </div>

                                                                <button
                                                                    onClick={() => handleDeleteUser(u.id)}
                                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-100 group-hover:opacity-100"
                                                                    title="Delete User"
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
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
                                    {allUsers.map((u: any, i: number) => (
                                        <div key={u.id} className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100">
                                            <div className="flex items-center mb-6">
                                                <div className="w-12 h-12 rounded-[18px] bg-slate-900 text-white flex items-center justify-center font-black text-lg mr-4 shadow-lg shadow-slate-200">
                                                    {u.firstName[0]}{u.lastName[0]}
                                                </div>
                                                <div className="text-left">
                                                    <div className="text-lg font-black text-slate-900 leading-tight">{u.firstName} {u.lastName}</div>
                                                    <div className="text-xs font-bold text-slate-400">{u.email}</div>
                                                </div>
                                                <div className="ml-auto text-xs font-black text-slate-200">#{i + 1}</div>
                                            </div>

                                            <div className="w-full pt-4 border-t border-slate-50 flex items-center justify-between">
                                                <div className="relative group/select inline-block">
                                                    <select
                                                        value={u.role}
                                                        onChange={(e) => handleRoleUpdate(u.id, e.target.value)}
                                                        className={`appearance-none px-4 py-2 text-[10px] font-black rounded-xl uppercase tracking-widest border transition-all cursor-pointer pr-8
                                                            ${u.role === 'admin' ? 'bg-purple-50 text-purple-600 border-purple-100 hover:bg-purple-100' :
                                                                u.role === 'doctor' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100' :
                                                                    'bg-emerald-100/10 text-emerald-600 border-emerald-100 hover:bg-emerald-100'}`}
                                                    >
                                                        <option value="patient">Patient Access</option>
                                                        <option value="doctor">Doctor Access</option>
                                                        <option value="admin">Admin Access</option>
                                                    </select>
                                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="19 9l-7 7-7-7" /></svg>
                                                    </div>
                                                </div>

                                                <div className="flex items-center space-x-3">
                                                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest italic">
                                                        ● Active
                                                    </span>
                                                    <button
                                                        onClick={() => handleDeleteUser(u.id)}
                                                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                        title="Delete User"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
            `}</style>
        </React.Fragment>
    );
};
