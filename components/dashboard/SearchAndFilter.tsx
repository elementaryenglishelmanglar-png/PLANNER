import React from 'react';
import { SearchIcon } from '../icons/SearchIcon';
import { DocumentIcon } from '../icons/DocumentIcon';
import { CheckBadgeIcon } from '../icons/CheckBadgeIcon';
import { ContentIcon } from '../icons/ContentIcon';
import { MessageIcon } from '../icons/MessageIcon';

interface FilterButtonProps {
    children: React.ReactNode;
    isActive?: boolean;
    onClick: () => void;
}

const FilterButton: React.FC<FilterButtonProps> = ({ children, isActive, onClick }) => {
    const baseClasses = "px-5 py-2.5 text-sm font-semibold rounded-xl flex items-center space-x-2 transition-all duration-300 flex-shrink-0 cursor-pointer select-none";
    const activeClasses = "bg-gradient-to-r from-manglar-green to-[#2E7D32] text-white shadow-md transform scale-105";
    const inactiveClasses = "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 hover:text-manglar-black shadow-sm hover:shadow";

    return (
        <button onClick={onClick} className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>
            {children}
        </button>
    );
}

interface SearchAndFilterProps {
    activeFilter: string;
    onFilterChange: (filter: string) => void;
}

const filters = [
    { name: 'Todos', icon: null },
    { name: 'Planificación', icon: <DocumentIcon className="w-4 h-4" /> },
    { name: 'Evaluación', icon: <CheckBadgeIcon className="w-4 h-4" /> },
    { name: 'Contenido', icon: <ContentIcon className="w-4 h-4" /> },
    { name: 'Comunicación', icon: <MessageIcon className="w-4 h-4" /> },
];


export const SearchAndFilter: React.FC<SearchAndFilterProps> = ({ activeFilter, onFilterChange }) => {
    return (
        <div className="flex flex-col md:flex-row justify-between items-center space-y-5 md:space-y-0 mb-8 p-1">
            <div className="relative w-full md:w-auto md:flex-1 md:max-w-md group">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-manglar-green transition-colors" />
                <input
                    type="text"
                    placeholder="Encuentra la herramienta ideal..."
                    className="w-full pl-12 pr-5 py-3.5 bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-manglar-light-green focus:border-manglar-green focus:outline-none transition-all duration-300 text-gray-700 placeholder-gray-400"
                />
            </div>
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 -mx-6 px-6 md:mx-0 md:px-0">
                {filters.map(filter => (
                    <FilterButton
                        key={filter.name}
                        isActive={activeFilter === filter.name}
                        onClick={() => onFilterChange(filter.name)}
                    >
                        {filter.icon}
                        <span>{filter.name}</span>
                    </FilterButton>
                ))}
            </div>
        </div>
    );
};
