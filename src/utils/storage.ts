import { Profile, LeaderboardEntry, Settings } from '@/types';

const PROFILES_KEY = 'sweetmatch_profiles';
const SETTINGS_KEY = 'sweetmatch_settings';
const DEVICE_ID_KEY = 'sweetmatch_device_id';
const LEADERBOARD_KEY = 'sweetmatch_leaderboard';

export function getDeviceId(): string {
  let deviceId = localStorage.getItem(DEVICE_ID_KEY);
  if (!deviceId) {
    deviceId = 'device_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    localStorage.setItem(DEVICE_ID_KEY, deviceId);
  }
  return deviceId;
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}

export function saveProfiles(profiles: Profile[]): void {
  try {
    localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
  } catch (e) {
    console.error('Error saving profiles:', e);
  }
}

export function loadProfiles(): Profile[] {
  try {
    const data = localStorage.getItem(PROFILES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Error loading profiles:', e);
    return [];
  }
}

export function saveProfile(profile: Profile): void {
  const profiles = loadProfiles();
  const index = profiles.findIndex(p => p.id === profile.id);
  if (index >= 0) {
    profiles[index] = profile;
  } else {
    profiles.push(profile);
  }
  saveProfiles(profiles);
}

export function deleteProfile(profileId: string): void {
  const profiles = loadProfiles().filter(p => p.id !== profileId);
  saveProfiles(profiles);
}

export function getSettings(): Settings {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    return data ? JSON.parse(data) : {
      darkMode: false,
      soundEnabled: true,
      musicEnabled: true,
      vibrationEnabled: true,
      colorBlindMode: false,
      highContrastMode: false
    };
  } catch (e) {
    return {
      darkMode: false,
      soundEnabled: true,
      musicEnabled: true,
      vibrationEnabled: true,
      colorBlindMode: false,
      highContrastMode: false
    };
  }
}

export function saveSettings(settings: Settings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

// Leaderboard functions - simulating cloud sync with localStorage
export function getLocalLeaderboard(): LeaderboardEntry[] {
  try {
    const data = localStorage.getItem(LEADERBOARD_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

export function saveToLeaderboard(entry: LeaderboardEntry): void {
  const leaderboard = getLocalLeaderboard();
  const existingIndex = leaderboard.findIndex(e => e.id === entry.id);
  
  if (existingIndex >= 0) {
    if (entry.score > leaderboard[existingIndex].score) {
      leaderboard[existingIndex] = entry;
    }
  } else {
    leaderboard.push(entry);
  }
  
  // Sort by score and keep top 100
  leaderboard.sort((a, b) => b.score - a.score);
  const top100 = leaderboard.slice(0, 100);
  
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(top100));
}

export function generateRecoveryCode(profiles: Profile[]): string {
  const data = JSON.stringify(profiles);
  const encoded = btoa(unescape(encodeURIComponent(data)));
  return encoded.substring(0, 20).toUpperCase();
}

export function exportProfileData(profile: Profile): string {
  return btoa(unescape(encodeURIComponent(JSON.stringify(profile))));
}

export function importProfileData(code: string): Profile | null {
  try {
    return JSON.parse(decodeURIComponent(escape(atob(code))));
  } catch (e) {
    return null;
  }
}
