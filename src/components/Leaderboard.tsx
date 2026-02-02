import { useState, useEffect } from 'react';
import { Profile, Settings, LeaderboardEntry } from '@/types';
import { getLocalLeaderboard, getDeviceId } from '@/utils/storage';
import { cn } from '@/utils/cn';
import { soundManager } from '@/utils/sounds';

interface LeaderboardProps {
  profile: Profile;
  settings: Settings;
  onClose: () => void;
}

export function Leaderboard({ profile, settings, onClose }: LeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [filter, setFilter] = useState<'global' | 'device'>('global');
  
  useEffect(() => {
    const entries = getLocalLeaderboard();
    setLeaderboard(entries);
  }, []);
  
  const deviceId = getDeviceId();
  
  const filteredLeaderboard = filter === 'device' 
    ? leaderboard.filter(e => e.deviceId === deviceId)
    : leaderboard;
  
  const userRank = leaderboard.findIndex(e => e.id === profile.id) + 1;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className={cn(
        "w-full max-w-md rounded-3xl overflow-hidden max-h-[90vh] flex flex-col",
        settings.darkMode ? "bg-gray-800" : "bg-white"
      )}>
        {/* Header */}
        <div className={cn(
          "p-4 text-center",
          settings.darkMode 
            ? "bg-gradient-to-r from-yellow-600 to-orange-600" 
            : "bg-gradient-to-r from-yellow-400 to-orange-400"
        )}>
          <div className="text-4xl mb-2">🏆</div>
          <h2 className="text-2xl font-bold text-white">Classement</h2>
          <p className="text-white/80 text-sm">Compétition mondiale</p>
        </div>
        
        {/* Filter Tabs */}
        <div className="flex p-2 gap-2">
          <button
            onClick={() => {
              soundManager.buttonClick();
              setFilter('global');
            }}
            className={cn(
              "flex-1 py-2 rounded-xl font-medium transition-all",
              filter === 'global' 
                ? "bg-gradient-to-r from-yellow-400 to-orange-400 text-white" 
                : settings.darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"
            )}
          >
            🌍 Mondial
          </button>
          <button
            onClick={() => {
              soundManager.buttonClick();
              setFilter('device');
            }}
            className={cn(
              "flex-1 py-2 rounded-xl font-medium transition-all",
              filter === 'device' 
                ? "bg-gradient-to-r from-yellow-400 to-orange-400 text-white" 
                : settings.darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"
            )}
          >
            📱 Cet appareil
          </button>
        </div>
        
        {/* Your Rank */}
        {userRank > 0 && (
          <div className={cn(
            "mx-4 p-3 rounded-xl mb-2",
            settings.darkMode ? "bg-purple-900/50" : "bg-purple-100"
          )}>
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center font-bold",
                settings.darkMode ? "bg-purple-700 text-white" : "bg-purple-200 text-purple-700"
              )}>
                #{userRank}
              </div>
              <img src={profile.avatar} alt="" className="w-10 h-10" />
              <div className="flex-1">
                <div className={cn(
                  "font-bold",
                  settings.darkMode ? "text-white" : "text-gray-800"
                )}>
                  {profile.name} (Toi)
                </div>
                <div className={cn(
                  "text-sm",
                  settings.darkMode ? "text-gray-400" : "text-gray-500"
                )}>
                  Niveau {profile.currentLevel}
                </div>
              </div>
              <div className={cn(
                "font-bold",
                settings.darkMode ? "text-yellow-400" : "text-yellow-600"
              )}>
                {profile.totalScore.toLocaleString()} ⭐
              </div>
            </div>
          </div>
        )}
        
        {/* Leaderboard List */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {filteredLeaderboard.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">📊</div>
              <p className={cn(
                "text-sm",
                settings.darkMode ? "text-gray-400" : "text-gray-500"
              )}>
                {filter === 'device' 
                  ? "Aucun score sur cet appareil"
                  : "Sois le premier à apparaître dans le classement !"}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredLeaderboard.slice(0, 50).map((entry, index) => {
                const rank = index + 1;
                const isCurrentUser = entry.id === profile.id;
                
                return (
                  <div
                    key={entry.id}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl transition-all",
                      isCurrentUser 
                        ? settings.darkMode ? "bg-purple-900/50 ring-2 ring-purple-500" : "bg-purple-50 ring-2 ring-purple-300"
                        : settings.darkMode ? "bg-gray-700" : "bg-gray-50"
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                      rank === 1 ? "bg-yellow-400 text-yellow-900" :
                      rank === 2 ? "bg-gray-300 text-gray-700" :
                      rank === 3 ? "bg-orange-400 text-orange-900" :
                      settings.darkMode ? "bg-gray-600 text-gray-300" : "bg-gray-200 text-gray-600"
                    )}>
                      {rank <= 3 ? ['🥇', '🥈', '🥉'][rank - 1] : rank}
                    </div>
                    
                    <img src={entry.avatar} alt="" className="w-10 h-10" />
                    
                    <div className="flex-1 min-w-0">
                      <div className={cn(
                        "font-medium truncate",
                        settings.darkMode ? "text-white" : "text-gray-800"
                      )}>
                        {entry.profileName}
                        {isCurrentUser && " (Toi)"}
                      </div>
                      <div className={cn(
                        "text-xs",
                        settings.darkMode ? "text-gray-400" : "text-gray-500"
                      )}>
                        Niveau {entry.level}
                      </div>
                    </div>
                    
                    <div className={cn(
                      "font-bold text-right",
                      settings.darkMode ? "text-yellow-400" : "text-yellow-600"
                    )}>
                      {entry.score.toLocaleString()}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        {/* Close Button */}
        <div className="p-4">
          <button
            onClick={() => {
              soundManager.buttonClick();
              onClose();
            }}
            className={cn(
              "w-full py-3 rounded-xl font-medium transition-all active:scale-95",
              settings.darkMode 
                ? "bg-gray-700 text-white" 
                : "bg-gray-200 text-gray-700"
            )}
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
