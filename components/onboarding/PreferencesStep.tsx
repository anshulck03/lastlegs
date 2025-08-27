'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { OnboardingData } from '@/types/onboarding';

interface PreferencesStepProps {
  data: OnboardingData;
  updateData: (updates: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
  isLoading: boolean;
}

export function PreferencesStep({ data, updateData, onNext, onPrev, isLoading }: PreferencesStepProps) {
  const [showConstraints, setShowConstraints] = useState(false);

  const facilities = data.facilities || {};

  const updateFacility = (facility: string, available: boolean) => {
    updateData({
      facilities: {
        ...facilities,
        [facility]: available,
      },
    });
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Training Preferences
        </h2>
        <p className="text-gray-600">
          Help us customize your training plan to fit your schedule and available facilities.
        </p>
      </div>

      <div className="space-y-8">
        {/* Weekly Hours */}
        <div>
          <label htmlFor="weeklyHours" className="block text-sm font-medium text-gray-700 mb-2">
            Available Training Hours per Week (optional)
          </label>
          <input
            type="number"
            id="weeklyHours"
            min="3"
            max="25"
            value={data.weeklyHours || ''}
            onChange={(e) => updateData({ weeklyHours: parseInt(e.target.value) || undefined })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="Leave blank for default recommendations"
          />
          <p className="mt-1 text-sm text-gray-500">
            We'll use default recommendations based on your distance and fitness level if not specified.
          </p>
        </div>

        {/* Facilities */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Available Facilities
          </label>
          <div className="grid grid-cols-2 gap-4">
            {[
              { key: 'pool', label: 'Swimming Pool' },
              { key: 'gym', label: 'Gym/Weights' },
              { key: 'treadmill', label: 'Treadmill' },
              { key: 'trainer', label: 'Bike Trainer' },
            ].map(({ key, label }) => (
              <motion.button
                key={key}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => updateFacility(key, !facilities[key as keyof typeof facilities])}
                className={`p-4 border-2 rounded-lg text-center transition-colors ${
                  facilities[key as keyof typeof facilities]
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <div className="font-medium">{label}</div>
                <div className="text-sm mt-1">
                  {facilities[key as keyof typeof facilities] ? 'Available' : 'Not Available'}
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Constraints */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="text-sm font-medium text-gray-700">
              Training Constraints (optional)
            </label>
            <button
              type="button"
              onClick={() => setShowConstraints(!showConstraints)}
              className="text-sm text-red-600 hover:text-red-700"
            >
              {showConstraints ? 'Hide' : 'Add constraints'}
            </button>
          </div>
          
          {showConstraints && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <textarea
                value={data.constraints || ''}
                onChange={(e) => updateData({ constraints: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="e.g., Can't train on weekends, injured knee, prefer morning workouts..."
              />
              <p className="mt-1 text-sm text-gray-500">
                Let us know about any injuries, schedule limitations, or training preferences.
              </p>
            </motion.div>
          )}
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onPrev}
          disabled={isLoading}
          className="px-8 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
        >
          Back
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onNext}
          disabled={isLoading}
          className="px-8 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
        >
          Continue
        </motion.button>
      </div>
    </div>
  );
}