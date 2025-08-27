'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ProfileStep } from './ProfileStep';
import { PreferencesStep } from './PreferencesStep';
import { RaceSelectionStep } from './RaceSelectionStep';
import { CompleteStep } from './CompleteStep';
import { ProgressStepper } from '@/components/ui/ProgressStepper';
import { OnboardingData, ONBOARDING_STEPS } from '@/types/onboarding';

export function OnboardingWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({});
  const [isLoading, setIsLoading] = useState(false);

  const updateData = (updates: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <ProfileStep
            data={data}
            updateData={updateData}
            onNext={nextStep}
            isLoading={isLoading}
          />
        );
      case 1:
        return (
          <PreferencesStep
            data={data}
            updateData={updateData}
            onNext={nextStep}
            onPrev={prevStep}
            isLoading={isLoading}
          />
        );
      case 2:
        return (
          <RaceSelectionStep
            data={data}
            updateData={updateData}
            onNext={nextStep}
            onPrev={prevStep}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        );
      case 3:
        return (
          <CompleteStep
            data={data}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <ProgressStepper
            steps={ONBOARDING_STEPS}
            currentStep={currentStep}
          />
        </div>

        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8"
        >
          {renderStep()}
        </motion.div>
      </div>
    </div>
  );
}