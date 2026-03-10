import { supabase } from './supabaseClient';
import { GenerationHistory } from '../types';

export const historyService = {
    /**
     * Obtiene todo el historial almacenado ordenado del más reciente al más antiguo.
     */
    async getHistory(): Promise<GenerationHistory[]> {
        try {
            const { data, error } = await supabase
                .from('generations_history')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetched history:', error);
                return [];
            }

            return data || [];
        } catch (e) {
            console.error('Unexpected error fetching history:', e);
            return [];
        }
    },

    /**
     * Inserta un nuevo registro de generación en Supabase.
     */
    async saveGeneration(record: GenerationHistory): Promise<void> {
        try {
            const { error } = await supabase
                .from('generations_history')
                .insert([record]);

            if (error) {
                console.error('Error saving history record:', error);
            }
        } catch (e) {
            console.error('Unexpected error saving history:', e);
        }
    }
};
