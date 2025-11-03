import React from 'react';
import { LessonData } from '../../types';
import { ClipboardCheckIcon } from '../icons/ClipboardCheckIcon';

interface Props {
  data: LessonData;
}

const DetailItem: React.FC<{ label: string; value?: string | string[] | number }> = ({ label, value }) => {
  if (!value || (Array.isArray(value) && value.length === 0)) {
    return null;
  }
  const displayValue = Array.isArray(value) ? value.join(', ') : value;
  return (
    <div>
      <h4 className="text-sm font-medium text-gray-500">{label}</h4>
      <p className="text-base text-gray-800">{displayValue}</p>
    </div>
  );
};

export const Step5_Preview: React.FC<Props> = ({ data }) => {
  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-manglar-green/10 rounded-full">
          <ClipboardCheckIcon className="w-6 h-6 text-manglar-green" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Vista previa de tu planeación</h2>
          <p className="text-gray-500">Revisa los detalles antes de generar tu planeación.</p>
        </div>
      </div>
      
      <div className="bg-gray-50 p-6 rounded-lg space-y-4">
        <DetailItem label="Tema de la clase" value={data.topic} />
        <DetailItem label="Detalles" value={`${data.levels.join(', ')} - ${data.subject}`} />
        {data.skill && <DetailItem label="Skill" value={data.skill} />}
        <DetailItem label="Metodología" value={data.methodology} />
        <DetailItem label="Contenido" value={data.learningObjectives} />
        <DetailItem label="País" value={data.country} />
        <DetailItem label="Estándares y objetivos" value={data.standards} />
        <DetailItem label="Duración" value={`${data.duration} lecciones`} />
      </div>
    </div>
  );
};
