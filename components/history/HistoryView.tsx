import React, { useEffect, useState } from 'react';
import { historyService } from '../../services/historyService';
import { GenerationHistory } from '../../types';
import { HistoryIcon } from '../icons/HistoryIcon';
import { allTools } from '../dashboard/toolsData';

export const HistoryView: React.FC = () => {
    const [history, setHistory] = useState<GenerationHistory[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        setLoading(true);
        const data = await historyService.getHistory();
        setHistory(data);
        setLoading(false);
    };

    const getToolTitle = (toolId: string) => {
        const tool = allTools.find(t => t.id === toolId);
        return tool ? tool.title : toolId;
    };

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return 'Fecha desconocida';
        return new Date(dateStr).toLocaleString('es-ES', {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-manglar-black flex items-center">
                    <HistoryIcon className="w-8 h-8 mr-3 text-manglar-green" />
                    Historial de Generaciones
                </h1>
                <button
                    onClick={loadHistory}
                    className="px-4 py-2 bg-manglar-light-green text-manglar-green rounded-lg hover:bg-manglar-green hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-manglar-green"
                >
                    {loading ? 'Cargando...' : 'Actualizar'}
                </button>
            </div>

            <p className="text-manglar-secondary text-lg">
                Revisa tus recientes creaciones y contenido generado por IA.
            </p>

            {loading && history.length === 0 ? (
                <div className="flex justify-center p-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-manglar-green"></div>
                </div>
            ) : history.length === 0 ? (
                <div className="bg-white p-12 rounded-xl border border-gray-100 text-center shadow-sm">
                    <HistoryIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-xl font-medium text-gray-500">Tu historial está vacío</h3>
                    <p className="text-gray-400 mt-2">Aún no has generado ningún material con COCOCIEM.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {history.map((item) => (
                        <div key={item.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex flex-col md:flex-row md:items-start justify-between">
                                <div className="mb-4 md:mb-0">
                                    <span className="inline-block px-3 py-1 rounded-full bg-manglar-light-green text-manglar-green text-xs font-semibold uppercase tracking-wider mb-2">
                                        {getToolTitle(item.tool_id)}
                                    </span>
                                    <p className="text-sm text-gray-500 mb-2">
                                        Generado el {formatDate(item.created_at)}
                                    </p>

                                    <div className="bg-gray-50 p-3 rounded-lg text-sm font-mono text-gray-600 mb-4 whitespace-pre-wrap overflow-x-auto max-h-32">
                                        {"Configuración de Usuario:\\n"}
                                        {JSON.stringify(item.prompt_data, null, 2)}
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-4 mt-2">
                                <h4 className="text-sm font-bold text-gray-700 mb-2">Resultado:</h4>
                                <div className="text-gray-600 text-sm max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                                    {typeof item.generated_result === 'string' ? (
                                        <pre className="whitespace-pre-wrap font-sans">{item.generated_result}</pre>
                                    ) : (
                                        <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded-lg border border-gray-200">{JSON.stringify(item.generated_result, null, 2)}</pre>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
