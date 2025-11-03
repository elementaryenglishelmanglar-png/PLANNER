import React from 'react';
import { ProfePlannerIcon } from '../icons/ProfePlannerIcon';
import { PlusIcon } from '../icons/PlusIcon';
import { ChatBubbleIcon } from '../icons/ChatBubbleIcon';

export const DashboardHeader: React.FC = () => {
    return (
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
                <ProfePlannerIcon className="w-12 h-12"/>
                <div>
                    <h1 className="text-3xl font-bold text-manglar-black">Taller</h1>
                    <p className="text-manglar-secondary">Crea y personaliza tus recursos educativos</p>
                </div>
            </div>
            <div className="flex items-center space-x-2">
                <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-manglar-border rounded-full hover:bg-gray-50 flex items-center space-x-2">
                   <ChatBubbleIcon className="w-4 h-4" />
                   <span>¿No sabes por dónde empezar?</span>
                </button>
                <button className="px-4 py-2 text-sm font-medium text-white bg-manglar-green rounded-full hover:bg-manglar-green/90 flex items-center space-x-2">
                    <PlusIcon className="w-4 h-4" />
                    <span>Sugerir una nueva herramienta</span>
                </button>
            </div>
        </header>
    );
}