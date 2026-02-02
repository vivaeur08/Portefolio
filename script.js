// ==========================================
// 🍬 SWEET CRUSH - Complete JavaScript
// ==========================================

// ==========================================
// CONFIGURATION
// ==========================================
const CONFIG = {
    GRID_SIZE: 8,
    CANDY_TYPES: 6,
    MIN_MATCH: 3,
    ANIMATION_SPEED: 200,
    SWAP_DURATION: 150,
    FALL_DURATION: 100,
    COMBO_MULTIPLIER: 1.5,
    MAX_PROFILES: 8,
    PIN_LENGTH: 4,
    DAILY_REWARD_COINS: 50,
    LEADERBOARD_SYNC_INTERVAL: 30000
};

const CANDY_EMOJIS = ['🍬', '🍭', '🍫', '🍩', '🧁', '🍪', '🍰', '🎂'];
const CANDY_COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'];

const AVATARS = [
    "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/Boy.png",
    "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/Girl.png",
    "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Crying%20Cat.png",
    "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Enraged%20Face.png",
    "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/Detective.png",
    "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/Man%20Vampire.png",
    "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/Man%20Supervillain.png",
    "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/Person%20Juggling.png",
    "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Butterfly.png",
    "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Dog%20Face.png",
    "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Frog.png",
    "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Fox.png",
    "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Monkey%20Face.png",
    "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Orangutan.png",
    "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Panda.png",
    "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Raccoon.png",
    "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Snake.png",
    "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Tiger%20Face.png"
];

const LEVELS = [
    { id: 1, target: 1000, moves: 20, objective: 'score', title: 'Début sucré 🍬' },
    { id: 2, target: 1500, moves: 18, objective: 'score', title: 'Cascade de bonbons' },
    { id: 3, target: 2000, moves: 20, objective: 'score', title: 'Combo délice' },
    { id: 4, target: 2500, moves: 18, objective: 'score', title: 'Tempête sucrée' },
    { id: 5, target: 3000, moves: 22, objective: 'score', title: 'Festival gourmand' },
    { id: 6, target: 3500, moves: 20, objective: 'score', title: 'Explosion colorée' },
    { id: 7, target: 4000, moves: 18, objective: 'score', title: 'Défi intense' },
    { id: 8, target: 4500, moves: 20, objective: 'score', title: 'Maître des combos' },
    { id: 9, target: 5000, moves: 22, objective: 'score', title: 'Légende sucrée' },
    { id: 10, target: 6000, moves: 25, objective: 'score', title: 'Champion ultime 🏆' }
];

const ACHIEVEMENTS = [
    { id: 'first_match', name: 'Premier Match', description: 'Réalise ton premier match', icon: '⭐', condition: (stats) => stats.totalMatches >= 1 },
    { id: 'combo_master', name: 'Maître Combo', description: 'Fais un combo x5', icon: '🔥', condition: (stats) => stats.maxCombo >= 5 },
    { id: 'level_5', name: 'Aventurier', description: 'Atteins le niveau 5', icon: '🎯', condition: (stats) => stats.maxLevel >= 5 },
    { id: 'level_10', name: 'Expert', description: 'Atteins le niveau 10', icon: '🏆', condition: (stats) => stats.maxLevel >= 10 },
    { id: 'score_10k', name: 'Score 10K', description: 'Atteins 10 000 points total', icon: '💎', condition: (stats) => stats.totalScore >= 10000 },
    { id: 'score_50k', name: 'Score 50K', description: 'Atteins 50 000 points total', icon: '👑', condition: (stats) => stats.totalScore >= 50000 },
    { id: 'daily_7', name: 'Fidèle', description: 'Joue 7 jours de suite', icon: '📅', condition: (stats) => stats.dailyStreak >= 7 },
    { id: 'matches_100', name: 'Collectionneur', description: 'Fais 100 matchs', icon: '🌟', condition: (stats) => stats.totalMatches >= 100 },
    { id: 'matches_500', name: 'Légende', description: 'Fais 500 matchs', icon: '🎪', condition: (stats) => stats.totalMatches >= 500 },
    { id: 'perfect_level', name: 'Parfait', description: 'Termine un niveau avec tous les coups', icon: '✨', condition: (stats) => stats.perfectLevels >= 1 }
];

const BOOSTERS = [
    { id: 'hammer', name: 'Marteau', description: 'Détruit un bonbon', icon: '🔨', cost: 0 },
    { id: 'bomb', name: 'Bombe', description: 'Détruit une zone 3x3', icon: '💣', cost: 0 },
    { id: 'rainbow', name: 'Arc-en-ciel', description: 'Détruit tous les bonbons d\'une couleur', icon: '🌈', cost: 0 },
    { id: 'shuffle', name: 'Mélange', description: 'Mélange le plateau', icon: '🔄', cost: 0 },
    { id: 'extra_moves', name: '+5 Coups', description: 'Ajoute 5 coups', icon: '➕', cost: 0 }
];

// ==========================================
// UTILITY FUNCTIONS
// ==========================================
const Utils = {
    generateId() {
        return 'xxxx-xxxx-xxxx'.replace(/x/g, () => 
            Math.floor(Math.random() * 16).toString(16)
        );
    },

    getToday() {
        return new Date().toISOString().split('T')[0];
    },

    vibrate(pattern = 10) {
        if ('vibrate' in navigator) {
            navigator.vibrate(pattern);
        }
    },

    playSound(soundId) {
        if (SoundManager.enabled) {
            SoundManager.play(soundId);
        }
    },

    formatNumber(num) {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    },

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

// ==========================================
// SOUND MANAGER
// ==========================================
const SoundManager = {
    enabled: true,
    musicEnabled: true,
    context: null,
    sounds: {},

    init() {
        try {
            this.context = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Audio context not supported');
        }
    },

    play(type) {
        if (!this.enabled || !this.context) return;
        
        const oscillator = this.context.createOscillator();
        const gainNode = this.context.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.context.destination);
        
        const sounds = {
            match: { freq: 523, duration: 0.1, type: 'sine' },
            combo: { freq: 659, duration: 0.15, type: 'sine' },
            swap: { freq: 440, duration: 0.05, type: 'triangle' },
            invalid: { freq: 200, duration: 0.1, type: 'sawtooth' },
            levelComplete: { freq: 784, duration: 0.3, type: 'sine' },
            click: { freq: 600, duration: 0.05, type: 'sine' },
            special: { freq: 880, duration: 0.2, type: 'sine' }
        };
        
        const sound = sounds[type] || sounds.click;
        oscillator.type = sound.type;
        oscillator.frequency.setValueAtTime(sound.freq, this.context.currentTime);
        gainNode.gain.setValueAtTime(0.1, this.context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + sound.duration);
        
        oscillator.start();
        oscillator.stop(this.context.currentTime + sound.duration);
    },

    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    },

    toggleMusic() {
        this.musicEnabled = !this.musicEnabled;
        return this.musicEnabled;
    }
};

// ==========================================
// STORAGE MANAGER (IndexedDB + localStorage fallback)
// ==========================================
const StorageManager = {
    dbName: 'SweetCrushDB',
    dbVersion: 1,
    db: null,

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);
            
            request.onerror = () => {
                console.log('IndexedDB not available, using localStorage');
                resolve(false);
            };
            
            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve(true);
            };
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                if (!db.objectStoreNames.contains('profiles')) {
                    db.createObjectStore('profiles', { keyPath: 'id' });
                }
                if (!db.objectStoreNames.contains('leaderboard')) {
                    db.createObjectStore('leaderboard', { keyPath: 'odirectiid' });
                }
                if (!db.objectStoreNames.contains('settings')) {
                    db.createObjectStore('settings', { keyPath: 'key' });
                }
            };
        });
    },

    async saveProfile(profile) {
        if (this.db) {
            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction(['profiles'], 'readwrite');
                const store = transaction.objectStore('profiles');
                const request = store.put(profile);
                request.onsuccess = () => resolve(true);
                request.onerror = () => reject(false);
            });
        } else {
            const profiles = JSON.parse(localStorage.getItem('sweetcrush_profiles') || '[]');
            const index = profiles.findIndex(p => p.id === profile.id);
            if (index >= 0) {
                profiles[index] = profile;
            } else {
                profiles.push(profile);
            }
            localStorage.setItem('sweetcrush_profiles', JSON.stringify(profiles));
            return true;
        }
    },

    async getProfiles() {
        if (this.db) {
            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction(['profiles'], 'readonly');
                const store = transaction.objectStore('profiles');
                const request = store.getAll();
                request.onsuccess = () => resolve(request.result || []);
                request.onerror = () => resolve([]);
            });
        } else {
            return JSON.parse(localStorage.getItem('sweetcrush_profiles') || '[]');
        }
    },

    async deleteProfile(profileId) {
        if (this.db) {
            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction(['profiles'], 'readwrite');
                const store = transaction.objectStore('profiles');
                const request = store.delete(profileId);
                request.onsuccess = () => resolve(true);
                request.onerror = () => reject(false);
            });
        } else {
            const profiles = JSON.parse(localStorage.getItem('sweetcrush_profiles') || '[]');
            const filtered = profiles.filter(p => p.id !== profileId);
            localStorage.setItem('sweetcrush_profiles', JSON.stringify(filtered));
            return true;
        }
    },

    saveSetting(key, value) {
        localStorage.setItem(`sweetcrush_${key}`, JSON.stringify(value));
    },

    getSetting(key, defaultValue = null) {
        const value = localStorage.getItem(`sweetcrush_${key}`);
        return value ? JSON.parse(value) : defaultValue;
    },

    // Global leaderboard (simulated - would connect to real server)
    async getGlobalLeaderboard() {
        // In a real app, this would fetch from a server
        // For demo, we use localStorage with a shared key
        return JSON.parse(localStorage.getItem('sweetcrush_global_leaderboard') || '[]');
    },

    async updateGlobalLeaderboard(entry) {
        let leaderboard = await this.getGlobalLeaderboard();
        const existingIndex = leaderboard.findIndex(e => e.odirectiid === entry.odirectiid);
        
        if (existingIndex >= 0) {
            if (entry.score > leaderboard[existingIndex].score) {
                leaderboard[existingIndex] = entry;
            }
        } else {
            leaderboard.push(entry);
        }
        
        leaderboard.sort((a, b) => b.score - a.score);
        leaderboard = leaderboard.slice(0, 100); // Keep top 100
        
        localStorage.setItem('sweetcrush_global_leaderboard', JSON.stringify(leaderboard));
        return leaderboard;
    }
};

// ==========================================
// PROFILE MANAGER
// ==========================================
class ProfileManager {
    constructor() {
        this.profiles = [];
        this.currentProfile = null;
    }

    async init() {
        this.profiles = await StorageManager.getProfiles();
    }

    createProfile(name, avatarIndex, isProtected = false, pin = null) {
        if (this.profiles.length >= CONFIG.MAX_PROFILES) {
            return { success: false, error: 'Nombre maximum de profils atteint' };
        }

        const profile = {
            id: Utils.generateId(),
            odirectiid: Utils.generateId(), // For leaderboard
            name: name.trim().substring(0, 20),
            avatar: avatarIndex,
            isProtected: isProtected,
            pin: isProtected ? this.hashPin(pin) : null,
            createdAt: new Date().toISOString(),
            stats: {
                currentLevel: 1,
                maxLevel: 1,
                totalScore: 0,
                highScore: 0,
                totalMatches: 0,
                maxCombo: 0,
                gamesPlayed: 0,
                dailyStreak: 0,
                lastPlayDate: null,
                perfectLevels: 0
            },
            boosters: {
                hammer: 3,
                bomb: 2,
                rainbow: 1,
                shuffle: 3,
                extra_moves: 2
            },
            achievements: [],
            dailyReward: {
                lastClaimed: null,
                streak: 0
            },
            levelScores: {},
            coins: 100
        };

        this.profiles.push(profile);
        StorageManager.saveProfile(profile);
        
        return { success: true, profile };
    }

    hashPin(pin) {
        // Simple hash for demo - use proper hashing in production
        return btoa(pin + 'sweetcrush_salt');
    }

    verifyPin(profile, pin) {
        if (!profile.isProtected) return true;
        return profile.pin === this.hashPin(pin);
    }

    async selectProfile(profileId) {
        const profile = this.profiles.find(p => p.id === profileId);
        if (profile) {
            this.currentProfile = profile;
            this.checkDailyReward();
            this.updateDailyStreak();
            return profile;
        }
        return null;
    }

    async updateProfile(updates) {
        if (!this.currentProfile) return false;
        
        Object.assign(this.currentProfile, updates);
        await StorageManager.saveProfile(this.currentProfile);
        
        // Update in array
        const index = this.profiles.findIndex(p => p.id === this.currentProfile.id);
        if (index >= 0) {
            this.profiles[index] = this.currentProfile;
        }
        
        return true;
    }

    async deleteProfile(profileId, pin = null) {
        const profile = this.profiles.find(p => p.id === profileId);
        
        if (!profile) {
            return { success: false, error: 'Profil non trouvé' };
        }
        
        if (profile.isProtected && !this.verifyPin(profile, pin)) {
            return { success: false, error: 'Code PIN incorrect' };
        }
        
        await StorageManager.deleteProfile(profileId);
        this.profiles = this.profiles.filter(p => p.id !== profileId);
        
        if (this.currentProfile?.id === profileId) {
            this.currentProfile = null;
        }
        
        return { success: true };
    }

    async resetProgress(pin = null) {
        if (!this.currentProfile) return { success: false, error: 'Aucun profil sélectionné' };
        
        if (this.currentProfile.isProtected && !this.verifyPin(this.currentProfile, pin)) {
            return { success: false, error: 'Code PIN incorrect' };
        }
        
        this.currentProfile.stats = {
            currentLevel: 1,
            maxLevel: 1,
            totalScore: 0,
            highScore: 0,
            totalMatches: 0,
            maxCombo: 0,
            gamesPlayed: 0,
            dailyStreak: 0,
            lastPlayDate: null,
            perfectLevels: 0
        };
        this.currentProfile.levelScores = {};
        this.currentProfile.achievements = [];
        
        await StorageManager.saveProfile(this.currentProfile);
        
        return { success: true };
    }

    checkDailyReward() {
        if (!this.currentProfile) return null;
        
        const today = Utils.getToday();
        const lastClaimed = this.currentProfile.dailyReward.lastClaimed;
        
        if (lastClaimed !== today) {
            return {
                available: true,
                streak: this.currentProfile.dailyReward.streak + 1,
                reward: CONFIG.DAILY_REWARD_COINS * (1 + Math.min(this.currentProfile.dailyReward.streak, 6) * 0.1)
            };
        }
        
        return { available: false };
    }

    async claimDailyReward() {
        const reward = this.checkDailyReward();
        if (!reward.available) return null;
        
        const today = Utils.getToday();
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        
        let streak = this.currentProfile.dailyReward.streak;
        if (this.currentProfile.dailyReward.lastClaimed === yesterday) {
            streak++;
        } else {
            streak = 1;
        }
        
        this.currentProfile.dailyReward = {
            lastClaimed: today,
            streak: streak
        };
        
        const coins = Math.floor(CONFIG.DAILY_REWARD_COINS * (1 + Math.min(streak - 1, 6) * 0.1));
        this.currentProfile.coins += coins;
        
        // Random booster reward
        const boosterTypes = Object.keys(this.currentProfile.boosters);
        const randomBooster = boosterTypes[Math.floor(Math.random() * boosterTypes.length)];
        this.currentProfile.boosters[randomBooster]++;
        
        await StorageManager.saveProfile(this.currentProfile);
        
        return { coins, booster: randomBooster, streak };
    }

    updateDailyStreak() {
        if (!this.currentProfile) return;
        
        const today = Utils.getToday();
        const lastPlay = this.currentProfile.stats.lastPlayDate;
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        
        if (lastPlay === yesterday) {
            this.currentProfile.stats.dailyStreak++;
        } else if (lastPlay !== today) {
            this.currentProfile.stats.dailyStreak = 1;
        }
        
        this.currentProfile.stats.lastPlayDate = today;
        StorageManager.saveProfile(this.currentProfile);
    }

    checkAchievements() {
        if (!this.currentProfile) return [];
        
        const newAchievements = [];
        const stats = this.currentProfile.stats;
        
        ACHIEVEMENTS.forEach(achievement => {
            if (!this.currentProfile.achievements.includes(achievement.id)) {
                if (achievement.condition(stats)) {
                    this.currentProfile.achievements.push(achievement.id);
                    newAchievements.push(achievement);
                }
            }
        });
        
        if (newAchievements.length > 0) {
            StorageManager.saveProfile(this.currentProfile);
        }
        
        return newAchievements;
    }

    async updateLeaderboard() {
        if (!this.currentProfile) return;
        
        const entry = {
            odirectiid: this.currentProfile.odirectiid,
            name: this.currentProfile.name,
            avatar: this.currentProfile.avatar,
            score: this.currentProfile.stats.highScore,
            level: this.currentProfile.stats.maxLevel,
            updatedAt: new Date().toISOString()
        };
        
        return await StorageManager.updateGlobalLeaderboard(entry);
    }

    generateRecoveryCode() {
        if (!this.currentProfile) return null;
        
        const data = {
            id: this.currentProfile.id,
            name: this.currentProfile.name,
            stats: this.currentProfile.stats,
            timestamp: Date.now()
        };
        
        return btoa(JSON.stringify(data));
    }

    async restoreFromCode(code) {
        try {
            const data = JSON.parse(atob(code));
            // Implement restore logic
            return { success: true };
        } catch (e) {
            return { success: false, error: 'Code invalide' };
        }
    }
}

// ==========================================
// GAME ENGINE
// ==========================================
class GameEngine {
    constructor() {
        this.grid = [];
        this.gridSize = CONFIG.GRID_SIZE;
        this.selectedCandy = null;
        this.isAnimating = false;
        this.score = 0;
        this.moves = 0;
        this.targetScore = 0;
        this.maxMoves = 0;
        this.combo = 0;
        this.currentLevel = null;
        this.isGameOver = false;
        this.isPaused = false;
        this.matchCount = 0;
    }

    initLevel(levelId) {
        const level = LEVELS.find(l => l.id === levelId) || LEVELS[0];
        this.currentLevel = level;
        this.targetScore = level.target;
        this.maxMoves = level.moves;
        this.moves = level.moves;
        this.score = 0;
        this.combo = 0;
        this.isGameOver = false;
        this.matchCount = 0;
        
        this.createGrid();
        this.ensureNoInitialMatches();
        
        return level;
    }

    createGrid() {
        this.grid = [];
        for (let row = 0; row < this.gridSize; row++) {
            this.grid[row] = [];
            for (let col = 0; col < this.gridSize; col++) {
                this.grid[row][col] = this.createCandy(row, col);
            }
        }
    }

    createCandy(row, col, type = null) {
        return {
            type: type !== null ? type : Math.floor(Math.random() * CONFIG.CANDY_TYPES),
            row,
            col,
            isSpecial: false,
            specialType: null, // 'striped-h', 'striped-v', 'wrapped', 'color-bomb'
            isMatched: false,
            isFalling: false
        };
    }

    ensureNoInitialMatches() {
        let hasMatches = true;
        let attempts = 0;
        
        while (hasMatches && attempts < 100) {
            hasMatches = false;
            attempts++;
            
            for (let row = 0; row < this.gridSize; row++) {
                for (let col = 0; col < this.gridSize; col++) {
                    // Check horizontal
                    if (col >= 2) {
                        if (this.grid[row][col].type === this.grid[row][col-1].type &&
                            this.grid[row][col].type === this.grid[row][col-2].type) {
                            this.grid[row][col].type = (this.grid[row][col].type + 1) % CONFIG.CANDY_TYPES;
                            hasMatches = true;
                        }
                    }
                    // Check vertical
                    if (row >= 2) {
                        if (this.grid[row][col].type === this.grid[row-1][col].type &&
                            this.grid[row][col].type === this.grid[row-2][col].type) {
                            this.grid[row][col].type = (this.grid[row][col].type + 1) % CONFIG.CANDY_TYPES;
                            hasMatches = true;
                        }
                    }
                }
            }
        }
    }

    canSwap(candy1, candy2) {
        const rowDiff = Math.abs(candy1.row - candy2.row);
        const colDiff = Math.abs(candy1.col - candy2.col);
        return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
    }

    async swap(candy1, candy2, isRevert = false) {
        // Swap in grid
        const temp = { type: candy1.type, isSpecial: candy1.isSpecial, specialType: candy1.specialType };
        candy1.type = candy2.type;
        candy1.isSpecial = candy2.isSpecial;
        candy1.specialType = candy2.specialType;
        candy2.type = temp.type;
        candy2.isSpecial = temp.isSpecial;
        candy2.specialType = temp.specialType;

        return new Promise(resolve => setTimeout(resolve, CONFIG.SWAP_DURATION));
    }

    findMatches() {
        const matches = [];
        
        // Check horizontal matches
        for (let row = 0; row < this.gridSize; row++) {
            let matchLength = 1;
            for (let col = 1; col < this.gridSize; col++) {
                if (this.grid[row][col].type === this.grid[row][col-1].type) {
                    matchLength++;
                } else {
                    if (matchLength >= CONFIG.MIN_MATCH) {
                        for (let i = 0; i < matchLength; i++) {
                            matches.push({ row, col: col - 1 - i });
                        }
                    }
                    matchLength = 1;
                }
            }
            if (matchLength >= CONFIG.MIN_MATCH) {
                for (let i = 0; i < matchLength; i++) {
                    matches.push({ row, col: this.gridSize - 1 - i });
                }
            }
        }
        
        // Check vertical matches
        for (let col = 0; col < this.gridSize; col++) {
            let matchLength = 1;
            for (let row = 1; row < this.gridSize; row++) {
                if (this.grid[row][col].type === this.grid[row-1][col].type) {
                    matchLength++;
                } else {
                    if (matchLength >= CONFIG.MIN_MATCH) {
                        for (let i = 0; i < matchLength; i++) {
                            matches.push({ row: row - 1 - i, col });
                        }
                    }
                    matchLength = 1;
                }
            }
            if (matchLength >= CONFIG.MIN_MATCH) {
                for (let i = 0; i < matchLength; i++) {
                    matches.push({ row: this.gridSize - 1 - i, col });
                }
            }
        }
        
        return matches;
    }

    async processMatches() {
        let matches = this.findMatches();
        let totalCombos = 0;
        
        while (matches.length > 0) {
            totalCombos++;
            this.combo = totalCombos;
            
            // Mark matched candies
            matches.forEach(({row, col}) => {
                if (this.grid[row] && this.grid[row][col]) {
                    this.grid[row][col].isMatched = true;
                }
            });
            
            // Calculate score
            const matchScore = matches.length * 10 * Math.pow(CONFIG.COMBO_MULTIPLIER, totalCombos - 1);
            this.score += Math.floor(matchScore);
            this.matchCount += matches.length;
            
            // Wait for animation
            await new Promise(resolve => setTimeout(resolve, CONFIG.ANIMATION_SPEED));
            
            // Remove matched candies
            this.removeMatches(matches);
            
            // Wait for removal animation
            await new Promise(resolve => setTimeout(resolve, CONFIG.ANIMATION_SPEED / 2));
            
            // Drop candies
            await this.dropCandies();
            
            // Fill empty spaces
            await this.fillEmptySpaces();
            
            // Check for new matches
            matches = this.findMatches();
        }
        
        this.combo = 0;
        return totalCombos;
    }

    removeMatches(matches) {
        const uniqueMatches = [];
        const seen = new Set();
        
        matches.forEach(({row, col}) => {
            const key = `${row}-${col}`;
            if (!seen.has(key)) {
                seen.add(key);
                uniqueMatches.push({row, col});
            }
        });
        
        uniqueMatches.forEach(({row, col}) => {
            if (this.grid[row] && this.grid[row][col]) {
                this.grid[row][col] = null;
            }
        });
    }

    async dropCandies() {
        let dropped = false;
        
        for (let col = 0; col < this.gridSize; col++) {
            let emptyRow = this.gridSize - 1;
            
            for (let row = this.gridSize - 1; row >= 0; row--) {
                if (this.grid[row][col] !== null) {
                    if (row !== emptyRow) {
                        this.grid[emptyRow][col] = this.grid[row][col];
                        this.grid[emptyRow][col].row = emptyRow;
                        this.grid[row][col] = null;
                        dropped = true;
                    }
                    emptyRow--;
                }
            }
        }
        
        if (dropped) {
            await new Promise(resolve => setTimeout(resolve, CONFIG.FALL_DURATION));
        }
        
        return dropped;
    }

    async fillEmptySpaces() {
        for (let col = 0; col < this.gridSize; col++) {
            for (let row = 0; row < this.gridSize; row++) {
                if (this.grid[row][col] === null) {
                    this.grid[row][col] = this.createCandy(row, col);
                    this.grid[row][col].isFalling = true;
                }
            }
        }
        
        await new Promise(resolve => setTimeout(resolve, CONFIG.FALL_DURATION));
        
        // Reset falling state
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                if (this.grid[row][col]) {
                    this.grid[row][col].isFalling = false;
                }
            }
        }
    }

    async makeMove(row1, col1, row2, col2) {
        if (this.isAnimating || this.isGameOver || this.isPaused) return null;
        
        const candy1 = this.grid[row1][col1];
        const candy2 = this.grid[row2][col2];
        
        if (!candy1 || !candy2) return null;
        if (!this.canSwap(candy1, candy2)) return null;
        
        this.isAnimating = true;
        
        // Perform swap
        await this.swap(candy1, candy2);
        
        // Check for matches
        const matches = this.findMatches();
        
        if (matches.length === 0) {
            // Invalid move, swap back
            await this.swap(candy1, candy2, true);
            this.isAnimating = false;
            SoundManager.play('invalid');
            return { valid: false };
        }
        
        // Valid move
        this.moves--;
        SoundManager.play('match');
        
        // Process matches (cascade)
        const combos = await this.processMatches();
        
        if (combos > 1) {
            SoundManager.play('combo');
            Utils.vibrate([10, 50, 10]);
        }
        
        this.isAnimating = false;
        
        // Check game state
        const gameState = this.checkGameState();
        
        return { 
            valid: true, 
            combos, 
            score: this.score, 
            moves: this.moves,
            gameState
        };
    }

    checkGameState() {
        if (this.score >= this.targetScore) {
            this.isGameOver = true;
            return { 
                status: 'win', 
                stars: this.calculateStars(),
                score: this.score,
                movesLeft: this.moves
            };
        }
        
        if (this.moves <= 0) {
            this.isGameOver = true;
            return { 
                status: 'lose',
                score: this.score,
                target: this.targetScore
            };
        }
        
        // Check if any moves available
        if (!this.hasValidMoves()) {
            this.shuffleGrid();
            return { status: 'shuffled' };
        }
        
        return { status: 'playing' };
    }

    calculateStars() {
        const percentage = this.score / this.targetScore;
        if (percentage >= 2) return 3;
        if (percentage >= 1.5) return 2;
        return 1;
    }

    hasValidMoves() {
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                // Check right swap
                if (col < this.gridSize - 1) {
                    this.swapTemp(row, col, row, col + 1);
                    if (this.findMatches().length > 0) {
                        this.swapTemp(row, col, row, col + 1);
                        return true;
                    }
                    this.swapTemp(row, col, row, col + 1);
                }
                // Check down swap
                if (row < this.gridSize - 1) {
                    this.swapTemp(row, col, row + 1, col);
                    if (this.findMatches().length > 0) {
                        this.swapTemp(row, col, row + 1, col);
                        return true;
                    }
                    this.swapTemp(row, col, row + 1, col);
                }
            }
        }
        return false;
    }

    swapTemp(row1, col1, row2, col2) {
        const temp = this.grid[row1][col1].type;
        this.grid[row1][col1].type = this.grid[row2][col2].type;
        this.grid[row2][col2].type = temp;
    }

    shuffleGrid() {
        const types = [];
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                types.push(this.grid[row][col].type);
            }
        }
        
        // Fisher-Yates shuffle
        for (let i = types.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [types[i], types[j]] = [types[j], types[i]];
        }
        
        let index = 0;
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                this.grid[row][col].type = types[index++];
            }
        }
        
        this.ensureNoInitialMatches();
    }

    // Booster effects
    useHammer(row, col) {
        if (!this.grid[row] || !this.grid[row][col]) return false;
        
        this.grid[row][col] = null;
        this.score += 50;
        
        return true;
    }

    useBomb(row, col) {
        const affected = [];
        
        for (let r = Math.max(0, row - 1); r <= Math.min(this.gridSize - 1, row + 1); r++) {
            for (let c = Math.max(0, col - 1); c <= Math.min(this.gridSize - 1, col + 1); c++) {
                if (this.grid[r][c]) {
                    affected.push({ row: r, col: c });
                    this.grid[r][c] = null;
                }
            }
        }
        
        this.score += affected.length * 30;
        
        return affected;
    }

    useRainbow(targetType) {
        const affected = [];
        
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                if (this.grid[row][col] && this.grid[row][col].type === targetType) {
                    affected.push({ row, col });
                    this.grid[row][col] = null;
                }
            }
        }
        
        this.score += affected.length * 20;
        
        return affected;
    }

    useShuffle() {
        this.shuffleGrid();
        return true;
    }

    addExtraMoves(amount = 5) {
        this.moves += amount;
        return this.moves;
    }

    getHint() {
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                if (col < this.gridSize - 1) {
                    this.swapTemp(row, col, row, col + 1);
                    if (this.findMatches().length > 0) {
                        this.swapTemp(row, col, row, col + 1);
                        return { row1: row, col1: col, row2: row, col2: col + 1 };
                    }
                    this.swapTemp(row, col, row, col + 1);
                }
                if (row < this.gridSize - 1) {
                    this.swapTemp(row, col, row + 1, col);
                    if (this.findMatches().length > 0) {
                        this.swapTemp(row, col, row + 1, col);
                        return { row1: row, col1: col, row2: row + 1, col2: col };
                    }
                    this.swapTemp(row, col, row + 1, col);
                }
            }
        }
        return null;
    }
}

// ==========================================
// UI MANAGER
// ==========================================
class UIManager {
    constructor(game) {
        this.game = game;
        this.currentScreen = 'loading';
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.selectedCell = null;
        this.isDragging = false;
        this.activeBooster = null;
        this.pinInput = '';
        this.pinCallback = null;
        this.darkMode = StorageManager.getSetting('darkMode', false);
        this.colorblindMode = StorageManager.getSetting('colorblindMode', false);
    }

    init() {
        this.setupEventListeners();
        this.applyTheme();
        this.showScreen('profile-select');
    }

    setupEventListeners() {
        // Touch events for game grid
        document.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
        document.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
        document.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });
        
        // Click events (for desktop testing)
        document.addEventListener('click', this.handleClick.bind(this));
        
        // Prevent context menu
        document.addEventListener('contextmenu', e => e.preventDefault());
        
        // Handle visibility change (pause game)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && this.game.gameEngine && !this.game.gameEngine.isPaused) {
                this.showPauseMenu();
            }
        });
    }

    handleTouchStart(e) {
        if (this.currentScreen !== 'game') return;
        
        const touch = e.touches[0];
        const target = document.elementFromPoint(touch.clientX, touch.clientY);
        
        if (target && target.classList.contains('candy-cell')) {
            e.preventDefault();
            this.touchStartX = touch.clientX;
            this.touchStartY = touch.clientY;
            this.selectedCell = target;
            this.isDragging = true;
            target.classList.add('selected');
            Utils.vibrate(5);
        }
    }

    handleTouchMove(e) {
        if (!this.isDragging || !this.selectedCell) return;
        e.preventDefault();
    }

    handleTouchEnd(e) {
        if (!this.isDragging || !this.selectedCell) return;
        
        const touch = e.changedTouches[0];
        const deltaX = touch.clientX - this.touchStartX;
        const deltaY = touch.clientY - this.touchStartY;
        const threshold = 30;
        
        this.selectedCell.classList.remove('selected');
        
        const row = parseInt(this.selectedCell.dataset.row);
        const col = parseInt(this.selectedCell.dataset.col);
        
        let targetRow = row;
        let targetCol = col;
        
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            if (deltaX > threshold) targetCol++;
            else if (deltaX < -threshold) targetCol--;
        } else {
            if (deltaY > threshold) targetRow++;
            else if (deltaY < -threshold) targetRow--;
        }
        
        if (targetRow !== row || targetCol !== col) {
            if (this.activeBooster) {
                this.useActiveBooster(row, col);
            } else {
                this.game.makeMove(row, col, targetRow, targetCol);
            }
        } else if (this.activeBooster) {
            this.useActiveBooster(row, col);
        }
        
        this.isDragging = false;
        this.selectedCell = null;
    }

    handleClick(e) {
        const target = e.target;
        
        // Handle button clicks
        if (target.matches('[data-action]')) {
            const action = target.dataset.action;
            this.handleAction(action, target);
            SoundManager.play('click');
            Utils.vibrate(5);
        }
        
        // Handle candy clicks (for booster usage)
        if (target.classList.contains('candy-cell') && this.activeBooster) {
            const row = parseInt(target.dataset.row);
            const col = parseInt(target.dataset.col);
            this.useActiveBooster(row, col);
        }
    }

    handleAction(action, target) {
        switch (action) {
            case 'select-profile':
                this.showProfileSelect();
                break;
            case 'create-profile':
                this.showCreateProfile();
                break;
            case 'confirm-create-profile':
                this.createProfile();
                break;
            case 'play-profile':
                const profileId = target.dataset.profileId;
                this.selectProfile(profileId);
                break;
            case 'delete-profile':
                this.confirmDeleteProfile(target.dataset.profileId);
                break;
            case 'play-level':
                const levelId = parseInt(target.dataset.levelId);
                this.game.startLevel(levelId);
                break;
            case 'show-levels':
                this.showScreen('level-select');
                this.renderLevelSelect();
                break;
            case 'show-leaderboard':
                this.showLeaderboard();
                break;
            case 'show-achievements':
                this.showAchievements();
                break;
            case 'show-settings':
                this.showSettings();
                break;
            case 'toggle-sound':
                SoundManager.toggle();
                this.updateSettingsUI();
                break;
            case 'toggle-music':
                SoundManager.toggleMusic();
                this.updateSettingsUI();
                break;
            case 'toggle-dark-mode':
                this.toggleDarkMode();
                break;
            case 'toggle-colorblind':
                this.toggleColorblindMode();
                break;
            case 'claim-daily':
                this.claimDailyReward();
                break;
            case 'pause':
                this.showPauseMenu();
                break;
            case 'resume':
                this.hidePauseMenu();
                break;
            case 'restart':
                this.game.restartLevel();
                break;
            case 'quit':
                this.showScreen('main-menu');
                break;
            case 'use-booster':
                const boosterId = target.dataset.boosterId;
                this.activateBooster(boosterId);
                break;
            case 'cancel-booster':
                this.cancelBooster();
                break;
            case 'next-level':
                this.game.nextLevel();
                break;
            case 'retry':
                this.game.restartLevel();
                break;
            case 'pin-digit':
                this.enterPinDigit(target.dataset.digit);
                break;
            case 'pin-delete':
                this.deletePinDigit();
                break;
            case 'pin-cancel':
                this.cancelPin();
                break;
            case 'close-modal':
                this.closeModal();
                break;
            case 'back':
                this.goBack();
                break;
            case 'toggle-protection':
                this.toggleProfileProtection();
                break;
            case 'avatar-select':
                const avatarIndex = parseInt(target.dataset.index);
                this.selectAvatar(avatarIndex);
                break;
        }
    }

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        const screen = document.getElementById(screenId);
        if (screen) {
            screen.classList.add('active');
            this.currentScreen = screenId;
        }
    }

    async showProfileSelect() {
        await this.game.profileManager.init();
        this.showScreen('profile-select');
        this.renderProfileList();
    }

    renderProfileList() {
        const container = document.getElementById('profile-list');
        const profiles = this.game.profileManager.profiles;
        
        let html = '';
        
        profiles.forEach(profile => {
            html += `
                <div class="profile-card" data-profile-id="${profile.id}">
                    <img src="${AVATARS[profile.avatar]}" alt="Avatar" class="profile-avatar">
                    <div class="profile-info">
                        <h3>${this.escapeHtml(profile.name)}</h3>
                        <p>Niveau ${profile.stats.maxLevel} • ${Utils.formatNumber(profile.stats.highScore)} pts</p>
                    </div>
                    ${profile.isProtected ? '<span class="protected-badge">🔒</span>' : ''}
                    <button class="btn-play" data-action="play-profile" data-profile-id="${profile.id}">▶️</button>
                </div>
            `;
        });
        
        if (profiles.length < CONFIG.MAX_PROFILES) {
            html += `
                <button class="btn-create-profile" data-action="create-profile">
                    <span class="plus-icon">➕</span>
                    <span>Nouveau profil</span>
                </button>
            `;
        }
        
        container.innerHTML = html;
    }

    showCreateProfile() {
        this.showScreen('create-profile');
        this.selectedAvatarIndex = 0;
        this.isProtectedProfile = false;
        this.renderAvatarGrid();
        document.getElementById('profile-name-input').value = '';
        document.getElementById('protection-toggle').checked = false;
    }

    renderAvatarGrid() {
        const container = document.getElementById('avatar-grid');
        let html = '';
        
        AVATARS.forEach((avatar, index) => {
            html += `
                <div class="avatar-option ${index === this.selectedAvatarIndex ? 'selected' : ''}" 
                     data-action="avatar-select" data-index="${index}">
                    <img src="${avatar}" alt="Avatar ${index + 1}">
                </div>
            `;
        });
        
        container.innerHTML = html;
    }

    selectAvatar(index) {
        this.selectedAvatarIndex = index;
        document.querySelectorAll('.avatar-option').forEach((el, i) => {
            el.classList.toggle('selected', i === index);
        });
    }

    toggleProfileProtection() {
        this.isProtectedProfile = !this.isProtectedProfile;
        const pinSection = document.getElementById('pin-setup-section');
        if (pinSection) {
            pinSection.style.display = this.isProtectedProfile ? 'block' : 'none';
        }
    }

    async createProfile() {
        const nameInput = document.getElementById('profile-name-input');
        const name = nameInput.value.trim();
        
        if (!name) {
            this.showToast('Veuillez entrer un prénom', 'error');
            return;
        }
        
        let pin = null;
        if (this.isProtectedProfile) {
            const pinInputs = document.querySelectorAll('.pin-setup-input');
            pin = Array.from(pinInputs).map(i => i.value).join('');
            
            if (pin.length !== 4) {
                this.showToast('Le code PIN doit contenir 4 chiffres', 'error');
                return;
            }
        }
        
        const result = this.game.profileManager.createProfile(
            name, 
            this.selectedAvatarIndex,
            this.isProtectedProfile,
            pin
        );
        
        if (result.success) {
            this.showToast('Profil créé avec succès ! 🎉', 'success');
            await this.game.profileManager.selectProfile(result.profile.id);
            this.showScreen('main-menu');
            this.renderMainMenu();
        } else {
            this.showToast(result.error, 'error');
        }
    }

    async selectProfile(profileId) {
        const profile = this.game.profileManager.profiles.find(p => p.id === profileId);
        
        if (!profile) return;
        
        if (profile.isProtected) {
            this.showPinInput((pin) => {
                if (this.game.profileManager.verifyPin(profile, pin)) {
                    this.completeProfileSelection(profileId);
                } else {
                    this.showToast('Code PIN incorrect', 'error');
                }
            });
        } else {
            this.completeProfileSelection(profileId);
        }
    }

    async completeProfileSelection(profileId) {
        await this.game.profileManager.selectProfile(profileId);
        this.showScreen('main-menu');
        this.renderMainMenu();
        this.checkDailyReward();
    }

    renderMainMenu() {
        const profile = this.game.profileManager.currentProfile;
        if (!profile) return;
        
        const container = document.getElementById('main-menu-content');
        container.innerHTML = `
            <div class="profile-header">
                <img src="${AVATARS[profile.avatar]}" alt="Avatar" class="current-avatar">
                <div class="profile-details">
                    <h2>${this.escapeHtml(profile.name)}</h2>
                    <p>Niveau ${profile.stats.maxLevel}</p>
                    <p>💰 ${Utils.formatNumber(profile.coins)} pièces</p>
                </div>
                <button class="btn-icon" data-action="select-profile">👤</button>
            </div>
            
            <div class="stats-bar">
                <div class="stat">
                    <span class="stat-value">${Utils.formatNumber(profile.stats.highScore)}</span>
                    <span class="stat-label">Meilleur score</span>
                </div>
                <div class="stat">
                    <span class="stat-value">${profile.stats.dailyStreak}</span>
                    <span class="stat-label">Jours de suite</span>
                </div>
                <div class="stat">
                    <span class="stat-value">${profile.achievements.length}/${ACHIEVEMENTS.length}</span>
                    <span class="stat-label">Succès</span>
                </div>
            </div>
            
            <div class="menu-buttons">
                <button class="btn-primary btn-large" data-action="show-levels">
                    🎮 Jouer
                </button>
                <div class="btn-row">
                    <button class="btn-secondary" data-action="show-leaderboard">
                        🏆 Classement
                    </button>
                    <button class="btn-secondary" data-action="show-achievements">
                        ⭐ Succès
                    </button>
                </div>
                <div class="btn-row">
                    <button class="btn-secondary" data-action="claim-daily" id="daily-reward-btn">
                        🎁 Récompense
                    </button>
                    <button class="btn-secondary" data-action="show-settings">
                        ⚙️ Options
                    </button>
                </div>
            </div>
        `;
    }

    checkDailyReward() {
        const reward = this.game.profileManager.checkDailyReward();
        const btn = document.getElementById('daily-reward-btn');
        
        if (btn) {
            if (reward && reward.available) {
                btn.classList.add('has-reward');
                btn.innerHTML = '🎁 Récompense !';
            } else {
                btn.classList.remove('has-reward');
                btn.innerHTML = '🎁 Récompense';
            }
        }
    }

    async claimDailyReward() {
        const reward = await this.game.profileManager.claimDailyReward();
        
        if (reward) {
            const booster = BOOSTERS.find(b => b.id === reward.booster);
            this.showModal('daily-reward', `
                <div class="daily-reward-content">
                    <h2>🎁 Récompense quotidienne !</h2>
                    <p class="streak-text">Jour ${reward.streak} de suite !</p>
                    <div class="rewards">
                        <div class="reward-item">
                            <span class="reward-icon">💰</span>
                            <span class="reward-value">+${reward.coins} pièces</span>
                        </div>
                        <div class="reward-item">
                            <span class="reward-icon">${booster ? booster.icon : '🎁'}</span>
                            <span class="reward-value">+1 ${booster ? booster.name : 'Booster'}</span>
                        </div>
                    </div>
                    <button class="btn-primary" data-action="close-modal">Super !</button>
                </div>
            `);
            
            SoundManager.play('special');
            Utils.vibrate([50, 100, 50]);
            this.checkDailyReward();
            this.renderMainMenu();
        } else {
            this.showToast('Reviens demain pour ta récompense !', 'info');
        }
    }

    renderLevelSelect() {
        const profile = this.game.profileManager.currentProfile;
        const container = document.getElementById('level-grid');
        
        let html = '';
        LEVELS.forEach(level => {
            const isUnlocked = level.id <= profile.stats.maxLevel;
            const levelScore = profile.levelScores[level.id] || null;
            const stars = levelScore ? levelScore.stars : 0;
            
            html += `
                <div class="level-card ${isUnlocked ? 'unlocked' : 'locked'}" 
                     ${isUnlocked ? `data-action="play-level" data-level-id="${level.id}"` : ''}>
                    <span class="level-number">${level.id}</span>
                    <div class="level-stars">
                        ${this.renderStars(stars)}
                    </div>
                    ${!isUnlocked ? '<span class="lock-icon">🔒</span>' : ''}
                </div>
            `;
        });
        
        container.innerHTML = html;
    }

    renderStars(count) {
        let html = '';
        for (let i = 0; i < 3; i++) {
            html += `<span class="star ${i < count ? 'earned' : ''}">${i < count ? '⭐' : '☆'}</span>`;
        }
        return html;
    }

    renderGameScreen(level) {
        this.showScreen('game');
        
        const container = document.getElementById('game-content');
        container.innerHTML = `
            <div class="game-header">
                <button class="btn-icon" data-action="pause">⏸️</button>
                <div class="level-info">
                    <span class="level-title">${level.title}</span>
                </div>
                <div class="score-display">
                    <span id="current-score">0</span>
                </div>
            </div>
            
            <div class="game-stats">
                <div class="stat-item">
                    <span class="stat-icon">🎯</span>
                    <span id="target-score">${Utils.formatNumber(level.target)}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-icon">👆</span>
                    <span id="moves-left">${level.moves}</span>
                </div>
                <div class="combo-display" id="combo-display" style="display: none;">
                    <span id="combo-count">x0</span>
                </div>
            </div>
            
            <div class="progress-bar">
                <div class="progress-fill" id="score-progress" style="width: 0%"></div>
                <div class="progress-stars">
                    <span class="progress-star" data-star="1" style="left: 33%">⭐</span>
                    <span class="progress-star" data-star="2" style="left: 66%">⭐</span>
                    <span class="progress-star" data-star="3" style="left: 100%">⭐</span>
                </div>
            </div>
            
            <div class="game-grid" id="game-grid">
                ${this.renderGrid()}
            </div>
            
            <div class="booster-bar">
                ${this.renderBoosters()}
            </div>
        `;
    }

    renderGrid() {
        const grid = this.game.gameEngine.grid;
        let html = '';
        
        for (let row = 0; row < grid.length; row++) {
            for (let col = 0; col < grid[row].length; col++) {
                const candy = grid[row][col];
                if (candy) {
                    const colorClass = this.colorblindMode ? `cb-type-${candy.type}` : '';
                    html += `
                        <div class="candy-cell ${candy.isMatched ? 'matched' : ''} ${candy.isFalling ? 'falling' : ''} ${colorClass}"
                             data-row="${row}" data-col="${col}" data-type="${candy.type}"
                             style="background-color: ${CANDY_COLORS[candy.type]}">
                            <span class="candy-emoji">${CANDY_EMOJIS[candy.type]}</span>
                            ${candy.isSpecial ? `<span class="special-indicator">${this.getSpecialIndicator(candy.specialType)}</span>` : ''}
                        </div>
                    `;
                }
            }
        }
        
        return html;
    }

    getSpecialIndicator(type) {
        switch (type) {
            case 'striped-h': return '↔️';
            case 'striped-v': return '↕️';
            case 'wrapped': return '💫';
            case 'color-bomb': return '🌈';
            default: return '';
        }
    }

    renderBoosters() {
        const profile = this.game.profileManager.currentProfile;
        let html = '';
        
        BOOSTERS.forEach(booster => {
            const count = profile.boosters[booster.id] || 0;
            html += `
                <button class="booster-btn ${count === 0 ? 'disabled' : ''}" 
                        data-action="use-booster" data-booster-id="${booster.id}"
                        ${count === 0 ? 'disabled' : ''}>
                    <span class="booster-icon">${booster.icon}</span>
                    <span class="booster-count">${count}</span>
                </button>
            `;
        });
        
        return html;
    }

    updateGameUI() {
        const engine = this.game.gameEngine;
        
        document.getElementById('current-score').textContent = Utils.formatNumber(engine.score);
        document.getElementById('moves-left').textContent = engine.moves;
        
        const progress = Math.min(100, (engine.score / engine.targetScore) * 100);
        document.getElementById('score-progress').style.width = `${progress}%`;
        
        // Update stars
        document.querySelectorAll('.progress-star').forEach(star => {
            const starNum = parseInt(star.dataset.star);
            const threshold = engine.targetScore * (starNum === 1 ? 1 : starNum === 2 ? 1.5 : 2);
            star.classList.toggle('earned', engine.score >= threshold);
        });
        
        // Combo display
        const comboDisplay = document.getElementById('combo-display');
        if (engine.combo > 1) {
            comboDisplay.style.display = 'block';
            document.getElementById('combo-count').textContent = `x${engine.combo}`;
            comboDisplay.classList.add('animate');
            setTimeout(() => comboDisplay.classList.remove('animate'), 300);
        } else {
            comboDisplay.style.display = 'none';
        }
        
        // Update grid
        document.getElementById('game-grid').innerHTML = this.renderGrid();
    }

    activateBooster(boosterId) {
        const profile = this.game.profileManager.currentProfile;
        const count = profile.boosters[boosterId] || 0;
        
        if (count === 0) {
            this.showToast('Pas assez de boosters !', 'error');
            return;
        }
        
        this.activeBooster = boosterId;
        document.getElementById('game-grid').classList.add('booster-active');
        
        // Show instruction based on booster
        const booster = BOOSTERS.find(b => b.id === boosterId);
        this.showToast(`${booster.icon} Touche un bonbon pour utiliser ${booster.name}`, 'info');
    }

    async useActiveBooster(row, col) {
        if (!this.activeBooster) return;
        
        const engine = this.game.gameEngine;
        const profile = this.game.profileManager.currentProfile;
        
        let success = false;
        
        switch (this.activeBooster) {
            case 'hammer':
                success = engine.useHammer(row, col);
                break;
            case 'bomb':
                success = engine.useBomb(row, col).length > 0;
                break;
            case 'rainbow':
                const candy = engine.grid[row][col];
                if (candy) {
                    success = engine.useRainbow(candy.type).length > 0;
                }
                break;
            case 'shuffle':
                success = engine.useShuffle();
                break;
            case 'extra_moves':
                success = engine.addExtraMoves(5) > 0;
                break;
        }
        
        if (success) {
            profile.boosters[this.activeBooster]--;
            await StorageManager.saveProfile(profile);
            
            SoundManager.play('special');
            Utils.vibrate([20, 50, 20]);
            
            // Process any resulting matches
            await engine.dropCandies();
            await engine.fillEmptySpaces();
            await engine.processMatches();
            
            this.updateGameUI();
        }
        
        this.cancelBooster();
    }

    cancelBooster() {
        this.activeBooster = null;
        document.getElementById('game-grid')?.classList.remove('booster-active');
    }

    showPauseMenu() {
        this.game.gameEngine.isPaused = true;
        
        this.showModal('pause-menu', `
            <div class="pause-content">
                <h2>⏸️ Pause</h2>
                <div class="pause-buttons">
                    <button class="btn-primary" data-action="resume">▶️ Reprendre</button>
                    <button class="btn-secondary" data-action="restart">🔄 Recommencer</button>
                    <button class="btn-secondary" data-action="quit">🚪 Quitter</button>
                </div>
            </div>
        `);
    }

    hidePauseMenu() {
        this.game.gameEngine.isPaused = false;
        this.closeModal();
    }

    showLevelComplete(result) {
        SoundManager.play('levelComplete');
        Utils.vibrate([50, 100, 50, 100, 50]);
        
        const starsHtml = this.renderStars(result.stars);
        
        this.showModal('level-complete', `
            <div class="level-complete-content">
                <h2>🎉 Niveau terminé !</h2>
                <div class="stars-display">${starsHtml}</div>
                <div class="score-display">
                    <span class="final-score">${Utils.formatNumber(result.score)}</span>
                    <span class="score-label">points</span>
                </div>
                ${result.movesLeft > 0 ? `<p>+${result.movesLeft * 50} points bonus (coups restants)</p>` : ''}
                <div class="complete-buttons">
                    <button class="btn-secondary" data-action="quit">Menu</button>
                    <button class="btn-primary" data-action="next-level">Suivant ▶️</button>
                </div>
            </div>
        `);
    }

    showLevelFailed(result) {
        SoundManager.play('invalid');
        
        this.showModal('level-failed', `
            <div class="level-failed-content">
                <h2>😔 Niveau échoué</h2>
                <p>Score: ${Utils.formatNumber(result.score)} / ${Utils.formatNumber(result.target)}</p>
                <div class="failed-buttons">
                    <button class="btn-secondary" data-action="quit">Menu</button>
                    <button class="btn-primary" data-action="retry">🔄 Réessayer</button>
                </div>
            </div>
        `);
    }

    async showLeaderboard() {
        this.showScreen('leaderboard');
        
        const leaderboard = await StorageManager.getGlobalLeaderboard();
        const profile = this.game.profileManager.currentProfile;
        
        const container = document.getElementById('leaderboard-content');
        let html = `
            <div class="leaderboard-header">
                <button class="btn-icon" data-action="back">←</button>
                <h2>🏆 Classement mondial</h2>
            </div>
            <div class="leaderboard-list">
        `;
        
        if (leaderboard.length === 0) {
            html += `<p class="empty-text">Aucun score enregistré</p>`;
        } else {
            leaderboard.forEach((entry, index) => {
                const isCurrentUser = entry.odirectiid === profile?.odirectiid;
                const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}`;
                
                html += `
                    <div class="leaderboard-entry ${isCurrentUser ? 'current-user' : ''}">
                        <span class="rank">${medal}</span>
                        <img src="${AVATARS[entry.avatar] || AVATARS[0]}" alt="Avatar" class="entry-avatar">
                        <div class="entry-info">
                            <span class="entry-name">${this.escapeHtml(entry.name)}</span>
                            <span class="entry-level">Niveau ${entry.level}</span>
                        </div>
                        <span class="entry-score">${Utils.formatNumber(entry.score)}</span>
                    </div>
                `;
            });
        }
        
        html += '</div>';
        container.innerHTML = html;
    }

    showAchievements() {
        this.showScreen('achievements');
        
        const profile = this.game.profileManager.currentProfile;
        const container = document.getElementById('achievements-content');
        
        let html = `
            <div class="achievements-header">
                <button class="btn-icon" data-action="back">←</button>
                <h2>⭐ Succès</h2>
                <span class="achievement-count">${profile.achievements.length}/${ACHIEVEMENTS.length}</span>
            </div>
            <div class="achievements-list">
        `;
        
        ACHIEVEMENTS.forEach(achievement => {
            const isUnlocked = profile.achievements.includes(achievement.id);
            
            html += `
                <div class="achievement-card ${isUnlocked ? 'unlocked' : 'locked'}">
                    <span class="achievement-icon">${achievement.icon}</span>
                    <div class="achievement-info">
                        <h3>${achievement.name}</h3>
                        <p>${achievement.description}</p>
                    </div>
                    ${isUnlocked ? '<span class="check">✅</span>' : ''}
                </div>
            `;
        });
        
        html += '</div>';
        container.innerHTML = html;
    }

    showSettings() {
        this.showScreen('settings');
        
        const container = document.getElementById('settings-content');
        const profile = this.game.profileManager.currentProfile;
        
        container.innerHTML = `
            <div class="settings-header">
                <button class="btn-icon" data-action="back">←</button>
                <h2>⚙️ Paramètres</h2>
            </div>
            
            <div class="settings-section">
                <h3>🔊 Audio</h3>
                <div class="setting-row">
                    <span>Effets sonores</span>
                    <button class="toggle-btn ${SoundManager.enabled ? 'active' : ''}" 
                            data-action="toggle-sound">
                        ${SoundManager.enabled ? '🔊' : '🔇'}
                    </button>
                </div>
                <div class="setting-row">
                    <span>Musique</span>
                    <button class="toggle-btn ${SoundManager.musicEnabled ? 'active' : ''}" 
                            data-action="toggle-music">
                        ${SoundManager.musicEnabled ? '🎵' : '🔇'}
                    </button>
                </div>
            </div>
            
            <div class="settings-section">
                <h3>🎨 Affichage</h3>
                <div class="setting-row">
                    <span>Mode sombre</span>
                    <button class="toggle-btn ${this.darkMode ? 'active' : ''}" 
                            data-action="toggle-dark-mode">
                        ${this.darkMode ? '🌙' : '☀️'}
                    </button>
                </div>
                <div class="setting-row">
                    <span>Mode daltonien</span>
                    <button class="toggle-btn ${this.colorblindMode ? 'active' : ''}" 
                            data-action="toggle-colorblind">
                        ${this.colorblindMode ? '✅' : '○'}
                    </button>
                </div>
            </div>
            
            ${profile ? `
            <div class="settings-section">
                <h3>👤 Profil</h3>
                <div class="setting-row">
                    <span>Protection par PIN</span>
                    <button class="toggle-btn ${profile.isProtected ? 'active' : ''}" 
                            data-action="toggle-protection">
                        ${profile.isProtected ? '🔒' : '🔓'}
                    </button>
                </div>
                <div class="setting-row danger">
                    <span>Réinitialiser la progression</span>
                    <button class="btn-danger" data-action="reset-progress">🗑️</button>
                </div>
            </div>
            ` : ''}
            
            <div class="settings-section">
                <h3>ℹ️ À propos</h3>
                <p class="about-text">Sweet Crush v1.0.0</p>
                <p class="about-text">Un jeu puzzle match-3 familial 🍬</p>
            </div>
        `;
    }

    updateSettingsUI() {
        // Update toggle buttons in settings
        document.querySelectorAll('[data-action="toggle-sound"]').forEach(btn => {
            btn.classList.toggle('active', SoundManager.enabled);
            btn.textContent = SoundManager.enabled ? '🔊' : '🔇';
        });
        
        document.querySelectorAll('[data-action="toggle-music"]').forEach(btn => {
            btn.classList.toggle('active', SoundManager.musicEnabled);
            btn.textContent = SoundManager.musicEnabled ? '🎵' : '🔇';
        });
    }

    toggleDarkMode() {
        this.darkMode = !this.darkMode;
        StorageManager.saveSetting('darkMode', this.darkMode);
        this.applyTheme();
        this.showSettings();
    }

    toggleColorblindMode() {
        this.colorblindMode = !this.colorblindMode;
        StorageManager.saveSetting('colorblindMode', this.colorblindMode);
        this.showSettings();
        
        if (this.currentScreen === 'game') {
            this.updateGameUI();
        }
    }

    applyTheme() {
        document.body.classList.toggle('dark-mode', this.darkMode);
    }

    showPinInput(callback) {
        this.pinInput = '';
        this.pinCallback = callback;
        
        this.showModal('pin-input', `
            <div class="pin-input-content">
                <h2>🔒 Code PIN</h2>
                <div class="pin-dots">
                    <span class="pin-dot"></span>
                    <span class="pin-dot"></span>
                    <span class="pin-dot"></span>
                    <span class="pin-dot"></span>
                </div>
                <div class="pin-keypad">
                    ${[1,2,3,4,5,6,7,8,9,'',0,'←'].map(key => 
                        key === '' ? '<span></span>' :
                        key === '←' ? `<button class="pin-key" data-action="pin-delete">←</button>` :
                        `<button class="pin-key" data-action="pin-digit" data-digit="${key}">${key}</button>`
                    ).join('')}
                </div>
                <button class="btn-secondary" data-action="pin-cancel">Annuler</button>
            </div>
        `);
    }

    enterPinDigit(digit) {
        if (this.pinInput.length >= 4) return;
        
        this.pinInput += digit;
        this.updatePinDots();
        Utils.vibrate(5);
        
        if (this.pinInput.length === 4) {
            setTimeout(() => {
                if (this.pinCallback) {
                    this.pinCallback(this.pinInput);
                }
                this.closeModal();
            }, 200);
        }
    }

    deletePinDigit() {
        this.pinInput = this.pinInput.slice(0, -1);
        this.updatePinDots();
    }

    updatePinDots() {
        document.querySelectorAll('.pin-dot').forEach((dot, i) => {
            dot.classList.toggle('filled', i < this.pinInput.length);
        });
    }

    cancelPin() {
        this.pinInput = '';
        this.pinCallback = null;
        this.closeModal();
    }

    confirmDeleteProfile(profileId) {
        const profile = this.game.profileManager.profiles.find(p => p.id === profileId);
        if (!profile) return;
        
        const deleteAction = async (pin = null) => {
            const result = await this.game.profileManager.deleteProfile(profileId, pin);
            if (result.success) {
                this.showToast('Profil supprimé', 'success');
                this.renderProfileList();
            } else {
                this.showToast(result.error, 'error');
            }
            this.closeModal();
        };
        
        if (profile.isProtected) {
            this.showPinInput((pin) => {
                this.showModal('confirm-delete', `
                    <div class="confirm-content">
                        <h2>⚠️ Supprimer le profil ?</h2>
                        <p>Cette action est irréversible. Toute la progression de "${this.escapeHtml(profile.name)}" sera perdue.</p>
                        <div class="confirm-buttons">
                            <button class="btn-secondary" data-action="close-modal">Annuler</button>
                            <button class="btn-danger" onclick="game.ui.executeDelete('${profileId}', '${pin}')">Supprimer</button>
                        </div>
                    </div>
                `);
            });
        } else {
            this.showModal('confirm-delete', `
                <div class="confirm-content">
                    <h2>⚠️ Supprimer le profil ?</h2>
                    <p>Cette action est irréversible. Toute la progression de "${this.escapeHtml(profile.name)}" sera perdue.</p>
                    <div class="confirm-buttons">
                        <button class="btn-secondary" data-action="close-modal">Annuler</button>
                        <button class="btn-danger" onclick="game.ui.executeDelete('${profileId}')">Supprimer</button>
                    </div>
                </div>
            `);
        }
    }

    async executeDelete(profileId, pin = null) {
        const result = await this.game.profileManager.deleteProfile(profileId, pin);
        if (result.success) {
            this.showToast('Profil supprimé', 'success');
            this.closeModal();
            this.renderProfileList();
        } else {
            this.showToast(result.error, 'error');
        }
    }

    showModal(id, content) {
        let modal = document.getElementById('modal-overlay');
        
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'modal-overlay';
            document.body.appendChild(modal);
        }
        
        modal.innerHTML = `<div class="modal-content" data-modal="${id}">${content}</div>`;
        modal.classList.add('active');
    }

    closeModal() {
        const modal = document.getElementById('modal-overlay');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    showToast(message, type = 'info') {
        let toast = document.getElementById('toast');
        
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'toast';
            document.body.appendChild(toast);
        }
        
        toast.textContent = message;
        toast.className = `toast ${type} active`;
        
        setTimeout(() => {
            toast.classList.remove('active');
        }, 3000);
    }

    goBack() {
        switch (this.currentScreen) {
            case 'level-select':
            case 'leaderboard':
            case 'achievements':
            case 'settings':
                this.showScreen('main-menu');
                this.renderMainMenu();
                break;
            case 'create-profile':
                this.showProfileSelect();
                break;
            default:
                this.showScreen('main-menu');
        }
    }

    showNewAchievements(achievements) {
        if (achievements.length === 0) return;
        
        let html = '<div class="achievements-popup">';
        achievements.forEach(a => {
            html += `
                <div class="achievement-earned">
                    <span class="achievement-icon">${a.icon}</span>
                    <div>
                        <h3>Nouveau succès !</h3>
                        <p>${a.name}</p>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        
        this.showModal('new-achievements', html + '<button class="btn-primary" data-action="close-modal">Super !</button>');
        SoundManager.play('special');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// ==========================================
// MAIN GAME CLASS
// ==========================================
class SweetCrushGame {
    constructor() {
        this.profileManager = new ProfileManager();
        this.gameEngine = new GameEngine();
        this.ui = new UIManager(this);
        this.currentLevelId = 1;
    }

    async init() {
        // Initialize storage
        await StorageManager.init();
        
        // Initialize sound
        SoundManager.init();
        
        // Initialize profile manager
        await this.profileManager.init();
        
        // Initialize UI
        this.ui.init();
        
        // Show splash then profile select
        setTimeout(() => {
            this.ui.showProfileSelect();
        }, 1500);
        
        // Register service worker for PWA
        if ('serviceWorker' in navigator) {
            try {
                await navigator.serviceWorker.register('/sw.js');
            } catch (e) {
                console.log('Service worker registration failed');
            }
        }
        
        console.log('🍬 Sweet Crush initialized!');
    }

    async startLevel(levelId) {
        this.currentLevelId = levelId;
        const level = this.gameEngine.initLevel(levelId);
        this.ui.renderGameScreen(level);
        
        // Update stats
        this.profileManager.currentProfile.stats.gamesPlayed++;
        await StorageManager.saveProfile(this.profileManager.currentProfile);
    }

    async makeMove(row1, col1, row2, col2) {
        const result = await this.gameEngine.makeMove(row1, col1, row2, col2);
        
        if (!result) return;
        
        this.ui.updateGameUI();
        
        if (result.valid && result.gameState) {
            if (result.gameState.status === 'win') {
                await this.handleLevelComplete(result.gameState);
            } else if (result.gameState.status === 'lose') {
                this.ui.showLevelFailed(result.gameState);
            }
        }
    }

    async handleLevelComplete(result) {
        const profile = this.profileManager.currentProfile;
        
        // Calculate final score with bonus
        const bonusScore = result.movesLeft * 50;
        result.score += bonusScore;
        this.gameEngine.score = result.score;
        
        // Update profile stats
        profile.stats.totalScore += result.score;
        profile.stats.totalMatches += this.gameEngine.matchCount;
        
        if (result.score > profile.stats.highScore) {
            profile.stats.highScore = result.score;
        }
        
        if (this.gameEngine.combo > profile.stats.maxCombo) {
            profile.stats.maxCombo = this.gameEngine.combo;
        }
        
        // Perfect level check
        if (result.movesLeft === this.gameEngine.maxMoves) {
            profile.stats.perfectLevels++;
        }
        
        // Save level score
        const existingScore = profile.levelScores[this.currentLevelId];
        if (!existingScore || result.stars > existingScore.stars || 
            (result.stars === existingScore.stars && result.score > existingScore.score)) {
            profile.levelScores[this.currentLevelId] = {
                score: result.score,
                stars: result.stars,
                date: new Date().toISOString()
            };
        }
        
        // Unlock next level
        if (this.currentLevelId >= profile.stats.maxLevel && this.currentLevelId < LEVELS.length) {
            profile.stats.maxLevel = this.currentLevelId + 1;
        }
        
        profile.stats.currentLevel = this.currentLevelId;
        
        // Award boosters for stars
        if (result.stars >= 2) {
            const boosterTypes = Object.keys(profile.boosters);
            const randomBooster = boosterTypes[Math.floor(Math.random() * boosterTypes.length)];
            profile.boosters[randomBooster]++;
        }
        
        // Save profile
        await StorageManager.saveProfile(profile);
        
        // Update leaderboard
        await this.profileManager.updateLeaderboard();
        
        // Check achievements
        const newAchievements = this.profileManager.checkAchievements();
        
        // Show level complete
        this.ui.showLevelComplete(result);
        
        // Show new achievements after a delay
        if (newAchievements.length > 0) {
            setTimeout(() => {
                this.ui.showNewAchievements(newAchievements);
            }, 2000);
        }
    }

    restartLevel() {
        this.ui.closeModal();
        this.startLevel(this.currentLevelId);
    }

    nextLevel() {
        this.ui.closeModal();
        
        if (this.currentLevelId < LEVELS.length) {
            this.startLevel(this.currentLevelId + 1);
        } else {
            this.ui.showScreen('level-select');
            this.ui.renderLevelSelect();
        }
    }
}

// ==========================================
// INITIALIZE GAME
// ==========================================
let game;

document.addEventListener('DOMContentLoaded', async () => {
    game = new SweetCrushGame();
    await game.init();
    
    // Make game globally accessible for UI callbacks
    window.game = game;
});

// ==========================================
// PWA INSTALL PROMPT
// ==========================================
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // Show install button if not already installed
    const installBtn = document.getElementById('install-btn');
    if (installBtn) {
        installBtn.style.display = 'block';
        installBtn.addEventListener('click', async () => {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                installBtn.style.display = 'none';
            }
            deferredPrompt = null;
        });
    }
});

// ==========================================
// HANDLE APP LIFECYCLE
// ==========================================
window.addEventListener('beforeunload', () => {
    // Save current game state if in progress
    if (game && game.profileManager.currentProfile) {
        StorageManager.saveProfile(game.profileManager.currentProfile);
    }
});

// iOS Safari specific handling
if (navigator.standalone) {
    document.body.classList.add('standalone');
}

// Prevent pull-to-refresh on iOS
document.body.addEventListener('touchmove', (e) => {
    if (e.target.closest('.game-grid')) {
        e.preventDefault();
    }
}, { passive: false });

// Handle safe area insets for iPhone X+
document.documentElement.style.setProperty(
    '--safe-area-inset-top',
    'env(safe-area-inset-top)'
);
document.documentElement.style.setProperty(
    '--safe-area-inset-bottom',
    'env(safe-area-inset-bottom)'
);