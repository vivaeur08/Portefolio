import { useState, useEffect, useCallback } from 'react';
import { Profile, Settings, LevelData } from '@/types';
import { 
  loadProfiles, 
  saveProfile, 
  getSettings, 
  saveSettings, 
  saveToLeaderboard,
  getDeviceId
} from '@/utils/storage';
import { LEVELS } from '@/utils/gameLogic';
import { checkNewAchievements } from '@/utils/achievements';
import { soundManager } from '@/utils/sounds';

import { ProfileSelect } from '@/components/ProfileSelect';
import { LevelSelect } from '@/components/LevelSelect';
import { GameBoard } from '@/components/GameBoard';
import { Leaderboard } from '@/components/Leaderboard';
import { DailyReward } from '@/components/DailyReward';
import { Achievements } from '@/components/Achievements';
import { Settings as SettingsModal } from '@/components/Settings';
import { LevelComplete } from '@/components/LevelComplete';
import { GameOver } from '@/components/GameOver';
import { Shop } from '@/components/Shop';

type Screen = 'profiles' | 'levels' | 'game';
type Modal = 'leaderboard' | 'daily' | 'achievements' | 'settings' | 'complete' | 'gameover' | 'shop' | null;

export function App() {
  const [screen, setScreen] = useState<Screen>('profiles');
  const [modal, setModal] = useState<Modal>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);
  const [settings, setSettings] = useState<Settings>(getSettings());
  const [currentLevel, setCurrentLevel] = useState<LevelData | null>(null);
  const [gameResult, setGameResult] = useState<{ score: number; stars: number; maxCombo: number; timeBonus: number } | null>(null);
  const [gameKey, setGameKey] = useState(0); // Key to force re-render of game
  
  // Load profiles on mount
  useEffect(() => {
    const loaded = loadProfiles();
    setProfiles(loaded);
    soundManager.init();
  }, []);
  
  // Save settings when changed
  useEffect(() => {
    saveSettings(settings);
    soundManager.setEnabled(settings.soundEnabled);
  }, [settings]);
  
  // Update leaderboard when profile changes
  useEffect(() => {
    if (currentProfile && currentProfile.totalScore > 0) {
      saveToLeaderboard({
        id: currentProfile.id,
        profileName: currentProfile.name,
        avatar: currentProfile.avatar,
        score: currentProfile.totalScore,
        level: currentProfile.currentLevel,
        deviceId: getDeviceId(),
        timestamp: Date.now()
      });
    }
  }, [currentProfile?.totalScore, currentProfile?.id]);
  
  const handleSelectProfile = useCallback((profile: Profile) => {
    setCurrentProfile(profile);
    setScreen('levels');
    
    // Check for daily reward - give it automatically on login
    const today = new Date().toDateString();
    if (profile.lastDailyReward !== today) {
      setModal('daily');
    }
  }, []);
  
  const handleSelectLevel = useCallback((levelId: number) => {
    const level = LEVELS.find(l => l.id === levelId);
    if (level) {
      setCurrentLevel(level);
      setGameKey(prev => prev + 1); // Force new game instance
      setScreen('game');
    }
  }, []);
  
  const handleLevelComplete = useCallback((score: number, stars: number, maxCombo: number, timeBonus: number) => {
    if (!currentProfile || !currentLevel) return;
    
    const coinsEarned = 50 + stars * 25 + Math.floor(timeBonus / 10);
    const updatedProfile: Profile = {
      ...currentProfile,
      totalScore: currentProfile.totalScore + score,
      coins: currentProfile.coins + coinsEarned,
      currentLevel: Math.max(currentProfile.currentLevel, currentLevel.id + 1),
      gamesPlayed: currentProfile.gamesPlayed + 1,
      bestCombo: Math.max(currentProfile.bestCombo, maxCombo),
      boosters: {
        ...currentProfile.boosters,
        hammer: currentProfile.boosters.hammer + (stars >= 3 ? 1 : 0)
      }
    };
    
    // Check achievements
    const newAchievements = checkNewAchievements(updatedProfile);
    if (newAchievements.length > 0) {
      updatedProfile.achievements = [...updatedProfile.achievements, ...newAchievements];
    }
    
    saveProfile(updatedProfile);
    setCurrentProfile(updatedProfile);
    setProfiles(prev => prev.map(p => p.id === updatedProfile.id ? updatedProfile : p));
    
    setGameResult({ score, stars, maxCombo, timeBonus });
    setModal('complete');
  }, [currentProfile, currentLevel]);
  
  const handleGameOver = useCallback((score: number) => {
    if (!currentProfile) return;
    
    const updatedProfile: Profile = {
      ...currentProfile,
      gamesPlayed: currentProfile.gamesPlayed + 1,
      totalScore: currentProfile.totalScore + Math.floor(score * 0.25) // Partial credit
    };
    
    const newAchievements = checkNewAchievements(updatedProfile);
    if (newAchievements.length > 0) {
      updatedProfile.achievements = [...updatedProfile.achievements, ...newAchievements];
    }
    
    saveProfile(updatedProfile);
    setCurrentProfile(updatedProfile);
    setProfiles(prev => prev.map(p => p.id === updatedProfile.id ? updatedProfile : p));
    
    setGameResult({ score, stars: 0, maxCombo: 0, timeBonus: 0 });
    setModal('gameover');
  }, [currentProfile]);
  
  const handleClaimDailyReward = useCallback((rewards: { coins: number; booster?: string }) => {
    if (!currentProfile) return;
    
    const today = new Date().toDateString();
    const updatedProfile: Profile = {
      ...currentProfile,
      coins: currentProfile.coins + rewards.coins,
      dailyRewardDay: currentProfile.dailyRewardDay + 1,
      lastDailyReward: today,
      boosters: rewards.booster 
        ? {
            ...currentProfile.boosters,
            [rewards.booster]: (currentProfile.boosters[rewards.booster as keyof typeof currentProfile.boosters] || 0) + 1
          }
        : currentProfile.boosters
    };
    
    saveProfile(updatedProfile);
    setCurrentProfile(updatedProfile);
    setProfiles(prev => prev.map(p => p.id === updatedProfile.id ? updatedProfile : p));
    setModal(null);
  }, [currentProfile]);
  
  const handleUseBooster = useCallback((type: 'hammer' | 'bomb' | 'rainbow'): boolean => {
    if (!currentProfile || currentProfile.boosters[type] <= 0) return false;
    
    const updatedProfile: Profile = {
      ...currentProfile,
      boosters: {
        ...currentProfile.boosters,
        [type]: currentProfile.boosters[type] - 1
      }
    };
    
    saveProfile(updatedProfile);
    setCurrentProfile(updatedProfile);
    setProfiles(prev => prev.map(p => p.id === updatedProfile.id ? updatedProfile : p));
    
    return true;
  }, [currentProfile]);
  
  const handleBuyBooster = useCallback((type: 'hammer' | 'bomb' | 'rainbow', cost: number) => {
    if (!currentProfile || currentProfile.coins < cost) return;
    
    const updatedProfile: Profile = {
      ...currentProfile,
      coins: currentProfile.coins - cost,
      boosters: {
        ...currentProfile.boosters,
        [type]: currentProfile.boosters[type] + 1
      }
    };
    
    saveProfile(updatedProfile);
    setCurrentProfile(updatedProfile);
    setProfiles(prev => prev.map(p => p.id === updatedProfile.id ? updatedProfile : p));
    soundManager.reward();
  }, [currentProfile]);
  
  const handleNextLevel = useCallback(() => {
    if (!currentLevel) return;
    const nextLevel = LEVELS.find(l => l.id === currentLevel.id + 1);
    if (nextLevel) {
      setCurrentLevel(nextLevel);
      setGameKey(prev => prev + 1); // Force new game instance
      setModal(null);
      // Screen stays as 'game'
    } else {
      setScreen('levels');
      setCurrentLevel(null);
      setModal(null);
    }
  }, [currentLevel]);
  
  const handleReplay = useCallback(() => {
    setModal(null);
    setGameKey(prev => prev + 1); // Force new game instance
  }, []);
  
  return (
    <div className={settings.darkMode ? 'dark' : ''}>
      {screen === 'profiles' && (
        <ProfileSelect
          profiles={profiles}
          onSelectProfile={handleSelectProfile}
          onProfilesChange={setProfiles}
          settings={settings}
        />
      )}
      
      {screen === 'levels' && currentProfile && (
        <LevelSelect
          profile={currentProfile}
          settings={settings}
          onSelectLevel={handleSelectLevel}
          onBack={() => setScreen('profiles')}
          onOpenLeaderboard={() => setModal('leaderboard')}
          onOpenSettings={() => setModal('settings')}
          onOpenAchievements={() => setModal('achievements')}
          onOpenDailyReward={() => setModal('daily')}
          onOpenShop={() => setModal('shop')}
        />
      )}
      
      {screen === 'game' && currentProfile && currentLevel && (
        <GameBoard
          key={gameKey}
          level={currentLevel}
          profile={currentProfile}
          settings={settings}
          onComplete={handleLevelComplete}
          onGameOver={handleGameOver}
          onExit={() => {
            setScreen('levels');
            setCurrentLevel(null);
          }}
          onUseBooster={handleUseBooster}
        />
      )}
      
      {/* Modals */}
      {modal === 'leaderboard' && currentProfile && (
        <Leaderboard
          profile={currentProfile}
          settings={settings}
          onClose={() => setModal(null)}
        />
      )}
      
      {modal === 'daily' && currentProfile && (
        <DailyReward
          profile={currentProfile}
          settings={settings}
          onClaim={handleClaimDailyReward}
          onClose={() => setModal(null)}
        />
      )}
      
      {modal === 'achievements' && currentProfile && (
        <Achievements
          profile={currentProfile}
          settings={settings}
          onClose={() => setModal(null)}
        />
      )}
      
      {modal === 'settings' && currentProfile && (
        <SettingsModal
          profile={currentProfile}
          settings={settings}
          onUpdateSettings={setSettings}
          onUpdateProfile={(profile) => {
            setCurrentProfile(profile);
            setProfiles(prev => prev.map(p => p.id === profile.id ? profile : p));
          }}
          onClose={() => setModal(null)}
        />
      )}
      
      {modal === 'shop' && currentProfile && (
        <Shop
          profile={currentProfile}
          settings={settings}
          onBuyBooster={handleBuyBooster}
          onClose={() => setModal(null)}
        />
      )}
      
      {modal === 'complete' && currentLevel && gameResult && (
        <LevelComplete
          levelId={currentLevel.id}
          score={gameResult.score}
          stars={gameResult.stars}
          maxCombo={gameResult.maxCombo}
          timeBonus={gameResult.timeBonus}
          settings={settings}
          onNextLevel={handleNextLevel}
          onReplay={handleReplay}
          onExit={() => {
            setScreen('levels');
            setCurrentLevel(null);
            setModal(null);
          }}
        />
      )}
      
      {modal === 'gameover' && currentLevel && gameResult && (
        <GameOver
          levelId={currentLevel.id}
          score={gameResult.score}
          targetScore={currentLevel.targetScore}
          settings={settings}
          onRetry={handleReplay}
          onExit={() => {
            setScreen('levels');
            setCurrentLevel(null);
            setModal(null);
          }}
        />
      )}
    </div>
  );
}
