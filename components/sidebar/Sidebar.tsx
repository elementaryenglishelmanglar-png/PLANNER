import React from 'react';
import { SidebarLink } from './SidebarLink';

// Import all new icons for the sidebar
import { BookOpenIcon } from '../icons/BookOpenIcon';
import { SparklesIcon } from '../icons/SparklesIcon';
import { HistoryIcon } from '../icons/HistoryIcon';
import { ClassesIcon } from '../icons/ClassesIcon';
import { RankingIcon } from '../icons/RankingIcon';
import { CommunityIcon } from '../icons/CommunityIcon';
import { LogoutIcon } from '../icons/LogoutIcon';
import { GlobeIcon } from '../icons/GlobeIcon';
import { PremiumIcon } from '../icons/PremiumIcon';
import { WhatsappIcon } from '../icons/WhatsappIcon';

interface SidebarProps {
  onNavigate: (view: 'dashboard' | 'wizard' | 'history') => void;
  currentView: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ onNavigate, currentView }) => {
  const isLessonPlannerActive = ['wizard', 'loading', 'plan', 'error'].includes(currentView);
  const isToolsActive = !isLessonPlannerActive && currentView !== 'history';

  return (
    <aside className="w-64 glassmorphism flex flex-col p-5 border-r border-[#E5E7EB]/50 sticky top-0 h-screen z-20">
      <div className="px-2 mb-10 mt-4">
        <button onClick={() => onNavigate('dashboard')} className="text-left w-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent focus:ring-manglar-green rounded-xl transition-transform hover:scale-105 active:scale-95 duration-200 group">
          <div className="flex items-center space-x-2">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-manglar-green to-[#2E7D32] tracking-tight">COCOCIEM</h1>
            <div className="w-2 h-2 rounded-full bg-manglar-yellow animate-pulse"></div>
          </div>
        </button>
      </div>

      <nav className="flex-1 space-y-2">
        <p className="px-4 text-xs font-semibold text-gray-400 uppercase">Menú</p>
        <SidebarLink icon={<BookOpenIcon className="w-5 h-5" />} label="Planificador de Clase" onClick={() => onNavigate('wizard')} isActive={isLessonPlannerActive} />
        <SidebarLink icon={<SparklesIcon className="w-5 h-5" />} label="Herramientas de IA" onClick={() => onNavigate('dashboard')} isActive={isToolsActive} />
        <SidebarLink icon={<HistoryIcon className="w-5 h-5" />} label="Historial" onClick={() => onNavigate('history')} isActive={currentView === 'history'} />
        <SidebarLink icon={<ClassesIcon className="w-5 h-5" />} label="Mis clases" />
        <SidebarLink icon={<RankingIcon className="w-5 h-5" />} label="Ranking" />
        <SidebarLink icon={<CommunityIcon className="w-5 h-5" />} label="Comunidad" />
        <SidebarLink icon={<LogoutIcon className="w-5 h-5" />} label="Cerrar sesión" />
      </nav>

      <div className="mt-auto space-y-3 pt-6 border-t border-manglar-border/30">
        <SidebarLink icon={<GlobeIcon className="w-5 h-5 flex-shrink-0" />} label="English" onClick={() => { }} isActive={false} />
        <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-manglar-green to-[#2E7D32] rounded-xl hover:shadow-premium hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300">
          <PremiumIcon className="w-5 h-5" />
          <span>Suscripción Premium</span>
        </button>
        <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-sm font-semibold text-manglar-black bg-[#F4D03F] rounded-xl hover:bg-[#FDECA6] hover:shadow-softer hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300">
          <WhatsappIcon className="w-5 h-5" />
          <span>Compartir</span>
        </button>
      </div>
    </aside>
  );
};