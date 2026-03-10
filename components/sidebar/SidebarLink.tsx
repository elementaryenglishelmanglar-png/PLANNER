
import React from 'react';

interface SidebarLinkProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

export const SidebarLink: React.FC<SidebarLinkProps> = ({ icon, label, isActive, onClick }) => {
  const baseClasses = "w-full flex items-center space-x-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-300 text-left relative group overflow-hidden";
  const activeClasses = "bg-manglar-light-green text-manglar-green shadow-sm";
  const inactiveClasses = "text-manglar-secondary hover:bg-gray-50 hover:text-manglar-black hover:translate-x-1";
  const disabledClasses = "text-gray-400 cursor-not-allowed opacity-50";

  const isClickable = !!onClick;

  return (
    <button
      onClick={onClick}
      disabled={!isClickable}
      className={`${baseClasses} ${isActive ? activeClasses : isClickable ? inactiveClasses : disabledClasses}`}
    >
      {isActive && (
        <span className="absolute left-0 top-0 bottom-0 w-1 bg-manglar-green rounded-r-md"></span>
      )}
      <span className={`transform transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
        {icon}
      </span>
      <span>{label}</span>
    </button>
  );
};
