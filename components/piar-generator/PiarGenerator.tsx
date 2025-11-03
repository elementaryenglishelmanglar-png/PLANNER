import React, { useState, useCallback, useRef, useEffect } from 'react';
import { CurricularAdaptationData } from '../../types';
import { generateCurricularAdaptation } from '../../services/geminiService';
import { LoadingSpinner } from '../LoadingSpinner';
import { LessonPlanDisplay } from '../LessonPlanDisplay';
import { ErrorDisplay } from '../ErrorDisplay';
import { UserCogIcon } from '../icons/UserCogIcon';
import { DocumentIcon } from '../icons/DocumentIcon';
import { InfoCircleIcon } from '../icons/InfoCircleIcon';
import { EDUCATION_LEVELS, SUBJECTS } from '../wizard/constants';
import { ChevronDownIcon } from '../icons/ChevronDownIcon';
import { XIcon } from '../icons/XIcon';

interface CurricularAdaptationsProps {
    onBackToDashboard: () => void;
}

export const CurricularAdaptations: React.FC<CurricularAdaptationsProps> = ({ onBackToDashboard }) => {
    const [mode, setMode] = useState<'topic' | 'text'>('topic');
    const [formData, setFormData] = useState<CurricularAdaptationData>({
        educationLevel: '',
        subjects: [],
        learningConditions: '',
        medicalHistory: '',
        studentName: '',
        share: false,
        sourceText: '',
    });
    const [generatedPlan, setGeneratedPlan] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [isSubjectDropdownOpen, setIsSubjectDropdownOpen] = useState(false);
    const subjectDropdownRef = useRef<HTMLDivElement>(null);

    const handleInputChange = (field: keyof CurricularAdaptationData, value: string | boolean | string[]) => {
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

    const createAdaptationPrompt = (data: CurricularAdaptationData, currentMode: 'topic' | 'text'): string => {
        const studentProfile = `
            **Perfil del Estudiante:**
            - **Nombre:** ${data.studentName || 'No especificado'}
            - **Nivel Educativo:** ${data.educationLevel}
            - **Materia(s):** ${data.subjects.join(', ')}
            - **Condiciones que Afectan el Aprendizaje:** ${data.learningConditions}
            - **Antecedentes Clínicos o Historial Médico:** ${data.medicalHistory}
        `.trim();

        const contentToAdapt = currentMode === 'text'
            ? `
                **Contenido a Adaptar (Texto Completo):**
                ---
                ${data.sourceText}
                ---
            `.trim()
            : `
                **Contenido a Adaptar (Descripción del Tema):**
                ---
                ${data.sourceText}
                ---
            `.trim();

        return `
            Por favor, genera una propuesta de Adaptaciones Curriculares. Aquí tienes la información del estudiante y el contenido de la lección que necesita ser adaptado.

            ${studentProfile}

            ${contentToAdapt}
        `.trim();
    };

    const handleGenerate = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setGeneratedPlan(null);
        const prompt = createAdaptationPrompt(formData, mode);
        try {
            const plan = await generateCurricularAdaptation(prompt);
            setGeneratedPlan(plan);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ocurrió un error desconocido.');
        } finally {
            setIsLoading(false);
        }
    }, [formData, mode]);

    const isFormValid = formData.educationLevel && formData.subjects.length > 0 && formData.learningConditions.trim() !== '' && formData.studentName.trim() !== '' && formData.sourceText.trim() !== '';

    return (
        <div className="flex h-full max-h-[calc(100vh-80px)] w-full bg-white rounded-2xl shadow-lg overflow-hidden animate-fade-in">
            {/* Main Content */}
            <main className="flex-1 p-6 md:p-8 flex flex-col">
                <header className="flex justify-between items-start mb-6">
                    <div>
                        <button onClick={onBackToDashboard} className="text-sm text-gray-600 hover:underline mb-2 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                            Volver al Taller
                        </button>
                        <div className="flex items-center space-x-3">
                             <UserCogIcon className="w-8 h-8 text-gray-700" />
                             <h1 className="text-2xl font-bold text-gray-800">Adaptaciones Curriculares</h1>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button className="px-3 py-1.5 text-sm font-medium text-red-600 bg-red-100 border border-red-200 rounded-md hover:bg-red-200 flex items-center space-x-2 transition-colors">
                            <DocumentIcon className="w-4 h-4" />
                            <span>Exportar a PDF</span>
                        </button>
                         <button className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-100 border border-blue-200 rounded-md hover:bg-blue-200 flex items-center space-x-2 transition-colors">
                            <DocumentIcon className="w-4 h-4" />
                            <span>Exportar a Word</span>
                        </button>
                    </div>
                </header>
                <div className="flex-grow overflow-y-auto bg-gray-50 rounded-lg p-4 -mx-4">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-full">
                           <LoadingSpinner />
                        </div>
                    ) : error ? (
                         <div className="flex items-center justify-center h-full p-4">
                           <ErrorDisplay message={error} />
                        </div>
                    ) : generatedPlan ? (
                        <LessonPlanDisplay plan={generatedPlan} />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
                           <UserCogIcon className="w-20 h-20 text-gray-300 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-600">No hay adaptaciones generadas</h3>
                            <p className="max-w-xs text-sm">Completa el formulario de la derecha para generar las adaptaciones curriculares.</p>
                        </div>
                    )}
                </div>
            </main>

            {/* Form Sidebar */}
            <aside className="w-[450px] flex-shrink-0 bg-white border-l p-6 overflow-y-auto">
                <div className="space-y-5">
                    <h2 className="text-xl font-bold flex items-center justify-between text-gray-800">
                        Generador de Adaptaciones
                        <InfoCircleIcon className="w-5 h-5 text-gray-400" />
                    </h2>
                    
                    <div className="p-4 bg-gray-50 rounded-lg space-y-4">
                        <h3 className="text-sm font-semibold text-gray-800">Información del Estudiante</h3>
                         <div>
                            <label htmlFor="studentName" className="block text-xs font-medium text-gray-600 mb-1 flex items-center">Nombre del Estudiante <span className="text-red-500 ml-0.5">*</span></label>
                            <input type="text" id="studentName" value={formData.studentName} onChange={e => handleInputChange('studentName', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm" placeholder="Nombre completo del estudiante" />
                        </div>

                        <div>
                            <label htmlFor="educationLevel" className="block text-xs font-medium text-gray-600 mb-1 flex items-center">Nivel Educativo <span className="text-red-500 ml-0.5">*</span></label>
                            <select id="educationLevel" value={formData.educationLevel} onChange={e => handleInputChange('educationLevel', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm">
                                <option value="" disabled>Selecciona el nivel</option>
                                {EDUCATION_LEVELS.map(level => <option key={level} value={level}>{level}</option>)}
                            </select>
                        </div>

                        <div ref={subjectDropdownRef} className="relative">
                            <label className="block text-xs font-medium text-gray-600 mb-1 flex items-center">Materias <span className="text-red-500 ml-0.5">*</span></label>
                            <button type="button" onClick={() => setIsSubjectDropdownOpen(!isSubjectDropdownOpen)} className="w-full flex justify-between items-center p-2 bg-white border border-gray-300 rounded-md text-left text-sm">
                                <span>{formData.subjects.length > 0 ? `${formData.subjects.length} seleccionada(s)` : 'Selecciona las materias'}</span>
                                <ChevronDownIcon className={`w-4 h-4 transition-transform ${isSubjectDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {isSubjectDropdownOpen && (
                                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                                    {SUBJECTS.map(subject => (
                                        <div key={subject} className="flex items-center p-2 hover:bg-gray-100">
                                            <input type="checkbox" id={`subject-${subject}`} checked={formData.subjects.includes(subject)} onChange={() => handleSubjectSelect(subject)} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                                            <label htmlFor={`subject-${subject}`} className="ml-3 block text-sm text-gray-900">{subject}</label>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {formData.subjects.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-1.5">
                                    {formData.subjects.map(subject => (
                                        <div key={subject} className="flex items-center bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-0.5 rounded-full">
                                            {subject}
                                            <button onClick={() => handleRemoveSubject(subject)} className="ml-1 text-indigo-500 hover:text-indigo-700">
                                                <XIcon className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div>
                            <label htmlFor="learningConditions" className="block text-xs font-medium text-gray-600 mb-1 flex items-center">Condiciones que Afectan el Aprendizaje... <span className="text-red-500 ml-0.5">*</span></label>
                            <textarea id="learningConditions" rows={3} value={formData.learningConditions} onChange={e => handleInputChange('learningConditions', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm" placeholder="Ej: Dificultades en la comprensión lectora, problemas de atención..."></textarea>
                        </div>
                        
                        <div>
                            <label htmlFor="medicalHistory" className="block text-xs font-medium text-gray-600 mb-1 flex items-center">Antecedentes Clínicos o Historial Médico</label>
                            <textarea id="medicalHistory" rows={3} value={formData.medicalHistory} onChange={e => handleInputChange('medicalHistory', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm" placeholder="Ej: Diagnóstico de TDAH, condición visual, alergias, medicamentos..."></textarea>
                        </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg space-y-4">
                        <h3 className="text-sm font-semibold text-gray-800">Contenido a Adaptar <span className="text-red-500 ml-0.5">*</span></h3>
                        <div className="flex bg-gray-200 rounded-lg p-1">
                            <button type="button" onClick={() => setMode('topic')} className={`w-1/2 py-1.5 text-sm font-medium rounded-md transition-colors ${mode === 'topic' ? 'bg-white shadow' : 'text-gray-600'}`}>Describir Tema</button>
                            <button type="button" onClick={() => setMode('text')} className={`w-1/2 py-1.5 text-sm font-medium rounded-md transition-colors ${mode === 'text' ? 'bg-white shadow' : 'text-gray-600'}`}>Pegar Texto</button>
                        </div>
                        <div>
                             <textarea 
                                id="sourceText" 
                                rows={6} 
                                value={formData.sourceText} 
                                onChange={e => handleInputChange('sourceText', e.target.value)} 
                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm" 
                                placeholder={
                                    mode === 'topic' 
                                    ? "Describe el tema, los objetivos y las actividades de la lección que necesitas adaptar."
                                    : "Pega aquí el texto de la lección, guía o material a adaptar. Puedes copiarlo desde un PDF o Word."
                                }
                            />
                        </div>
                    </div>
                    
                    <div className="flex items-start">
                        <div className="flex items-center h-5">
                            <input id="share" type="checkbox" checked={formData.share} onChange={e => handleInputChange('share', e.target.checked)} className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                        </div>
                        <div className="ml-3 text-sm">
                            <label htmlFor="share" className="font-medium text-gray-700">Compartir con la comunidad de profesores</label>
                        </div>
                        <InfoCircleIcon className="w-4 h-4 ml-auto text-gray-400" />
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={isLoading || !isFormValid}
                        className="w-full py-2.5 px-4 bg-indigo-500 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors"
                    >
                        {isLoading ? 'Generando...' : 'Generar Adaptaciones'}
                    </button>
                </div>
            </aside>
        </div>
    );
};
