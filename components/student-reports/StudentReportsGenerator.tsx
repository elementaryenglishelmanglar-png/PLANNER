import React, { useState, useCallback } from 'react';
import { StudentReportData } from '../../types';
import { generateStudentReport } from '../../services/geminiService';
import { LoadingSpinner } from '../LoadingSpinner';
import { ErrorDisplay } from '../ErrorDisplay';
import { LessonPlanDisplay } from '../LessonPlanDisplay';
import { StudentReportsIcon } from '../icons/StudentReportsIcon';
import { InfoCircleIcon } from '../icons/InfoCircleIcon';
import { EDUCATION_LEVELS } from '../wizard/constants';
import { MagicWandIcon } from '../icons/MagicWandIcon';

interface StudentReportsGeneratorProps {
    onBackToDashboard: () => void;
}

const REPORTING_PERIODS = ["Trimestre 1", "Trimestre 2", "Trimestre 3", "Informe de Mitad de Año", "Informe Final de Año"];
const REPORT_TONES = ["Equilibrado y Constructivo", "Positivo y Alentador", "Formal y Directo"];
const LANGUAGES = ["Español", "Inglés", "Francés"];

export const StudentReportsGenerator: React.FC<StudentReportsGeneratorProps> = ({ onBackToDashboard }) => {
    const [formData, setFormData] = useState<StudentReportData>({
        studentName: '',
        grade: '',
        reportingPeriod: REPORTING_PERIODS[0],
        academicStrengths: '',
        academicImprovements: '',
        behavioralStrengths: '',
        behavioralImprovements: '',
        reportTone: REPORT_TONES[0],
        closingRemark: '¡Felices vacaciones!',
        language: 'Español',
    });
    const [generatedReport, setGeneratedReport] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (field: keyof StudentReportData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const createPrompt = (data: StudentReportData): string => {
        return `
            Por favor, redacta un comentario para el boletín de un estudiante con los siguientes datos:
            - **Idioma de Salida:** ${data.language}
            - **Nombre del Estudiante:** ${data.studentName}
            - **Grado:** ${data.grade}
            - **Período del Informe:** ${data.reportingPeriod}
            - **Tono del Comentario:** ${data.reportTone}
            
            **Información Académica:**
            - **Fortalezas Académicas:** ${data.academicStrengths}
            - **Áreas a Mejorar (Académicas):** ${data.academicImprovements}
            
            **Información Comportamental y Social:**
            - **Fortalezas Comportamentales:** ${data.behavioralStrengths}
            - **Áreas a Mejorar (Comportamentales):** ${data.behavioralImprovements}
            
            - **Frase de Cierre:** ${data.closingRemark}
        `.trim();
    };

    const handleGenerate = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setGeneratedReport(null);
        const prompt = createPrompt(formData);
        try {
            const report = await generateStudentReport(prompt);
            setGeneratedReport(report);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ocurrió un error desconocido.');
        } finally {
            setIsLoading(false);
        }
    }, [formData]);

    const isFormValid = formData.studentName.trim() !== '' && formData.grade.trim() !== '' && formData.academicStrengths.trim() !== '' && formData.academicImprovements.trim() !== '' && formData.language.trim() !== '';

    return (
        <div className="flex h-full max-h-[calc(100vh-80px)] w-full bg-white rounded-2xl shadow-lg overflow-hidden animate-fade-in">
            {/* Display Panel */}
            <main className="flex-1 p-4 md:p-6 flex flex-col bg-gray-50/50">
                <div className="flex-grow overflow-y-auto bg-white rounded-lg p-4 border">
                    {isLoading && <div className="h-full flex items-center justify-center"><LoadingSpinner /></div>}
                    {error && <div className="h-full flex items-center justify-center p-4"><ErrorDisplay message={error} /></div>}
                    {generatedReport && <LessonPlanDisplay plan={generatedReport} />}
                    {!isLoading && !error && !generatedReport && (
                        <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
                            <StudentReportsIcon className="w-16 h-16 text-gray-300" />
                            <h3 className="mt-4 text-lg font-semibold text-gray-600">Genera un informe descriptivo</h3>
                            <p className="max-w-xs text-sm">Completa el formulario para redactar un comentario de boletín personalizado y constructivo.</p>
                        </div>
                    )}
                </div>
            </main>

            {/* Form Panel */}
            <aside className="w-full md:w-96 bg-white border-l p-6 overflow-y-auto">
                <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); handleGenerate(); }}>
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 flex items-center justify-center bg-blue-100 rounded-full">
                           <StudentReportsIcon className="h-6 w-6 text-blue-600"/>
                        </div>
                        <h2 className="text-xl font-bold text-gray-800">Informe Estudiantil</h2>
                    </div>
                    
                    {/* Student Info */}
                    <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
                        <h3 className="text-sm font-semibold text-gray-600">Datos del Estudiante</h3>
                         <div>
                            <label htmlFor="studentName" className="block text-xs font-medium text-gray-700 mb-1">Nombre del Estudiante <span className="text-red-500">*</span></label>
                            <input type="text" id="studentName" value={formData.studentName} onChange={e => handleInputChange('studentName', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md shadow-sm text-sm" placeholder="Ej: Rocío Pérez" />
                        </div>
                        <div>
                            <label htmlFor="grade" className="block text-xs font-medium text-gray-700 mb-1">Grado <span className="text-red-500">*</span></label>
                            <select id="grade" value={formData.grade} onChange={e => handleInputChange('grade', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md shadow-sm text-sm">
                                <option value="" disabled>Selecciona el nivel</option>
                                {EDUCATION_LEVELS.map(level => <option key={level} value={level}>{level}</option>)}
                            </select>
                        </div>
                         <div>
                            <label htmlFor="reportingPeriod" className="block text-xs font-medium text-gray-700 mb-1">Período del Informe</label>
                            <select id="reportingPeriod" value={formData.reportingPeriod} onChange={e => handleInputChange('reportingPeriod', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md shadow-sm text-sm">
                                {REPORTING_PERIODS.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Performance */}
                     <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
                        <h3 className="text-sm font-semibold text-gray-600">Desempeño Académico</h3>
                        <div>
                            <label htmlFor="academicStrengths" className="block text-xs font-medium text-gray-700 mb-1">Fortalezas <span className="text-red-500">*</span></label>
                            <textarea id="academicStrengths" rows={3} value={formData.academicStrengths} onChange={e => handleInputChange('academicStrengths', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md shadow-sm text-sm" placeholder="Ej: Escribe cuentos coherentes, resuelve adiciones con complejidad..."></textarea>
                        </div>
                        <div>
                            <label htmlFor="academicImprovements" className="block text-xs font-medium text-gray-700 mb-1">Áreas de Oportunidad <span className="text-red-500">*</span></label>
                            <textarea id="academicImprovements" rows={3} value={formData.academicImprovements} onChange={e => handleInputChange('academicImprovements', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md shadow-sm text-sm" placeholder="Ej: Mejorar la entonación al leer en voz alta..."></textarea>
                        </div>
                    </div>
                    
                    <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
                        <h3 className="text-sm font-semibold text-gray-600">Desempeño Comportamental y Social</h3>
                        <div>
                            <label htmlFor="behavioralStrengths" className="block text-xs font-medium text-gray-700 mb-1">Fortalezas</label>
                            <textarea id="behavioralStrengths" rows={3} value={formData.behavioralStrengths} onChange={e => handleInputChange('behavioralStrengths', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md shadow-sm text-sm" placeholder="Ej: Es colaborativo, participa activamente en clase..."></textarea>
                        </div>
                        <div>
                            <label htmlFor="behavioralImprovements" className="block text-xs font-medium text-gray-700 mb-1">Áreas de Oportunidad</label>
                            <textarea id="behavioralImprovements" rows={3} value={formData.behavioralImprovements} onChange={e => handleInputChange('behavioralImprovements', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md shadow-sm text-sm" placeholder="Ej: Debe concentrarse más, mejorar la puntualidad..."></textarea>
                        </div>
                    </div>
                    
                    {/* Settings */}
                    <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
                         <h3 className="text-sm font-semibold text-gray-600">Configuración del Informe</h3>
                         <div>
                            <label htmlFor="language" className="block text-xs font-medium text-gray-700 mb-1">Idioma del Informe</label>
                            <select id="language" value={formData.language} onChange={e => handleInputChange('language', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md shadow-sm text-sm">
                                {LANGUAGES.map(lang => <option key={lang} value={lang}>{lang}</option>)}
                            </select>
                        </div>
                         <div>
                            <label htmlFor="reportTone" className="block text-xs font-medium text-gray-700 mb-1">Tono del Comentario</label>
                            <select id="reportTone" value={formData.reportTone} onChange={e => handleInputChange('reportTone', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md shadow-sm text-sm">
                                {REPORT_TONES.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="closingRemark" className="block text-xs font-medium text-gray-700 mb-1">Frase de Cierre</label>
                            <input type="text" id="closingRemark" value={formData.closingRemark} onChange={e => handleInputChange('closingRemark', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md shadow-sm text-sm" />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || !isFormValid}
                        className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                    >
                        <MagicWandIcon className="w-5 h-5" />
                        <span>{isLoading ? 'Generando...' : 'Generar Informe'}</span>
                    </button>
                </form>
            </aside>
        </div>
    );
};