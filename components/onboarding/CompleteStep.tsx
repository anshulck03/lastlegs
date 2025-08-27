'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Zap, Target, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Confetti } from '@/components/ui/Confetti';
import { OnboardingData } from '@/types/onboarding';

interface CompleteStepProps {
  data: OnboardingData;
}

export function CompleteStep({ data }: CompleteStepProps) {
  const router = useRouter();

  const handleViewPlan = () => {
    router.push('/app');
  };

  return (
    <div className="text-center">
      <Confetti />
      
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="mb-8"
      >
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          You're all set!
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Your personalized training plan is ready. Let's get you to the finish line.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        <div className="p-4 bg-red-50 rounded-lg">
          <Zap className="w-8 h-8 text-red-600 mx-auto mb-2" />
          <h3 className="font-medium text-gray-900">AI-Powered</h3>
          <p className="text-sm text-gray-600">
            Intelligent coaching insights tailored to your progress
          </p>
        </div>
        
        <div className="p-4 bg-blue-50 rounded-lg">
          <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <h3 className="font-medium text-gray-900">Goal-Focused</h3>
          <p className="text-sm text-gray-600">
            Every workout designed to get you race-ready
          </p>
        </div>
        
        <div className="p-4 bg-green-50 rounded-lg">
          <Calendar className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <h3 className="font-medium text-gray-900">Adaptive</h3>
          <p className="text-sm text-gray-600">
            Plan adjusts to your schedule and preferences
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <button
          onClick={handleViewPlan}
          className="px-8 py-4 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors text-lg"
        >
          View Your Training Plan
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-8 text-sm text-gray-500"
      >
        <p>Ready to crush your goals? Let's make it happen. 🏁</p>
      </motion.div>
    </div>
  );
}