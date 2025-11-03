import React from 'react';

interface StepperProps {
  currentStep: number;
  totalSteps: number;
  setStep: (step: number) => void;
}

export const Stepper: React.FC<StepperProps> = ({ currentStep, totalSteps, setStep }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map(step => (
          <button
            key={step}
            onClick={() => step < currentStep && setStep(step)}
            className={`w-3 h-3 rounded-full transition-colors duration-300 ${
              currentStep === step ? 'bg-manglar-green scale-125' : 'bg-gray-300'
            } ${step < currentStep ? 'hover:bg-manglar-green/70 cursor-pointer' : 'cursor-default'}`}
            aria-label={`Go to step ${step}`}
          />
        ))}
      </div>
      <div className="text-sm font-medium text-gray-500">
        Paso {currentStep} de {totalSteps}
      </div>
    </div>
  );
};