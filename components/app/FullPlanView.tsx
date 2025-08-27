'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { ChevronDown, ChevronRight, Clock, Calendar, Target, Zap } from 'lucide-react';
import { Plan, WeekPlan } from '@/lib/plan/types';
import { SessionCard } from './SessionCard';
import { WeekInsight } from './WeekInsight';

interface FullPlanViewProps {
  plan: Plan;
}

export function FullPlanView({ plan }: FullPlanViewProps) {
  const [expandedWeeks, setExpandedWeeks] = useState<Set<number>>(new Set([1])); // First week expanded by default

  const toggleWeek = (weekIndex: number) => {
    const newExpanded = new Set(expandedWeeks);
    if (newExpanded.has(weekIndex)) {
      newExpanded.delete(weekIndex);
    } else {
      newExpanded.add(weekIndex);
    }
    setExpandedWeeks(newExpanded);
  };

  const phaseColors = {
    BASE: 'bg-green-100 text-green-800 border-green-200',
    BUILD: 'bg-blue-100 text-blue-800 border-blue-200',
    PEAK: 'bg-purple-100 text-purple-800 border-purple-200',
    TAPER: 'bg-orange-100 text-orange-800 border-orange-200',
  };

  const totalWeeks = plan.weeks.length;
  const currentWeekIndex = Math.floor(plan.weeks.length / 2); // Rough estimation for demo

  return (
    <div className="space-y-6">
      {/* Plan Overview */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Training Plan Overview</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <Target className="w-6 h-6 text-red-600 mx-auto mb-2" />
            <div className="font-bold text-2xl text-red-600">{plan.distance}</div>
            <div className="text-sm text-red-700">Distance</div>
          </div>
          
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Calendar className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <div className="font-bold text-2xl text-blue-600">{totalWeeks}</div>
            <div className="text-sm text-blue-700">Weeks</div>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <Clock className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <div className="font-bold text-2xl text-green-600">{plan.weeklyHoursTarget}h</div>
            <div className="text-sm text-green-700">Avg/Week</div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <Zap className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <div className="font-bold text-2xl text-purple-600">{plan.strengthPriority}</div>
            <div className="text-sm text-purple-700">Strength</div>
          </div>
        </div>

        {/* Plan Notes */}
        {plan.meta.notes.length > 0 && (
          <div className="p-4 bg-amber-50 rounded-lg">
            <h4 className="font-medium text-amber-900 mb-2">Plan Adaptations</h4>
            <ul className="space-y-1">
              {plan.meta.notes.map((note, index) => (
                <li key={index} className="text-amber-800 text-sm">• {note}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Weekly Breakdown */}
      <div className="space-y-4">
        <h3 className="font-bold text-gray-900">Weekly Breakdown</h3>
        
        {plan.weeks.map((week, index) => {
          const isExpanded = expandedWeeks.has(week.weekIndex);
          const isCurrentWeek = index === currentWeekIndex;
          const totalSessions = week.days.reduce((total, day) => total + day.sessions.length, 0);
          
          return (
            <motion.div
              key={week.weekIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-white rounded-xl shadow-sm border ${
                isCurrentWeek ? 'border-red-200 bg-red-50' : 'border-gray-100'
              }`}
            >
              {/* Week Header */}
              <button
                onClick={() => toggleWeek(week.weekIndex)}
                className="w-full p-6 text-left hover:bg-gray-50 transition-colors rounded-t-xl"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    )}
                    
                    <div>
                      <h4 className={`font-bold text-lg ${isCurrentWeek ? 'text-red-900' : 'text-gray-900'}`}>
                        Week {week.weekIndex}
                        {isCurrentWeek && ' (Current)'}
                      </h4>
                      <p className={`text-sm ${isCurrentWeek ? 'text-red-700' : 'text-gray-600'}`}>
                        {format(parseISO(week.days[0].dateISO), 'MMM d')} - {format(parseISO(week.days[6].dateISO), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className={`font-bold ${isCurrentWeek ? 'text-red-900' : 'text-gray-900'}`}>
                        {week.targetHours}h
                      </div>
                      <div className={`text-sm ${isCurrentWeek ? 'text-red-700' : 'text-gray-600'}`}>
                        {totalSessions} sessions
                      </div>
                    </div>
                    
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${phaseColors[week.phase]}`}>
                      {week.phase}
                    </span>
                  </div>
                </div>
              </button>

              {/* Week Content */}
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t border-gray-100"
                >
                  <div className="p-6 space-y-6">
                    {/* AI Week Insight */}
                    <WeekInsight weekIndex={week.weekIndex} />
                    
                    {/* Daily Sessions */}
                    <div className="grid gap-4">
                      {week.days.map((day) => {
                        const dayName = format(parseISO(day.dateISO), 'EEEE');
                        const isToday = format(new Date(), 'yyyy-MM-dd') === day.dateISO;
                        
                        return (
                          <div
                            key={day.dateISO}
                            className={`p-4 rounded-lg border ${
                              isToday ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <h5 className={`font-medium ${isToday ? 'text-red-900' : 'text-gray-900'}`}>
                                {dayName} - {format(parseISO(day.dateISO), 'MMM d')}
                                {isToday && ' (Today)'}
                              </h5>
                              <span className={`text-sm ${isToday ? 'text-red-700' : 'text-gray-600'}`}>
                                {day.sessions.length} sessions
                              </span>
                            </div>
                            
                            {day.sessions.length > 0 ? (
                              <div className="space-y-2">
                                {day.sessions.map((session, sessionIndex) => (
                                  <SessionCard key={sessionIndex} session={session} />
                                ))}
                              </div>
                            ) : (
                              <div className={`text-center py-3 ${isToday ? 'text-red-600' : 'text-gray-500'}`}>
                                <div className="font-medium">Rest Day</div>
                                <div className="text-sm">Recovery and regeneration</div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}