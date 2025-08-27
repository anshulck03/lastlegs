'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, RefreshCw, AlertCircle } from 'lucide-react';
import { Plan } from '@/lib/plan/types';

interface CoachInsightsProps {
  plan: Plan;
}

export function CoachInsights({ plan }: CoachInsightsProps) {
  const [overviewText, setOverviewText] = useState<string>('');
  const [constraintsText, setConstraintsText] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const fetchOverview = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const response = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'PLAN_OVERVIEW' }),
      });

      if (response.ok) {
        const data = await response.json();
        setOverviewText(data.text || '');
      } else {
        throw new Error('Failed to fetch coach insights');
      }
    } catch (err) {
      console.error('Error fetching coach insights:', err);
      setError('Unable to load AI insights');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchConstraints = async () => {
    try {
      const response = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'CONSTRAINT_TRANSLATION' }),
      });

      if (response.ok) {
        const data = await response.json();
        setConstraintsText(data.text || '');
      }
    } catch (err) {
      console.error('Error fetching constraint insights:', err);
    }
  };

  useEffect(() => {
    fetchOverview();
    
    // Only fetch constraints if they exist
    const profileHasConstraints = true; // We'll assume constraints exist for now
    if (profileHasConstraints) {
      fetchConstraints();
    }
  }, [plan]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Brain className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900">AI Coach Insights</h3>
          <p className="text-sm text-gray-600">Analytical overview of your training plan</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="w-5 h-5 text-gray-400 animate-spin mr-2" />
          <span className="text-gray-600">Loading insights...</span>
        </div>
      ) : error ? (
        <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
          <button
            onClick={fetchOverview}
            className="text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {overviewText && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Training Overview</h4>
              <p className="text-blue-800 text-sm leading-relaxed">{overviewText}</p>
            </div>
          )}
          
          {constraintsText && (
            <div className="p-4 bg-amber-50 rounded-lg">
              <h4 className="font-medium text-amber-900 mb-2">Constraint Adaptations</h4>
              <p className="text-amber-800 text-sm leading-relaxed">{constraintsText}</p>
            </div>
          )}

          {!overviewText && !constraintsText && !isLoading && !error && (
            <p className="text-gray-500 text-center py-4">
              AI insights will appear here once your plan is generated.
            </p>
          )}
        </div>
      )}
    </motion.div>
  );
}