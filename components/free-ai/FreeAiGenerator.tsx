import React, { useState, useCallback, useRef, useEffect } from 'react';
import { ChatMessage } from '../../types';
import { generateFreeResponse } from '../../services/geminiService';
import { LessonPlanDisplay } from '../LessonPlanDisplay';
import { FreeIaIcon } from '../icons/FreeIaIcon';
import { SendIcon } from '../icons/SendIcon';
import { ProfePlannerIcon } from '../icons/ProfePlannerIcon';

interface FreeAiGeneratorProps {
    onBackToDashboard: () => void;
}

const QuickActionButton: React.FC<{ text: string; onClick: () => void; }> = ({ text, onClick }) => (
    <button
        onClick={onClick}
        className="text-left text-sm p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all"
    >
        <p className="font-semibold text-gray-700">{text.split(':')[0]}:</p>
        <p className="text-gray-500">{text.split(':')[1]}</p>
    </button>
);

export const FreeAiGenerator: React.FC<FreeAiGeneratorProps> = ({ onBackToDashboard }) => {
    const [conversation, setConversation] = useState<ChatMessage[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [conversation, isLoading]);

    const handleSendMessage = useCallback(async (message: string) => {
        if (isLoading || !message.trim()) return;

        const userMessage: ChatMessage = { role: 'user', content: message };
        setConversation(prev => [...prev, userMessage]);
        setIsLoading(true);
        setInputValue('');

        try {
            const response = await generateFreeResponse(message);
            const modelMessage: ChatMessage = { role: 'model', content: response };
            setConversation(prev => [...prev, modelMessage]);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Ocurrió un error desconocido.';
            const errorModelMessage: ChatMessage = { role: 'model', content: `**Error:** ${errorMessage}` };
            setConversation(prev => [...prev, errorModelMessage]);
        } finally {
            setIsLoading(false);
        }
    }, [isLoading]);

    const quickActions = [
        {
            label: "Explica un tema: como si tuviera 10 años",
            prompt: "Explica la fotosíntesis como si yo tuviera 10 años, usando analogías simples."
        },
        {
            label: "Crea ideas para un proyecto: sobre la Antigua Roma",
            prompt: "Dame 5 ideas creativas para un proyecto de clase sobre la Antigua Roma para estudiantes de secundaria."
        },
        {
            label: "Redacta un email: para los padres sobre una excursión",
            prompt: "Redacta un email breve y claro para los padres de familia informando sobre una próxima excursión al museo de ciencias."
        },
        {
            label: "Dame 3 datos curiosos: sobre los tiburones",
            prompt: "Dame 3 datos curiosos y sorprendentes sobre los tiburones para captar la atención de mis estudiantes."
        }
    ];

    return (
        <div className="flex flex-col h-full max-h-[calc(100vh-80px)] w-full bg-white rounded-2xl shadow-lg overflow-hidden animate-fade-in">
            <header className="flex-shrink-0 p-4 border-b flex justify-between items-center">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full">
                        <FreeIaIcon className="h-6 w-6 text-gray-600"/>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">IA Libre</h1>
                        <p className="text-sm text-gray-500">Tu asistente pedagógico para cualquier tarea</p>
                    </div>
                </div>
            </header>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {conversation.map((msg, index) => (
                    <div key={index} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                        {msg.role === 'model' && (
                            <div className="w-10 h-10 flex-shrink-0">
                                <ProfePlannerIcon className="w-full h-full" />
                            </div>
                        )}
                        <div className={`max-w-2xl rounded-2xl px-5 py-3 ${msg.role === 'user' ? 'bg-manglar-green text-white rounded-br-none' : 'bg-gray-100 text-manglar-black rounded-bl-none'}`}>
                            {msg.role === 'user' ? (
                                <p>{msg.content}</p>
                            ) : (
                                <LessonPlanDisplay plan={msg.content} />
                            )}
                        </div>
                    </div>
                ))}
                
                {isLoading && (
                    <div className="flex gap-4">
                        <div className="w-10 h-10 flex-shrink-0">
                            <ProfePlannerIcon />
                        </div>
                        <div className="max-w-2xl rounded-2xl px-5 py-3 bg-gray-100 text-manglar-black rounded-bl-none flex items-center">
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                )}
                 <div ref={chatEndRef} />
            </div>

            {conversation.length === 0 && !isLoading && (
                <div className="px-6 pb-6 text-center">
                     <h3 className="text-lg font-semibold text-gray-700 mb-4">Ideas para Empezar</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-4xl mx-auto">
                        {quickActions.map(action => (
                            <QuickActionButton key={action.label} text={action.label} onClick={() => setInputValue(action.prompt)} />
                        ))}
                     </div>
                </div>
            )}

            <div className="p-4 border-t bg-white">
                <form 
                    onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputValue); }}
                    className="flex items-center space-x-3 max-w-4xl mx-auto"
                >
                    <textarea
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage(inputValue);
                            }
                        }}
                        placeholder="Pregúntame cualquier cosa para tu clase..."
                        className="flex-1 p-3 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-manglar-green focus:border-manglar-green transition duration-150 ease-in-out resize-none"
                        rows={1}
                        style={{minHeight: '48px'}}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !inputValue.trim()}
                        className="w-12 h-12 flex items-center justify-center bg-manglar-green text-white rounded-full transition-colors duration-200 hover:bg-manglar-green/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-manglar-green disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        <SendIcon className="w-6 h-6" />
                    </button>
                </form>
            </div>
        </div>
    );
};
