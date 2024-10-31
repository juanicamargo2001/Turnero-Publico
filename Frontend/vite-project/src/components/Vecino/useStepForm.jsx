import { useState } from 'react';

export const useStepForm = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  return {
    currentStep,
    nextStep,
    prevStep,
  };
};
