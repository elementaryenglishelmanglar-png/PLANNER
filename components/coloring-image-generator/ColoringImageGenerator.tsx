
import React, { useState, useCallback } from 'react';
import { ColoringImageData } from '../../types';
import { generateColoringImage } from '../../services/geminiService';
import { LoadingSpinner } from '../LoadingSpinner';
import { ErrorDisplay } from '../ErrorDisplay';
import { ImagePlusIcon } from '../icons/ImagePlusIcon';
import { InfoCircleIcon } from '../icons/InfoCircleIcon';
import { EDUCATION_LEVELS_COLORING, SUBJECTS_COLORING } from './constants';

interface ColoringImageGeneratorProps {
    onBackToDashboard: () => void;
}

export const ColoringImageGenerator: React.FC<ColoringImageGeneratorProps> = ({ onBackToDashboard }) => {
    const [formData, setFormData] = useState<ColoringImageData>({
        educationLevel: '',
        subject: '',
        topic: '',
    });
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (field: keyof ColoringImageData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };
    
    const createPrompt = (data: ColoringImageData): string => {
        return `
            Genera un dibujo para colorear para el nivel educativo "${data.educationLevel}" en la materia de "${data.subject}". 
            El tema del dibujo es: "${data.topic}".
        `.trim();
    };

    const handleGenerate = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setGeneratedImage(null);
        const prompt = createPrompt(formData);
        try {
            const base64Image = await generateColoringImage(prompt);
            setGeneratedImage(`data:image/png;base64,${base64Image}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ocurrió un error desconocido.');
        } finally {
            setIsLoading(false);
        }
    }, [formData]);

    const handleDownload = () => {
        if (!generatedImage) return;
        const link = document.createElement('a');
        link.href = generatedImage;
        const fileName = formData.topic.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        link.download = `dibujo_${fileName || 'generado'}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const isFormValid = formData.educationLevel.trim() !== '' && formData.subject.trim() !== '' && formData.topic.trim() !== '';

    return (
        <div className="flex h-full max-h-[calc(100vh-80px)] w-full bg-white rounded-2xl shadow-lg overflow-hidden animate-fade-in">
            {/* Display Panel */}
            <main className="flex-1 p-4 md:p-6 flex flex-col items-center justify-center bg-gray-50/50">
                <div className="w-full h-full flex items-center justify-center border-2 border-dashed border-gray-300 rounded-xl bg-white p-4">
                    {isLoading ? (
                        <LoadingSpinner />
                    ) : error ? (
                        <div className="p-4 max-w-md">
                           <ErrorDisplay message={error} />
                        </div>
                    ) : generatedImage ? (
                        <div className="flex flex-col items-center justify-center gap-4 h-full">
                            <img src={generatedImage} alt="Dibujo generado para colorear" className="max-w-full max-h-[80%] object-contain rounded-lg"/>
                            <button
                                onClick={handleDownload}
                                className="mt-4 px-6 py-2 bg-manglar-green text-white font-semibold rounded-lg shadow-md hover:bg-manglar-green/90 focus:outline-none focus:ring-2 focus:ring-manglar-green focus:ring-opacity-75"
                            >
                                Descargar Imagen
                            </button>
                        </div>
                    ) : (
                        <div className="text-center text-gray-400">
                            <ImagePlusIcon className="w-16 h-16 mx-auto text-gray-300" />
                            <h3 className="mt-4 text-lg font-semibold text-gray-600">No hay imagen generada</h3>
                            <p className="max-w-xs text-sm">Completa el formulario de la derecha para generar un dibujo para colorear.</p>
                        </div>
                    )}
                </div>
            </main>
            
            {/* Form Panel */}
            <aside className="w-full md:w-96 bg-white border-l p-6 overflow-y-auto">
                <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleGenerate(); }}>
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-800">Generador de Dibujos</h2>
                        <InfoCircleIcon className="w-5 h-5 text-gray-400" />
                    </div>
                    
                    <div>
                        <label htmlFor="educationLevel" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                            Nivel Educativo
                            <InfoCircleIcon className="w-4 h-4 ml-1 text-gray-400" />
                        </label>
                        <select
                            id="educationLevel"
                            value={formData.educationLevel}
                            onChange={(e) => handleInputChange('educationLevel', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                        >
                            <option value="" disabled>Selecciona el nivel</option>
                            {EDUCATION_LEVELS_COLORING.map(level => <option key={level} value={level}>{level}</option>)}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                            Materia
                            <InfoCircleIcon className="w-4 h-4 ml-1 text-gray-400" />
                        </label>
                        <select
                            id="subject"
                            value={formData.subject}
                            onChange={(e) => handleInputChange('subject', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                        >
                            <option value="" disabled>Selecciona la materia</option>
                            {SUBJECTS_COLORING.map(subject => <option key={subject} value={subject}>{subject}</option>)}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                            Tema o Concepto
                            <InfoCircleIcon className="w-4 h-4 ml-1 text-gray-400" />
                        </label>
                        <textarea
                            id="topic"
                            rows={5}
                            value={formData.topic}
                            onChange={(e) => handleInputChange('topic', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                            placeholder="Ej: El ciclo del agua, Los planetas del sistema solar, La fotosíntesis..."
                        />
                    </div>
                    
                    <button
                        type="submit"
                        disabled={isLoading || !isFormValid}
                        className="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors"
                    >
                        {isLoading ? 'Generando...' : 'Generar Dibujo'}
                    </button>
                </form>
            </aside>
        </div>
    );
};
