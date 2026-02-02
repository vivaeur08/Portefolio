export interface Profile {
  id: string;
  name: string;
  avatar: string;
  isProtected: boolean;
  pin?: string;
  createdAt: number;
  lastPlayed: number;
  currentLevel: number;
  totalScore: number;
  coins: number;
  boosters: {
    hammer: number;
    bomb: number;
    rainbow: number;
  };
  achievements: string[];
  dailyRewardDay: number;
  lastDailyReward: string;
  gamesPlayed: number;
  bestCombo: number;
}

export interface LevelData {
  id: number;
  moves: number;
  targetScore: number;
  gridSize: { rows: number; cols: number };
  candyTypes: number;
  obstacles?: { row: number; col: number; type: 'ice' | 'stone' }[];
  objective: 'score' | 'collect' | 'clear';
  collectTarget?: { type: number; count: number };
}

export interface LeaderboardEntry {
  id: string;
  profileName: string;
  avatar: string;
  score: number;
  level: number;
  deviceId: string;
  timestamp: number;
}

export interface GameState {
  grid: (Candy | null)[][];
  score: number;
  moves: number;
  combo: number;
  isAnimating: boolean;
  selectedCandy: { row: number; col: number } | null;
}

export interface Candy {
  id: string;
  type: number;
  special?: 'striped-h' | 'striped-v' | 'wrapped' | 'color-bomb';
  isNew?: boolean;
  isMatched?: boolean;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (profile: Profile) => boolean;
}

export interface Settings {
  darkMode: boolean;
  soundEnabled: boolean;
  musicEnabled: boolean;
  vibrationEnabled: boolean;
  colorBlindMode: boolean;
  highContrastMode: boolean;
}
