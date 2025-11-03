import React, { useState, useCallback } from 'react';
import { TimelineFormData, TimelineEvent } from '../../types';
import { generateTimeline } from '../../services/geminiService';
import { LoadingSpinner } from '../LoadingSpinner';
import { ErrorDisplay } from '../ErrorDisplay';
import { TimelineIcon } from '../icons/TimelineIcon';
import { InfoCircleIcon } from '../icons/InfoCircleIcon';
import { EDUCATION_LEVELS } from '../wizard/constants';
import { TimelineDisplay } from './TimelineDisplay';
import { PdfIcon } from '../icons/PdfIcon';
import { ImageIcon } from '../icons/ImageIcon';
import { MagicWandIcon } from '../icons/MagicWandIcon';

interface TimelineGeneratorProps {
    onBackToDashboard: () => void;
}

const TIMELINE_STYLES = [
    'Estilo 1 (Banda de Color)',
    'Estilo 2 (Clásico)',
    'Estilo 3 (Moderno)',
    'Estilo 4 (Minimalista)',
    'Estilo 5 (Tarjetas Coloridas)',
    'Estilo 6 (Circular Alternado)',
];

export const TimelineGenerator: React.FC<TimelineGeneratorProps> = ({ onBackToDashboard }) => {
    const [formData, setFormData] = useState<TimelineFormData>({
        name: '',
        theme: '',
        grade: '',
        subject: '',
        share: false,
    });
    const [timelineData, setTimelineData] = useState<TimelineEvent[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [style, setStyle] = useState<string>(TIMELINE_STYLES[0]);

    const handleInputChange = (field: keyof TimelineFormData, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const createPrompt = (data: TimelineFormData): string => {
        return `
            Por favor, genera una línea de tiempo con las siguientes especificaciones:
            - **Nombre/Tema General:** ${data.name}
            - **Tema Específico:** ${data.theme}
            - **Grado Escolar:** ${data.grade}
            - **Asignatura:** ${data.subject}
        `.trim();
    };

    const handleGenerate = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setTimelineData(null);
        const prompt = createPrompt(formData);
        try {
            const result = await generateTimeline(prompt);
            setTimelineData(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ocurrió un error desconocido.');
        } finally {
            setIsLoading(false);
        }
    }, [formData]);
    
    const isFormValid = formData.name.trim() !== '' && formData.theme.trim() !== '' && formData.grade.trim() !== '' && formData.subject.trim() !== '';

    return (
        <div className="flex flex-col h-full max-h-[calc(100vh-80px)] w-full bg-white rounded-2xl shadow-lg overflow-hidden animate-fade-in">
            {/* Header */}
            <header className="flex-shrink-0 flex justify-between items-center p-4 border-b">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full">
                        <TimelineIcon className="h-6 w-6 text-gray-600" />
                    </div>
                    <h1 className="text-xl font-bold text-gray-800">Generador de Línea de Tiempo Educativa</h1>
                </div>
                {timelineData && (
                    <div className="flex items-center space-x-2">
                        <button className="px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 flex items-center space-x-2"><PdfIcon className="w-4 h-4" /><span>Exportar a PDF</span></button>
                        <button className="px-3 py-1.5 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-md hover:bg-green-100 flex items-center space-x-2"><ImageIcon className="w-4 h-4" /><span>Exportar a imagen</span></button>
                        <button className="px-3 py-1.5 text-sm font-medium text-purple-700 bg-purple-50 border border-purple-200 rounded-md hover:bg-purple-100 flex items-center space-x-2"><MagicWandIcon className="w-4 h-4" /><span>Mejorar con IA</span></button>
                    </div>
                )}
            </header>

            {/* Main Content Area */}
            <div className="flex flex-1 min-h-0">
                {/* Display Panel */}
                <main className="flex-1 p-4 md:p-6 flex flex-col bg-gray-50/50">
                    {timelineData && (
                         <div className="mb-4">
                            <label htmlFor="timeline-style" className="block text-sm font-medium text-gray-700 mb-1">Estilo de Línea de Tiempo:</label>
                            <select id="timeline-style" value={style} onChange={(e) => setStyle(e.target.value)} className="w-full max-w-xs p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm">
                                {TIMELINE_STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    )}
                    <div className="flex-grow overflow-auto p-4 bg-white rounded-lg border">
                        {isLoading && <div className="h-full flex items-center justify-center"><LoadingSpinner /></div>}
                        {error && <div className="h-full flex items-center justify-center p-4"><ErrorDisplay message={error} /></div>}
                        {timelineData && <TimelineDisplay data={timelineData} style={style} />}
                        {!isLoading && !error && !timelineData && (
                            <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
                               {/* FIX: Pass a className to the TimelineIcon component for sizing. Color is inherited from the parent div. */}
                               <TimelineIcon className="w-12 h-12" />
                                <h3 className="mt-4 text-lg font-semibold text-gray-600">No hay línea de tiempo generada</h3>
                                <p className="max-w-xs text-sm">Completa el formulario de la derecha para generar una línea de tiempo educativa.</p>
                            </div>
                        )}
                    </div>
                </main>

                {/* Form Panel */}
                <aside className="w-full md:w-80 bg-white border-l p-6 overflow-y-auto">
                    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleGenerate(); }}>
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Línea de Tiempo <span className="text-red-500">*</span></label>
                            <input type="text" id="name" value={formData.name} onChange={e => { handleInputChange('name', e.target.value); }} maxLength={100} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm" placeholder="Ej: Línea de Tiempo de la Segunda Guerra" />
                            <p className="text-xs text-gray-500 text-right mt-1">{formData.name.length}/100</p>
                        </div>
                        <div>
                            <label htmlFor="theme" className="block text-sm font-medium text-gray-700 mb-1">Tema <span className="text-red-500">*</span></label>
                            <input type="text" id="theme" value={formData.theme} onChange={e => handleInputChange('theme', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm" placeholder="Ej: Segunda Guerra Mundial" />
                        </div>
                        <div>
                            <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-1">Grado/Nivel educativo <span className="text-red-500">*</span></label>
                            <select id="grade" value={formData.grade} onChange={e => handleInputChange('grade', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm">
                                <option value="" disabled>Selecciona el grado</option>
                                {EDUCATION_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                            </select>
                        </div>
                         <div>
                            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Asignatura <span className="text-red-500">*</span></label>
                            <input type="text" id="subject" value={formData.subject} onChange={e => handleInputChange('subject', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm" placeholder="Ej: Historia, Ciencias, etc." />
                        </div>
                        <div className="flex items-start pt-2">
                            <div className="flex items-center h-5">
                                <input id="share" type="checkbox" checked={formData.share} onChange={e => handleInputChange('share', e.target.checked)} className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                            </div>
                            <div className="ml-3 text-sm">
                                <label htmlFor="share" className="font-medium text-gray-700">Compartir con la comunidad de profesores</label>
                            </div>
                        </div>
                        <button type="submit" disabled={isLoading || !isFormValid} className="w-full py-2.5 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors">
                            {isLoading ? 'Generando...' : 'Generar Línea de Tiempo'}
                        </button>
                    </form>
                </aside>
            </div>
        </div>
    );
};