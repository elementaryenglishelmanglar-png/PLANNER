import React, { useState, useCallback } from 'react';
import { WordSearchFormData, WordSearchAPIResponse } from '../../types';
import { generateWordSearch } from '../../services/geminiService';
import { LoadingSpinner } from '../LoadingSpinner';
import { ErrorDisplay } from '../ErrorDisplay';
import { WordSearchIcon } from '../icons/WordSearchIcon';
import { InfoCircleIcon } from '../icons/InfoCircleIcon';
import { WordSearchGrid } from './WordSearchGrid';
import { PdfIcon } from '../icons/PdfIcon';
import { SolutionIcon } from '../icons/SolutionIcon';
import { RefreshIcon } from '../icons/RefreshIcon';
import { SUBJECTS, EDUCATION_LEVELS } from '../wizard/constants';

interface WordSearchGeneratorProps {
    onBackToDashboard: () => void;
}

const InfoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 hover:text-gray-600 inline ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

export const WordSearchGenerator: React.FC<WordSearchGeneratorProps> = ({ onBackToDashboard }) => {
    const [formData, setFormData] = useState<WordSearchFormData>({
        resourceName: '',
        theme: '',
        subject: '',
        grade: '',
        share: false,
    });
    const [wordSearchData, setWordSearchData] = useState<WordSearchAPIResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showSolution, setShowSolution] = useState(false);

    const handleInputChange = (field: keyof WordSearchFormData, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const createPrompt = (data: WordSearchFormData): string => {
        const words = data.theme.split('\n').filter(w => w.trim() !== '').join(', ');
        return `
            Por favor, genera una sopa de letras con las siguientes especificaciones:
            - **Tema:** ${data.resourceName}
            - **Lista de Palabras:** ${words}
            - **Materia:** ${data.subject}
            - **Grado Escolar:** ${data.grade}
            - **Tamaño de la cuadrícula:** Aproximadamente 15x15
        `.trim();
    };

    const handleGenerate = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setWordSearchData(null);
        setShowSolution(false);
        const prompt = createPrompt(formData);
        try {
            const result = await generateWordSearch(prompt);
            setWordSearchData(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ocurrió un error desconocido.');
        } finally {
            setIsLoading(false);
        }
    }, [formData]);
    
    const isFormValid = formData.resourceName.trim() !== '' && formData.theme.trim() !== '' && formData.subject.trim() !== '' && formData.grade.trim() !== '';

    return (
        <div className="flex flex-col md:flex-row h-full max-h-[calc(100vh-80px)] w-full bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Display Panel */}
            <main className="flex-1 p-4 md:p-6 flex flex-col bg-gray-50">
                <header className="flex-shrink-0 flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-2">
                        <WordSearchIcon className="h-6 w-6 text-manglar-green"/>
                        <h1 className="text-xl font-bold">Sopa de Letras</h1>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 flex items-center space-x-2"><PdfIcon className="w-4 h-4" /><span>Exportar a PDF</span></button>
                        <button onClick={() => setShowSolution(!showSolution)} disabled={!wordSearchData} className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"><SolutionIcon className="w-4 h-4" /><span>{showSolution ? 'Ocultar Solución' : 'Mostrar Solución'}</span></button>
                        <button className="p-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"><RefreshIcon className="w-4 h-4" /></button>
                    </div>
                </header>
                <div className="flex-grow overflow-y-auto p-2">
                    {isLoading && <div className="h-full flex items-center justify-center"><LoadingSpinner /></div>}
                    {error && <div className="h-full flex items-center justify-center p-4"><ErrorDisplay message={error} /></div>}
                    {wordSearchData && (
                        <div className="max-w-2xl mx-auto space-y-8">
                            <WordSearchGrid grid={wordSearchData.grid} />

                            <div className="bg-white p-4 rounded-xl border border-gray-200">
                                <h2 className="font-bold text-lg mb-3">¡Palabras a encontrar!</h2>
                                <div className="flex flex-wrap gap-2">
                                    {wordSearchData.words.map((word, index) => (
                                        <span key={index} className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">{word}</span>
                                    ))}
                                </div>
                            </div>
                            
                            {showSolution && (
                                <div className="animate-fade-in">
                                    <h2 className="text-xl font-bold mb-4 text-center">Solución</h2>
                                     <WordSearchGrid grid={wordSearchData.grid} solution={wordSearchData.solution} />
                                </div>
                            )}
                        </div>
                    )}
                     {!isLoading && !error && !wordSearchData && (
                        <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                           <WordSearchIcon className="w-16 h-16 text-gray-400"/>
                            <h3 className="mt-4 text-lg font-semibold">Genera tu Sopa de Letras</h3>
                            <p className="max-w-xs">Completa el formulario para crear una actividad divertida para tus estudiantes.</p>
                        </div>
                    )}
                </div>
            </main>

            {/* Form Panel */}
            <aside className="w-full md:w-96 bg-white border-l p-6 overflow-y-auto">
                <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); handleGenerate(); }}>
                    <div>
                        <label htmlFor="resourceName" className="block text-sm font-medium text-gray-700 mb-1">Nombre del Recurso <span className="text-red-500">*</span><InfoIcon /></label>
                        <input type="text" id="resourceName" value={formData.resourceName} onChange={e => { handleInputChange('resourceName', e.target.value); }} maxLength={100} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm" placeholder="Ej: Sopa de Letras del Sistema Solar" />
                        <p className="text-xs text-gray-500 text-right mt-1">{formData.resourceName.length}/100</p>
                    </div>
                    <div>
                        <label htmlFor="theme" className="block text-sm font-medium text-gray-700 mb-1">Tema <span className="text-red-500">*</span><InfoIcon /></label>
                        <textarea id="theme" rows={8} value={formData.theme} onChange={e => handleInputChange('theme', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm" placeholder="Escribe una palabra por línea..."></textarea>
                    </div>
                    <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Materia <span className="text-red-500">*</span></label>
                        <select id="subject" value={formData.subject} onChange={e => handleInputChange('subject', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm">
                            <option value="" disabled>Selecciona la materia</option>
                            {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-1">Grado <span className="text-red-500">*</span></label>
                        <select id="grade" value={formData.grade} onChange={e => handleInputChange('grade', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm">
                            <option value="" disabled>Selecciona el grado</option>
                            {EDUCATION_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                    </div>
                    <div className="flex items-start">
                        <div className="flex items-center h-5">
                            <input id="share" type="checkbox" checked={formData.share} onChange={e => handleInputChange('share', e.target.checked)} className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                        </div>
                        <div className="ml-3 text-sm">
                            <label htmlFor="share" className="font-medium text-gray-700">Compartir con la comunidad de professores</label>
                        </div>
                        <InfoCircleIcon className="w-4 h-4 ml-auto text-gray-400" />
                    </div>
                    <button type="submit" disabled={isLoading || !isFormValid} className="w-full py-2.5 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors">
                        {isLoading ? 'Generando...' : 'Generar Sopa de Letras'}
                    </button>
                </form>
            </aside>
        </div>
    );
};