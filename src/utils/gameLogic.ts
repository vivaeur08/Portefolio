import { Candy, LevelData } from '@/types';
import { generateId } from './storage';

export const CANDY_EMOJIS = ['🍬', '🍭', '🍫', '🍩', '🧁', '🍪', '🍰', '🎂'];
export const CANDY_COLORS = [
  'from-red-400 to-red-600',
  'from-orange-400 to-orange-600', 
  'from-yellow-400 to-yellow-600',
  'from-green-400 to-green-600',
  'from-blue-400 to-blue-600',
  'from-purple-400 to-purple-600',
  'from-pink-400 to-pink-600',
  'from-cyan-400 to-cyan-600'
];

export const COLORBLIND_SHAPES = ['●', '■', '▲', '◆', '★', '♦', '♠', '♣'];

export function createCandy(type: number): Candy {
  return {
    id: generateId(),
    type,
    isNew: true
  };
}

export function createGrid(rows: number, cols: number, candyTypes: number): Candy[][] {
  const grid: Candy[][] = [];
  
  for (let r = 0; r < rows; r++) {
    const row: Candy[] = [];
    for (let c = 0; c < cols; c++) {
      let type: number;
      do {
        type = Math.floor(Math.random() * candyTypes);
      } while (
        (c >= 2 && row[c-1]?.type === type && row[c-2]?.type === type) ||
        (r >= 2 && grid[r-1]?.[c]?.type === type && grid[r-2]?.[c]?.type === type)
      );
      row.push(createCandy(type));
    }
    grid.push(row);
  }
  
  return grid;
}

export function findMatches(grid: (Candy | null)[][]): { row: number; col: number }[][] {
  const rows = grid.length;
  const cols = grid[0]?.length || 0;
  const matches: { row: number; col: number }[][] = [];
  const visited = new Set<string>();
  
  // Find horizontal matches
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols - 2; c++) {
      if (!grid[r][c] || visited.has(`${r},${c}`)) continue;
      
      const type = grid[r][c]!.type;
      const match: { row: number; col: number }[] = [{ row: r, col: c }];
      
      let nc = c + 1;
      while (nc < cols && grid[r][nc]?.type === type) {
        match.push({ row: r, col: nc });
        nc++;
      }
      
      if (match.length >= 3) {
        match.forEach(m => visited.add(`${m.row},${m.col}`));
        matches.push(match);
      }
    }
  }
  
  // Reset visited for vertical matches
  visited.clear();
  
  // Find vertical matches
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows - 2; r++) {
      if (!grid[r][c] || visited.has(`${r},${c}`)) continue;
      
      const type = grid[r][c]!.type;
      const match: { row: number; col: number }[] = [{ row: r, col: c }];
      
      let nr = r + 1;
      while (nr < rows && grid[nr][c]?.type === type) {
        match.push({ row: nr, col: c });
        nr++;
      }
      
      if (match.length >= 3) {
        match.forEach(m => visited.add(`${m.row},${m.col}`));
        matches.push(match);
      }
    }
  }
  
  return matches;
}

export function removeMatches(grid: (Candy | null)[][], matches: { row: number; col: number }[][]): { 
  newGrid: (Candy | null)[][];
  points: number;
  specialCandies: { row: number; col: number; type: Candy['special'] }[];
} {
  const newGrid = grid.map(row => [...row]);
  let points = 0;
  const specialCandies: { row: number; col: number; type: Candy['special'] }[] = [];
  
  matches.forEach(match => {
    const matchLength = match.length;
    
    // Calculate points based on match length
    if (matchLength === 3) points += 60;
    else if (matchLength === 4) points += 120;
    else if (matchLength >= 5) points += 200;
    
    // Create special candies for matches of 4 or more
    if (matchLength === 4) {
      const midIndex = Math.floor(matchLength / 2);
      const midPos = match[midIndex];
      const isHorizontal = match[0].row === match[1].row;
      specialCandies.push({
        row: midPos.row,
        col: midPos.col,
        type: isHorizontal ? 'striped-h' : 'striped-v'
      });
    } else if (matchLength >= 5) {
      const midIndex = Math.floor(matchLength / 2);
      const midPos = match[midIndex];
      specialCandies.push({
        row: midPos.row,
        col: midPos.col,
        type: 'color-bomb'
      });
    }
    
    // Remove matched candies
    match.forEach(({ row, col }) => {
      newGrid[row][col] = null;
    });
  });
  
  return { newGrid, points, specialCandies };
}

export function applyGravity(grid: (Candy | null)[][], candyTypes: number): (Candy | null)[][] {
  const rows = grid.length;
  const cols = grid[0]?.length || 0;
  const newGrid = grid.map(row => [...row]);
  
  for (let c = 0; c < cols; c++) {
    let emptyRow = rows - 1;
    
    // Move existing candies down
    for (let r = rows - 1; r >= 0; r--) {
      if (newGrid[r][c]) {
        if (r !== emptyRow) {
          newGrid[emptyRow][c] = newGrid[r][c];
          newGrid[r][c] = null;
        }
        emptyRow--;
      }
    }
    
    // Fill empty spaces with new candies
    for (let r = emptyRow; r >= 0; r--) {
      const type = Math.floor(Math.random() * candyTypes);
      newGrid[r][c] = createCandy(type);
    }
  }
  
  return newGrid;
}

export function swapCandies(
  grid: (Candy | null)[][],
  pos1: { row: number; col: number },
  pos2: { row: number; col: number }
): (Candy | null)[][] {
  const newGrid = grid.map(row => [...row]);
  const temp = newGrid[pos1.row][pos1.col];
  newGrid[pos1.row][pos1.col] = newGrid[pos2.row][pos2.col];
  newGrid[pos2.row][pos2.col] = temp;
  return newGrid;
}

export function isValidSwap(pos1: { row: number; col: number }, pos2: { row: number; col: number }): boolean {
  const rowDiff = Math.abs(pos1.row - pos2.row);
  const colDiff = Math.abs(pos1.col - pos2.col);
  return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
}

export function hasValidMoves(grid: (Candy | null)[][]): boolean {
  const rows = grid.length;
  const cols = grid[0]?.length || 0;
  
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // Check swap with right neighbor
      if (c < cols - 1) {
        const swapped = swapCandies(grid, { row: r, col: c }, { row: r, col: c + 1 });
        if (findMatches(swapped).length > 0) return true;
      }
      // Check swap with bottom neighbor
      if (r < rows - 1) {
        const swapped = swapCandies(grid, { row: r, col: c }, { row: r + 1, col: c });
        if (findMatches(swapped).length > 0) return true;
      }
    }
  }
  
  return false;
}

export function shuffleGrid(grid: (Candy | null)[][], candyTypes: number): (Candy | null)[][] {
  let newGrid = grid.map(row => row.map(candy => candy ? { ...candy } : null));
  let attempts = 0;
  
  while (!hasValidMoves(newGrid) && attempts < 100) {
    // Shuffle all candies
    const candies: Candy[] = [];
    newGrid.forEach(row => row.forEach(candy => {
      if (candy) candies.push(candy);
    }));
    
    for (let i = candies.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [candies[i], candies[j]] = [candies[j], candies[i]];
    }
    
    let idx = 0;
    newGrid = newGrid.map(row => row.map(candy => {
      if (candy) return candies[idx++];
      return null;
    }));
    
    attempts++;
  }
  
  if (attempts >= 100) {
    newGrid = createGrid(grid.length, grid[0]?.length || 0, candyTypes);
  }
  
  return newGrid;
}

export const LEVELS: LevelData[] = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  moves: Math.max(15, 30 - Math.floor(i / 5)),
  targetScore: 1000 + i * 500,
  gridSize: { 
    rows: Math.min(8, 6 + Math.floor(i / 10)),
    cols: Math.min(8, 6 + Math.floor(i / 10))
  },
  candyTypes: Math.min(6, 4 + Math.floor(i / 10)),
  objective: 'score' as const
}));

export function calculateStars(score: number, targetScore: number): number {
  const ratio = score / targetScore;
  if (ratio >= 2) return 3;
  if (ratio >= 1.5) return 2;
  if (ratio >= 1) return 1;
  return 0;
}
