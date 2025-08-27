'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Target, Zap, AlertCircle, RefreshCw } from 'lucide-react';
import { format, parseISO, differenceInDays } from 'date-fns';
import { Plan, WeekPlan } from '@/lib/plan/types';
import { WeekView } from '@/components/app/WeekView';
import { FullPlanView } from '@/components/app/FullPlanView';
import { RaceCard } from '@/components/app/RaceCard';
import { CoachInsights } from '@/components/app/CoachInsights';

type TabType = 'this-week' | 'full-plan';

interface Race {
  id: string;
  name: string;
  location: string;
  date: string;
  distance: 'HALF' | 'FULL';
}

interface UserData {
  raceSelection?: {
    race: Race;
  };
}

export default function AppPage() {
  const [activeTab, setActiveTab] = useState<TabType>('this-week');
  const [plan, setPlan] = useState<Plan | null>(null);
  const [currentWeek, setCurrentWeek] = useState<WeekPlan | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const fetchPlan = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Fetch full plan
      const planResponse = await fetch('/api/plan');
      if (!planResponse.ok) {
        const errorData = await planResponse.json();
        throw new Error(errorData.error || 'Failed to fetch plan');
      }
      const planData = await planResponse.json();
      setPlan(planData);

      // Fetch current week
      const weekResponse = await fetch('/api/plan?week=current');
      if (!weekResponse.ok) {
        const errorData = await weekResponse.json();
        throw new Error(errorData.error || 'Failed to fetch current week');
      }
      const weekData = await weekResponse.json();
      setCurrentWeek(weekData);

      // Fetch user/race data
      const userResponse = await fetch('/api/race-selection');
      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUserData(userData);
      }

    } catch (err) {
      console.error('Error fetching plan:', err);
      setError(err instanceof Error ? err.message : 'Failed to load training plan');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlan();
  }, []);

  const tabs = [
    { id: 'this-week' as const, label: 'This Week', icon: Calendar },
    { id: 'full-plan' as const, label: 'Full Plan', icon: Target },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-red-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your training plan...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-6">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Unable to Load Plan</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          
          {error.includes('No race selected') ? (
            <a
              href="/onboarding"
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Complete Setup
            </a>
          ) : (
            <button
              onClick={fetchPlan}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </button>
          )}
        </div>
      </div>
    );
  }

  const race = userData?.raceSelection?.race;
  const daysToRace = race ? differenceInDays(parseISO(race.date), new Date()) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Your Training Dashboard
          </h1>
          <p className="text-gray-600">
            AI-powered training plan tailored to your goals
          </p>
        </div>

        {/* Race Card */}
        {race && (
          <div className="mb-8">
            <RaceCard race={race} daysToRace={daysToRace} />
          </div>
        )}

        {/* Coach Insights */}
        {plan && (
          <div className="mb-8">
            <CoachInsights plan={plan} />
          </div>
        )}

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-red-500 text-red-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'this-week' ? (
            currentWeek ? (
              <WeekView week={currentWeek} plan={plan} />
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">No current week data available</p>
              </div>
            )
          ) : plan ? (
            <FullPlanView plan={plan} />
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">No plan data available</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}