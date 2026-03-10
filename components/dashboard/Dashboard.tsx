import React, { useState } from 'react';
import { DashboardHeader } from './DashboardHeader';
import { SearchAndFilter } from './SearchAndFilter';
import { ToolCard } from './ToolCard';

import { allTools } from './toolsData';

interface DashboardProps {
  onSelectTool: (toolId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onSelectTool }) => {
  const [activeFilter, setActiveFilter] = useState('Todos');

  const filteredTools = activeFilter === 'Todos'
    ? allTools
    : allTools.filter(tool => tool.category === activeFilter);

  return (
    <div className="space-y-8 animate-fade-in">
      <DashboardHeader />
      <SearchAndFilter activeFilter={activeFilter} onFilterChange={setActiveFilter} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTools.map((tool) => (
          <ToolCard
            key={tool.id}
            icon={tool.icon}
            title={tool.title}
            description={tool.description}
            onClick={() => onSelectTool(tool.id)}
          />
        ))}
      </div>
    </div>
  );
};