
import React from 'react';

interface SidebarLinkProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

export const SidebarLink: React.FC<SidebarLinkProps> = ({ icon, label, isActive, onClick }) => {
  const baseClasses = "w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors text-left";
  const activeClasses = "bg-manglar-light-green text-manglar-green";
  const inactiveClasses = "text-manglar-secondary hover:bg-gray-100";
  const disabledClasses = "text-gray-400 cursor-not-allowed";

  const isClickable = !!onClick;

  return (
    <button
      onClick={onClick}
      disabled={!isClickable}
      className={`${baseClasses} ${isActive ? activeClasses : isClickable ? inactiveClasses : disabledClasses}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};
