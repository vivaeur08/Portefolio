import { useRef, useCallback } from 'react';
import { Candy, LevelData, Profile, Settings } from '@/types';
import { useGame } from '@/hooks/useGame';
import { CANDY_EMOJIS, CANDY_COLORS, COLORBLIND_SHAPES } from '@/utils/gameLogic';
import { cn } from '@/utils/cn';

interface GameBoardProps {
  level: LevelData;
  profile: Profile;
  settings: Settings;
  onComplete: (score: number, stars: number, maxCombo: number, timeBonus: number) => void;
  onGameOver: (score: number) => void;
  onExit: () => void;
  onUseBooster: (type: 'hammer' | 'bomb' | 'rainbow') => boolean;
}

export function GameBoard({ level, profile, settings, onComplete, onGameOver, onExit, onUseBooster }: GameBoardProps) {
  const {
    grid,
    score,
    moves,
    combo,
    maxComboInGame,
    isAnimating,
    selectedCandy,
    showCombo,
    progress,
    boosterMode,
    handleCandyClick,
    handleDrag,
    activateBooster,
    cancelBoosterMode
  } = useGame({
    level,
    profile,
    onComplete,
    onGameOver,
    soundEnabled: settings.soundEnabled
  });
  
  const touchStartRef = useRef<{ row: number; col: number; x: number; y: number } | null>(null);
  
  const handleTouchStart = useCallback((e: React.TouchEvent, row: number, col: number) => {
    const touch = e.touches[0];
    touchStartRef.current = { row, col, x: touch.clientX, y: touch.clientY };
  }, []);
  
  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    
    const touch = e.changedTouches[0];
    const { row, col, x, y } = touchStartRef.current;
    
    const dx = touch.clientX - x;
    const dy = touch.clientY - y;
    const threshold = 30;
    
    if (Math.abs(dx) < threshold && Math.abs(dy) < threshold) {
      handleCandyClick(row, col);
    } else if (!boosterMode) {
      let toRow = row;
      let toCol = col;
      
      if (Math.abs(dx) > Math.abs(dy)) {
        toCol = dx > 0 ? col + 1 : col - 1;
      } else {
        toRow = dy > 0 ? row + 1 : row - 1;
      }
      
      if (toRow >= 0 && toRow < grid.length && toCol >= 0 && toCol < grid[0].length) {
        handleDrag(row, col, toRow, toCol);
      }
    }
    
    touchStartRef.current = null;
  }, [handleCandyClick, handleDrag, grid, boosterMode]);
  
  const handleBoosterClick = (type: 'hammer' | 'bomb' | 'rainbow') => {
    // Check if player has the booster
    if (profile.boosters[type] <= 0) return;
    
    // If clicking the same booster that's already active, cancel it
    if (boosterMode === type) {
      cancelBoosterMode();
      return;
    }
    
    // Try to activate the booster
    if (activateBooster(type)) {
      // Booster activated - will consume when candy is selected
    }
  };
  
  // When booster mode completes (candy was selected), consume the booster
  const handleCandyClickWrapper = useCallback((row: number, col: number) => {
    const currentBoosterMode = boosterMode;
    handleCandyClick(row, col);
    
    // If we were in booster mode and clicked a valid candy, consume the booster
    if (currentBoosterMode && grid[row][col]) {
      onUseBooster(currentBoosterMode);
    }
  }, [handleCandyClick, boosterMode, grid, onUseBooster]);
  
  const renderCandy = (candy: Candy | null, row: number, col: number) => {
    if (!candy) return null;
    
    const isSelected = selectedCandy?.row === row && selectedCandy?.col === col;
    const emoji = settings.colorBlindMode 
      ? COLORBLIND_SHAPES[candy.type % COLORBLIND_SHAPES.length]
      : CANDY_EMOJIS[candy.type % CANDY_EMOJIS.length];
    
    return (
      <div
        key={candy.id}
        className={cn(
          "absolute inset-0.5 rounded-xl flex items-center justify-center text-2xl transition-all duration-200",
          "bg-gradient-to-br shadow-md",
          CANDY_COLORS[candy.type % CANDY_COLORS.length],
          isSelected && "ring-4 ring-white scale-110 z-10",
          candy.isNew && "animate-bounce-in",
          candy.isMatched && "animate-pop-out scale-0 opacity-0",
          candy.special === 'striped-h' && "before:absolute before:inset-y-2 before:inset-x-0 before:bg-white/40 before:rounded",
          candy.special === 'striped-v' && "before:absolute before:inset-x-2 before:inset-y-0 before:bg-white/40 before:rounded",
          candy.special === 'wrapped' && "ring-2 ring-yellow-300",
          candy.special === 'color-bomb' && "bg-gradient-to-br from-gray-700 to-gray-900 animate-pulse",
          boosterMode && "cursor-crosshair"
        )}
        onTouchStart={(e) => handleTouchStart(e, row, col)}
        onTouchEnd={handleTouchEnd}
        onClick={() => handleCandyClickWrapper(row, col)}
      >
        {settings.colorBlindMode ? (
          <span className="text-white font-bold drop-shadow">{emoji}</span>
        ) : (
          <span className="drop-shadow">{emoji}</span>
        )}
        {candy.special === 'color-bomb' && <span className="absolute text-lg">💫</span>}
      </div>
    );
  };
  
  const cellSize = Math.min(
    (window.innerWidth - 32) / (grid[0]?.length || 6),
    (window.innerHeight - 280) / (grid.length || 6),
    48
  );
  
  return (
    <div className={cn(
      "min-h-screen flex flex-col",
      settings.darkMode 
        ? "bg-gray-900" 
        : "bg-gradient-to-b from-purple-500 via-pink-500 to-orange-400"
    )}>
      {/* Header */}
      <div className={cn(
        "p-4 flex items-center justify-between",
        settings.darkMode ? "bg-gray-800" : "bg-black/20"
      )}>
        <button
          onClick={onExit}
          className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white text-xl"
        >
          ←
        </button>
        
        <div className="text-center">
          <div className="text-white text-sm opacity-80">Niveau {level.id}</div>
          <div className="text-white font-bold text-xl">{score.toLocaleString()}</div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-center">
            <div className="text-white text-xs opacity-80">Combo</div>
            <div className="text-yellow-300 font-bold text-sm">
              🔥 {maxComboInGame}
            </div>
          </div>
          <div className="text-center">
            <div className="text-white text-sm opacity-80">Coups</div>
            <div className={cn(
              "font-bold text-xl",
              moves <= 5 ? "text-red-300" : "text-white"
            )}>
              {moves}
            </div>
          </div>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="px-4 py-2">
        <div className={cn(
          "h-4 rounded-full overflow-hidden",
          settings.darkMode ? "bg-gray-700" : "bg-white/30"
        )}>
          <div 
            className={cn(
              "h-full transition-all duration-300 flex items-center justify-end pr-1",
              progress >= 100 
                ? "bg-gradient-to-r from-green-400 to-emerald-400" 
                : "bg-gradient-to-r from-yellow-400 to-orange-400"
            )}
            style={{ width: `${progress}%` }}
          >
            {progress >= 100 && <span className="text-xs">⭐</span>}
          </div>
        </div>
        <div className="flex justify-between text-xs text-white/80 mt-1">
          <span>0</span>
          <span className={cn(progress >= 100 && "text-green-300 font-bold")}>
            {progress >= 100 ? "✓ Objectif atteint!" : `Objectif: ${level.targetScore.toLocaleString()}`}
          </span>
        </div>
      </div>
      
      {/* Booster Mode Indicator */}
      {boosterMode && (
        <div className="mx-4 mb-2 p-3 rounded-xl bg-yellow-400 text-yellow-900 text-center font-medium flex items-center justify-center gap-2">
          <span className="text-xl">
            {boosterMode === 'hammer' ? '🔨' : boosterMode === 'bomb' ? '💣' : '🌈'}
          </span>
          <span>
            {boosterMode === 'hammer' 
              ? 'Touche un bonbon pour le détruire' 
              : boosterMode === 'bomb'
              ? 'Touche un bonbon pour exploser la zone 3x3'
              : 'Touche un bonbon pour détruire tous ceux de cette couleur'}
          </span>
          <button 
            onClick={cancelBoosterMode}
            className="ml-2 w-6 h-6 rounded-full bg-yellow-600 text-white text-sm flex items-center justify-center"
          >
            ✕
          </button>
        </div>
      )}
      
      {/* Combo Display */}
      {showCombo && combo > 1 && (
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
          <div className="text-4xl font-bold text-white drop-shadow-lg animate-bounce">
            {combo}x COMBO! 🔥
          </div>
        </div>
      )}
      
      {/* Game Grid */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div 
          className={cn(
            "rounded-2xl p-2",
            settings.darkMode ? "bg-gray-800" : "bg-white/20",
            boosterMode && "ring-4 ring-yellow-400"
          )}
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${grid[0]?.length || 6}, ${cellSize}px)`,
            gridTemplateRows: `repeat(${grid.length}, ${cellSize}px)`,
            gap: '2px'
          }}
        >
          {grid.map((row, rowIndex) =>
            row.map((candy, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={cn(
                  "relative rounded-lg",
                  settings.darkMode ? "bg-gray-700" : "bg-white/10"
                )}
                style={{ width: cellSize, height: cellSize }}
              >
                {renderCandy(candy, rowIndex, colIndex)}
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* Boosters */}
      <div className={cn(
        "p-4 flex justify-center gap-4",
        settings.darkMode ? "bg-gray-800" : "bg-black/20"
      )}>
        {[
          { type: 'hammer' as const, icon: '🔨', label: 'Marteau', count: profile.boosters.hammer, desc: 'Détruire 1' },
          { type: 'bomb' as const, icon: '💣', label: 'Bombe', count: profile.boosters.bomb, desc: 'Zone 3x3' },
          { type: 'rainbow' as const, icon: '🌈', label: 'Arc-en-ciel', count: profile.boosters.rainbow, desc: 'Couleur' },
        ].map(booster => (
          <button
            key={booster.type}
            onClick={() => handleBoosterClick(booster.type)}
            disabled={booster.count <= 0 || isAnimating}
            className={cn(
              "flex flex-col items-center p-3 rounded-xl transition-all min-w-[70px]",
              booster.count > 0 && !isAnimating
                ? boosterMode === booster.type
                  ? "bg-yellow-400 text-yellow-900 scale-110 ring-2 ring-white"
                  : "bg-white/20 active:scale-95" 
                : "bg-white/10 opacity-50"
            )}
          >
            <span className="text-2xl">{booster.icon}</span>
            <span className={cn(
              "text-xs mt-1",
              boosterMode === booster.type ? "text-yellow-900" : "text-white"
            )}>
              {booster.desc}
            </span>
            <span className={cn(
              "text-sm font-bold",
              boosterMode === booster.type ? "text-yellow-900" : "text-white"
            )}>
              {booster.count}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
