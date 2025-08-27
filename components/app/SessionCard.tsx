'use client';

import { Clock, MapPin, Target, Waves, Bike, User } from 'lucide-react';
import { Session } from '@/lib/plan/types';

interface SessionCardProps {
  session: Session;
}

export function SessionCard({ session }: SessionCardProps) {
  const getSportIcon = (sport: string) => {
    switch (sport) {
      case 'SWIM':
        return Waves;
      case 'BIKE':
        return Bike;
      case 'RUN':
        return Target;
      case 'STRENGTH':
        return User;
      default:
        return Target;
    }
  };

  const getSportColor = (sport: string) => {
    switch (sport) {
      case 'SWIM':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'BIKE':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'RUN':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'STRENGTH':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const Icon = getSportIcon(session.sport);
  const colorClass = getSportColor(session.sport);

  return (
    <div className={`p-4 rounded-lg border-2 ${colorClass} ${session.isBrick ? 'ring-2 ring-yellow-300' : ''}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5" />
          <div>
            <h5 className="font-medium">{session.label}</h5>
            {session.notes && (
              <p className="text-sm opacity-75 mt-1">{session.notes}</p>
            )}
          </div>
        </div>
        
        <div className="text-right text-sm">
          {session.durationMin && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{session.durationMin}min</span>
            </div>
          )}
          {session.distanceKm && (
            <div className="flex items-center gap-1 mt-1">
              <MapPin className="w-4 h-4" />
              <span>{session.distanceKm.toFixed(1)}km</span>
            </div>
          )}
        </div>
      </div>
      
      {session.isBrick && (
        <div className="mt-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full inline-block">
          Brick Session
        </div>
      )}
    </div>
  );
}