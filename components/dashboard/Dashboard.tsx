import React, { useState } from 'react';
import { DashboardHeader } from './DashboardHeader';
import { SearchAndFilter } from './SearchAndFilter';
import { ToolCard } from './ToolCard';

// Import icons for functional tools
import { LessonPlanIcon } from '../icons/LessonPlanIcon';
import { CreateQuizIcon } from '../icons/CreateQuizIcon';
import { WordSearchIcon } from '../icons/WordSearchIcon';
import { DuaIcon } from '../icons/DuaIcon';
import { ColoringIcon } from '../icons/ColoringIcon';
import { ReasonableAdjustmentsIcon } from '../icons/ReasonableAdjustmentsIcon';
import { ChecklistIcon } from '../icons/ChecklistIcon';
import { StudentReportsIcon } from '../icons/StudentReportsIcon';
import { FreeIaIcon } from '../icons/FreeIaIcon';
import { TimelineIcon } from '../icons/TimelineIcon';
import { ReadingIcon } from '../icons/ReadingIcon';


interface DashboardProps {
  onSelectTool: (toolId: string) => void;
}

const allTools = [
  // Planificación
  { id: 'lesson-planner', icon: <LessonPlanIcon className="h-6 w-6 text-manglar-green"/>, title: 'Planificador de Lecciones', description: 'Diseña planes de clase detallados con objetivos de aprendizaje, actividades interactivas...', category: 'Planificación' },
  
  // Evaluación
  { id: 'dua-generator', icon: <DuaIcon className="h-6 w-6 text-manglar-green"/>, title: 'Diseño Universal para el Aprendizaje (DUA)', description: 'Crea diseños universales para el aprendizaje que se adapten a las necesidades de todos los...', category: 'Evaluación' },
  { id: 'quiz-creator', icon: <CreateQuizIcon className="h-6 w-6 text-manglar-green"/>, title: 'Creador de Cuestionarios', description: 'Genera cuestionarios personalizados con preguntas de opción múltiple, verdadero/falso...', category: 'Evaluación' },
  { id: 'curricular-adaptations-generator', icon: <ReasonableAdjustmentsIcon className="h-6 w-6 text-manglar-green"/>, title: 'Adaptaciones Curriculares', description: 'Desarrolla adaptaciones curriculares personalizadas para estudiantes con...', category: 'Evaluación' },
  { id: 'student-reports-generator', icon: <StudentReportsIcon className="h-6 w-6 text-manglar-green"/>, title: 'Informes Estudiantiles', description: 'Elabora informes detallados del progreso académico con análisis de fortalezas, áreas de...', category: 'Evaluación' },

  // Contenido
  { id: 'worksheet-generator', icon: <ChecklistIcon className="h-6 w-6 text-manglar-green"/>, title: 'Generador de Worksheets', description: 'Crea hojas de trabajo personalizadas con ejercicios, preguntas e imágenes para cualquier tema.', category: 'Contenido' },
  { id: 'reading-generator', icon: <ReadingIcon className="h-6 w-6 text-manglar-green"/>, title: 'Generador de Lecturas', description: 'Crea lecturas de calidad con diferentes enfoques y objetivos para mejorar la comprensión lectora.', category: 'Contenido' },
  { id: 'coloring-image-generator', icon: <ColoringIcon className="h-6 w-6 text-manglar-green"/>, title: 'Generador de Imágenes para Colorear', description: 'Genera imágenes educativas para colorear personalizadas según el tema y nivel de tus...', category: 'Contenido' },
  { id: 'word-search-generator', icon: <WordSearchIcon className="h-6 w-6 text-manglar-green"/>, title: 'Sopa de Letras', description: 'Genera sopas de letras temáticas con vocabulario específico de la asignatura,..', category: 'Contenido' },
  { id: 'free-ai', icon: <FreeIaIcon className="h-6 w-6 text-manglar-green"/>, title: 'IA Libre', description: 'Utiliza inteligencia artificial para crear contenido educativo personalizado, generar ideas y...', category: 'Contenido' },
  { id: 'timeline-generator', icon: <TimelineIcon className="h-6 w-6 text-manglar-green" />, title: 'Línea de Tiempo', description: 'Genera líneas de tiempo educativas para visualizar eventos y procesos.', category: 'Contenido' },
];


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