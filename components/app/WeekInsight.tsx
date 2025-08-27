'use client';

import { useState, useEffect } from 'react';
import { Brain, RefreshCw, AlertCircle } from 'lucide-react';

interface WeekInsightProps {
  weekIndex: number;
}

export function WeekInsight({ weekIndex }: WeekInsightProps) {
  const [insight, setInsight] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const fetchInsight = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const response = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type: 'WEEKLY_EXPLANATION',
          weekIndex 
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setInsight(data.text || '');
      } else {
        throw new Error('Failed to fetch insight');
      }
    } catch (err) {
      console.error('Error fetching week insight:', err);
      setError('Unable to load AI insights');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInsight();
  }, [weekIndex]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-4 bg-blue-50 rounded-lg">
        <RefreshCw className="w-4 h-4 text-blue-600 animate-spin mr-2" />
        <span className="text-blue-700 text-sm">Loading AI insights...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
        <div className="flex items-center gap-2 text-red-700">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">{error}</span>
        </div>
        <button
          onClick={fetchInsight}
          className="text-sm text-red-600 hover:text-red-700 font-medium"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!insight) {
    return null;
  }

  return (
    <div className="p-4 bg-blue-50 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <Brain className="w-4 h-4 text-blue-600" />
        <h5 className="font-medium text-blue-900">AI Coach Insights</h5>
      </div>
      <p className="text-blue-800 text-sm leading-relaxed">{insight}</p>
    </div>
  );
}