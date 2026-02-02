import { useState } from 'react';
import { Profile, Settings } from '@/types';
import { generateId, saveProfile, deleteProfile as deleteProfileStorage } from '@/utils/storage';
import { cn } from '@/utils/cn';
import { soundManager } from '@/utils/sounds';

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
  "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Tiger%20Face.png",
];

interface ProfileSelectProps {
  profiles: Profile[];
  onSelectProfile: (profile: Profile) => void;
  onProfilesChange: (profiles: Profile[]) => void;
  settings: Settings;
}

export function ProfileSelect({ profiles, onSelectProfile, onProfilesChange, settings }: ProfileSelectProps) {
  const [showCreate, setShowCreate] = useState(false);
  const [showDelete, setShowDelete] = useState<Profile | null>(null);
  const [newName, setNewName] = useState('');
  const [newAvatar, setNewAvatar] = useState(AVATARS[0]);
  const [isProtected, setIsProtected] = useState(false);
  const [pin, setPin] = useState('');
  const [pinConfirm, setPinConfirm] = useState('');
  const [deletePin, setDeletePin] = useState('');
  const [error, setError] = useState('');
  
  const handleCreate = () => {
    if (newName.trim().length < 2) {
      setError('Le prénom doit avoir au moins 2 caractères');
      return;
    }
    
    if (isProtected && pin.length !== 4) {
      setError('Le code PIN doit avoir 4 chiffres');
      return;
    }
    
    if (isProtected && pin !== pinConfirm) {
      setError('Les codes PIN ne correspondent pas');
      return;
    }
    
    const newProfile: Profile = {
      id: generateId(),
      name: newName.trim(),
      avatar: newAvatar,
      isProtected,
      pin: isProtected ? pin : undefined,
      createdAt: Date.now(),
      lastPlayed: Date.now(),
      currentLevel: 1,
      totalScore: 0,
      coins: 100,
      boosters: { hammer: 3, bomb: 3, rainbow: 1 },
      achievements: [],
      dailyRewardDay: 0,
      lastDailyReward: '',
      gamesPlayed: 0,
      bestCombo: 0
    };
    
    saveProfile(newProfile);
    onProfilesChange([...profiles, newProfile]);
    soundManager.reward();
    
    setShowCreate(false);
    setNewName('');
    setNewAvatar(AVATARS[0]);
    setIsProtected(false);
    setPin('');
    setPinConfirm('');
    setError('');
  };
  
  const handleDelete = () => {
    if (!showDelete) return;
    
    if (showDelete.isProtected && deletePin !== showDelete.pin) {
      setError('Code PIN incorrect');
      return;
    }
    
    deleteProfileStorage(showDelete.id);
    onProfilesChange(profiles.filter(p => p.id !== showDelete.id));
    setShowDelete(null);
    setDeletePin('');
    setError('');
  };
  
  return (
    <div className={cn(
      "min-h-screen p-4 flex flex-col",
      settings.darkMode ? "bg-gray-900" : "bg-gradient-to-b from-pink-400 via-purple-400 to-indigo-500"
    )}>
      {/* Header */}
      <div className="text-center py-6">
        <div className="text-6xl mb-2">🍬</div>
        <h1 className={cn(
          "text-3xl font-bold",
          settings.darkMode ? "text-white" : "text-white drop-shadow-lg"
        )}>
          Sweet Match
        </h1>
        <p className={cn(
          "text-sm mt-1",
          settings.darkMode ? "text-gray-300" : "text-white/80"
        )}>
          Choisis ton profil pour jouer
        </p>
      </div>
      
      {/* Profiles Grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-2 gap-3 pb-4">
          {profiles.map(profile => (
            <div
              key={profile.id}
              className={cn(
                "relative rounded-2xl p-4 text-center transition-transform active:scale-95",
                settings.darkMode 
                  ? "bg-gray-800 border border-gray-700" 
                  : "bg-white/90 shadow-lg"
              )}
              onClick={() => {
                soundManager.buttonClick();
                onSelectProfile(profile);
              }}
            >
              {profile.isProtected && (
                <div className="absolute top-2 right-2 text-lg">🔒</div>
              )}
              <img 
                src={profile.avatar} 
                alt={profile.name}
                className="w-16 h-16 mx-auto mb-2"
              />
              <h3 className={cn(
                "font-bold truncate",
                settings.darkMode ? "text-white" : "text-gray-800"
              )}>
                {profile.name}
              </h3>
              <p className={cn(
                "text-xs",
                settings.darkMode ? "text-gray-400" : "text-gray-500"
              )}>
                Niveau {profile.currentLevel} • ⭐ {profile.totalScore.toLocaleString()}
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDelete(profile);
                  setError('');
                }}
                className={cn(
                  "absolute top-2 left-2 w-6 h-6 rounded-full text-sm flex items-center justify-center",
                  settings.darkMode 
                    ? "bg-red-900/50 text-red-300" 
                    : "bg-red-100 text-red-500"
                )}
              >
                ×
              </button>
            </div>
          ))}
          
          {/* Add Profile Button */}
          <button
            onClick={() => {
              soundManager.buttonClick();
              setShowCreate(true);
            }}
            className={cn(
              "rounded-2xl p-4 text-center border-2 border-dashed transition-transform active:scale-95",
              settings.darkMode 
                ? "border-gray-600 text-gray-400 bg-gray-800/50" 
                : "border-white/50 text-white bg-white/20"
            )}
          >
            <div className="text-4xl mb-2">➕</div>
            <span className="font-medium">Nouveau profil</span>
          </button>
        </div>
      </div>
      
      {/* Create Profile Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className={cn(
            "w-full max-w-sm rounded-3xl p-6 max-h-[90vh] overflow-y-auto",
            settings.darkMode ? "bg-gray-800" : "bg-white"
          )}>
            <h2 className={cn(
              "text-xl font-bold text-center mb-4",
              settings.darkMode ? "text-white" : "text-gray-800"
            )}>
              Nouveau Profil
            </h2>
            
            <input
              type="text"
              placeholder="Prénom"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className={cn(
                "w-full p-3 rounded-xl mb-4 outline-none",
                settings.darkMode 
                  ? "bg-gray-700 text-white placeholder-gray-400" 
                  : "bg-gray-100 text-gray-800"
              )}
              maxLength={15}
            />
            
            <p className={cn(
              "text-sm font-medium mb-2",
              settings.darkMode ? "text-gray-300" : "text-gray-600"
            )}>
              Choisis ton avatar :
            </p>
            
            <div className="grid grid-cols-6 gap-2 mb-4 max-h-32 overflow-y-auto">
              {AVATARS.map((avatar) => (
                <button
                  key={avatar}
                  onClick={() => setNewAvatar(avatar)}
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center transition-all",
                    newAvatar === avatar 
                      ? "ring-2 ring-pink-500 bg-pink-100 scale-110" 
                      : settings.darkMode ? "bg-gray-700" : "bg-gray-100"
                  )}
                >
                  <img src={avatar} alt="" className="w-8 h-8" />
                </button>
              ))}
            </div>
            
            <label className="flex items-center gap-3 mb-4">
              <input
                type="checkbox"
                checked={isProtected}
                onChange={(e) => setIsProtected(e.target.checked)}
                className="w-5 h-5 rounded accent-pink-500"
              />
              <span className={cn(
                "text-sm",
                settings.darkMode ? "text-gray-300" : "text-gray-600"
              )}>
                🔒 Protéger avec un code PIN
              </span>
            </label>
            
            {isProtected && (
              <div className="space-y-3 mb-4">
                <input
                  type="tel"
                  placeholder="Code PIN (4 chiffres)"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  className={cn(
                    "w-full p-3 rounded-xl text-center text-lg tracking-widest outline-none",
                    settings.darkMode 
                      ? "bg-gray-700 text-white" 
                      : "bg-gray-100 text-gray-800"
                  )}
                  maxLength={4}
                />
                <input
                  type="tel"
                  placeholder="Confirmer le PIN"
                  value={pinConfirm}
                  onChange={(e) => setPinConfirm(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  className={cn(
                    "w-full p-3 rounded-xl text-center text-lg tracking-widest outline-none",
                    settings.darkMode 
                      ? "bg-gray-700 text-white" 
                      : "bg-gray-100 text-gray-800"
                  )}
                  maxLength={4}
                />
              </div>
            )}
            
            {error && (
              <p className="text-red-500 text-sm text-center mb-4">{error}</p>
            )}
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCreate(false);
                  setError('');
                }}
                className={cn(
                  "flex-1 py-3 rounded-xl font-medium",
                  settings.darkMode 
                    ? "bg-gray-700 text-gray-300" 
                    : "bg-gray-200 text-gray-600"
                )}
              >
                Annuler
              </button>
              <button
                onClick={handleCreate}
                className="flex-1 py-3 rounded-xl font-medium bg-gradient-to-r from-pink-500 to-purple-500 text-white"
              >
                Créer
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {showDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className={cn(
            "w-full max-w-sm rounded-3xl p-6",
            settings.darkMode ? "bg-gray-800" : "bg-white"
          )}>
            <div className="text-center mb-4">
              <img 
                src={showDelete.avatar} 
                alt={showDelete.name}
                className="w-16 h-16 mx-auto mb-2"
              />
              <h2 className={cn(
                "text-xl font-bold",
                settings.darkMode ? "text-white" : "text-gray-800"
              )}>
                Supprimer {showDelete.name} ?
              </h2>
              <p className={cn(
                "text-sm mt-2",
                settings.darkMode ? "text-gray-400" : "text-gray-500"
              )}>
                ⚠️ Cette action est irréversible. Toute la progression sera perdue.
              </p>
            </div>
            
            {showDelete.isProtected && (
              <input
                type="tel"
                placeholder="Entrer le code PIN"
                value={deletePin}
                onChange={(e) => setDeletePin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                className={cn(
                  "w-full p-3 rounded-xl text-center text-lg tracking-widest mb-4 outline-none",
                  settings.darkMode 
                    ? "bg-gray-700 text-white" 
                    : "bg-gray-100 text-gray-800"
                )}
                maxLength={4}
              />
            )}
            
            {error && (
              <p className="text-red-500 text-sm text-center mb-4">{error}</p>
            )}
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDelete(null);
                  setDeletePin('');
                  setError('');
                }}
                className={cn(
                  "flex-1 py-3 rounded-xl font-medium",
                  settings.darkMode 
                    ? "bg-gray-700 text-gray-300" 
                    : "bg-gray-200 text-gray-600"
                )}
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-3 rounded-xl font-medium bg-red-500 text-white"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
