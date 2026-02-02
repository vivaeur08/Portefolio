import { Profile, Settings } from '@/types';
import { ACHIEVEMENTS } from '@/utils/achievements';
import { cn } from '@/utils/cn';
import { soundManager } from '@/utils/sounds';

interface AchievementsProps {
  profile: Profile;
  settings: Settings;
  onClose: () => void;
}

export function Achievements({ profile, settings, onClose }: AchievementsProps) {
  const unlockedCount = profile.achievements.length;
  const totalCount = ACHIEVEMENTS.length;
  const progress = (unlockedCount / totalCount) * 100;
  
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
            ? "bg-gradient-to-r from-amber-600 to-yellow-600" 
            : "bg-gradient-to-r from-amber-400 to-yellow-400"
        )}>
          <div className="text-4xl mb-2">🏅</div>
          <h2 className="text-2xl font-bold text-white">Succès</h2>
          <p className="text-white/80 text-sm">
            {unlockedCount} / {totalCount} débloqués
          </p>
          
          {/* Progress Bar */}
          <div className="mt-3 bg-white/30 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        
        {/* Achievements List */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid gap-3">
            {ACHIEVEMENTS.map((achievement) => {
              const isUnlocked = profile.achievements.includes(achievement.id);
              
              return (
                <div
                  key={achievement.id}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-xl transition-all",
                    isUnlocked 
                      ? settings.darkMode 
                        ? "bg-gradient-to-r from-amber-900/50 to-yellow-900/50 border border-amber-500/30" 
                        : "bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200"
                      : settings.darkMode 
                        ? "bg-gray-700 opacity-60" 
                        : "bg-gray-100 opacity-60"
                  )}
                >
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center text-2xl",
                    isUnlocked 
                      ? "bg-gradient-to-br from-amber-400 to-yellow-500" 
                      : settings.darkMode ? "bg-gray-600" : "bg-gray-200"
                  )}>
                    {isUnlocked ? achievement.icon : '🔒'}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className={cn(
                      "font-bold",
                      isUnlocked 
                        ? settings.darkMode ? "text-amber-300" : "text-amber-700"
                        : settings.darkMode ? "text-gray-400" : "text-gray-500"
                    )}>
                      {achievement.name}
                    </h3>
                    <p className={cn(
                      "text-sm",
                      settings.darkMode ? "text-gray-400" : "text-gray-500"
                    )}>
                      {achievement.description}
                    </p>
                  </div>
                  
                  {isUnlocked && (
                    <div className="text-2xl">✓</div>
                  )}
                </div>
              );
            })}
          </div>
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
