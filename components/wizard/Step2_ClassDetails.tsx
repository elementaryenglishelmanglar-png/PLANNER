import React from 'react';
import { LessonData } from '../../types';
import { TargetIcon } from '../icons/TargetIcon';
import { TEACHING_METHODOLOGIES } from './constants';

interface Props {
  data: LessonData;
  updateData: (update: Partial<LessonData>) => void;
}

export const Step2_ClassDetails: React.FC<Props> = ({ data, updateData }) => {
  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-manglar-green/10 rounded-full">
          <TargetIcon className="w-6 h-6 text-manglar-green" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Detalles de la Clase</h2>
          <p className="text-gray-500">Proporciona información detallada para la planificación.</p>
        </div>
      </div>
      
      <div className="space-y-6">
        <div>
          <label htmlFor="methodology" className="block text-sm font-medium text-gray-700 mb-1">Metodología de enseñanza</label>
          <select
            id="methodology"
            value={data.methodology}
            onChange={(e) => updateData({ methodology: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-manglar-green focus:border-manglar-green transition duration-150 ease-in-out bg-white"
          >
            <option value="" disabled>Selecciona una metodología</option>
            {TEACHING_METHODOLOGIES.map(method => (
              <option key={method.name} value={method.name}>{method.name}</option>
            ))}
          </select>
          {data.methodology && (
            <p className="mt-2 text-sm text-gray-500">
              {TEACHING_METHODOLOGIES.find(m => m.name === data.methodology)?.description}
            </p>
          )}
        </div>
        
        <div>
          <label htmlFor="learning-objectives" className="block text-sm font-medium text-gray-700 mb-1">¿Qué quieres que tus estudiantes aprendan con esta clase?</label>
          <textarea
            id="learning-objectives"
            rows={6}
            value={data.learningObjectives}
            onChange={(e) => updateData({ learningObjectives: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-manglar-green focus:border-manglar-green transition duration-150 ease-in-out bg-gray-50"
            placeholder="Describe los principales conceptos y habilidades que quieres que tus estudiantes desarrollen."
          />
        </div>
      </div>
    </div>
  );
};