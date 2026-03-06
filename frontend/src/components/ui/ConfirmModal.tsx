import React from 'react';
import { Modal } from './Modal';
import { AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'warning' | 'danger' | 'info';
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    type = 'warning'
}) => {
    const iconColor = type === 'danger' ? 'text-rose-500' : type === 'warning' ? 'text-amber-500' : 'text-sky-500';
    const bgColor = type === 'danger' ? 'bg-rose-50' : type === 'warning' ? 'bg-amber-50' : 'bg-sky-50';
    const buttonColor = type === 'danger' ? 'bg-rose-600 hover:bg-rose-700' : type === 'warning' ? 'bg-sky-600 hover:bg-sky-700' : 'bg-sky-600 hover:bg-sky-700';

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <div className="flex flex-col items-center text-center">
                <div className={`w-16 h-16 ${bgColor} rounded-full flex items-center justify-center mb-6`}>
                    <AlertTriangle size={32} className={iconColor} />
                </div>
                <p className="text-gray-500 font-medium mb-10 leading-relaxed">
                    {message}
                </p>
                <div className="flex w-full space-x-4">
                    <button
                        onClick={onClose}
                        className="flex-1 py-4 bg-gray-50 text-gray-500 font-black rounded-2xl hover:bg-gray-100 transition-all uppercase tracking-widest text-[10px]"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={`flex-1 py-4 ${buttonColor} text-white font-black rounded-2xl transition-all shadow-xl uppercase tracking-widest text-[10px]`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </Modal>
    );
};
