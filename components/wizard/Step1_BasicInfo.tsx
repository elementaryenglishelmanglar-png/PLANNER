import React, { useState, useRef, useEffect } from 'react';
import { LessonData } from '../../types';
import { BookOpenIcon } from '../icons/BookOpenIcon';
import { ChevronDownIcon } from '../icons/ChevronDownIcon';
import { XIcon } from '../icons/XIcon';
import { SUBJECTS, EDUCATION_LEVELS, ENGLISH_SKILLS } from './constants';

interface Props {
  data: LessonData;
  updateData: (update: Partial<LessonData>) => void;
}

export const Step1_BasicInfo: React.FC<Props> = ({ data, updateData }) => {
  const [isLevelDropdownOpen, setIsLevelDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLevelSelect = (level: string) => {
    const newLevels = data.levels.includes(level)
      ? data.levels.filter(l => l !== level)
      : [...data.levels, level];
    updateData({ levels: newLevels });
  };
  
  const handleRemoveLevel = (level: string) => {
    updateData({ levels: data.levels.filter(l => l !== level) });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsLevelDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-manglar-green/10 rounded-full">
          <BookOpenIcon className="w-6 h-6 text-manglar-green" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Información Básica</h2>
          <p className="text-gray-500">Comienza dando un nombre a tu clase, Nivel Educativo y Materia.</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">¿Nombre de la clase o tema?</label>
          <input
            type="text"
            id="topic"
            value={data.topic}
            onChange={(e) => updateData({ topic: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-manglar-green focus:border-manglar-green transition duration-150 ease-in-out bg-gray-50"
            placeholder="Ej: La independencia de Colombia"
          />
        </div>

        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <div ref={dropdownRef} className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nivel educativo (puedes seleccionar varios)</label>
                <button
                    type="button"
                    onClick={() => setIsLevelDropdownOpen(!isLevelDropdownOpen)}
                    className="w-full flex justify-between items-center p-3 bg-white border border-gray-300 rounded-lg text-left"
                >
                    <span>{data.levels.length > 0 ? `${data.levels.length} seleccionado(s)` : 'Selecciona el nivel'}</span>
                    <ChevronDownIcon className={`w-5 h-5 transition-transform ${isLevelDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {isLevelDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {EDUCATION_LEVELS.map(level => (
                        <div key={level} className="flex items-center p-2 hover:bg-gray-100">
                        <input
                            type="checkbox"
                            id={`level-${level}`}
                            checked={data.levels.includes(level)}
                            onChange={() => handleLevelSelect(level)}
                            className="h-4 w-4 text-manglar-green border-gray-300 rounded focus:ring-manglar-green"
                        />
                        <label htmlFor={`level-${level}`} className="ml-3 block text-sm text-gray-900">{level}</label>
                        </div>
                    ))}
                    </div>
                )}
                {data.levels.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                        {data.levels.map(level => (
                            <div key={level} className="flex items-center bg-manglar-green/10 text-manglar-green text-sm font-medium px-2.5 py-1 rounded-full">
                                {level}
                                <button onClick={() => handleRemoveLevel(level)} className="ml-1.5">
                                    <XIcon className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            
            <a href="#" className="inline-block text-sm text-manglar-green hover:underline p-2 rounded-md bg-manglar-green/10">
                Ver equivalencia de grados por país
            </a>

            <div className="space-y-4">
                <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Materia</label>
                    <select
                        id="subject"
                        value={data.subject}
                        onChange={(e) => {
                            const newSubject = e.target.value;
                            const update: Partial<LessonData> = { subject: newSubject };
                            if (newSubject !== 'Inglés') {
                                update.skill = '';
                            }
                            updateData(update);
                        }}
                        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-manglar-green focus:border-manglar-green transition duration-150 ease-in-out bg-white"
                    >
                        <option value="" disabled>Selecciona la materia</option>
                        {SUBJECTS.map(subject => <option key={subject} value={subject}>{subject}</option>)}
                    </select>
                </div>
                {data.subject === 'Inglés' && (
                    <div className="animate-fade-in">
                        <label htmlFor="skill" className="block text-sm font-medium text-gray-700 mb-1">Skill</label>
                        <select
                            id="skill"
                            value={data.skill}
                            onChange={(e) => updateData({ skill: e.target.value })}
                            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-manglar-green focus:border-manglar-green transition duration-150 ease-in-out bg-white"
                        >
                            <option value="" disabled>Selecciona la skill</option>
                            {ENGLISH_SKILLS.map(skill => <option key={skill} value={skill}>{skill}</option>)}
                        </select>
                    </div>
                )}
            </div>
        </div>

      </div>
    </div>
  );
};
