import React, { useState, useEffect } from 'react';
import { Loader2, ChevronLeft, ChevronRight, CreditCard, Receipt } from 'lucide-react';

type PaymentRole = 'admin' | 'patient' | 'doctor';

interface PaymentsSectionProps {
    payments: any[];
    loading: boolean;
    role: PaymentRole;
    title?: string;
    subtitle?: string;
    pageSize?: number;
    compact?: boolean;
    showHeader?: boolean;
}

const PAGE_SIZE_DEFAULT = 5;

const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

function paginate<T>(items: T[], page: number, pageSize: number) {
    const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
    const safePage = Math.min(Math.max(1, page), totalPages);
    const start = (safePage - 1) * pageSize;
    return {
        items: items.slice(start, start + pageSize),
        page: safePage,
        totalPages,
        total: items.length,
        start: items.length ? start + 1 : 0,
        end: Math.min(start + pageSize, items.length),
    };
}

const profileImg = (path?: string) =>
    path ? (path.startsWith('http') ? path : `${apiBase}${path}`) : null;

const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

const paymentStatusStyles: Record<string, { bg: string; text: string; border: string }> = {
    paid: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100' },
    pending: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100' },
    failed: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-100' },
    cancelled: { bg: 'bg-slate-50', text: 'text-slate-500', border: 'border-slate-100' },
};

const formatAmount = (amount: number, currency: string) => {
    const upper = (currency || 'pkr').toUpperCase();
    if (upper === 'PKR') return `Rs. ${Number(amount).toLocaleString()}`;
    return `${upper} ${Number(amount).toLocaleString()}`;
};

const PaymentsSection: React.FC<PaymentsSectionProps> = ({
    payments,
    loading,
    role,
    title = 'Payment History',
    subtitle = 'Consultation payments and transaction details',
    pageSize = PAGE_SIZE_DEFAULT,
    compact = false,
    showHeader = true,
}) => {
    const [page, setPage] = useState(1);
    const paginated = paginate(payments, page, pageSize);

    useEffect(() => {
        setPage(1);
    }, [payments.length]);

    const showPatient = role === 'admin' || role === 'doctor';
    const showDoctor = role === 'admin' || role === 'patient';

    return (
        <div className={`flex flex-col ${compact ? 'gap-4' : 'gap-5'}`}>
            {showHeader && (
            <div>
                <h2 className={`${compact ? 'text-xl' : 'text-2xl'} font-black text-gray-900 uppercase tracking-tight leading-tight`}>
                    {title}
                </h2>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-0.5">
                    {subtitle}
                </p>
            </div>
            )}

            {loading ? (
                <div className="flex justify-center items-center h-40">
                    <Loader2 className="animate-spin text-sky-600" size={32} />
                </div>
            ) : (
                <div className="flex flex-col bg-white rounded-[20px] shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className={`min-w-full w-full divide-y divide-gray-50 ${compact ? 'min-w-[900px]' : 'min-w-[1100px]'}`}>
                            <thead className="bg-gray-50/50 sticky top-0 backdrop-blur-xl z-10">
                                <tr>
                                    <th className="px-4 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">#</th>
                                    {showPatient && (
                                        <th className="px-4 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Patient</th>
                                    )}
                                    {showDoctor && (
                                        <th className="px-4 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Doctor</th>
                                    )}
                                    <th className="px-4 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Appt. Date</th>
                                    <th className="px-4 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Time</th>
                                    <th className="px-4 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Amount</th>
                                    <th className="px-4 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Method</th>
                                    <th className="px-4 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                                    <th className="px-4 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Paid On</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {payments.length === 0 ? (
                                    <tr>
                                        <td colSpan={10} className="px-6 py-14 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <CreditCard size={36} className="text-gray-200" />
                                                <span className="text-xs font-black text-gray-300 uppercase tracking-widest">No payments yet</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : paginated.items.map((p: any) => {
                                    const st = paymentStatusStyles[p.status] || paymentStatusStyles.pending;
                                    const patientImg = profileImg(p.patient?.profileImage);
                                    const doctorImg = profileImg(p.doctorUser?.profileImage);
                                    const methodLabel = p.cardBrand && p.cardLast4
                                        ? `${p.cardBrand} •••• ${p.cardLast4}`
                                        : p.paymentMethod || '—';

                                    return (
                                        <tr key={p.id} className="hover:bg-gray-50/80 transition-all">
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <span className="font-black text-gray-400 text-[10px] tracking-widest">#{p.id}</span>
                                            </td>
                                            {showPatient && (
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center space-x-2 min-w-[160px]">
                                                        <div className="w-8 h-8 rounded-lg overflow-hidden border border-slate-100 shrink-0 bg-slate-50 flex items-center justify-center">
                                                            {patientImg ? (
                                                                <img src={patientImg} alt="" className="w-full h-full object-cover" />
                                                            ) : (
                                                                <span className="text-slate-400 font-black text-[10px]">{p.patient?.fullName?.charAt(0)}</span>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className="text-xs font-black text-gray-900 uppercase">{p.patient?.fullName}</div>
                                                            <div className="text-[10px] font-bold text-gray-400">{p.patient?.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                            )}
                                            {showDoctor && (
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center space-x-2 min-w-[160px]">
                                                        <div className="w-8 h-8 rounded-lg overflow-hidden border border-slate-100 shrink-0 bg-slate-50 flex items-center justify-center">
                                                            {doctorImg ? (
                                                                <img src={doctorImg} alt="" className="w-full h-full object-cover" />
                                                            ) : (
                                                                <span className="text-slate-400 font-black text-[10px]">{p.doctorUser?.fullName?.charAt(0)}</span>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className="text-xs font-black text-gray-900 uppercase">Dr. {p.doctorUser?.fullName}</div>
                                                            <div className="text-[10px] font-bold text-sky-500">{p.doctorUser?.doctor?.specialization || '—'}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                            )}
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <span className="text-xs font-black text-gray-800">
                                                    {formatDate(p.appointment?.date ?? p.appointmentDate)}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <span className="text-xs font-black text-sky-600">
                                                    {p.appointment?.time ?? p.appointmentTime}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <span className="text-sm font-black text-emerald-600">{formatAmount(p.amount, p.currency)}</span>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <span className="text-[10px] font-bold text-gray-500 uppercase">{methodLabel}</span>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <span className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${st.bg} ${st.text} ${st.border}`}>
                                                    {p.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase">
                                                        {p.paidAt
                                                            ? new Date(p.paidAt).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                                                            : '—'}
                                                    </span>
                                                    {p.receiptUrl && p.status === 'paid' && (
                                                        <a
                                                            href={p.receiptUrl}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="text-sky-500 hover:text-sky-700"
                                                            title="View receipt"
                                                        >
                                                            <Receipt size={14} />
                                                        </a>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {paginated.total > pageSize && (
                        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50/30">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                Showing {paginated.start}–{paginated.end} of {paginated.total}
                            </span>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setPage(page - 1)}
                                    disabled={page <= 1}
                                    className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-white disabled:opacity-30"
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                <span className="text-[11px] font-black text-gray-600">{paginated.page} / {paginated.totalPages}</span>
                                <button
                                    onClick={() => setPage(page + 1)}
                                    disabled={page >= paginated.totalPages}
                                    className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-white disabled:opacity-30"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default PaymentsSection;
