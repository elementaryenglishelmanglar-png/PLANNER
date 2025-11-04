import React, { useState, useCallback } from 'react';
import { Sidebar } from './components/sidebar/Sidebar';
import { Dashboard } from './components/dashboard/Dashboard';
import { LessonPlanWizard } from './components/LessonPlanWizard';
import { LessonPlanDisplay } from './components/LessonPlanDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorDisplay } from './components/ErrorDisplay';
import { generateLessonPlan } from './services/geminiService';
import { LessonData } from './types';
import { QuizCreator } from './components/quiz-creator/QuizCreator';
import { CurricularAdaptations } from './components/piar-generator/PiarGenerator';
import { WordSearchGenerator } from './components/word-search/WordSearchGenerator';
import { ColoringImageGenerator } from './components/coloring-image-generator/ColoringImageGenerator';
import { DuaGenerator } from './components/dua-generator/DuaGenerator';
import { TimelineGenerator } from './components/timeline-generator/TimelineGenerator';
import { ReadingGenerator } from './components/reading-generator/ReadingGenerator';
import { StudentReportsGenerator } from './components/student-reports/StudentReportsGenerator';
import { WorksheetGenerator } from './components/worksheet-generator/WorksheetGenerator';
import { FreeAiGenerator } from './components/free-ai/FreeAiGenerator';

type ViewState = 'dashboard' | 'wizard' | 'loading' | 'plan' | 'error' | 'quizCreator' | 'curricularAdaptations' | 'wordSearch' | 'coloringImage' | 'duaGenerator' | 'timelineGenerator' | 'readingGenerator' | 'studentReports' | 'worksheetGenerator' | 'freeAi';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('dashboard');
  const [lessonPlan, setLessonPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const createPromptFromData = (data: LessonData): string => {
    return `
      Por favor, crea un plan de lección detallado basado en las siguientes especificaciones.

      - **Tema de la Clase:** ${data.topic}
      - **Nivel(es) Educativo(s):** ${data.levels.join(', ')}
      - **Materia:** ${data.subject}
      ${data.subject === 'Inglés' && data.skill ? `- **Habilidad a Enfocar (Skill):** ${data.skill}` : ''}
      - **Metodología de Enseñanza:** ${data.methodology}
      - **Objetivos de Aprendizaje / Contenido:**
      ${data.learningObjectives}
      - **Duración:** ${data.duration} lecciones
      - **País para Estándares:** ${data.country || 'No especificado'}
      - **Estándares o Currículo Específico:**
      ${data.standards || 'No especificado'}
      - **Contexto de los Estudiantes:**
      ${data.studentContext || 'No especificado'}

      Asegúrate de seguir la estructura de plan de lección definida en tus instrucciones de sistema (Objetivos, Materiales, Procedimiento detallado por sesión con Inicio/Desarrollo/Cierre, Actividades, Recursos y Evaluación).
      ${data.subject === 'Inglés' && data.skill ? `\n\n**Instrucción Adicional Importante:** La lección debe estar diseñada específicamente para enseñar y practicar la habilidad de "${data.skill}". Todas las actividades, desde el inicio hasta el cierre y la evaluación, deben girar en torno al desarrollo de esta habilidad.` : ''}
    `.trim();
  };

  const handleGeneratePlan = useCallback(async (data: LessonData) => {
    const prompt = createPromptFromData(data);
    
    setView('loading');
    setError(null);
    setLessonPlan(null);

    try {
      const plan = await generateLessonPlan(prompt);
      setLessonPlan(plan);
      setView('plan');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
      setView('error');
    }
  }, []);

  const handleNavigateToDashboard = () => setView('dashboard');
  
  const handleSidebarNavigate = (view: 'dashboard' | 'wizard') => setView(view);
  
  const handleNavigateToTool = useCallback((toolId: string) => {
    if (toolId === 'lesson-planner') {
      setView('wizard');
    } else if (toolId === 'quiz-creator') {
      setView('quizCreator');
    } else if (toolId === 'curricular-adaptations-generator') {
      setView('curricularAdaptations');
    } else if (toolId === 'word-search-generator') {
      setView('wordSearch');
    } else if (toolId === 'coloring-image-generator') {
      setView('coloringImage');
    } else if (toolId === 'dua-generator') {
      setView('duaGenerator');
    } else if (toolId === 'timeline-generator') {
      setView('timelineGenerator');
    } else if (toolId === 'reading-generator') {
      setView('readingGenerator');
    } else if (toolId === 'student-reports-generator') {
        setView('studentReports');
    } else if (toolId === 'worksheet-generator') {
        setView('worksheetGenerator');
    } else if (toolId === 'free-ai') {
        setView('freeAi');
    }
    // Future tools can be routed here
  }, []);

  const renderContent = () => {
    switch (view) {
      case 'dashboard':
        return <Dashboard onSelectTool={handleNavigateToTool} />;
      case 'wizard':
        return <LessonPlanWizard onGenerate={handleGeneratePlan} />;
      case 'quizCreator':
        return <QuizCreator onBackToDashboard={handleNavigateToDashboard}/>;
      case 'curricularAdaptations':
        return <CurricularAdaptations onBackToDashboard={handleNavigateToDashboard} />;
       case 'wordSearch':
        return <WordSearchGenerator onBackToDashboard={handleNavigateToDashboard} />;
       case 'coloringImage':
        return <ColoringImageGenerator onBackToDashboard={handleNavigateToDashboard} />;
       case 'duaGenerator':
        return <DuaGenerator onBackToDashboard={handleNavigateToDashboard} />;
       case 'timelineGenerator':
        return <TimelineGenerator onBackToDashboard={handleNavigateToDashboard} />;
       case 'readingGenerator':
        return <ReadingGenerator onBackToDashboard={handleNavigateToDashboard} />;
       case 'studentReports':
        return <StudentReportsGenerator onBackToDashboard={handleNavigateToDashboard} />;
       case 'worksheetGenerator':
        return <WorksheetGenerator onBackToDashboard={handleNavigateToDashboard} />;
       case 'freeAi':
        return <FreeAiGenerator onBackToDashboard={handleNavigateToDashboard} />;
      case 'loading':
        return <LoadingSpinner />;
      case 'plan':
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <LessonPlanDisplay plan={lessonPlan!} />
            <div className="mt-8 text-center">
              <button
                onClick={() => setView('wizard')}
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-manglar-green hover:bg-manglar-green/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-manglar-green transition-all"
              >
                Crear Nueva Planeación
              </button>
            </div>
          </div>
        );
      case 'error':
        return (
          <div className="space-y-6 bg-white p-6 rounded-lg shadow-md">
            <ErrorDisplay message={error!} />
             <div className="text-center">
                <button
                    onClick={() => setView('wizard')}
                    className="text-manglar-green hover:underline"
                >
                    Volver a intentarlo
                </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex text-manglar-black">
      <Sidebar onNavigate={handleSidebarNavigate} currentView={view} />
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;