import { Settings } from '@/types';
import { cn } from '@/utils/cn';
import { soundManager } from '@/utils/sounds';

interface LevelCompleteProps {
  levelId: number;
  score: number;
  stars: number;
  maxCombo: number;
  timeBonus: number;
  settings: Settings;
  onNextLevel: () => void;
  onReplay: () => void;
  onExit: () => void;
}

export function LevelComplete({ 
  levelId, 
  score, 
  stars,
  maxCombo,
  timeBonus,
  settings, 
  onNextLevel, 
  onReplay,
  onExit 
}: LevelCompleteProps) {
  const coinsEarned = 50 + stars * 25 + Math.floor(timeBonus / 10);
  
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className={cn(
        "w-full max-w-sm rounded-3xl overflow-hidden",
        settings.darkMode ? "bg-gray-800" : "bg-white"
      )}>
        {/* Header */}
        <div className="bg-gradient-to-r from-green-400 to-emerald-500 p-6 text-center">
          <div className="text-5xl mb-2">🎉</div>
          <h2 className="text-2xl font-bold text-white">Niveau Réussi !</h2>
          <p className="text-white/80 text-sm mt-1">Niveau {levelId}</p>
        </div>
        
        {/* Stars */}
        <div className="py-6 text-center">
          <div className="flex justify-center gap-2 text-4xl">
            {[1, 2, 3].map((star) => (
              <span 
                key={star}
                className={cn(
                  "transition-all duration-500",
                  star <= stars 
                    ? "animate-bounce-in" 
                    : "opacity-30 grayscale"
                )}
                style={{ animationDelay: `${star * 200}ms` }}
              >
                ⭐
              </span>
            ))}
          </div>
          
          <div className={cn(
            "mt-4 text-3xl font-bold",
            settings.darkMode ? "text-white" : "text-gray-800"
          )}>
            {score.toLocaleString()}
          </div>
          <p className={cn(
            "text-sm",
            settings.darkMode ? "text-gray-400" : "text-gray-500"
          )}>
            points
          </p>
        </div>
        
        {/* Stats */}
        <div className={cn(
          "mx-4 p-3 rounded-xl mb-2 flex justify-around",
          settings.darkMode ? "bg-gray-700/50" : "bg-gray-50"
        )}>
          <div className="text-center">
            <div className="text-xl">🔥</div>
            <div className={cn(
              "font-bold",
              settings.darkMode ? "text-white" : "text-gray-800"
            )}>
              {maxCombo}x
            </div>
            <div className={cn(
              "text-xs",
              settings.darkMode ? "text-gray-400" : "text-gray-500"
            )}>
              Max Combo
            </div>
          </div>
          <div className="text-center">
            <div className="text-xl">⏱️</div>
            <div className={cn(
              "font-bold",
              settings.darkMode ? "text-white" : "text-gray-800"
            )}>
              +{timeBonus}
            </div>
            <div className={cn(
              "text-xs",
              settings.darkMode ? "text-gray-400" : "text-gray-500"
            )}>
              Bonus Temps
            </div>
          </div>
        </div>
        
        {/* Rewards */}
        <div className={cn(
          "mx-4 p-4 rounded-xl mb-4",
          settings.darkMode ? "bg-gray-700" : "bg-gray-100"
        )}>
          <h3 className={cn(
            "text-sm font-medium text-center mb-3",
            settings.darkMode ? "text-gray-300" : "text-gray-600"
          )}>
            Récompenses
          </h3>
          <div className="flex justify-center gap-6">
            <div className="text-center">
              <div className="text-2xl">🪙</div>
              <div className={cn(
                "font-bold",
                settings.darkMode ? "text-white" : "text-gray-800"
              )}>
                +{coinsEarned}
              </div>
            </div>
            {stars >= 3 && (
              <div className="text-center">
                <div className="text-2xl">🔨</div>
                <div className={cn(
                  "font-bold",
                  settings.darkMode ? "text-white" : "text-gray-800"
                )}>
                  +1
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Buttons */}
        <div className="p-4 space-y-2">
          <button
            onClick={() => {
              soundManager.buttonClick();
              onNextLevel();
            }}
            className="w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-green-400 to-emerald-500 text-white transition-all active:scale-95"
          >
            Niveau Suivant →
          </button>
          
          <div className="flex gap-2">
            <button
              onClick={() => {
                soundManager.buttonClick();
                onReplay();
              }}
              className={cn(
                "flex-1 py-3 rounded-xl font-medium transition-all active:scale-95",
                settings.darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-600"
              )}
            >
              🔄 Rejouer
            </button>
            <button
              onClick={() => {
                soundManager.buttonClick();
                onExit();
              }}
              className={cn(
                "flex-1 py-3 rounded-xl font-medium transition-all active:scale-95",
                settings.darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-600"
              )}
            >
              🏠 Menu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
