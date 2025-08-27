'use client';

import { motion } from 'framer-motion';
import { Calendar, MapPin, Target, Clock } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface Race {
  id: string;
  name: string;
  location: string;
  date: string;
  distance: 'HALF' | 'FULL';
}

interface RaceCardProps {
  race: Race;
  daysToRace: number;
}

export function RaceCard({ race, daysToRace }: RaceCardProps) {
  const raceDate = parseISO(race.date);
  const distanceLabel = race.distance === 'HALF' ? '70.3' : '140.6';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-6 text-white shadow-lg"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5" />
            <span className="text-red-100 text-sm font-medium">TARGET RACE</span>
          </div>
          
          <h2 className="text-2xl font-bold mb-2">{race.name}</h2>
          
          <div className="flex items-center gap-6 text-red-100">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{race.location}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{format(raceDate, 'MMM d, yyyy')}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              <span>Ironman {distanceLabel}</span>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-5 h-5" />
            <span className="text-red-100 text-sm font-medium">COUNTDOWN</span>
          </div>
          
          <div className="text-3xl font-bold">
            {daysToRace}
          </div>
          
          <div className="text-red-100 text-sm">
            {daysToRace === 1 ? 'day' : 'days'} to go
          </div>
        </div>
      </div>
    </motion.div>
  );
}