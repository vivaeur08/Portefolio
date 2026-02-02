import { Settings } from '@/types';
import { cn } from '@/utils/cn';
import { soundManager } from '@/utils/sounds';

interface GameOverProps {
  levelId: number;
  score: number;
  targetScore: number;
  settings: Settings;
  onRetry: () => void;
  onExit: () => void;
}

export function GameOver({ 
  levelId, 
  score, 
  targetScore,
  settings, 
  onRetry,
  onExit 
}: GameOverProps) {
  const progress = Math.min(100, (score / targetScore) * 100);
  
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className={cn(
        "w-full max-w-sm rounded-3xl overflow-hidden",
        settings.darkMode ? "bg-gray-800" : "bg-white"
      )}>
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-400 to-red-500 p-6 text-center">
          <div className="text-5xl mb-2">😔</div>
          <h2 className="text-2xl font-bold text-white">Plus de coups !</h2>
          <p className="text-white/80 text-sm mt-1">Niveau {levelId}</p>
        </div>
        
        {/* Score */}
        <div className="py-6 text-center">
          <div className={cn(
            "text-3xl font-bold",
            settings.darkMode ? "text-white" : "text-gray-800"
          )}>
            {score.toLocaleString()}
          </div>
          <p className={cn(
            "text-sm",
            settings.darkMode ? "text-gray-400" : "text-gray-500"
          )}>
            sur {targetScore.toLocaleString()} points
          </p>
          
          {/* Progress */}
          <div className={cn(
            "mx-8 mt-4 h-3 rounded-full overflow-hidden",
            settings.darkMode ? "bg-gray-700" : "bg-gray-200"
          )}>
            <div 
              className="h-full bg-gradient-to-r from-orange-400 to-red-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className={cn(
            "text-xs mt-2",
            settings.darkMode ? "text-gray-400" : "text-gray-500"
          )}>
            {Math.round(progress)}% de l'objectif
          </p>
        </div>
        
        {/* Tips */}
        <div className={cn(
          "mx-4 p-4 rounded-xl mb-4",
          settings.darkMode ? "bg-gray-700" : "bg-gray-100"
        )}>
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <p className={cn(
              "text-sm",
              settings.darkMode ? "text-gray-300" : "text-gray-600"
            )}>
              Astuce : Essaie de créer des combos en enchaînant les matchs pour multiplier tes points !
            </p>
          </div>
        </div>
        
        {/* Buttons */}
        <div className="p-4 space-y-2">
          <button
            onClick={() => {
              soundManager.buttonClick();
              onRetry();
            }}
            className="w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-purple-400 to-pink-500 text-white transition-all active:scale-95"
          >
            🔄 Réessayer
          </button>
          
          <button
            onClick={() => {
              soundManager.buttonClick();
              onExit();
            }}
            className={cn(
              "w-full py-3 rounded-xl font-medium transition-all active:scale-95",
              settings.darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-600"
            )}
          >
            🏠 Retour au menu
          </button>
        </div>
      </div>
    </div>
  );
}
