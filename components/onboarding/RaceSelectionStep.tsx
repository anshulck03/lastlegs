'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { differenceInWeeks, parseISO, format } from 'date-fns';
import { Calendar, MapPin, ExternalLink, AlertTriangle } from 'lucide-react';
import { OnboardingData } from '@/types/onboarding';

interface Race {
  id: string;
  name: string;
  location: string;
  date: string;
  distance: 'HALF' | 'FULL';
  status: 'OPEN' | 'CLOSED' | 'WAITLIST';
  registrationUrl?: string;
  description?: string;
}

interface RaceSelectionStepProps {
  data: OnboardingData;
  updateData: (updates: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export function RaceSelectionStep({
  data,
  updateData,
  onNext,
  onPrev,
  isLoading,
  setIsLoading,
}: RaceSelectionStepProps) {
  const [races, setRaces] = useState<Race[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchRaces = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/races?distance=${data.distancePreference}&limit=12`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch races');
        }
        
        const racesData = await response.json();
        setRaces(racesData);
      } catch (err) {
        setError('Failed to load races. Please try again.');
        console.error('Error fetching races:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (data.distancePreference) {
      fetchRaces();
    }
  }, [data.distancePreference, setIsLoading]);

  const getWeeksToRace = (raceDate: string) => {
    const today = new Date();
    const race = parseISO(raceDate);
    return differenceInWeeks(race, today);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'WAITLIST':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'CLOSED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleRaceSelect = async (raceId: string) => {
    try {
      setIsLoading(true);
      
      // Select the race via API
      const response = await fetch('/api/race-selection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ raceId }),
      });

      if (!response.ok) {
        throw new Error('Failed to select race');
      }

      updateData({ selectedRaceId: raceId });
      onNext();
    } catch (err) {
      setError('Failed to select race. Please try again.');
      console.error('Error selecting race:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedRace = races.find(race => race.id === data.selectedRaceId);
  const shortRunwayRaces = races.filter(race => getWeeksToRace(race.date) < 16);

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Choose Your Target Race
        </h2>
        <p className="text-gray-600">
          Select the {data.distancePreference?.toLowerCase()} distance race you want to train for.
        </p>
      </div>

      {shortRunwayRaces.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg"
        >
          <div className="flex items-center gap-2 text-amber-800">
            <AlertTriangle className="w-4 h-4" />
            <span className="font-medium">Short Training Window</span>
          </div>
          <p className="text-sm text-amber-700 mt-1">
            Some races have less than 16 weeks of preparation time. Consider switching to a closer distance or selecting a race with more preparation time for optimal training.
          </p>
        </motion.div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="p-6 border border-gray-200 rounded-lg">
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : races.length > 0 ? (
        <div className="grid gap-4 mb-8">
          {races.map((race) => {
            const weeksToRace = getWeeksToRace(race.date);
            const isShortRunway = weeksToRace < 16;
            
            return (
              <motion.div
                key={race.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleRaceSelect(race.id)}
                className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                  data.selectedRaceId === race.id
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                } ${isShortRunway ? 'bg-amber-50' : ''}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{race.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {race.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {format(parseISO(race.date), 'MMM d, yyyy')}
                      </div>
                      <div className="font-medium">
                        {weeksToRace} weeks away
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(race.status)}`}>
                      {race.status === 'OPEN' ? 'Open' : race.status === 'WAITLIST' ? 'Waitlist' : 'Closed'}
                    </span>
                    {isShortRunway && (
                      <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded">
                        Short runway
                      </span>
                    )}
                  </div>
                </div>

                {race.description && (
                  <p className="text-gray-600 text-sm mb-4">{race.description}</p>
                )}

                {race.registrationUrl && (
                  <div className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700">
                    <ExternalLink className="w-4 h-4" />
                    <span>View race details</span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600">No races found for {data.distancePreference?.toLowerCase()} distance.</p>
        </div>
      )}

      <div className="flex justify-between">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onPrev}
          disabled={isLoading}
          className="px-8 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
        >
          Back
        </motion.button>
        
        {selectedRace && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onNext}
            disabled={isLoading}
            className="px-8 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            Continue with {selectedRace.name}
          </motion.button>
        )}
      </div>
    </div>
  );
}