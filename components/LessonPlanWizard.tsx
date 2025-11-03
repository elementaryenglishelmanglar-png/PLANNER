import React, { useState } from 'react';
import { LessonData } from '../types';

import { Step1_BasicInfo } from './wizard/Step1_BasicInfo';
import { Step2_ClassDetails } from './wizard/Step2_ClassDetails';
import { Step3_Standards } from './wizard/Step3_Standards';
import { Step4_Duration } from './wizard/Step4_Duration';
import { Step5_Preview } from './wizard/Step5_Preview';
import { Stepper } from './wizard/Stepper';
import { MagicWandIcon } from './icons/MagicWandIcon';

interface LessonPlanWizardProps {
  onGenerate: (data: LessonData) => void;
}

const TOTAL_STEPS = 5;

export const LessonPlanWizard: React.FC<LessonPlanWizardProps> = ({ onGenerate }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<LessonData>({
    topic: '',
    levels: [],
    subject: '',
    skill: '',
    methodology: '',
    learningObjectives: '',
    country: '',
    standards: '',
    studentContext: '',
    duration: 1,
  });

  const nextStep = () => setStep(prev => Math.min(prev + 1, TOTAL_STEPS));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));
  const goToStep = (stepNumber: number) => setStep(stepNumber);

  const updateData = (update: Partial<LessonData>) => {
    setData(prev => ({ ...prev, ...update }));
  };
  
  const isStep1Valid = data.topic.trim() !== '' && data.levels.length > 0 && data.subject.trim() !== '' && (data.subject !== 'Inglés' || data.skill.trim() !== '');
  const isStep2Valid = data.methodology.trim() !== '' && data.learningObjectives.trim() !== '';

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 space-y-8 animate-fade-in max-w-4xl mx-auto">
        <Stepper currentStep={step} totalSteps={TOTAL_STEPS} setStep={goToStep} />

        <div className="min-h-[400px]">
            {step === 1 && <Step1_BasicInfo data={data} updateData={updateData} />}
            {step === 2 && <Step2_ClassDetails data={data} updateData={updateData} />}
            {step === 3 && <Step3_Standards data={data} updateData={updateData} />}
            {step === 4 && <Step4_Duration data={data} updateData={updateData} />}
            {step === 5 && <Step5_Preview data={data} />}
        </div>

        <div className="flex justify-between items-center">
            <button
                onClick={prevStep}
                disabled={step === 1}
                className="px-6 py-2 text-base font-medium rounded-lg text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                Atrás
            </button>

            {step < TOTAL_STEPS - 1 && (
                 <button
                    onClick={nextStep}
                    disabled={(step === 1 && !isStep1Valid) || (step === 2 && !isStep2Valid)}
                    className="px-6 py-2 text-base font-medium rounded-lg text-white bg-manglar-green hover:bg-manglar-green/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-manglar-green disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Siguiente
                </button>
            )}

            {step === TOTAL_STEPS - 1 && (
                 <button
                    onClick={() => setStep(TOTAL_STEPS)}
                    className="px-6 py-2 text-base font-medium rounded-lg text-white bg-manglar-green hover:bg-manglar-green/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-manglar-green disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Ver Detalles
                </button>
            )}

            {step === TOTAL_STEPS && (
                <button
                    onClick={() => onGenerate(data)}
                    className="inline-flex items-center justify-center px-6 py-2 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-manglar-green hover:bg-manglar-green/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-manglar-green disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    <MagicWandIcon className="w-5 h-5 mr-2" />
                    Generar Planeación
                </button>
            )}
        </div>
    </div>
  );
};
