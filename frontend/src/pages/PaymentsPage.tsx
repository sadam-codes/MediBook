import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, CreditCard } from 'lucide-react';
import api from '../services/api';
import PaymentsSection from '../components/home/PaymentsSection';

type PaymentRole = 'admin' | 'patient' | 'doctor';

const roleConfig: Record<PaymentRole, { endpoint: string; title: string; subtitle: string; backPath: string }> = {
    admin: {
        endpoint: '/payments/admin',
        title: 'All Payments',
        subtitle: 'Complete platform payment records with patient, doctor and transaction details',
        backPath: '/admin',
    },
    patient: {
        endpoint: '/payments/my',
        title: 'My Payments',
        subtitle: 'Payment history for your booked consultations',
        backPath: '/patient',
    },
    doctor: {
        endpoint: '/payments/doctor',
        title: 'Received Payments',
        subtitle: 'Payments received from your booked patients',
        backPath: '/doctor',
    },
};

export const PaymentsPage: React.FC = () => {
    const navigate = useNavigate();
    const user = useMemo(() => {
        const userString = localStorage.getItem('user');
        return userString ? JSON.parse(userString) : null;
    }, []);

    const [payments, setPayments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const role = user?.role as PaymentRole | undefined;
    const config = role && roleConfig[role] ? roleConfig[role] : null;

    useEffect(() => {
        if (!user) return;

        if (!config) {
            navigate('/');
            return;
        }

        const fetchPayments = async () => {
            setLoading(true);
            try {
                const res = await api.get(config.endpoint);
                setPayments(res.data);
            } catch (err) {
                console.error('Failed to fetch payments:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPayments();
    }, [user?.id, user?.role, config?.endpoint, navigate]);

    if (!config) {
        return null;
    }

    const paidTotal = payments
        .filter((p) => p.status === 'paid')
        .reduce((sum, p) => sum + Number(p.amount), 0);

    return (
        <div className="flex-1 flex flex-col min-h-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div className="text-left">
                    <button
                        onClick={() => navigate(config.backPath)}
                        className="flex items-center space-x-2 text-slate-400 hover:text-sky-600 mb-4 transition-colors group"
                    >
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-widest leading-none">Back to Dashboard</span>
                    </button>
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tight">
                        Payment <span className="text-sky-600">Details</span>
                    </h2>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2 opacity-60">
                        {config.subtitle}
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-600">
                            <CreditCard size={22} />
                        </div>
                        <div className="text-left">
                            <p className="text-[9px] font-black text-sky-600 uppercase tracking-widest mb-1">Total Records</p>
                            <p className="text-2xl font-black text-slate-900 leading-none">{payments.length}</p>
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-sm flex items-center gap-4">
                        <div className="text-left">
                            <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-1">Paid Total</p>
                            <p className="text-2xl font-black text-slate-900 leading-none">Rs. {paidTotal.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>

            {loading && payments.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center py-20">
                    <Loader2 size={40} className="animate-spin text-sky-600 mb-4 opacity-30" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Loading Payments...</p>
                </div>
            ) : (
                <PaymentsSection
                    payments={payments}
                    loading={loading}
                    role={role as PaymentRole}
                    pageSize={8}
                    showHeader={false}
                />
            )}
        </div>
    );
};
