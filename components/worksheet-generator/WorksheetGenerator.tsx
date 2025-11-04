import React, { useState, useCallback } from 'react';
import { WorksheetData } from '../../types';
import { generateWorksheet } from '../../services/geminiService';
import { LoadingSpinner } from '../LoadingSpinner';
import { ErrorDisplay } from '../ErrorDisplay';
import { LessonPlanDisplay } from '../LessonPlanDisplay';
import { ChecklistIcon } from '../icons/ChecklistIcon';
import { InfoCircleIcon } from '../icons/InfoCircleIcon';
import { EDUCATION_LEVELS, SUBJECTS } from '../wizard/constants';
import { MagicWandIcon } from '../icons/MagicWandIcon';

interface WorksheetGeneratorProps {
    onBackToDashboard: () => void;
}

const LANGUAGES = ["Español", "Inglés", "Francés"];
const DIFFICULTY_LEVELS = ["Fácil", "Medio", "Difícil"];

export const WorksheetGenerator: React.FC<WorksheetGeneratorProps> = ({ onBackToDashboard }) => {
    const [formData, setFormData] = useState<WorksheetData>({
        generationMode: 'topic',
        topic: '',
        sourceText: '',
        grade: '',
        subject: '',
        language: 'Español',
        difficulty: 'Medio',
    });
    const [generatedWorksheet, setGeneratedWorksheet] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (field: keyof WorksheetData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const createPrompt = (data: WorksheetData): string => {
        const commonSpecs = `
            - **Idioma:** ${data.language}
            - **Materia:** ${data.subject}
            - **Grado Escolar:** ${data.grade}
            - **Dificultad:** ${data.difficulty}
        `.trim();

        if (data.generationMode === 'text' && data.sourceText.trim() !== '') {
            return `
                Por favor, genera una hoja de trabajo (worksheet) basada **exclusivamente** en el siguiente texto.
                
                **Texto de Referencia:**
                ---
                ${data.sourceText}
                ---

                **Especificaciones de la Hoja de Trabajo:**
                ${commonSpecs}
            `.trim();
        } else {
            return `
                Por favor, genera una hoja de trabajo (worksheet) con las siguientes especificaciones:
                - **Tema:** ${data.topic}
                ${commonSpecs}
            `.trim();
        }
    };

    const handleGenerate = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setGeneratedWorksheet(null);
        const prompt = createPrompt(formData);
        try {
            const worksheet = await generateWorksheet(prompt);
            setGeneratedWorksheet(worksheet);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ocurrió un error desconocido.');
        } finally {
            setIsLoading(false);
        }
    }, [formData]);

    const isFormValid = formData.grade.trim() !== '' &&
                        formData.subject.trim() !== '' &&
                        (formData.generationMode === 'topic' ? formData.topic.trim() !== '' : formData.sourceText.trim() !== '');

    return (
        <div className="flex h-full max-h-[calc(100vh-80px)] w-full bg-white rounded-2xl shadow-lg overflow-hidden animate-fade-in">
            {/* Display Panel */}
            <main className="flex-1 p-4 md:p-6 flex flex-col bg-gray-50/50">
                <header className="flex-shrink-0 flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 flex items-center justify-center bg-yellow-100 rounded-full">
                           <ChecklistIcon className="h-6 w-6 text-yellow-600"/>
                        </div>
                        <h1 className="text-xl font-bold text-gray-800">Generador de Worksheets</h1>
                    </div>
                </header>
                <div className="flex-grow overflow-y-auto bg-white rounded-lg p-4 border">
                    {isLoading && <div className="h-full flex items-center justify-center"><LoadingSpinner /></div>}
                    {error && <div className="h-full flex items-center justify-center p-4"><ErrorDisplay message={error} /></div>}
                    {generatedWorksheet && <LessonPlanDisplay plan={generatedWorksheet} />}
                    {!isLoading && !error && !generatedWorksheet && (
                        <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
                            <ChecklistIcon className="w-16 h-16 text-gray-300" />
                            <h3 className="mt-4 text-lg font-semibold text-gray-600">Crea una hoja de trabajo a tu medida</h3>
                            <p className="max-w-xs text-sm">Usa el formulario de la derecha para generar una hoja de trabajo lista para usar.</p>
                        </div>
                    )}
                </div>
            </main>

            {/* Form Panel */}
            <aside className="w-full md:w-96 bg-white border-l p-6 overflow-y-auto">
                <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleGenerate(); }}>
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-800">Opciones</h2>
                        <InfoCircleIcon className="w-5 h-5 text-gray-400" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Método de Generación</label>
                        <div className="flex bg-gray-200 rounded-lg p-1">
                            <button 
                                type="button"
                                onClick={() => handleInputChange('generationMode', 'topic')}
                                className={`w-1/2 py-1.5 text-sm font-medium rounded-md transition-colors ${formData.generationMode === 'topic' ? 'bg-white shadow' : 'text-gray-600'}`}
                            >
                                Por Tema
                            </button>
                            <button
                                type="button"
                                onClick={() => handleInputChange('generationMode', 'text')}
                                className={`w-1/2 py-1.5 text-sm font-medium rounded-md transition-colors ${formData.generationMode === 'text' ? 'bg-white shadow' : 'text-gray-600'}`}
                            >
                                Desde Texto
                            </button>
                        </div>
                    </div>

                    {formData.generationMode === 'topic' ? (
                        <div>
                            <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">Tema <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                id="topic"
                                value={formData.topic}
                                onChange={e => handleInputChange('topic', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-sm"
                                placeholder="Ej: Las partes de la célula"
                            />
                        </div>
                    ) : (
                         <div>
                            <label htmlFor="sourceText" className="block text-sm font-medium text-gray-700 mb-1">Pega tu texto aquí <span className="text-red-500">*</span></label>
                            <textarea
                                id="sourceText"
                                rows={6}
                                value={formData.sourceText}
                                onChange={e => handleInputChange('sourceText', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-sm"
                                placeholder="Pega el contenido para generar la hoja de trabajo..."
                            />
                        </div>
                    )}


                    <div>
                        <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-1">Grado <span className="text-red-500">*</span></label>
                        <select
                            id="grade"
                            value={formData.grade}
                            onChange={e => handleInputChange('grade', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-sm"
                        >
                            <option value="" disabled>Selecciona el nivel</option>
                            {EDUCATION_LEVELS.map(level => <option key={level} value={level}>{level}</option>)}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Materia <span className="text-red-500">*</span></label>
                        <select
                            id="subject"
                            value={formData.subject}
                            onChange={e => handleInputChange('subject', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-sm"
                        >
                            <option value="" disabled>Selecciona la materia</option>
                            {SUBJECTS.map(subject => <option key={subject} value={subject}>{subject}</option>)}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">Idioma</label>
                        <select
                            id="language"
                            value={formData.language}
                            onChange={e => handleInputChange('language', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-sm"
                        >
                            {LANGUAGES.map(lang => <option key={lang} value={lang}>{lang}</option>)}
                        </select>
                    </div>
                    
                    <div>
                        <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">Dificultad</label>
                        <select
                            id="difficulty"
                            value={formData.difficulty}
                            onChange={e => handleInputChange('difficulty', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-sm"
                        >
                            {DIFFICULTY_LEVELS.map(level => <option key={level} value={level}>{level}</option>)}
                        </select>
                    </div>
                    
                    <button
                        type="submit"
                        disabled={isLoading || !isFormValid}
                        className="w-full py-3 px-4 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-75 disabled:bg-yellow-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                    >
                        <MagicWandIcon className="w-5 h-5" />
                        <span>{isLoading ? 'Generando...' : 'Generar Worksheet'}</span>
                    </button>
                </form>
            </aside>
        </div>
    );
};
