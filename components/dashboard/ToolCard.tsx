import React from 'react';

interface ToolCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick?: () => void;
}

export const ToolCard: React.FC<ToolCardProps> = ({ icon, title, description, onClick }) => {
  const isClickable = !!onClick;

  return (
    <div
      onClick={onClick}
      className={`bg-white border border-gray-200 p-6 rounded-3xl space-y-4 group relative overflow-hidden transition-all duration-300 shadow-sm hover:shadow-xl hover:border-manglar-green ${isClickable ? 'cursor-pointer' : ''}`}
    >

      <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-manglar-light-green text-manglar-green group-hover:scale-110 group-hover:bg-manglar-green group-hover:text-white transition-all duration-300 shadow-sm relative z-10">
        {icon}
      </div>

      <div className="relative z-10">
        <h3 className="text-xl font-bold text-manglar-black mb-2 group-hover:text-manglar-green transition-colors">{title}</h3>
        <p className="text-sm text-manglar-secondary leading-relaxed line-clamp-3">
          {description}
        </p>
      </div>

      <div className="absolute bottom-4 right-4 opacity-0 transform translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
        <div className="w-8 h-8 rounded-full bg-manglar-yellow/20 flex items-center justify-center">
          <svg className="w-4 h-4 text-[#B89B2B]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
        </div>
      </div>
    </div>
  );
};