import React from 'react';
import { LessonData } from '../../types';
import { CalendarIcon } from '../icons/CalendarIcon';
import { MinusIcon } from '../icons/MinusIcon';
import { PlusIcon } from '../icons/PlusIcon';

interface Props {
  data: LessonData;
  updateData: (update: Partial<LessonData>) => void;
}

export const Step4_Duration: React.FC<Props> = ({ data, updateData }) => {
  
  const handleDurationChange = (amount: number) => {
    const newDuration = Math.max(1, data.duration + amount);
    updateData({ duration: newDuration });
  };

  return (
    <div className="space-y-8 flex flex-col items-center justify-center text-center h-full pt-10">
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-manglar-green/10 rounded-full">
          <CalendarIcon className="w-6 h-6 text-manglar-green" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Duración de la Clase</h2>
          <p className="text-gray-500">Define cuántas lecciones incluirá tu plan.</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <label className="block text-lg font-medium text-gray-700">Lecciones</label>
        <div className="flex items-center justify-center space-x-4">
          <button 
            onClick={() => handleDurationChange(-1)} 
            disabled={data.duration <= 1}
            className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-300 bg-white disabled:opacity-50"
          >
            <MinusIcon className="w-6 h-6" />
          </button>
          <span className="text-4xl font-bold w-24 text-center">{data.duration}</span>
          <button 
            onClick={() => handleDurationChange(1)}
            className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-300 bg-white"
          >
            <PlusIcon className="w-6 h-6" />
          </button>
        </div>
        <p className="text-sm text-gray-500">1 lección = 1 clase de 40-60 min aprox.</p>
      </div>
    </div>
  );
};