import React from 'react';

const HomeFooter: React.FC = () => {
    return (
        <footer className="mt-auto border-t border-gray-100 pt-16 pb-12 flex flex-col md:flex-row items-center justify-between text-gray-400 text-[10px]">
            <div className="flex items-center space-x-4 mb-8 md:mb-0">
                <div className="font-black text-gray-900 text-2xl uppercase tracking-tighter">MediBook<span className="text-sky-600">AI</span></div>
                <div className="w-1.5 h-1.5 bg-gray-200 rounded-full" />
                <span className="font-black uppercase tracking-[0.2em] opacity-40">© 2026 Innovation Lab</span>
            </div>
            <div className="flex space-x-12 font-black uppercase tracking-[0.25em] text-[10px]">
                <a href="#" className="hover:text-sky-600 transition-colors">Privacy Cloud</a>
                <a href="#" className="hover:text-sky-600 transition-colors">Governance</a>
                <a href="#" className="hover:text-sky-600 transition-colors">Help Desk</a>
            </div>
        </footer>
    );
};

export default HomeFooter;
