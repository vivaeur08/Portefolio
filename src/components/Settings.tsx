import { useState } from 'react';
import { Profile, Settings as SettingsType } from '@/types';
import { exportProfileData, importProfileData, saveProfile } from '@/utils/storage';
import { cn } from '@/utils/cn';
import { soundManager } from '@/utils/sounds';

interface SettingsProps {
  profile: Profile;
  settings: SettingsType;
  onUpdateSettings: (settings: SettingsType) => void;
  onUpdateProfile: (profile: Profile) => void;
  onClose: () => void;
}

export function Settings({ profile, settings, onUpdateSettings, onUpdateProfile, onClose }: SettingsProps) {
  const [showExport, setShowExport] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [importCode, setImportCode] = useState('');
  const [pinInput, setPinInput] = useState('');
  const [error, setError] = useState('');
  const [exportCode, setExportCode] = useState('');
  
  const toggleSetting = (key: keyof SettingsType) => {
    soundManager.buttonClick();
    const newSettings = { ...settings, [key]: !settings[key] };
    onUpdateSettings(newSettings);
    
    if (key === 'soundEnabled') {
      soundManager.setEnabled(newSettings.soundEnabled);
    }
  };
  
  const handleExport = () => {
    const code = exportProfileData(profile);
    setExportCode(code);
    setShowExport(true);
  };
  
  const handleImport = () => {
    const importedProfile = importProfileData(importCode);
    if (importedProfile) {
      importedProfile.id = profile.id; // Keep same ID
      saveProfile(importedProfile);
      onUpdateProfile(importedProfile);
      setShowImport(false);
      setImportCode('');
      soundManager.reward();
    } else {
      setError('Code invalide');
    }
  };
  
  const handleReset = () => {
    if (profile.isProtected && pinInput !== profile.pin) {
      setError('Code PIN incorrect');
      return;
    }
    
    const resetProfile: Profile = {
      ...profile,
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
    
    saveProfile(resetProfile);
    onUpdateProfile(resetProfile);
    setShowResetConfirm(false);
    setPinInput('');
    setError('');
  };
  
  const SettingToggle = ({ 
    label, 
    description, 
    icon, 
    value, 
    onToggle 
  }: { 
    label: string; 
    description?: string;
    icon: string; 
    value: boolean; 
    onToggle: () => void;
  }) => (
    <div 
      className={cn(
        "flex items-center gap-3 p-4 rounded-xl",
        settings.darkMode ? "bg-gray-700" : "bg-gray-50"
      )}
      onClick={onToggle}
    >
      <span className="text-2xl">{icon}</span>
      <div className="flex-1">
        <div className={cn(
          "font-medium",
          settings.darkMode ? "text-white" : "text-gray-800"
        )}>
          {label}
        </div>
        {description && (
          <div className={cn(
            "text-sm",
            settings.darkMode ? "text-gray-400" : "text-gray-500"
          )}>
            {description}
          </div>
        )}
      </div>
      <div className={cn(
        "w-12 h-7 rounded-full transition-all relative",
        value 
          ? "bg-gradient-to-r from-pink-500 to-purple-500" 
          : settings.darkMode ? "bg-gray-600" : "bg-gray-300"
      )}>
        <div className={cn(
          "absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-all",
          value ? "right-1" : "left-1"
        )} />
      </div>
    </div>
  );
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className={cn(
        "w-full max-w-md rounded-3xl overflow-hidden max-h-[90vh] flex flex-col",
        settings.darkMode ? "bg-gray-800" : "bg-white"
      )}>
        {/* Header */}
        <div className={cn(
          "p-4 text-center",
          settings.darkMode 
            ? "bg-gradient-to-r from-gray-700 to-gray-600" 
            : "bg-gradient-to-r from-gray-200 to-gray-100"
        )}>
          <div className="text-4xl mb-2">⚙️</div>
          <h2 className={cn(
            "text-2xl font-bold",
            settings.darkMode ? "text-white" : "text-gray-800"
          )}>
            Paramètres
          </h2>
        </div>
        
        {/* Settings List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <h3 className={cn(
            "text-sm font-medium uppercase tracking-wide mb-2",
            settings.darkMode ? "text-gray-400" : "text-gray-500"
          )}>
            Audio & Retour
          </h3>
          
          <SettingToggle
            icon="🔊"
            label="Sons"
            description="Effets sonores du jeu"
            value={settings.soundEnabled}
            onToggle={() => toggleSetting('soundEnabled')}
          />
          
          <SettingToggle
            icon="🎵"
            label="Musique"
            description="Musique de fond"
            value={settings.musicEnabled}
            onToggle={() => toggleSetting('musicEnabled')}
          />
          
          <SettingToggle
            icon="📳"
            label="Vibrations"
            description="Retour haptique"
            value={settings.vibrationEnabled}
            onToggle={() => toggleSetting('vibrationEnabled')}
          />
          
          <h3 className={cn(
            "text-sm font-medium uppercase tracking-wide mb-2 mt-6",
            settings.darkMode ? "text-gray-400" : "text-gray-500"
          )}>
            Affichage
          </h3>
          
          <SettingToggle
            icon="🌙"
            label="Mode sombre"
            value={settings.darkMode}
            onToggle={() => toggleSetting('darkMode')}
          />
          
          <SettingToggle
            icon="👁️"
            label="Mode daltonien"
            description="Symboles à la place des couleurs"
            value={settings.colorBlindMode}
            onToggle={() => toggleSetting('colorBlindMode')}
          />
          
          <SettingToggle
            icon="🔤"
            label="Contraste élevé"
            description="Texte plus lisible"
            value={settings.highContrastMode}
            onToggle={() => toggleSetting('highContrastMode')}
          />
          
          <h3 className={cn(
            "text-sm font-medium uppercase tracking-wide mb-2 mt-6",
            settings.darkMode ? "text-gray-400" : "text-gray-500"
          )}>
            Données
          </h3>
          
          <button
            onClick={() => {
              soundManager.buttonClick();
              handleExport();
            }}
            className={cn(
              "w-full flex items-center gap-3 p-4 rounded-xl text-left",
              settings.darkMode ? "bg-gray-700" : "bg-gray-50"
            )}
          >
            <span className="text-2xl">📤</span>
            <div className="flex-1">
              <div className={cn(
                "font-medium",
                settings.darkMode ? "text-white" : "text-gray-800"
              )}>
                Exporter la progression
              </div>
              <div className={cn(
                "text-sm",
                settings.darkMode ? "text-gray-400" : "text-gray-500"
              )}>
                Obtenir un code de récupération
              </div>
            </div>
          </button>
          
          <button
            onClick={() => {
              soundManager.buttonClick();
              setShowImport(true);
            }}
            className={cn(
              "w-full flex items-center gap-3 p-4 rounded-xl text-left",
              settings.darkMode ? "bg-gray-700" : "bg-gray-50"
            )}
          >
            <span className="text-2xl">📥</span>
            <div className="flex-1">
              <div className={cn(
                "font-medium",
                settings.darkMode ? "text-white" : "text-gray-800"
              )}>
                Importer une progression
              </div>
              <div className={cn(
                "text-sm",
                settings.darkMode ? "text-gray-400" : "text-gray-500"
              )}>
                Restaurer depuis un code
              </div>
            </div>
          </button>
          
          <button
            onClick={() => {
              soundManager.buttonClick();
              setShowResetConfirm(true);
              setError('');
            }}
            className={cn(
              "w-full flex items-center gap-3 p-4 rounded-xl text-left",
              settings.darkMode ? "bg-red-900/30" : "bg-red-50"
            )}
          >
            <span className="text-2xl">🗑️</span>
            <div className="flex-1">
              <div className="font-medium text-red-500">
                Réinitialiser la progression
              </div>
              <div className={cn(
                "text-sm",
                settings.darkMode ? "text-gray-400" : "text-gray-500"
              )}>
                Recommencer à zéro
              </div>
            </div>
          </button>
        </div>
        
        {/* Close Button */}
        <div className="p-4">
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
      
      {/* Export Modal */}
      {showExport && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-60">
          <div className={cn(
            "w-full max-w-sm rounded-2xl p-6",
            settings.darkMode ? "bg-gray-800" : "bg-white"
          )}>
            <h3 className={cn(
              "text-lg font-bold text-center mb-4",
              settings.darkMode ? "text-white" : "text-gray-800"
            )}>
              📤 Code de récupération
            </h3>
            <p className={cn(
              "text-sm text-center mb-4",
              settings.darkMode ? "text-gray-400" : "text-gray-500"
            )}>
              Conserve ce code pour restaurer ta progression sur un autre appareil.
            </p>
            <div className={cn(
              "p-3 rounded-xl text-xs font-mono break-all text-center",
              settings.darkMode ? "bg-gray-700 text-green-400" : "bg-gray-100 text-gray-800"
            )}>
              {exportCode.substring(0, 50)}...
            </div>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(exportCode);
                setShowExport(false);
              }}
              className="w-full mt-4 py-3 rounded-xl font-medium bg-gradient-to-r from-pink-500 to-purple-500 text-white"
            >
              Copier et fermer
            </button>
          </div>
        </div>
      )}
      
      {/* Import Modal */}
      {showImport && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-60">
          <div className={cn(
            "w-full max-w-sm rounded-2xl p-6",
            settings.darkMode ? "bg-gray-800" : "bg-white"
          )}>
            <h3 className={cn(
              "text-lg font-bold text-center mb-4",
              settings.darkMode ? "text-white" : "text-gray-800"
            )}>
              📥 Importer une progression
            </h3>
            <textarea
              placeholder="Colle ton code ici..."
              value={importCode}
              onChange={(e) => setImportCode(e.target.value)}
              className={cn(
                "w-full p-3 rounded-xl h-24 resize-none outline-none",
                settings.darkMode 
                  ? "bg-gray-700 text-white" 
                  : "bg-gray-100 text-gray-800"
              )}
            />
            {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => {
                  setShowImport(false);
                  setImportCode('');
                  setError('');
                }}
                className={cn(
                  "flex-1 py-3 rounded-xl font-medium",
                  settings.darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-600"
                )}
              >
                Annuler
              </button>
              <button
                onClick={handleImport}
                className="flex-1 py-3 rounded-xl font-medium bg-gradient-to-r from-pink-500 to-purple-500 text-white"
              >
                Importer
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Reset Confirmation */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-60">
          <div className={cn(
            "w-full max-w-sm rounded-2xl p-6",
            settings.darkMode ? "bg-gray-800" : "bg-white"
          )}>
            <div className="text-center mb-4">
              <span className="text-4xl">⚠️</span>
              <h3 className={cn(
                "text-lg font-bold mt-2",
                settings.darkMode ? "text-white" : "text-gray-800"
              )}>
                Réinitialiser ?
              </h3>
              <p className={cn(
                "text-sm mt-2",
                settings.darkMode ? "text-gray-400" : "text-gray-500"
              )}>
                Toute ta progression sera perdue. Cette action est irréversible.
              </p>
            </div>
            
            {profile.isProtected && (
              <input
                type="tel"
                placeholder="Code PIN requis"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value.replace(/\D/g, '').slice(0, 4))}
                className={cn(
                  "w-full p-3 rounded-xl text-center text-lg tracking-widest mb-4 outline-none",
                  settings.darkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-800"
                )}
                maxLength={4}
              />
            )}
            
            {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowResetConfirm(false);
                  setPinInput('');
                  setError('');
                }}
                className={cn(
                  "flex-1 py-3 rounded-xl font-medium",
                  settings.darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-600"
                )}
              >
                Annuler
              </button>
              <button
                onClick={handleReset}
                className="flex-1 py-3 rounded-xl font-medium bg-red-500 text-white"
              >
                Réinitialiser
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
