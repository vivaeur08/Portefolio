import { Profile, Settings } from '@/types';
import { cn } from '@/utils/cn';
import { soundManager } from '@/utils/sounds';

interface DailyRewardProps {
  profile: Profile;
  settings: Settings;
  onClaim: (rewards: { coins: number; booster?: string }) => void;
  onClose: () => void;
}

const DAILY_REWARDS = [
  { day: 1, coins: 50, icon: '🪙' },
  { day: 2, coins: 75, icon: '🪙' },
  { day: 3, coins: 100, booster: 'hammer', icon: '🔨' },
  { day: 4, coins: 125, icon: '🪙' },
  { day: 5, coins: 150, booster: 'bomb', icon: '💣' },
  { day: 6, coins: 200, icon: '💰' },
  { day: 7, coins: 500, booster: 'rainbow', icon: '🌈' },
];

export function DailyReward({ profile, settings, onClaim, onClose }: DailyRewardProps) {
  const today = new Date().toDateString();
  const canClaim = profile.lastDailyReward !== today;
  const currentDay = (profile.dailyRewardDay % 7) + 1;
  const todayReward = DAILY_REWARDS.find(r => r.day === currentDay) || DAILY_REWARDS[0];
  
  const handleClaim = () => {
    if (!canClaim) return;
    
    soundManager.reward();
    onClaim({
      coins: todayReward.coins,
      booster: todayReward.booster
    });
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className={cn(
        "w-full max-w-sm rounded-3xl overflow-hidden",
        settings.darkMode ? "bg-gray-800" : "bg-white"
      )}>
        {/* Header */}
        <div className={cn(
          "p-6 text-center",
          settings.darkMode 
            ? "bg-gradient-to-r from-purple-600 to-pink-600" 
            : "bg-gradient-to-r from-purple-400 to-pink-400"
        )}>
          <div className="text-5xl mb-2">🎁</div>
          <h2 className="text-2xl font-bold text-white">Récompense Quotidienne</h2>
          <p className="text-white/80 text-sm mt-1">
            Jour {currentDay} / 7
          </p>
        </div>
        
        {/* Rewards Calendar */}
        <div className="p-4">
          <div className="grid grid-cols-7 gap-1 mb-4">
            {DAILY_REWARDS.map((reward) => {
              const isPast = reward.day < currentDay;
              const isCurrent = reward.day === currentDay;
              const isFuture = reward.day > currentDay;
              
              return (
                <div
                  key={reward.day}
                  className={cn(
                    "aspect-square rounded-lg flex flex-col items-center justify-center text-xs p-1 transition-all",
                    isPast && (settings.darkMode ? "bg-green-900/50" : "bg-green-100"),
                    isCurrent && canClaim && "bg-gradient-to-br from-yellow-400 to-orange-400 scale-110 ring-2 ring-yellow-300 z-10",
                    isCurrent && !canClaim && (settings.darkMode ? "bg-gray-700" : "bg-gray-200"),
                    isFuture && (settings.darkMode ? "bg-gray-700" : "bg-gray-100")
                  )}
                >
                  <span className="text-lg">{isPast ? '✓' : reward.icon}</span>
                  <span className={cn(
                    "text-[10px] font-medium",
                    isCurrent && canClaim ? "text-white" : 
                    settings.darkMode ? "text-gray-400" : "text-gray-500"
                  )}>
                    J{reward.day}
                  </span>
                </div>
              );
            })}
          </div>
          
          {/* Today's Reward */}
          <div className={cn(
            "p-4 rounded-2xl text-center mb-4",
            canClaim 
              ? "bg-gradient-to-r from-yellow-100 to-orange-100" 
              : settings.darkMode ? "bg-gray-700" : "bg-gray-100"
          )}>
            <div className="text-4xl mb-2">{todayReward.icon}</div>
            <div className={cn(
              "font-bold text-lg",
              settings.darkMode && !canClaim ? "text-white" : "text-gray-800"
            )}>
              {todayReward.coins} pièces
              {todayReward.booster && ` + 1 ${
                todayReward.booster === 'hammer' ? 'Marteau' :
                todayReward.booster === 'shuffle' ? 'Mélangeur' : 'Arc-en-ciel'
              }`}
            </div>
            {!canClaim && (
              <p className={cn(
                "text-sm mt-2",
                settings.darkMode ? "text-gray-400" : "text-gray-500"
              )}>
                Reviens demain pour ta prochaine récompense !
              </p>
            )}
          </div>
          
          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => {
                soundManager.buttonClick();
                onClose();
              }}
              className={cn(
                "flex-1 py-3 rounded-xl font-medium transition-all active:scale-95",
                settings.darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-600"
              )}
            >
              Fermer
            </button>
            {canClaim && (
              <button
                onClick={handleClaim}
                className="flex-1 py-3 rounded-xl font-medium bg-gradient-to-r from-yellow-400 to-orange-400 text-white transition-all active:scale-95"
              >
                Récupérer ! 🎉
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
