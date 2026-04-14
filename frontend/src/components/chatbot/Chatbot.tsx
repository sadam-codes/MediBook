import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, RefreshCcw } from 'lucide-react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import toast from 'react-hot-toast';
import { ConfirmModal } from '../ui/ConfirmModal';
import { useNavigate } from 'react-router-dom';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
    isTyping?: boolean;
}

const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000' });

// Doctor Card Component for Chat
const DoctorCard = ({ doctor, onBook }: { doctor: any; onBook: (id: string) => void }) => {
    if (!doctor) return null;
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all my-3 group"
        >
            <div className="flex p-4 space-x-4">
                <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-sky-50 shrink-0">
                    <img
                        src={doctor.user?.profileImage ? `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}${doctor.user.profileImage}` : "/default-doc.png"}
                        alt={doctor.user?.fullName}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="font-black text-slate-900 uppercase tracking-tight truncate text-sm mb-0.5">{doctor.user?.fullName}</h4>
                    <p className="text-[10px] text-sky-600 font-bold uppercase tracking-widest mb-2">{doctor.specialization}</p>
                    <div className="flex items-center space-x-3">
                        <div className="bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                            <p className="text-[8px] font-black text-slate-400 uppercase leading-none">Fee</p>
                            <p className="text-xs font-black text-slate-900">Rs. {doctor.consultationFee}</p>
                        </div>
                        <div className="bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                            <p className="text-[8px] font-black text-slate-400 uppercase leading-none">Exp</p>
                            <p className="text-xs font-black text-slate-900">{doctor.experience} Yrs</p>
                        </div>
                    </div>
                </div>
            </div>
            <button
                onClick={() => onBook(doctor.userId)}
                className="w-full py-3 bg-sky-50 text-sky-700 font-black text-[10px] uppercase tracking-[0.2em] border-t border-sky-100/50 hover:bg-sky-600 hover:text-white transition-all active:scale-[0.98]"
            >
                Book Appointment
            </button>
        </motion.div>
    );
};

// Typing Effect Component
const TypingText = ({ text, onComplete }: { text: string; onComplete?: () => void }) => {
    const [displayedText, setDisplayedText] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (currentIndex < text.length) {
            const timeout = setTimeout(() => {
                setDisplayedText((prev) => prev + text[currentIndex]);
                setCurrentIndex((prev) => prev + 1);
            }, 5); // Faster typing
            return () => clearTimeout(timeout);
        } else if (onComplete) {
            onComplete();
        }
    }, [currentIndex, text, onComplete]);

    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
                p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                ul: ({ node, ...props }) => <ul className="list-disc ml-4 mb-2" {...props} />,
                ol: ({ node, ...props }) => <ol className="list-decimal ml-4 mb-2" {...props} />,
                li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                strong: ({ node, ...props }) => <strong className="font-extrabold text-sky-700" {...props} />,
            }}
        >
            {displayedText}
        </ReactMarkdown>
    );
};

export const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [allDoctors, setAllDoctors] = useState<any[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    const navigate = useNavigate();

    const initialMessage: Message = {
        id: '1',
        text: 'Hello! I am your **MediBook Assistant**. How can I help you today?',
        sender: 'bot',
        timestamp: new Date(),
    };

    useEffect(() => {
        if (messages.length === 0) {
            setMessages([initialMessage]);
        }
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            const res = await api.get('/doctors');
            setAllDoctors(res.data);
        } catch (err) {
            console.error('Failed to fetch doctors for chatbot:', err);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleClearChat = () => {
        setMessages([{ ...initialMessage, id: Date.now().toString(), timestamp: new Date() }]);
        toast.success('Conversation cleared');
        setIsConfirmOpen(false);
    };

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: input,
            sender: 'user',
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await api.post('/chatbot/chat', { message: input });
            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: response.data.response,
                sender: 'bot',
                timestamp: new Date(),
                isTyping: true,
            };
            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error('Chatbot error:', error);
            toast.error('Failed to get response');
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: "I'm sorry, I'm having trouble connecting to the server.",
                sender: 'bot',
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const parseMessage = (text: string) => {
        const parts = [];
        const regex = /\[DOCTOR_CARD: (.*?)\]/g;
        let lastIndex = 0;
        let match;

        while ((match = regex.exec(text)) !== null) {
            if (match.index > lastIndex) {
                parts.push({ type: 'text', content: text.substring(lastIndex, match.index) });
            }
            parts.push({ type: 'doctor', id: match[1] });
            lastIndex = regex.lastIndex;
        }

        if (lastIndex < text.length) {
            parts.push({ type: 'text', content: text.substring(lastIndex) });
        }

        return parts.length > 0 ? parts : [{ type: 'text', content: text }];
    };

    return (
        <div className="fixed bottom-6 right-6 z-[9999] font-sans">
            <ConfirmModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleClearChat}
                title="Clear Conversation"
                message="Are you sure you want to clear all messages? This action cannot be undone."
                confirmText="Clear Now"
                type="warning"
            />
            {/* Floating Button with Animation */}
            {/* Floating Button with Animation */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                animate={{
                    y: [0, -10, 0],
                    boxShadow: ["0px 10px 30px rgba(16, 185, 129, 0.2)", "0px 20px 40px rgba(16, 185, 129, 0.4)", "0px 10px 30px rgba(16, 185, 129, 0.2)"]
                }}
                transition={{
                    y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                    boxShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                }}
                className="bg-sky-600 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-center border border-white/20 hover:bg-sky-700 transition-all group relative"
            >
                {isOpen ? <X size={28} /> : (
                    <div className="flex items-center space-x-2">
                        <MessageCircle size={28} />
                        <span className="hidden group-hover:block text-xs font-bold uppercase tracking-widest px-2">Chat AI</span>
                    </div>
                )}
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-sky-500"></span>
                    </span>
                )}
            </motion.button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 50, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, scale: 0.9, y: 50, filter: 'blur(10px)' }}
                        className="absolute bottom-24 right-0 w-[420px] h-[600px] bg-white rounded-[32px] shadow-2xl flex flex-col overflow-hidden border border-gray-200"
                    >
                        <div className="bg-sky-600 p-6 text-white flex items-center justify-between relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
                            <div className="flex items-center space-x-4 relative z-10">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-inner overflow-hidden border border-sky-100">
                                    <img src="/maledoctor.png" alt="MediBook AI" className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <h3 className="font-black text-lg tracking-tight uppercase leading-none mb-1">MediBook</h3>
                                    <p className="text-[10px] text-sky-100 font-bold uppercase tracking-[0.2em] flex items-center opacity-80">
                                        <span className="w-1.5 h-1.5 bg-sky-400 rounded-full mr-2 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
                                        Specialist Expert
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2 relative z-10">
                                <button
                                    onClick={() => setIsConfirmOpen(true)}
                                    title="Clear Chat"
                                    className="hover:bg-white/20 p-2.5 rounded-2xl transition-all active:scale-90"
                                >
                                    <RefreshCcw size={18} />
                                </button>
                                <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-2.5 rounded-2xl transition-all active:scale-90 relative z-10">
                                    <X size={20} />
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#fbfbfb] custom-scrollbar">
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} items-end space-x-3`}
                                >
                                    {msg.sender === 'bot' && (
                                        <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shrink-0 border border-gray-200 overflow-hidden">
                                            <img src="/maledoctor.png" alt="Bot Avatar" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                    <div
                                        className={`max-w-[85%] p-4 rounded-2xl text-[13px] leading-relaxed ${msg.sender === 'user'
                                            ? 'bg-sky-600 text-white rounded-br-none font-medium border border-sky-500'
                                            : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none font-normal'
                                            }`}
                                    >
                                        {msg.sender === 'bot' && msg.isTyping ? (
                                            <TypingText text={msg.text} onComplete={() => {
                                                const updated = [...messages];
                                                const msgIndex = updated.findIndex(m => m.id === msg.id);
                                                if (msgIndex !== -1) {
                                                    updated[msgIndex].isTyping = false;
                                                    setMessages(updated);
                                                }
                                            }} />
                                        ) : (
                                            <div className="space-y-2">
                                                {parseMessage(msg.text).map((part, pIndex) => (
                                                    part.type === 'text' ? (
                                                        <ReactMarkdown
                                                            key={pIndex}
                                                            remarkPlugins={[remarkGfm]}
                                                            components={{
                                                                p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                                                                ul: ({ node, ...props }) => <ul className="list-disc ml-4 mb-2" {...props} />,
                                                                ol: ({ node, ...props }) => <ol className="list-decimal ml-4 mb-2" {...props} />,
                                                                li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                                                                strong: ({ node, ...props }) => <strong className={`font-extrabold ${msg.sender === 'user' ? 'text-white underline' : 'text-sky-700'}`} {...props} />,
                                                            }}
                                                        >
                                                            {part.content}
                                                        </ReactMarkdown>
                                                    ) : (
                                                        <DoctorCard
                                                            key={pIndex}
                                                            doctor={allDoctors.find(d => d.userId === Number(part.id))}
                                                            onBook={(id) => navigate(`/bookings/${id}`)}
                                                        />
                                                    )
                                                ))}
                                            </div>
                                        )}
                                        <div className={`text-[9px] mt-2 font-bold uppercase tracking-widest opacity-40 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                    {msg.sender === 'user' && (
                                        <div className="w-9 h-9 rounded-xl bg-sky-100 flex items-center justify-center shrink-0 overflow-hidden border border-sky-200">
                                            {user?.profileImage ? (
                                                <img src={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}${user.profileImage}`} alt="User" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="bg-sky-600 w-full h-full flex items-center justify-center text-white font-black text-xs">
                                                    {user?.fullName?.[0] || 'U'}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                            {isLoading && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start items-center space-x-3">
                                    <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shrink-0 border border-gray-200 animate-bounce overflow-hidden">
                                        <img src="/maledoctor.png" alt="Loading" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-bl-none shadow-sm flex items-center space-x-3">
                                        <div className="flex space-x-1">
                                            <div className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                            <div className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                            <div className="w-1.5 h-1.5 bg-sky-600 rounded-full animate-bounce"></div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-5 bg-white border-t border-gray-100 uppercase tracking-widest">
                            <div className="flex items-center bg-gray-50 rounded-2xl border border-gray-200 focus-within:bg-white focus-within:border-sky-500 transition-all p-1.5">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Discuss symptoms or find a doctor..."
                                    className="flex-1 bg-transparent px-4 py-3 text-[13px] focus:outline-none font-bold placeholder:text-gray-400 placeholder:font-medium tracking-tight normal-case"
                                />
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleSend}
                                    disabled={!input.trim() || isLoading}
                                    className="p-3 bg-sky-600 text-white rounded-xl hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    <Send size={18} />
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 5px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
            `}</style>
        </div>
    );
};
