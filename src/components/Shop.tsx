import { Profile, Settings } from '@/types';
import { cn } from '@/utils/cn';
import { soundManager } from '@/utils/sounds';

interface ShopProps {
  profile: Profile;
  settings: Settings;
  onBuyBooster: (type: 'hammer' | 'bomb' | 'rainbow', cost: number) => void;
  onClose: () => void;
}

const SHOP_ITEMS = [
  { type: 'hammer' as const, icon: '🔨', name: 'Marteau', desc: 'Détruit 1 bonbon', cost: 100 },
  { type: 'bomb' as const, icon: '💣', name: 'Bombe', desc: 'Détruit une zone 3x3', cost: 150 },
  { type: 'rainbow' as const, icon: '🌈', name: 'Arc-en-ciel', desc: 'Détruit une couleur', cost: 250 },
];

export function Shop({ profile, settings, onBuyBooster, onClose }: ShopProps) {
  const handleBuy = (type: 'hammer' | 'bomb' | 'rainbow', cost: number) => {
    if (profile.coins >= cost) {
      onBuyBooster(type, cost);
    } else {
      soundManager.error();
    }
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
            ? "bg-gradient-to-r from-yellow-600 to-orange-600" 
            : "bg-gradient-to-r from-yellow-400 to-orange-400"
        )}>
          <div className="text-5xl mb-2">🛒</div>
          <h2 className="text-2xl font-bold text-white">Boutique</h2>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="text-2xl">🪙</span>
            <span className="text-xl font-bold text-white">{profile.coins.toLocaleString()}</span>
          </div>
        </div>
        
        {/* Items */}
        <div className="p-4 space-y-3">
          <h3 className={cn(
            "text-sm font-medium uppercase tracking-wide mb-2",
            settings.darkMode ? "text-gray-400" : "text-gray-500"
          )}>
            Boosters
          </h3>
          
          {SHOP_ITEMS.map((item) => {
            const canAfford = profile.coins >= item.cost;
            const currentCount = profile.boosters[item.type];
            
            return (
              <div
                key={item.type}
                className={cn(
                  "flex items-center gap-3 p-4 rounded-xl",
                  settings.darkMode ? "bg-gray-700" : "bg-gray-50"
                )}
              >
                <span className="text-3xl">{item.icon}</span>
                <div className="flex-1">
                  <div className={cn(
                    "font-medium",
                    settings.darkMode ? "text-white" : "text-gray-800"
                  )}>
                    {item.name}
                  </div>
                  <div className={cn(
                    "text-sm",
                    settings.darkMode ? "text-gray-400" : "text-gray-500"
                  )}>
                    {item.desc}
                  </div>
                  <div className={cn(
                    "text-xs mt-1",
                    settings.darkMode ? "text-gray-500" : "text-gray-400"
                  )}>
                    Possédés: {currentCount}
                  </div>
                </div>
                <button
                  onClick={() => handleBuy(item.type, item.cost)}
                  disabled={!canAfford}
                  className={cn(
                    "px-4 py-2 rounded-xl font-medium flex items-center gap-1 transition-all active:scale-95",
                    canAfford
                      ? "bg-gradient-to-r from-yellow-400 to-orange-400 text-white"
                      : settings.darkMode 
                        ? "bg-gray-600 text-gray-400" 
                        : "bg-gray-200 text-gray-400"
                  )}
                >
                  <span>🪙</span>
                  <span>{item.cost}</span>
                </button>
              </div>
            );
          })}
          
          {/* Info */}
          <div className={cn(
            "p-3 rounded-xl text-center text-sm",
            settings.darkMode ? "bg-gray-700/50 text-gray-400" : "bg-gray-100 text-gray-500"
          )}>
            💡 Gagne des pièces en complétant des niveaux et en obtenant des étoiles !
          </div>
        </div>
        
        {/* Close Button */}
        <div className="p-4 pt-0">
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
