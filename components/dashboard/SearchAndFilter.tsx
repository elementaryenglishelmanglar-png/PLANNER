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
    const baseClasses = "px-4 py-2 text-sm font-medium rounded-full flex items-center space-x-2 transition-colors flex-shrink-0";
    const activeClasses = "bg-manglar-green text-white";
    const inactiveClasses = "bg-white border border-manglar-border text-gray-700 hover:bg-gray-50";

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
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="relative w-full md:w-auto md:flex-1 md:max-w-xs">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Buscar una herramienta..."
                    className="w-full pl-10 pr-4 py-2 border border-manglar-border rounded-full focus:ring-2 focus:ring-manglar-green focus:outline-none"
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
