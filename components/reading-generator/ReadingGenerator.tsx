import React, { useState, useCallback } from 'react';
import { ReadingData } from '../../types';
import { generateReading } from '../../services/geminiService';
import { LoadingSpinner } from '../LoadingSpinner';
import { ErrorDisplay } from '../ErrorDisplay';
import { LessonPlanDisplay } from '../LessonPlanDisplay';
import { ReadingIcon } from '../icons/ReadingIcon';
import { InfoCircleIcon } from '../icons/InfoCircleIcon';
import { EDUCATION_LEVELS } from '../wizard/constants';
import { MagicWandIcon } from '../icons/MagicWandIcon';

interface ReadingGeneratorProps {
    onBackToDashboard: () => void;
}

const TEXT_TYPES = [
    "Informativo",
    "Narrativo",
    "Descriptivo",
    "Argumentativo",
    "Instructivo",
    "Poético",
];

export const ReadingGenerator: React.FC<ReadingGeneratorProps> = ({ onBackToDashboard }) => {
    const [formData, setFormData] = useState<ReadingData>({
        topic: '',
        grade: '',
        objectives: '',
        textType: '',
    });
    const [generatedReading, setGeneratedReading] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (field: keyof ReadingData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const createPrompt = (data: ReadingData): string => {
        return `
            Por favor, genera un material de comprensión lectora con las siguientes especificaciones:
            - **Tema:** ${data.topic}
            - **Grado Escolar:** ${data.grade}
            - **Tipo de Texto:** ${data.textType}
            - **Objetivos de la Lectura:** ${data.objectives}
        `.trim();
    };

    const handleGenerate = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setGeneratedReading(null);
        const prompt = createPrompt(formData);
        try {
            const reading = await generateReading(prompt);
            setGeneratedReading(reading);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ocurrió un error desconocido.');
        } finally {
            setIsLoading(false);
        }
    }, [formData]);

    const isFormValid = formData.topic.trim() !== '' && formData.grade.trim() !== '' && formData.textType.trim() !== '' && formData.objectives.trim() !== '';

    return (
        <div className="flex h-full max-h-[calc(100vh-80px)] w-full bg-white rounded-2xl shadow-lg overflow-hidden animate-fade-in">
            {/* Display Panel */}
            <main className="flex-1 p-4 md:p-6 flex flex-col bg-gray-50/50">
                <header className="flex-shrink-0 flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 flex items-center justify-center bg-green-100 rounded-full">
                           <ReadingIcon className="h-6 w-6 text-manglar-green"/>
                        </div>
                        <h1 className="text-xl font-bold text-gray-800">Generador de Lecturas</h1>
                    </div>
                </header>
                <div className="flex-grow overflow-y-auto bg-white rounded-lg p-4 border">
                    {isLoading && <div className="h-full flex items-center justify-center"><LoadingSpinner /></div>}
                    {error && <div className="h-full flex items-center justify-center p-4"><ErrorDisplay message={error} /></div>}
                    {generatedReading && <LessonPlanDisplay plan={generatedReading} />}
                    {!isLoading && !error && !generatedReading && (
                        <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
                            <ReadingIcon className="w-16 h-16 text-gray-300" />
                            <h3 className="mt-4 text-lg font-semibold text-gray-600">Genera una lectura personalizada</h3>
                            <p className="max-w-xs text-sm">Usa el formulario de la derecha para crear un texto de comprensión lectora a la medida.</p>
                        </div>
                    )}
                </div>
            </main>

            {/* Form Panel */}
            <aside className="w-full md:w-96 bg-white border-l p-6 overflow-y-auto">
                <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleGenerate(); }}>
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-800">Parámetros</h2>
                        <InfoCircleIcon className="w-5 h-5 text-gray-400" />
                    </div>

                    <div>
                        <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">Tema <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            id="topic"
                            value={formData.topic}
                            onChange={e => handleInputChange('topic', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                            placeholder="Ej: Los volcanes, La Revolución Francesa"
                        />
                    </div>

                    <div>
                        <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-1">Grado <span className="text-red-500">*</span></label>
                        <select
                            id="grade"
                            value={formData.grade}
                            onChange={e => handleInputChange('grade', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                        >
                            <option value="" disabled>Selecciona el nivel</option>
                            {EDUCATION_LEVELS.map(level => <option key={level} value={level}>{level}</option>)}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="textType" className="block text-sm font-medium text-gray-700 mb-1">Tipo de texto <span className="text-red-500">*</span></label>
                        <select
                            id="textType"
                            value={formData.textType}
                            onChange={e => handleInputChange('textType', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                        >
                            <option value="" disabled>Selecciona el tipo de texto</option>
                            {TEXT_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="objectives" className="block text-sm font-medium text-gray-700 mb-1">Objetivos de la lectura <span className="text-red-500">*</span></label>
                        <textarea
                            id="objectives"
                            rows={5}
                            value={formData.objectives}
                            onChange={e => handleInputChange('objectives', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                            placeholder="Ej: Identificar las ideas principales, Comprender vocabulario clave, Analizar la causa y efecto..."
                        />
                    </div>
                    
                    <button
                        type="submit"
                        disabled={isLoading || !isFormValid}
                        className="w-full py-3 px-4 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 disabled:bg-green-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                    >
                        <MagicWandIcon className="w-5 h-5" />
                        <span>{isLoading ? 'Generando...' : 'Generar Lectura'}</span>
                    </button>
                </form>
            </aside>
        </div>
    );
};