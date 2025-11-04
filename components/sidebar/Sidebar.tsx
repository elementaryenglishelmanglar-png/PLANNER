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
    onNavigate: (view: 'dashboard' | 'wizard') => void;
    currentView: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ onNavigate, currentView }) => {
  const isLessonPlannerActive = ['wizard', 'loading', 'plan', 'error'].includes(currentView);
  const isToolsActive = ['dashboard', 'quizCreator', 'curricularAdaptations', 'wordSearch', 'coloringImage', 'duaGenerator', 'timelineGenerator', 'readingGenerator', 'studentReports', 'worksheetGenerator', 'freeAi'].includes(currentView);
  
  return (
    <aside className="w-64 bg-white border-r border-manglar-border flex flex-col p-4">
      <div className="px-4 mb-8">
        <button onClick={() => onNavigate('dashboard')} className="text-left w-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-manglar-green rounded-md">
          <h1 className="text-2xl font-bold text-manglar-green">COCOCIEM</h1>
        </button>
      </div>
      
      <nav className="flex-1 space-y-2">
        <p className="px-4 text-xs font-semibold text-gray-400 uppercase">Menú</p>
        <SidebarLink icon={<BookOpenIcon className="w-5 h-5"/>} label="Planificador de Clase" onClick={() => onNavigate('wizard')} isActive={isLessonPlannerActive} />
        <SidebarLink icon={<SparklesIcon className="w-5 h-5"/>} label="Herramientas de IA" onClick={() => onNavigate('dashboard')} isActive={isToolsActive} />
        <SidebarLink icon={<HistoryIcon className="w-5 h-5"/>} label="Historial" />
        <SidebarLink icon={<ClassesIcon className="w-5 h-5"/>} label="Mis clases" />
        <SidebarLink icon={<RankingIcon className="w-5 h-5"/>} label="Ranking" />
        <SidebarLink icon={<CommunityIcon className="w-5 h-5"/>} label="Comunidad" />
        <SidebarLink icon={<LogoutIcon className="w-5 h-5"/>} label="Cerrar sesión" />
      </nav>

      <div className="mt-auto space-y-2">
         <SidebarLink icon={<GlobeIcon className="w-5 h-5"/>} label="English" />
         <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium text-white bg-manglar-green rounded-lg hover:bg-manglar-green/90">
             <PremiumIcon className="w-5 h-5" />
             <span>Suscripción Premium</span>
         </button>
         <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium text-manglar-black bg-manglar-yellow rounded-lg hover:bg-manglar-yellow/90">
             <WhatsappIcon className="w-5 h-5" />
             <span>Compartir por WhatsApp</span>
         </button>
      </div>
    </aside>
  );
};