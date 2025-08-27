'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface Step {
  id: string;
  title: string;
  description: string;
}

interface ProgressStepperProps {
  steps: Step[];
  currentStep: number;
}

export function ProgressStepper({ steps, currentStep }: ProgressStepperProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            {/* Step Circle */}
            <div className="relative">
              <motion.div
                initial={false}
                animate={{
                  backgroundColor: index <= currentStep ? '#dc2626' : '#e5e7eb',
                  scale: index === currentStep ? 1.1 : 1,
                }}
                className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-transparent"
              >
                {index < currentStep ? (
                  <Check className="w-5 h-5 text-white" />
                ) : (
                  <span className={`text-sm font-medium ${
                    index <= currentStep ? 'text-white' : 'text-gray-500'
                  }`}>
                    {index + 1}
                  </span>
                )}
              </motion.div>
              
              {/* Step Label */}
              <div className="absolute top-12 left-1/2 transform -translate-x-1/2 text-center min-w-max">
                <div className={`text-sm font-medium ${
                  index <= currentStep ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {step.title}
                </div>
                <div className="text-xs text-gray-500 mt-1 max-w-24">
                  {step.description}
                </div>
              </div>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <motion.div
                initial={false}
                animate={{
                  backgroundColor: index < currentStep ? '#dc2626' : '#e5e7eb',
                }}
                className="h-0.5 w-full mx-4"
                style={{ minWidth: '60px' }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}