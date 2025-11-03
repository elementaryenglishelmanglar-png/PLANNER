import React, { useState, useCallback, useRef, useEffect } from 'react';
import { DuaData } from '../../types';
import { generateDuaPlan } from '../../services/geminiService';
import { LoadingSpinner } from '../LoadingSpinner';
import { ErrorDisplay } from '../ErrorDisplay';
import { LessonPlanDisplay } from '../LessonPlanDisplay';
import { DuaIcon } from '../icons/DuaIcon';
import { InfoCircleIcon } from '../icons/InfoCircleIcon';
import { EDUCATION_LEVELS, SUBJECTS } from '../wizard/constants';
import { ChevronDownIcon } from '../icons/ChevronDownIcon';
import { XIcon } from '../icons/XIcon';
import { PdfIcon } from '../icons/PdfIcon';
import { DocumentIcon } from '../icons/DocumentIcon';
import { MagicWandIcon } from '../icons/MagicWandIcon';

interface DuaGeneratorProps {
    onBackToDashboard: () => void;
}

export const DuaGenerator: React.FC<DuaGeneratorProps> = ({ onBackToDashboard }) => {
    const [formData, setFormData] = useState<DuaData>({
        educationLevel: '',
        subjects: [],
        topic: '',
        resourceName: '',
        share: false,
    });
    const [generatedPlan, setGeneratedPlan] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [isSubjectDropdownOpen, setIsSubjectDropdownOpen] = useState(false);
    const subjectDropdownRef = useRef<HTMLDivElement>(null);
    
    const handleInputChange = (field: keyof DuaData, value: string | boolean | string[]) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubjectSelect = (subject: string) => {
        const newSubjects = formData.subjects.includes(subject)
          ? formData.subjects.filter(s => s !== subject)
          : [...formData.subjects, subject];
        handleInputChange('subjects', newSubjects);
    };
      
    const handleRemoveSubject = (subject: string) => {
        handleInputChange('subjects', formData.subjects.filter(s => s !== subject));
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
          if (subjectDropdownRef.current && !subjectDropdownRef.current.contains(event.target as Node)) {
            setIsSubjectDropdownOpen(false);
          }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const createPrompt = (data: DuaData): string => {
        return `
            Por favor, crea un plan de lección DUA con las siguientes especificaciones:
            - **Nombre del recurso:** ${data.resourceName}
            - **Nivel Educativo:** ${data.educationLevel}
            - **Materia(s):** ${data.subjects.join(', ')}
            - **Tema de Estudio, actividad o objetivo:** ${data.topic}
        `.trim();
    };

    const handleGenerate = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setGeneratedPlan(null);
        const prompt = createPrompt(formData);
        try {
            const plan = await generateDuaPlan(prompt);
            setGeneratedPlan(plan);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ocurrió un error desconocido.');
        } finally {
            setIsLoading(false);
        }
    }, [formData]);
    
    const isFormValid = formData.educationLevel && formData.subjects.length > 0 && formData.topic.trim() !== '' && formData.resourceName.trim() !== '';

    return (
        <div className="flex h-full max-h-[calc(100vh-80px)] w-full bg-white rounded-2xl shadow-lg overflow-hidden animate-fade-in">
            {/* Display Panel */}
            <main className="flex-1 p-4 md:p-6 flex flex-col bg-gray-50/50">
                <header className="flex-shrink-0 flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 flex items-center justify-center bg-purple-100 rounded-full">
                            <DuaIcon className="h-6 w-6 text-purple-600"/>
                        </div>
                        <h1 className="text-xl font-bold text-gray-800">Diseño Universal para el Aprendizaje (DUA)</h1>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 flex items-center space-x-2"><span>ES</span></button>
                        <button className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 flex items-center space-x-2"><span>EN</span></button>
                        <button className="px-3 py-1.5 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 flex items-center space-x-2"><PdfIcon className="w-4 h-4" /><span>Exportar a PDF</span></button>
                        <button className="px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 flex items-center space-x-2"><DocumentIcon className="w-4 h-4" /><span>Exportar a Word</span></button>
                        <button className="px-3 py-1.5 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 flex items-center space-x-2"><MagicWandIcon className="w-4 h-4" /><span>Mejorar con IA</span></button>
                    </div>
                </header>
                <div className="flex-grow overflow-y-auto bg-white rounded-lg p-4 border">
                    {isLoading && <div className="h-full flex items-center justify-center"><LoadingSpinner /></div>}
                    {error && <div className="h-full flex items-center justify-center p-4"><ErrorDisplay message={error} /></div>}
                    {generatedPlan && <LessonPlanDisplay plan={generatedPlan} />}
                    {!isLoading && !error && !generatedPlan && (
                        <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                           <DuaIcon className="w-16 h-16"/>
                            <h3 className="mt-4 text-lg font-semibold">No hay DUA generado</h3>
                            <p className="max-w-xs text-sm">Completa el formulario de la derecha para generar el Diseño Universal para el Aprendizaje (DUA).</p>
                        </div>
                    )}
                </div>
            </main>

            {/* Form Panel */}
            <aside className="w-full md:w-96 bg-white border-l p-6 overflow-y-auto">
                <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); handleGenerate(); }}>
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-800">Generador de DUA</h2>
                        <InfoCircleIcon className="w-5 h-5 text-gray-400" />
                    </div>

                    <div>
                        <label htmlFor="educationLevel" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">Nivel Educativo <InfoCircleIcon className="w-4 h-4 ml-1 text-gray-400" /></label>
                        <select id="educationLevel" value={formData.educationLevel} onChange={e => handleInputChange('educationLevel', e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm">
                            <option value="" disabled>Selecciona el nivel</option>
                            {EDUCATION_LEVELS.map(level => <option key={level} value={level}>{level}</option>)}
                        </select>
                    </div>
                    
                    <div ref={subjectDropdownRef} className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">Materias <InfoCircleIcon className="w-4 h-4 ml-1 text-gray-400" /></label>
                        <button type="button" onClick={() => setIsSubjectDropdownOpen(!isSubjectDropdownOpen)} className="w-full flex justify-between items-center p-2 bg-white border border-gray-300 rounded-lg text-left text-sm">
                            <span>{formData.subjects.length > 0 ? `${formData.subjects.length} seleccionada(s)` : 'Selecciona las materias'}</span>
                            <ChevronDownIcon className={`w-4 h-4 transition-transform ${isSubjectDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isSubjectDropdownOpen && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                                {SUBJECTS.map(subject => (
                                    <div key={subject} className="flex items-center p-2 hover:bg-gray-100">
                                        <input type="checkbox" id={`subject-dua-${subject}`} checked={formData.subjects.includes(subject)} onChange={() => handleSubjectSelect(subject)} className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500" />
                                        <label htmlFor={`subject-dua-${subject}`} className="ml-3 block text-sm text-gray-900">{subject}</label>
                                    </div>
                                ))}
                            </div>
                        )}
                        {formData.subjects.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1.5">
                                {formData.subjects.map(subject => (
                                    <div key={subject} className="flex items-center bg-purple-100 text-purple-800 text-xs font-medium px-2 py-0.5 rounded-full">
                                        {subject}
                                        <button onClick={() => handleRemoveSubject(subject)} className="ml-1 text-purple-500 hover:text-purple-700">
                                            <XIcon className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div>
                        <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">Tema de Estudio, actividad o objetivo <InfoCircleIcon className="w-4 h-4 ml-1 text-gray-400" /></label>
                        <textarea id="topic" rows={4} value={formData.topic} onChange={e => handleInputChange('topic', e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm" placeholder="Ej: La fotosíntesis, Los números decimales, La Segunda Guerra Mundial..."></textarea>
                    </div>

                    <div>
                        <label htmlFor="resourceName" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">Nombre del recurso <InfoCircleIcon className="w-4 h-4 ml-1 text-gray-400" /></label>
                        <input type="text" id="resourceName" value={formData.resourceName} onChange={e => handleInputChange('resourceName', e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm" placeholder="Nombre del recurso" />
                    </div>

                    <div className="flex items-start">
                        <div className="flex items-center h-5">
                            <input id="share-dua" type="checkbox" checked={formData.share} onChange={e => handleInputChange('share', e.target.checked)} className="focus:ring-purple-500 h-4 w-4 text-purple-600 border-gray-300 rounded" />
                        </div>
                        <div className="ml-3 text-sm">
                            <label htmlFor="share-dua" className="font-medium text-gray-700">Compartir con la comunidad de profesores</label>
                        </div>
                        <InfoCircleIcon className="w-4 h-4 ml-auto text-gray-400" />
                    </div>
                    
                    <button type="submit" disabled={isLoading || !isFormValid} className="w-full py-3 px-4 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75 disabled:bg-purple-300 disabled:cursor-not-allowed transition-colors">
                        {isLoading ? 'Generando...' : 'Generar DUA'}
                    </button>
                </form>
            </aside>
        </div>
    );
};