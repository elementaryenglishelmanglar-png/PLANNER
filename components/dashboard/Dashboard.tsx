import React, { useState } from 'react';
import { DashboardHeader } from './DashboardHeader';
import { SearchAndFilter } from './SearchAndFilter';
import { ToolCard } from './ToolCard';

// Import all tool icons
import { LessonPlanIcon } from '../icons/LessonPlanIcon';
import { CreateQuizIcon } from '../icons/CreateQuizIcon';
import { SlidesGenIcon } from '../icons/SlidesGenIcon';
import { WordSearchIcon } from '../icons/WordSearchIcon';
import { DuaIcon } from '../icons/DuaIcon';
import { ColoringIcon } from '../icons/ColoringIcon';
import { ImageIcon } from '../icons/ImageIcon';
import { SteamIcon } from '../icons/SteamIcon';
import { CommemorativeDatesIcon } from '../icons/CommemorativeDatesIcon';
import { TeacherTrainingIcon } from '../icons/TeacherTrainingIcon';
import { QualityStandardsIcon } from '../icons/QualityStandardsIcon';
import { DidacticSequenceIcon } from '../icons/DidacticSequenceIcon';
import { RecoveryPlanIcon } from '../icons/RecoveryPlanIcon';
import { LearningObjectivesIcon } from '../icons/LearningObjectivesIcon';
import { ReasonableAdjustmentsIcon } from '../icons/ReasonableAdjustmentsIcon';
import { RubricGeneratorIcon } from '../icons/RubricGeneratorIcon';
import { ChecklistIcon } from '../icons/ChecklistIcon';
import { StudentReportsIcon } from '../icons/StudentReportsIcon';
import { QuestionRouletteIcon } from '../icons/QuestionRouletteIcon';
import { TextQuestionsIcon } from '../icons/TextQuestionsIcon';
import { QuestionCorrectionIcon } from '../icons/QuestionCorrectionIcon';
import { EssayGraderIcon } from '../icons/EssayGraderIcon';
import { TestCorrectionIcon } from '../icons/TestCorrectionIcon';
import { YoutubeQuestionsIcon } from '../icons/YoutubeQuestionsIcon';
import { PodcastGeneratorIcon } from '../icons/PodcastGeneratorIcon';
import { MaterialFinderIcon } from '../icons/MaterialFinderIcon';
import { LightBulbIcon } from '../icons/LightBulbIcon';
import { FreeIaIcon } from '../icons/FreeIaIcon';
import { RealWorldBenefitsIcon } from '../icons/RealWorldBenefitsIcon';
import { ProjectGeneratorIcon } from '../icons/ProjectGeneratorIcon';
import { GrammarCheckerIcon } from '../icons/GrammarCheckerIcon';
import { TopicSummaryIcon } from '../icons/TopicSummaryIcon';
import { CrosswordIcon } from '../icons/CrosswordIcon';
import { MindMapIcon } from '../icons/MindMapIcon';
import { ConceptMapIcon } from '../icons/ConceptMapIcon';
import { TimelineIcon } from '../icons/TimelineIcon';
import { ActivityIdeasIcon } from '../icons/ActivityIdeasIcon';
import { WritingIcon } from '../icons/WritingIcon';
import { TextLevelingIcon } from '../icons/TextLevelingIcon';
import { TextAccessibilityIcon } from '../icons/TextAccessibilityIcon';
import { ParentWorkshopsIcon } from '../icons/ParentWorkshopsIcon';
import { SchoolEmailsIcon } from '../icons/SchoolEmailsIcon';
import { ParentEmailsIcon } from '../icons/ParentEmailsIcon';
import { ClearInstructionsIcon } from '../icons/ClearInstructionsIcon';
import { ReadingIcon } from '../icons/ReadingIcon';

interface DashboardProps {
  onSelectTool: (toolId: string) => void;
}

const allTools = [
  // Planificación
  { id: 'lesson-planner', icon: <LessonPlanIcon className="h-6 w-6 text-manglar-green"/>, title: 'Planificador de Lecciones', description: 'Diseña planes de clase detallados con objetivos de aprendizaje, actividades interactivas...', category: 'Planificación' },
  { icon: <SteamIcon className="h-6 w-6 text-manglar-green"/>, title: 'Generador de Plan STEAM', description: 'Crea planes STEAM integrando ciencias, tecnología, ingeniería, artes y matemáticas co...', category: 'Planificación' },
  { icon: <CommemorativeDatesIcon className="h-6 w-6 text-manglar-green"/>, title: 'Fechas Conmemorativas', description: 'Planifica actividades educativas para fechas importantes con recursos históricos, culturales ...', category: 'Planificación' },
  { icon: <TeacherTrainingIcon className="h-6 w-6 text-manglar-green"/>, title: 'Capacitación Docente', description: 'Desarrolla programas de formación docente con metodologías innovadoras, herramientas...', category: 'Planificación' },
  { icon: <QualityStandardsIcon className="h-6 w-6 text-manglar-green"/>, title: 'Estándares de Calidad', description: 'Establece criterios de calidad educativa con indicadores medibles, objetivos de mejora y...', category: 'Planificación' },
  { icon: <DidacticSequenceIcon className="h-6 w-6 text-manglar-green"/>, title: 'Secuencia Didáctica', description: 'Diseña secuencias de aprendizaje progresivas con actividades secuenciadas, recursos...', category: 'Planificación' },
  { icon: <RecoveryPlanIcon className="h-6 w-6 text-manglar-green"/>, title: 'Plan de Recuperación', description: 'Desarrolla planes personalizados de recuperación académica con actividades...', category: 'Planificación' },
  { icon: <LearningObjectivesIcon className="h-6 w-6 text-manglar-green"/>, title: 'Objetivos de Aprendizaje', description: 'Formula objetivos de aprendizaje específicos, medibles y alcanzables con indicadores de logr...', category: 'Planificación' },
  
  // Evaluación
  { id: 'dua-generator', icon: <DuaIcon className="h-6 w-6 text-manglar-green"/>, title: 'Diseño Universal para el Aprendizaje (DUA)', description: 'Crea diseños universales para el aprendizaje que se adapten a las necesidades de todos los...', category: 'Evaluación' },
  { id: 'quiz-creator', icon: <CreateQuizIcon className="h-6 w-6 text-manglar-green"/>, title: 'Creador de Cuestionarios', description: 'Genera cuestionarios personalizados con preguntas de opción múltiple, verdadero/falso...', category: 'Evaluación' },
  { id: 'curricular-adaptations-generator', icon: <ReasonableAdjustmentsIcon className="h-6 w-6 text-manglar-green"/>, title: 'Adaptaciones Curriculares', description: 'Desarrolla adaptaciones curriculares personalizadas para estudiantes con...', category: 'Evaluación' },
  { icon: <RubricGeneratorIcon className="h-6 w-6 text-manglar-green"/>, title: 'Generador de Rúbricas', description: 'Crea rúbricas detalladas para evaluar el trabajo de los estudiantes en cualquier tema o...', category: 'Evaluación' },
  { icon: <ChecklistIcon className="h-6 w-6 text-manglar-green"/>, title: 'Lista de Verificación (Cotejo)', description: 'Genera una lista de verificación para ayudar a los estudiantes a organizar su aprendizaje.', category: 'Evaluación' },
  { id: 'student-reports-generator', icon: <StudentReportsIcon className="h-6 w-6 text-manglar-green"/>, title: 'Informes Estudiantiles', description: 'Elabora informes detallados del progreso académico con análisis de fortalezas, áreas de...', category: 'Evaluación' },
  { icon: <QuestionRouletteIcon className="h-6 w-6 text-manglar-green"/>, title: 'Ruleta de Preguntas', description: 'Implementa una ruleta interactiva con preguntas de diferentes niveles de dificultad...', category: 'Evaluación' },
  { icon: <TextQuestionsIcon className="h-6 w-6 text-manglar-green"/>, title: 'Preguntas sobre Texto', description: 'Genera preguntas de comprensión lectora con diferentes niveles de complejidad y enfoque e...', category: 'Evaluación' },
  { icon: <QuestionCorrectionIcon className="h-6 w-6 text-manglar-green"/>, title: 'Corrección de Preguntas', description: 'Evalúa respuestas de estudiantes con retroalimentación detallada, explicaciones de...', category: 'Evaluación' },
  { icon: <EssayGraderIcon className="h-6 w-6 text-manglar-green"/>, title: 'Calificador de Ensayos', description: 'Evalúa ensayos académicos considerando estructura, argumentación, uso de fuentes y...', category: 'Evaluación' },
  { icon: <TestCorrectionIcon className="h-6 w-6 text-manglar-green"/>, title: 'Corrección de Pruebas en Papel o impresión', description: 'Evalúa pruebas escritas con criterios estandarizados y retroalimentación constructiv...', category: 'Evaluación' },
  { icon: <YoutubeQuestionsIcon className="h-6 w-6 text-manglar-green"/>, title: 'Preguntas de Video de YouTube', description: 'Crea preguntas de comprensión para videos educativos con diferentes niveles de análisis y...', category: 'Evaluación' },

  // Contenido
  { id: 'reading-generator', icon: <ReadingIcon className="h-6 w-6 text-manglar-green"/>, title: 'Generador de Lecturas', description: 'Crea lecturas de calidad con diferentes enfoques y objetivos para mejorar la comprensión lectora.', category: 'Contenido' },
  { id: 'coloring-image-generator', icon: <ColoringIcon className="h-6 w-6 text-manglar-green"/>, title: 'Generador de Imágenes para Colorear', description: 'Genera imágenes educativas para colorear personalizadas según el tema y nivel de tus...', category: 'Contenido' },
  { icon: <ImageIcon className="h-6 w-6 text-manglar-green" />, title: 'Generador de Imágenes Educativas', description: 'Crea imágenes personalizadas para tus materiales educativos con IA.', category: 'Contenido' },
  { icon: <PodcastGeneratorIcon className="h-6 w-6 text-manglar-green"/>, title: 'Generador de Podcasts Educativos', description: 'Sube tus materiales en PDF o DOC y conviértelos automáticamente en podcasts...', category: 'Contenido' },
  { icon: <MaterialFinderIcon className="h-6 w-6 text-manglar-green"/>, title: 'Buscador de Materiales educativos', description: 'Busca materiales educativos relevantes para tus lecciones en segundos.', category: 'Contenido' },
  { icon: <LightBulbIcon className="h-6 w-6 text-manglar-green"/>, title: 'Generador de Ideas', description: 'Obtén propuestas innovadoras para actividades de clase, proyectos colaborativos y estrategias...', category: 'Contenido' },
  { icon: <SlidesGenIcon className="h-6 w-6 text-manglar-green"/>, title: 'Generador de Diapositivas (Beta)', description: 'Diseña presentaciones educativas interactivas con elementos visuales, animaciones y...', category: 'Contenido' },
  { id: 'word-search-generator', icon: <WordSearchIcon className="h-6 w-6 text-manglar-green"/>, title: 'Sopa de Letras', description: 'Genera sopas de letras temáticas con vocabulario específico de la asignatura,..', category: 'Contenido' },
  { icon: <FreeIaIcon className="h-6 w-6 text-manglar-green"/>, title: 'IA Libre', description: 'Utiliza inteligencia artificial para crear contenido educativo personalizado, generar ideas y...', category: 'Contenido' },
  { icon: <RealWorldBenefitsIcon className="h-6 w-6 text-manglar-green"/>, title: 'Beneficios del Mundo Real', description: 'Conecta los conceptos académicos con aplicaciones prácticas en la vida cotidiana y el...', category: 'Contenido' },
  { icon: <ProjectGeneratorIcon className="h-6 w-6 text-manglar-green"/>, title: 'Generador de Proyectos', description: 'Diseña proyectos interdisciplinarios con objetivos claros, cronogramas, recursos...', category: 'Contenido' },
  { icon: <GrammarCheckerIcon className="h-6 w-6 text-manglar-green"/>, title: 'Corrector Gramatical', description: 'Revisa y mejora textos académicos con correcciones gramaticales, ortográficas y...', category: 'Contenido' },
  { icon: <TopicSummaryIcon className="h-6 w-6 text-manglar-green"/>, title: 'Resumen de Tema', description: 'Crea resúmenes concisos de temas curriculares con conceptos clave, ejemplos relevantes y...', category: 'Contenido' },
  { icon: <CrosswordIcon className="h-6 w-6 text-manglar-green"/>, title: 'Crucigrama', description: 'Genera crucigramas educativos con definiciones precisas y pistas contextuales para...', category: 'Contenido' },
  { icon: <MindMapIcon className="h-6 w-6 text-manglar-green"/>, title: 'Mapa Mental', description: 'Crea mapas mentales visuales para organizar ideas y conceptos.', category: 'Contenido' },
  { icon: <ConceptMapIcon className="h-6 w-6 text-manglar-green"/>, title: 'Mapa Conceptual', description: 'Crea un mapa conceptual para visualizar las relaciones entre conceptos.', category: 'Contenido' },
  { id: 'timeline-generator', icon: <TimelineIcon className="h-6 w-6 text-manglar-green" />, title: 'Línea de Tiempo', description: 'Genera líneas de tiempo educativas para visualizar eventos y procesos.', category: 'Contenido' },
  { icon: <ActivityIdeasIcon className="h-6 w-6 text-manglar-green"/>, title: 'Ideas de Actividades', description: 'Genera propuestas de actividades lúdicas y didácticas con objetivos específicos, materiales...', category: 'Contenido' },
  { icon: <WritingIcon className="h-6 w-6 text-manglar-green"/>, title: 'Redacción', description: 'Crea guías para la escritura académica con estructuras, ejemplos y criterios de evaluación...', category: 'Contenido' },
  { icon: <TextLevelingIcon className="h-6 w-6 text-manglar-green"/>, title: 'Nivelación de Textos', description: 'Adapta textos educativos a diferentes niveles de lectura considerando vocabulario, complejidad...', category: 'Contenido' },
  { icon: <TextAccessibilityIcon className="h-6 w-6 text-manglar-green"/>, title: 'Accesibilidad de Textos', description: 'Modifica textos para hacerlos accesibles con adaptaciones para diferentes necesidades...', category: 'Contenido' },

  // Comunicación
  { icon: <ParentWorkshopsIcon className="h-6 w-6 text-manglar-green"/>, title: 'Talleres para Padres', description: 'Diseña talleres formativos para padres con estrategias de apoyo al aprendizaje y...', category: 'Comunicación' },
  { icon: <SchoolEmailsIcon className="h-6 w-6 text-manglar-green"/>, title: 'Correos Escolares', description: 'Redacta comunicaciones institucionales profesionales con información clara, concisa y...', category: 'Comunicación' },
  { icon: <ParentEmailsIcon className="h-6 w-6 text-manglar-green"/>, title: 'Correos para Padres', description: 'Crea comunicaciones efectivas con padres de familia sobre el progreso académico y aspecto...', category: 'Comunicación' },
  { icon: <ClearInstructionsIcon className="h-6 w-6 text-manglar-green"/>, title: 'Instrucciones Claras', description: 'Elabora instrucciones paso a paso para actividades y tareas con lenguaje preciso y...', category: 'Comunicación' },
].map(tool => ({ ...tool, id: (tool as any).id || null }));


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
        {filteredTools.map((tool, index) => (
          <ToolCard
            key={index}
            icon={tool.icon}
            title={tool.title}
            description={tool.description}
            onClick={tool.id ? () => onSelectTool(tool.id!) : undefined}
          />
        ))}
      </div>
    </div>
  );
};