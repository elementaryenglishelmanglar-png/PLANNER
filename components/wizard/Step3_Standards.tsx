import React from 'react';
import { LessonData } from '../../types';
import { GlobeIcon } from '../icons/GlobeIcon';
import { COUNTRIES } from './constants';

interface Props {
  data: LessonData;
  updateData: (update: Partial<LessonData>) => void;
}

export const Step3_Standards: React.FC<Props> = ({ data, updateData }) => {
  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-manglar-green/10 rounded-full">
          <GlobeIcon className="w-6 h-6 text-manglar-green" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Estándares y Contexto</h2>
          <p className="text-gray-500">Alinea tu plan con los estándares y el contexto de tus estudiantes.</p>
        </div>
      </div>
      
      <div className="space-y-6">
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">País para estándares educativos (opcional)</label>
          <select
            id="country"
            value={data.country}
            onChange={(e) => updateData({ country: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-manglar-green focus:border-manglar-green transition duration-150 ease-in-out bg-white"
          >
            <option value="">Selecciona un país</option>
            {COUNTRIES.map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="standards" className="block text-sm font-medium text-gray-700 mb-1">¿Hay algún estándar o currículo específico que debas seguir?</label>
          <textarea
            id="standards"
            rows={4}
            value={data.standards}
            onChange={(e) => updateData({ standards: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-manglar-green focus:border-manglar-green transition duration-150 ease-in-out bg-gray-50"
            placeholder="Ej: [México] Nueva Escuela Mexicana (NEM), Common Core (USA), etc."
          />
        </div>
        
        <div>
          <label htmlFor="student-context" className="block text-sm font-medium text-gray-700 mb-1">Describe brevemente a tus estudiantes (opcional)</label>
          <textarea
            id="student-context"
            rows={4}
            value={data.studentContext}
            onChange={(e) => updateData({ studentContext: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-manglar-green focus:border-manglar-green transition duration-150 ease-in-out bg-gray-50"
            placeholder="Ej: Nivel de conocimiento previo, intereses, necesidades especiales, etc."
          />
        </div>
      </div>
    </div>
  );
};