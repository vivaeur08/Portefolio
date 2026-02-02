import { useState, useCallback, useRef, useEffect } from 'react';
import { Candy, LevelData, Profile } from '@/types';
import {
  createGrid,
  findMatches,
  removeMatches,
  applyGravity,
  swapCandies,
  isValidSwap,
  hasValidMoves,
  shuffleGrid
} from '@/utils/gameLogic';
import { soundManager } from '@/utils/sounds';

interface UseGameProps {
  level: LevelData;
  profile?: Profile;
  onComplete: (score: number, stars: number, maxCombo: number, timeBonus: number) => void;
  onGameOver: (score: number) => void;
  soundEnabled: boolean;
}

export type BoosterMode = 'hammer' | 'bomb' | 'rainbow' | null;

export function useGame({ level, onComplete, onGameOver, soundEnabled }: UseGameProps) {
  const [grid, setGrid] = useState<(Candy | null)[][]>(() => 
    createGrid(level.gridSize.rows, level.gridSize.cols, level.candyTypes)
  );
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(level.moves);
  const [combo, setCombo] = useState(0);
  const [maxComboInGame, setMaxComboInGame] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedCandy, setSelectedCandy] = useState<{ row: number; col: number } | null>(null);
  const [showCombo, setShowCombo] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [boosterMode, setBoosterMode] = useState<BoosterMode>(null);
  const [startTime] = useState(Date.now());
  
  const comboRef = useRef(0);
  const processingRef = useRef(false);
  const scoreRef = useRef(0);
  const maxComboRef = useRef(0);
  
  useEffect(() => {
    soundManager.setEnabled(soundEnabled);
  }, [soundEnabled]);
  
  // Keep refs in sync
  useEffect(() => {
    scoreRef.current = score;
  }, [score]);
  
  useEffect(() => {
    if (combo > maxComboRef.current) {
      maxComboRef.current = combo;
      setMaxComboInGame(combo);
    }
  }, [combo]);
  
  const calculateStarsFromPerformance = useCallback((currentScore: number, maxCombo: number): { stars: number; timeBonus: number } => {
    const elapsedTime = (Date.now() - startTime) / 1000; // seconds
    
    // Time bonus: faster = more points
    // Under 60 seconds = full bonus, decreases after
    const timeBonus = Math.max(0, Math.floor((120 - elapsedTime) * 10));
    
    // Stars calculation based on combo and time
    let stars = 1; // Base star for completing
    
    // Combo bonus: 3+ combo = 2 stars, 5+ combo = 3 stars
    if (maxCombo >= 5) {
      stars = 3;
    } else if (maxCombo >= 3) {
      stars = 2;
    }
    
    // Additional star bonus for exceeding target significantly
    const scoreRatio = currentScore / level.targetScore;
    if (scoreRatio >= 2 && stars < 3) {
      stars = Math.min(3, stars + 1);
    }
    
    // Time bonus can add a star if fast enough
    if (elapsedTime < 45 && stars < 3) {
      stars = Math.min(3, stars + 1);
    }
    
    return { stars, timeBonus };
  }, [startTime, level.targetScore]);
  
  const checkWinCondition = useCallback((currentScore: number) => {
    if (currentScore >= level.targetScore && !gameEnded) {
      setGameEnded(true);
      const { stars, timeBonus } = calculateStarsFromPerformance(currentScore, maxComboRef.current);
      soundManager.levelComplete();
      setTimeout(() => onComplete(currentScore + timeBonus, stars, maxComboRef.current, timeBonus), 500);
      return true;
    }
    return false;
  }, [level.targetScore, gameEnded, onComplete, calculateStarsFromPerformance]);
  
  const processMatches = useCallback(async (currentGrid: (Candy | null)[][], currentCombo: number, accumulatedPoints: number = 0): Promise<{ finalGrid: (Candy | null)[][]; totalPoints: number; maxCombo: number }> => {
    let totalPoints = accumulatedPoints;
    let maxCombo = currentCombo;
    let workingGrid = currentGrid;
    
    const matches = findMatches(workingGrid);
    
    if (matches.length === 0) {
      return { finalGrid: workingGrid, totalPoints, maxCombo };
    }
    
    maxCombo++;
    comboRef.current = maxCombo;
    
    const { newGrid, points } = removeMatches(workingGrid, matches);
    const earnedPoints = Math.round(points * Math.max(1, maxCombo * 0.5));
    totalPoints += earnedPoints;
    
    soundManager.match();
    if (maxCombo > 1) {
      soundManager.combo(maxCombo);
      setShowCombo(true);
      setTimeout(() => setShowCombo(false), 800);
    }
    
    setGrid(newGrid);
    setCombo(maxCombo);
    
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const filledGrid = applyGravity(newGrid, level.candyTypes);
    setGrid(filledGrid);
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const result = await processMatches(filledGrid, maxCombo, totalPoints);
    
    return {
      finalGrid: result.finalGrid,
      totalPoints: result.totalPoints,
      maxCombo: Math.max(maxCombo, result.maxCombo)
    };
  }, [level.candyTypes]);
  
  const handleSwap = useCallback(async (pos1: { row: number; col: number }, pos2: { row: number; col: number }) => {
    if (processingRef.current || gameEnded) return;
    
    processingRef.current = true;
    setIsAnimating(true);
    comboRef.current = 0;
    setCombo(0);
    
    soundManager.swap();
    
    const swappedGrid = swapCandies(grid, pos1, pos2);
    setGrid(swappedGrid);
    
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const matches = findMatches(swappedGrid);
    
    if (matches.length === 0) {
      soundManager.error();
      await new Promise(resolve => setTimeout(resolve, 100));
      setGrid(grid);
      processingRef.current = false;
      setIsAnimating(false);
      return;
    }
    
    const newMoves = moves - 1;
    setMoves(newMoves);
    
    const { finalGrid, totalPoints, maxCombo } = await processMatches(swappedGrid, 0);
    
    // Update max combo
    if (maxCombo > maxComboRef.current) {
      maxComboRef.current = maxCombo;
      setMaxComboInGame(maxCombo);
    }
    
    const newScore = score + totalPoints;
    setScore(newScore);
    
    // Check win condition immediately when target score is reached
    if (checkWinCondition(newScore)) {
      processingRef.current = false;
      setIsAnimating(false);
      return;
    }
    
    // Check for valid moves
    if (!hasValidMoves(finalGrid)) {
      const shuffled = shuffleGrid(finalGrid, level.candyTypes);
      setGrid(shuffled);
    }
    
    // Check if out of moves (game over)
    if (newMoves <= 0 && newScore < level.targetScore) {
      setGameEnded(true);
      setTimeout(() => onGameOver(newScore), 500);
    }
    
    processingRef.current = false;
    setIsAnimating(false);
  }, [grid, moves, score, level, gameEnded, processMatches, checkWinCondition, onGameOver]);
  
  const handleCandyClick = useCallback((row: number, col: number) => {
    if (isAnimating || gameEnded) return;
    
    // Handle booster modes
    if (boosterMode === 'hammer') {
      handleHammerUse(row, col);
      return;
    }
    
    if (boosterMode === 'bomb') {
      handleBombUse(row, col);
      return;
    }
    
    if (boosterMode === 'rainbow') {
      handleRainbowUse(row, col);
      return;
    }
    
    if (selectedCandy) {
      if (selectedCandy.row === row && selectedCandy.col === col) {
        setSelectedCandy(null);
        return;
      }
      
      if (isValidSwap(selectedCandy, { row, col })) {
        handleSwap(selectedCandy, { row, col });
      }
      
      setSelectedCandy(null);
    } else {
      setSelectedCandy({ row, col });
      soundManager.buttonClick();
    }
  }, [selectedCandy, isAnimating, gameEnded, handleSwap, boosterMode]);
  
  const handleHammerUse = useCallback(async (row: number, col: number) => {
    if (!grid[row][col] || processingRef.current || gameEnded) {
      setBoosterMode(null);
      return;
    }
    
    processingRef.current = true;
    setIsAnimating(true);
    setBoosterMode(null);
    
    soundManager.match();
    
    // Destroy the candy
    const newGrid = grid.map(r => [...r]);
    newGrid[row][col] = null;
    setGrid(newGrid);
    
    // Add points for hammer
    const hammerPoints = 30;
    const newScore = score + hammerPoints;
    setScore(newScore);
    
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Apply gravity
    const filledGrid = applyGravity(newGrid, level.candyTypes);
    setGrid(filledGrid);
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Process any resulting matches
    const { finalGrid, totalPoints, maxCombo } = await processMatches(filledGrid, 0);
    
    // Update max combo
    if (maxCombo > maxComboRef.current) {
      maxComboRef.current = maxCombo;
      setMaxComboInGame(maxCombo);
    }
    
    const finalScore = newScore + totalPoints;
    setScore(finalScore);
    
    // Check win condition
    if (checkWinCondition(finalScore)) {
      processingRef.current = false;
      setIsAnimating(false);
      return;
    }
    
    // Check for valid moves
    if (!hasValidMoves(finalGrid)) {
      const shuffled = shuffleGrid(finalGrid, level.candyTypes);
      setGrid(shuffled);
    }
    
    processingRef.current = false;
    setIsAnimating(false);
  }, [grid, score, level.candyTypes, gameEnded, processMatches, checkWinCondition]);
  
  const handleBombUse = useCallback(async (row: number, col: number) => {
    if (!grid[row][col] || processingRef.current || gameEnded) {
      setBoosterMode(null);
      return;
    }
    
    processingRef.current = true;
    setIsAnimating(true);
    setBoosterMode(null);
    
    soundManager.combo(3);
    
    // Destroy 3x3 area around the clicked candy
    const newGrid = grid.map(r => [...r]);
    let destroyedCount = 0;
    
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const nr = row + dr;
        const nc = col + dc;
        if (nr >= 0 && nr < grid.length && nc >= 0 && nc < grid[0].length && newGrid[nr][nc]) {
          newGrid[nr][nc] = null;
          destroyedCount++;
        }
      }
    }
    
    setGrid(newGrid);
    
    // Add points for bomb
    const bombPoints = destroyedCount * 25;
    const newScore = score + bombPoints;
    setScore(newScore);
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Apply gravity
    const filledGrid = applyGravity(newGrid, level.candyTypes);
    setGrid(filledGrid);
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Process any resulting matches
    const { finalGrid, totalPoints, maxCombo } = await processMatches(filledGrid, 0);
    
    // Update max combo
    if (maxCombo > maxComboRef.current) {
      maxComboRef.current = maxCombo;
      setMaxComboInGame(maxCombo);
    }
    
    const finalScore = newScore + totalPoints;
    setScore(finalScore);
    
    // Check win condition
    if (checkWinCondition(finalScore)) {
      processingRef.current = false;
      setIsAnimating(false);
      return;
    }
    
    // Check for valid moves
    if (!hasValidMoves(finalGrid)) {
      const shuffled = shuffleGrid(finalGrid, level.candyTypes);
      setGrid(shuffled);
    }
    
    processingRef.current = false;
    setIsAnimating(false);
  }, [grid, score, level.candyTypes, gameEnded, processMatches, checkWinCondition]);
  
  const handleRainbowUse = useCallback(async (row: number, col: number) => {
    if (!grid[row][col] || processingRef.current || gameEnded) {
      setBoosterMode(null);
      return;
    }
    
    processingRef.current = true;
    setIsAnimating(true);
    setBoosterMode(null);
    
    soundManager.combo(5);
    
    const targetType = grid[row][col]!.type;
    
    // Destroy all candies of this type
    const newGrid = grid.map(r => 
      r.map(candy => {
        if (candy && candy.type === targetType) {
          return null;
        }
        return candy;
      })
    );
    
    // Count destroyed candies for points
    let destroyedCount = 0;
    grid.forEach(r => r.forEach(candy => {
      if (candy && candy.type === targetType) destroyedCount++;
    }));
    
    setGrid(newGrid);
    
    // Add points for rainbow
    const rainbowPoints = destroyedCount * 50;
    const newScore = score + rainbowPoints;
    setScore(newScore);
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Apply gravity
    const filledGrid = applyGravity(newGrid, level.candyTypes);
    setGrid(filledGrid);
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Process any resulting matches
    const { finalGrid, totalPoints, maxCombo } = await processMatches(filledGrid, 0);
    
    // Update max combo
    if (maxCombo > maxComboRef.current) {
      maxComboRef.current = maxCombo;
      setMaxComboInGame(maxCombo);
    }
    
    const finalScore = newScore + totalPoints;
    setScore(finalScore);
    
    // Check win condition
    if (checkWinCondition(finalScore)) {
      processingRef.current = false;
      setIsAnimating(false);
      return;
    }
    
    // Check for valid moves
    if (!hasValidMoves(finalGrid)) {
      const shuffled = shuffleGrid(finalGrid, level.candyTypes);
      setGrid(shuffled);
    }
    
    processingRef.current = false;
    setIsAnimating(false);
  }, [grid, score, level.candyTypes, gameEnded, processMatches, checkWinCondition]);
  
  const handleDrag = useCallback((fromRow: number, fromCol: number, toRow: number, toCol: number) => {
    if (isAnimating || gameEnded || boosterMode) return;
    
    if (isValidSwap({ row: fromRow, col: fromCol }, { row: toRow, col: toCol })) {
      handleSwap({ row: fromRow, col: fromCol }, { row: toRow, col: toCol });
    }
  }, [isAnimating, gameEnded, handleSwap, boosterMode]);
  
  const activateBooster = useCallback((type: 'hammer' | 'bomb' | 'rainbow'): boolean => {
    if (isAnimating || gameEnded) return false;
    
    if (type === 'hammer') {
      setBoosterMode('hammer');
      setSelectedCandy(null);
      soundManager.buttonClick();
      return true;
    }
    
    if (type === 'bomb') {
      setBoosterMode('bomb');
      setSelectedCandy(null);
      soundManager.buttonClick();
      return true;
    }
    
    if (type === 'rainbow') {
      setBoosterMode('rainbow');
      setSelectedCandy(null);
      soundManager.buttonClick();
      return true;
    }
    
    return false;
  }, [isAnimating, gameEnded]);
  
  const cancelBoosterMode = useCallback(() => {
    setBoosterMode(null);
  }, []);
  
  const progress = Math.min(100, (score / level.targetScore) * 100);
  
  return {
    grid,
    score,
    moves,
    combo,
    maxComboInGame,
    isAnimating,
    selectedCandy,
    showCombo,
    progress,
    gameEnded,
    boosterMode,
    handleCandyClick,
    handleDrag,
    activateBooster,
    cancelBoosterMode
  };
}
