import { Profile, Settings } from '@/types';
import { LEVELS } from '@/utils/gameLogic';
import { cn } from '@/utils/cn';
import { soundManager } from '@/utils/sounds';

interface LevelSelectProps {
  profile: Profile;
  settings: Settings;
  onSelectLevel: (levelId: number) => void;
  onBack: () => void;
  onOpenLeaderboard: () => void;
  onOpenSettings: () => void;
  onOpenAchievements: () => void;
  onOpenDailyReward: () => void;
  onOpenShop: () => void;
}

export function LevelSelect({ 
  profile, 
  settings, 
  onSelectLevel, 
  onBack,
  onOpenLeaderboard,
  onOpenSettings,
  onOpenAchievements,
  onOpenDailyReward,
  onOpenShop
}: LevelSelectProps) {
  
  const canClaimDailyReward = () => {
    const today = new Date().toDateString();
    return profile.lastDailyReward !== today;
  };
  
  return (
    <div className={cn(
      "min-h-screen flex flex-col",
      settings.darkMode 
        ? "bg-gray-900" 
        : "bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500"
    )}>
      {/* Header */}
      <div className={cn(
        "p-4 flex items-center justify-between",
        settings.darkMode ? "bg-gray-800" : "bg-black/20"
      )}>
        <button
          onClick={() => {
            soundManager.buttonClick();
            onBack();
          }}
          className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white text-xl"
        >
          ←
        </button>
        
        <div className="flex items-center gap-2">
          <img src={profile.avatar} alt="" className="w-10 h-10" />
          <div>
            <div className="text-white font-bold">{profile.name}</div>
            <div className="text-white/70 text-xs">Niveau {profile.currentLevel}</div>
          </div>
        </div>
        
        <button
          onClick={() => {
            soundManager.buttonClick();
            onOpenShop();
          }}
          className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 active:scale-95 transition-all"
        >
          🪙 {profile.coins}
        </button>
      </div>
      
      {/* Quick Actions */}
      <div className="px-4 py-3 flex gap-2 overflow-x-auto">
        <button
          onClick={() => {
            soundManager.buttonClick();
            onOpenDailyReward();
          }}
          className={cn(
            "flex-shrink-0 px-4 py-2 rounded-xl flex items-center gap-2 transition-all active:scale-95",
            canClaimDailyReward() 
              ? "bg-gradient-to-r from-yellow-400 to-orange-400 text-white animate-pulse" 
              : settings.darkMode ? "bg-gray-700 text-gray-300" : "bg-white/20 text-white"
          )}
        >
          🎁 {canClaimDailyReward() ? "Récompense!" : "Quotidien"}
        </button>
        
        <button
          onClick={() => {
            soundManager.buttonClick();
            onOpenShop();
          }}
          className={cn(
            "flex-shrink-0 px-4 py-2 rounded-xl flex items-center gap-2 transition-all active:scale-95",
            settings.darkMode ? "bg-gray-700 text-gray-300" : "bg-white/20 text-white"
          )}
        >
          🛒 Boutique
        </button>
        
        <button
          onClick={() => {
            soundManager.buttonClick();
            onOpenLeaderboard();
          }}
          className={cn(
            "flex-shrink-0 px-4 py-2 rounded-xl flex items-center gap-2 transition-all active:scale-95",
            settings.darkMode ? "bg-gray-700 text-gray-300" : "bg-white/20 text-white"
          )}
        >
          🏆 Classement
        </button>
        
        <button
          onClick={() => {
            soundManager.buttonClick();
            onOpenAchievements();
          }}
          className={cn(
            "flex-shrink-0 px-4 py-2 rounded-xl flex items-center gap-2 transition-all active:scale-95",
            settings.darkMode ? "bg-gray-700 text-gray-300" : "bg-white/20 text-white"
          )}
        >
          🏅 Succès
        </button>
        
        <button
          onClick={() => {
            soundManager.buttonClick();
            onOpenSettings();
          }}
          className={cn(
            "flex-shrink-0 px-4 py-2 rounded-xl flex items-center gap-2 transition-all active:scale-95",
            settings.darkMode ? "bg-gray-700 text-gray-300" : "bg-white/20 text-white"
          )}
        >
          ⚙️ Options
        </button>
      </div>
      
      {/* Stats */}
      <div className={cn(
        "mx-4 p-4 rounded-2xl mb-4",
        settings.darkMode ? "bg-gray-800" : "bg-white/20"
      )}>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl">⭐</div>
            <div className="text-white font-bold">{profile.totalScore.toLocaleString()}</div>
            <div className="text-white/60 text-xs">Score Total</div>
          </div>
          <div>
            <div className="text-2xl">🎮</div>
            <div className="text-white font-bold">{profile.gamesPlayed}</div>
            <div className="text-white/60 text-xs">Parties</div>
          </div>
          <div>
            <div className="text-2xl">🔥</div>
            <div className="text-white font-bold">{profile.bestCombo}</div>
            <div className="text-white/60 text-xs">Meilleur Combo</div>
          </div>
        </div>
      </div>
      
      {/* Level Grid */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <h2 className="text-white font-bold text-lg mb-3">Sélectionne un niveau</h2>
        <div className="grid grid-cols-5 gap-2">
          {LEVELS.map((level) => {
            const isUnlocked = level.id <= profile.currentLevel;
            const isCompleted = level.id < profile.currentLevel;
            
            return (
              <button
                key={level.id}
                onClick={() => {
                  if (isUnlocked) {
                    soundManager.buttonClick();
                    onSelectLevel(level.id);
                  }
                }}
                disabled={!isUnlocked}
                className={cn(
                  "aspect-square rounded-xl flex flex-col items-center justify-center transition-all relative",
                  isUnlocked 
                    ? isCompleted
                      ? settings.darkMode 
                        ? "bg-green-700 text-white active:scale-95" 
                        : "bg-gradient-to-br from-green-400 to-green-600 text-white active:scale-95"
                      : settings.darkMode
                        ? "bg-purple-700 text-white active:scale-95 ring-2 ring-yellow-400"
                        : "bg-gradient-to-br from-purple-400 to-pink-500 text-white active:scale-95 ring-2 ring-yellow-400"
                    : settings.darkMode
                      ? "bg-gray-700 text-gray-500"
                      : "bg-white/10 text-white/40"
                )}
              >
                {isUnlocked ? (
                  <>
                    <span className="font-bold text-lg">{level.id}</span>
                    {isCompleted && (
                      <div className="absolute -top-1 -right-1 text-sm">⭐</div>
                    )}
                  </>
                ) : (
                  <span className="text-lg">🔒</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
