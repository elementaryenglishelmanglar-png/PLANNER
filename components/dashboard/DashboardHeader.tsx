import React from 'react';
import { ProfePlannerIcon } from '../icons/ProfePlannerIcon';
import { PlusIcon } from '../icons/PlusIcon';
import { ChatBubbleIcon } from '../icons/ChatBubbleIcon';

export const DashboardHeader: React.FC = () => {
    return (
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-6 md:space-y-0 mb-10">
            <div className="flex items-center space-x-5 group">
                <div className="p-3 bg-white rounded-2xl shadow-sm group-hover:shadow-md group-hover:-translate-y-1 transition-all duration-300">
                    <ProfePlannerIcon className="w-14 h-14 text-manglar-green" />
                </div>
                <div>
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-manglar-black to-manglar-secondary tracking-tight mb-1">Taller de Recursos</h1>
                    <p className="text-manglar-secondary text-lg">Crea, personaliza y organiza tus materiales educativos</p>
                </div>
            </div>
            <div className="flex items-center space-x-3">
                <button className="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 flex items-center space-x-2 transition-all shadow-sm hover:shadow active:scale-95">
                    <ChatBubbleIcon className="w-5 h-5 text-manglar-green" />
                    <span>¿Por dónde empezar?</span>
                </button>
                <button className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-manglar-green to-[#2E7D32] rounded-xl hover:shadow-premium flex items-center space-x-2 transition-all active:scale-95 transform hover:-translate-y-0.5">
                    <PlusIcon className="w-5 h-5" />
                    <span>Sugerir herramienta</span>
                </button>
            </div>
        </header>
    );
}