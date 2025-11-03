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
      className={`bg-white rounded-2xl p-6 space-y-3 shadow-sm hover:shadow-lg border border-transparent hover:border-manglar-green transition-all duration-300 transform hover:-translate-y-1 ${isClickable ? 'cursor-pointer' : ''}`}
    >
      <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-manglar-light-green">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-manglar-black">{title}</h3>
      <p className="text-sm text-manglar-secondary leading-relaxed">
        {description}
      </p>
    </div>
  );
};