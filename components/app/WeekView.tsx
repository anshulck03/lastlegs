'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { Clock, Calendar, Zap, RefreshCw, AlertCircle } from 'lucide-react';
import { WeekPlan, Plan, Session } from '@/lib/plan/types';
import { SessionCard } from './SessionCard';

interface WeekViewProps {
  week: WeekPlan;
  plan: Plan | null;
}

export function WeekView({ week, plan }: WeekViewProps) {
  const [weeklyInsight, setWeeklyInsight] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const fetchWeeklyInsight = async () => {
    if (!week) return;
    
    try {
      setIsLoading(true);
      setError('');
      
      const response = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type: 'WEEKLY_EXPLANATION',
          weekIndex: week.weekIndex 
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setWeeklyInsight(data.text || '');
      } else {
        throw new Error('Failed to fetch weekly insight');
      }
    } catch (err) {
      console.error('Error fetching weekly insight:', err);
      setError('Unable to load AI insights for this week');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWeeklyInsight();
  }, [week]);

  const totalSessions = week.days.reduce((total, day) => total + day.sessions.length, 0);
  const phaseColors = {
    BASE: 'bg-green-100 text-green-800',
    BUILD: 'bg-blue-100 text-blue-800',
    PEAK: 'bg-purple-100 text-purple-800',
    TAPER: 'bg-orange-100 text-orange-800',
  };

  return (
    <div className="space-y-6">
      {/* Week Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Week {week.weekIndex}
            </h2>
            <p className="text-gray-600">
              {format(parseISO(week.days[0].dateISO), 'MMM d')} - {format(parseISO(week.days[6].dateISO), 'MMM d, yyyy')}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{week.targetHours}h</div>
              <div className="text-sm text-gray-600">Target</div>
            </div>
            
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${phaseColors[week.phase]}`}>
              {week.phase}
            </span>
          </div>
        </div>

        {/* Week Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <Calendar className="w-5 h-5 text-gray-600 mx-auto mb-1" />
            <div className="font-medium text-gray-900">{totalSessions}</div>
            <div className="text-sm text-gray-600">Sessions</div>
          </div>
          
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <Clock className="w-5 h-5 text-gray-600 mx-auto mb-1" />
            <div className="font-medium text-gray-900">{week.targetHours}h</div>
            <div className="text-sm text-gray-600">Volume</div>
          </div>
          
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <Zap className="w-5 h-5 text-gray-600 mx-auto mb-1" />
            <div className="font-medium text-gray-900">{week.phase}</div>
            <div className="text-sm text-gray-600">Phase</div>
          </div>
        </div>
      </div>

      {/* AI Weekly Insight */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-900 mb-4">This Week's Focus</h3>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <RefreshCw className="w-5 h-5 text-gray-400 animate-spin mr-2" />
            <span className="text-gray-600">Loading weekly insights...</span>
          </div>
        ) : error ? (
          <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
            <button
              onClick={fetchWeeklyInsight}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Retry
            </button>
          </div>
        ) : weeklyInsight ? (
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-800 leading-relaxed">{weeklyInsight}</p>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">
            Weekly insights will appear here.
          </p>
        )}
      </div>

      {/* Daily Schedule */}
      <div className="space-y-4">
        <h3 className="font-bold text-gray-900">Daily Schedule</h3>
        
        <div className="grid gap-4">
          {week.days.map((day, index) => {
            const dayName = format(parseISO(day.dateISO), 'EEEE');
            const isToday = format(new Date(), 'yyyy-MM-dd') === day.dateISO;
            
            return (
              <motion.div
                key={day.dateISO}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white rounded-xl p-6 shadow-sm border ${
                  isToday ? 'border-red-200 bg-red-50' : 'border-gray-100'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className={`font-bold ${isToday ? 'text-red-900' : 'text-gray-900'}`}>
                      {dayName}
                    </h4>
                    <p className={`text-sm ${isToday ? 'text-red-700' : 'text-gray-600'}`}>
                      {format(parseISO(day.dateISO), 'MMM d')}
                      {isToday && ' (Today)'}
                    </p>
                  </div>
                  
                  <div className={`text-right ${isToday ? 'text-red-700' : 'text-gray-600'}`}>
                    <div className="font-medium">{day.sessions.length} sessions</div>
                    <div className="text-sm">
                      {day.sessions.reduce((total, session) => total + (session.durationMin || 0), 0)}min
                    </div>
                  </div>
                </div>

                {day.sessions.length > 0 ? (
                  <div className="space-y-3">
                    {day.sessions.map((session, sessionIndex) => (
                      <SessionCard key={sessionIndex} session={session} />
                    ))}
                  </div>
                ) : (
                  <div className={`text-center py-4 ${isToday ? 'text-red-600' : 'text-gray-500'}`}>
                    <div className="font-medium">Rest Day</div>
                    <div className="text-sm">Recovery and regeneration</div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}