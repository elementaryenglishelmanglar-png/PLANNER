import React, { useState, useCallback } from 'react';
import { QuizData } from '../../types';
import { generateQuiz } from '../../services/geminiService';
import { LoadingSpinner } from '../LoadingSpinner';
import { LessonPlanDisplay } from '../LessonPlanDisplay';
import { ErrorDisplay } from '../ErrorDisplay';
import { QUESTION_TYPES, EDUCATION_LEVELS, SUBJECTS, NUM_QUESTIONS, DIFFICULTY_LEVELS } from './constants';

import { CheckBadgeIcon } from '../icons/CheckBadgeIcon';
import { DocumentIcon } from '../icons/DocumentIcon';
import { RankingIcon } from '../icons/RankingIcon';
import { LightBulbIcon } from '../icons/LightBulbIcon';
import { TextQuestionsIcon } from '../icons/TextQuestionsIcon';

const InfoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const LightBulbEmptyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.375 3.375 0 0014 18.442V19.5a3 3 0 01-6 0v-1.058a3.375 3.375 0 00-.455-1.597l-.548-.547z" />
    </svg>
);


// --- Landing Page Component ---
const QuizCreatorLanding: React.FC<{ onStart: (mode: 'topic' | 'text') => void }> = ({ onStart }) => {

    const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
        <div className="bg-white p-6 rounded-xl shadow-sm text-center flex flex-col items-center">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-4">{icon}</div>
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
        </div>
    );

    const OptionCard: React.FC<{
        icon: React.ReactNode;
        title: string;
        description: string;
        onClick: () => void;
      }> = ({ icon, title, description, onClick }) => (
        <button
          onClick={onClick}
          className="bg-white p-6 rounded-xl shadow-sm text-left w-full h-full flex flex-col items-start hover:shadow-lg hover:border-blue-500 border border-gray-200 transition-all transform hover:-translate-y-1"
        >
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-4">{icon}</div>
          <h3 className="text-lg font-semibold mb-2 text-gray-800">{title}</h3>
          <p className="text-sm text-gray-600 flex-grow">{description}</p>
        </button>
      );

    return (
        <div className="animate-fade-in bg-gray-50/50 min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="text-center">
                <button className="bg-blue-100 text-blue-700 text-sm font-semibold px-4 py-1 rounded-full">Nueva Herramienta</button>
                <h1 className="mt-4 text-4xl font-extrabold text-gray-900 sm:text-5xl">Creador de Cuestionarios</h1>
                <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">Crea evaluaciones personalizadas y efectivas para tus estudiantes</p>
            </div>

            <div className="mt-12 sm:mx-auto sm:w-full sm:max-w-2xl">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold">¿Cómo quieres empezar?</h2>
                    <p className="text-md text-gray-500">Elige una opción para generar tu cuestionario.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <OptionCard 
                        icon={<LightBulbIcon className="w-6 h-6" />}
                        title="Generar por Tema"
                        description="Ideal para crear evaluaciones sobre un tema, palabras clave o materia específica."
                        onClick={() => onStart('topic')}
                    />
                     <OptionCard 
                        icon={<TextQuestionsIcon className="w-6 h-6" />}
                        title="Generar desde Texto"
                        description="Pega un texto y crea preguntas basadas exclusivamente en su contenido."
                        onClick={() => onStart('text')}
                    />
                </div>
            </div>
            
            <div className="mt-16 max-w-5xl mx-auto grid gap-8 lg:grid-cols-3">
                <FeatureCard icon={<CheckBadgeIcon className="w-6 h-6"/>} title="Evaluación Personalizada" description="Diseña cuestionarios adaptados a tus objetivos de aprendizaje y nivel educativo." />
                <FeatureCard icon={<DocumentIcon className="w-6 h-6" />} title="Diversos Tipos de Preguntas" description="Elige entre múltiples formatos de preguntas para evaluar diferentes habilidades." />
                <FeatureCard icon={<RankingIcon className="w-6 h-6" />} title="Resultados Inmediatos" description="Obtén análisis detallados del desempeño de tus estudiantes." />
            </div>
        </div>
    );
};

// --- Generator Page Component ---
const QuizCreatorGenerator: React.FC<{ initialMode: 'topic' | 'text'; onBack: () => void; }> = ({ initialMode, onBack }) => {
    const [generationMode, setGenerationMode] = useState<'topic' | 'text'>(initialMode);
    const [formData, setFormData] = useState<QuizData>({
        topic: '',
        questionType: 'Opción Múltiple',
        keywords: '',
        educationLevel: 'Grado 6',
        subject: 'Historia',
        coverage: '',
        numQuestions: '5 Preguntas',
        difficulty: 'Medio',
        share: false,
        sourceText: '',
    });
    const [generatedQuiz, setGeneratedQuiz] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const handleInputChange = (field: keyof QuizData, value: string | boolean) => {
        setFormData(prev => ({...prev, [field]: value}));
    };

    const createQuizPrompt = (data: QuizData, mode: 'topic' | 'text'): string => {
        const commonSpecs = `
            - **Nivel Educativo:** ${data.educationLevel}
            - **Materia:** ${data.subject}
            - **Tipo(s) de Pregunta:** ${data.questionType}
            - **Número de Preguntas:** ${data.numQuestions.split(' ')[0]}
            - **Nivel de Dificultad:** ${data.difficulty}
        `.trim();

        if (mode === 'text' && data.sourceText && data.sourceText.trim() !== '') {
            return `
                Por favor, genera un cuestionario basado **exclusivamente** en el siguiente texto.

                **Texto de Referencia:**
                ---
                ${data.sourceText}
                ---

                **Especificaciones del Cuestionario:**
                ${commonSpecs}
            `.trim();
        } else {
            return `
                Por favor, genera un cuestionario con las siguientes especificaciones:
                - **Tema:** ${data.topic}
                - **Palabras Clave:** ${data.keywords}
                - **Cobertura Específica:** ${data.coverage}
                ${commonSpecs}
            `.trim();
        }
    };

    const handleGenerate = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setGeneratedQuiz(null);
        const prompt = createQuizPrompt(formData, generationMode);
        try {
            const quiz = await generateQuiz(prompt);
            setGeneratedQuiz(quiz);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ocurrió un error desconocido.');
        } finally {
            setIsLoading(false);
        }
    }, [formData, generationMode]);
    
    const HeaderButton: React.FC<{ children: React.ReactNode }> = ({ children }) => (
        <button className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 flex items-center space-x-2">
            {children}
        </button>
    );

    const topicFields = [
        {id: 'topic', label: 'Tema', type: 'text', placeholder: 'Ej: Evaluación de Egipto Antiguo'},
        {id: 'keywords', label: 'Palabras Clave', type: 'text', placeholder: 'Ej: Biomas, Biodiversidad, etc.'},
        {id: 'coverage', label: 'El Cuestionario Debe Cubrir', type: 'textarea', placeholder: 'Describe los aspectos específicos que debe cubrir el cuestionario...'},
    ];

    const commonFields = [
        {id: 'questionType', label: 'Tipo de Pregunta', type: 'select', options: QUESTION_TYPES},
        {id: 'educationLevel', label: 'Nivel Educativo', type: 'select', options: EDUCATION_LEVELS},
        {id: 'subject', label: 'Materia', type: 'select', options: SUBJECTS},
        {id: 'numQuestions', label: 'Número de Preguntas', type: 'select', options: NUM_QUESTIONS},
        {id: 'difficulty', label: 'Nivel de Dificultad', type: 'select', options: DIFFICULTY_LEVELS},
    ];

    const renderField = (field: any) => (
        <div key={field.id}>
            <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                {field.label} <span className="text-red-500 ml-1">*</span> 
                <span className="ml-1.5"><InfoIcon /></span>
            </label>
            {field.type === 'select' ? (
                <select
                    id={field.id}
                    value={formData[field.id as keyof QuizData] as string}
                    onChange={e => handleInputChange(field.id as keyof QuizData, e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                    {field.options?.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
                </select>
            ) : field.type === 'textarea' ? (
                 <textarea
                    id={field.id}
                    rows={4}
                    value={formData[field.id as keyof QuizData] as string}
                    onChange={e => handleInputChange(field.id as keyof QuizData, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                 />
            ) : (
                <input
                    type="text"
                    id={field.id}
                    value={formData[field.id as keyof QuizData] as string}
                    onChange={e => handleInputChange(field.id as keyof QuizData, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
            )}
        </div>
    );

    return (
        <div className="flex flex-col h-full bg-white rounded-lg shadow-md animate-fade-in">
            <header className="flex-shrink-0 p-4 border-b flex justify-between items-center">
                <div>
                     <button onClick={onBack} className="text-sm text-gray-600 hover:underline">&larr; Volver</button>
                    <h1 className="text-xl font-bold text-gray-800">Generador de Cuestionarios</h1>
                </div>
                <div className="flex items-center space-x-2">
                    <HeaderButton><span>Exportar a PDF</span></HeaderButton>
                    <HeaderButton><span>Exportar a Word</span></HeaderButton>
                    <HeaderButton><span>Compartir</span></HeaderButton>
                </div>
            </header>
            <div className="flex-grow flex flex-col md:flex-row min-h-0">
                {/* Left Panel: Display */}
                <div className="w-full md:w-2/3 p-6 overflow-y-auto border-r">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-full">
                           <LoadingSpinner />
                        </div>
                    ) : error ? (
                         <div className="flex items-center justify-center h-full">
                           <ErrorDisplay message={error} />
                        </div>
                    ) : generatedQuiz ? (
                        <LessonPlanDisplay plan={generatedQuiz} />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                           <LightBulbEmptyIcon />
                            <h3 className="mt-4 text-lg font-semibold">No hay preguntas generadas</h3>
                            <p className="max-w-xs">Configura el cuestionario en el panel derecho y genera preguntas automáticamente.</p>
                        </div>
                    )}
                </div>

                {/* Right Panel: Form */}
                <aside className="w-full md:w-1/3 p-6 bg-gray-50/70 overflow-y-auto">
                    <div className="space-y-5">
                        <h2 className="text-lg font-bold flex items-center justify-between">
                            Configuración
                            <InfoIcon />
                        </h2>

                        {/* Generation Mode Switcher */}
                        <div>
                            <div className="flex bg-gray-200 rounded-lg p-1">
                                <button 
                                    onClick={() => setGenerationMode('topic')}
                                    className={`w-1/2 py-1.5 text-sm font-medium rounded-md transition-colors ${generationMode === 'topic' ? 'bg-white shadow' : 'text-gray-600'}`}
                                >
                                    Generar por Tema
                                </button>
                                <button 
                                    onClick={() => setGenerationMode('text')}
                                    className={`w-1/2 py-1.5 text-sm font-medium rounded-md transition-colors ${generationMode === 'text' ? 'bg-white shadow' : 'text-gray-600'}`}
                                >
                                    Generar desde Texto
                                </button>
                            </div>
                        </div>

                        {/* Conditional Fields */}
                        {generationMode === 'topic' ? (
                            topicFields.map(renderField)
                        ) : (
                            <div>
                                <label htmlFor="sourceText" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                    Pega tu texto aquí
                                    <span className="text-red-500 ml-1">*</span> 
                                    <span className="ml-1.5"><InfoIcon /></span>
                                </label>
                                <textarea
                                    id="sourceText"
                                    rows={8}
                                    value={formData.sourceText}
                                    onChange={e => handleInputChange('sourceText', e.target.value)}
                                    placeholder="Copia y pega el contenido que quieres usar para generar el cuestionario..."
                                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                                />
                            </div>
                        )}

                        {commonFields.map(renderField)}
                        
                         <div>
                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                    <input
                                        id="share"
                                        name="share"
                                        type="checkbox"
                                        checked={formData.share}
                                        onChange={e => handleInputChange('share', e.target.checked)}
                                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                    />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label htmlFor="share" className="font-medium text-gray-700">Compartir con la comunidad</label>
                                    <p className="text-gray-500">Quiero compartir este cuestionario con la comunidad educativa.</p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleGenerate}
                            disabled={isLoading}
                            className="w-full py-2.5 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 disabled:bg-blue-300 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Generando...' : 'Generar Cuestionario'}
                        </button>
                    </div>
                </aside>
            </div>
        </div>
    );
};


// --- Main Component ---
interface QuizCreatorProps {
    onBackToDashboard: () => void;
}

export const QuizCreator: React.FC<QuizCreatorProps> = ({ onBackToDashboard }) => {
    const [step, setStep] = useState<'landing' | 'generator'>('landing');
    const [initialMode, setInitialMode] = useState<'topic' | 'text'>('topic');

    const handleStart = (mode: 'topic' | 'text') => {
        setInitialMode(mode);
        setStep('generator');
    };

    if (step === 'landing') {
        return <QuizCreatorLanding onStart={handleStart} />;
    }

    return <QuizCreatorGenerator initialMode={initialMode} onBack={() => setStep('landing')} />;
};