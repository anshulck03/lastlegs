'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { OnboardingData, FITNESS_LEVELS, STRENGTH_PRIORITIES, DISTANCE_OPTIONS } from '@/types/onboarding';

interface ProfileStepProps {
  data: OnboardingData;
  updateData: (updates: Partial<OnboardingData>) => void;
  onNext: () => void;
  isLoading: boolean;
}

export function ProfileStep({ data, updateData, onNext, isLoading }: ProfileStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateAndNext = () => {
    const newErrors: Record<string, string> = {};

    if (!data.age || data.age < 16 || data.age > 80) {
      newErrors.age = 'Please enter a valid age (16-80)';
    }

    if (!data.distancePreference) {
      newErrors.distancePreference = 'Please select a race distance';
    }

    if (!data.fitnessLevel) {
      newErrors.fitnessLevel = 'Please select your fitness level';
    }

    if (!data.strengthPriority) {
      newErrors.strengthPriority = 'Please select your strength priority';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onNext();
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Let's get to know you
        </h2>
        <p className="text-gray-600">
          We'll use this information to create a personalized training plan that fits your goals and experience.
        </p>
      </div>

      <div className="space-y-8">
        {/* Age */}
        <div>
          <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
            Age *
          </label>
          <input
            type="number"
            id="age"
            min="16"
            max="80"
            value={data.age || ''}
            onChange={(e) => updateData({ age: parseInt(e.target.value) || undefined })}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
              errors.age ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter your age"
          />
          {errors.age && (
            <p className="mt-1 text-sm text-red-600">{errors.age}</p>
          )}
        </div>

        {/* Race Distance */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Target Race Distance *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DISTANCE_OPTIONS.map((option) => (
              <motion.button
                key={option.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => updateData({ distancePreference: option.value })}
                className={`p-4 border-2 rounded-lg text-left transition-colors ${
                  data.distancePreference === option.value
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium text-gray-900">{option.label}</div>
                <div className="text-sm text-gray-600 mt-1">{option.description}</div>
              </motion.button>
            ))}
          </div>
          {errors.distancePreference && (
            <p className="mt-2 text-sm text-red-600">{errors.distancePreference}</p>
          )}
        </div>

        {/* Fitness Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Current Fitness Level *
          </label>
          <div className="space-y-3">
            {FITNESS_LEVELS.map((level) => (
              <motion.button
                key={level.value}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => updateData({ fitnessLevel: level.value })}
                className={`w-full p-4 border-2 rounded-lg text-left transition-colors ${
                  data.fitnessLevel === level.value
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium text-gray-900">{level.label}</div>
                <div className="text-sm text-gray-600 mt-1">{level.description}</div>
              </motion.button>
            ))}
          </div>
          {errors.fitnessLevel && (
            <p className="mt-2 text-sm text-red-600">{errors.fitnessLevel}</p>
          )}
        </div>

        {/* Strength Priority */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Strength Training Priority *
          </label>
          <div className="space-y-3">
            {STRENGTH_PRIORITIES.map((priority) => (
              <motion.button
                key={priority.value}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => updateData({ strengthPriority: priority.value })}
                className={`w-full p-4 border-2 rounded-lg text-left transition-colors ${
                  data.strengthPriority === priority.value
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium text-gray-900">{priority.label}</div>
                <div className="text-sm text-gray-600 mt-1">{priority.description}</div>
              </motion.button>
            ))}
          </div>
          {errors.strengthPriority && (
            <p className="mt-2 text-sm text-red-600">{errors.strengthPriority}</p>
          )}
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={validateAndNext}
          disabled={isLoading}
          className="px-8 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
        >
          Continue
        </motion.button>
      </div>
    </div>
  );
}