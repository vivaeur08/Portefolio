import { Achievement, Profile } from '@/types';

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_game',
    name: 'Première Partie',
    description: 'Jouer votre première partie',
    icon: '🎮',
    condition: (p: Profile) => p.gamesPlayed >= 1
  },
  {
    id: 'level_5',
    name: 'Apprenti',
    description: 'Atteindre le niveau 5',
    icon: '⭐',
    condition: (p: Profile) => p.currentLevel >= 5
  },
  {
    id: 'level_10',
    name: 'Amateur',
    description: 'Atteindre le niveau 10',
    icon: '🌟',
    condition: (p: Profile) => p.currentLevel >= 10
  },
  {
    id: 'level_25',
    name: 'Expert',
    description: 'Atteindre le niveau 25',
    icon: '💫',
    condition: (p: Profile) => p.currentLevel >= 25
  },
  {
    id: 'level_50',
    name: 'Maître',
    description: 'Atteindre le niveau 50',
    icon: '👑',
    condition: (p: Profile) => p.currentLevel >= 50
  },
  {
    id: 'score_10k',
    name: 'Collectionneur',
    description: 'Accumuler 10 000 points au total',
    icon: '💰',
    condition: (p: Profile) => p.totalScore >= 10000
  },
  {
    id: 'score_100k',
    name: 'Trésorier',
    description: 'Accumuler 100 000 points au total',
    icon: '💎',
    condition: (p: Profile) => p.totalScore >= 100000
  },
  {
    id: 'combo_5',
    name: 'Combo Débutant',
    description: 'Faire un combo de 5',
    icon: '🔥',
    condition: (p: Profile) => p.bestCombo >= 5
  },
  {
    id: 'combo_10',
    name: 'Combo Expert',
    description: 'Faire un combo de 10',
    icon: '⚡',
    condition: (p: Profile) => p.bestCombo >= 10
  },
  {
    id: 'games_10',
    name: 'Joueur Régulier',
    description: 'Jouer 10 parties',
    icon: '🎯',
    condition: (p: Profile) => p.gamesPlayed >= 10
  },
  {
    id: 'games_50',
    name: 'Joueur Assidu',
    description: 'Jouer 50 parties',
    icon: '🏆',
    condition: (p: Profile) => p.gamesPlayed >= 50
  },
  {
    id: 'daily_7',
    name: 'Semaine Parfaite',
    description: 'Collecter 7 jours de récompenses',
    icon: '📅',
    condition: (p: Profile) => p.dailyRewardDay >= 7
  }
];

export function checkNewAchievements(profile: Profile): string[] {
  const newAchievements: string[] = [];
  
  ACHIEVEMENTS.forEach(achievement => {
    if (!profile.achievements.includes(achievement.id) && achievement.condition(profile)) {
      newAchievements.push(achievement.id);
    }
  });
  
  return newAchievements;
}
