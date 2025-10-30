import { useState, useEffect } from 'react';
import Icon from './Icon';
import "../App.css";

// Theme configuration with icon names (using global Icon component)
const themes = [
  { name: 'light', icon: 'sun', category: 'Default', contrast: 'high' },
  { name: 'dark', icon: 'moon', category: 'Default', contrast: 'high' },
  { name: 'cupcake', icon: 'sparkles', category: 'Sweet', contrast: 'high' },
  { name: 'bumblebee', icon: 'bug', category: 'Nature', contrast: 'medium' },
  { name: 'emerald', icon: 'heart', category: 'Nature', contrast: 'high' },
  { name: 'corporate', icon: 'building-office', category: 'Professional', contrast: 'high' },
  { name: 'synthwave', icon: 'headphones', category: 'Retro', contrast: 'high' },
  { name: 'retro', icon: 'radio', category: 'Retro', contrast: 'medium' },
  { name: 'cyberpunk', icon: 'cpu-chip', category: 'Futuristic', contrast: 'high' },
  { name: 'valentine', icon: 'gift', category: 'Sweet', contrast: 'medium' },
  { name: 'halloween', icon: 'face-smile', category: 'Seasonal', contrast: 'high' },
  { name: 'garden', icon: 'flower', category: 'Nature', contrast: 'high' },
  { name: 'forest', icon: 'tree', category: 'Nature', contrast: 'high' },
  { name: 'aqua', icon: 'waves', category: 'Nature', contrast: 'high' },
  { name: 'lofi', icon: 'headphones', category: 'Chill', contrast: 'medium' },
  { name: 'pastel', icon: 'paint-brush', category: 'Sweet', contrast: 'low' },
  { name: 'fantasy', icon: 'unicorn', category: 'Magical', contrast: 'medium' },
  { name: 'wireframe', icon: 'pencil-square', category: 'Professional', contrast: 'low' },
  { name: 'black', icon: 'circle', category: 'Dark', contrast: 'high' },
  { name: 'luxury', icon: 'gem', category: 'Premium', contrast: 'high' },
  { name: 'dracula', icon: 'vampire', category: 'Dark', contrast: 'high' },
  { name: 'cmyk', icon: 'print', category: 'Professional', contrast: 'medium' },
  { name: 'autumn', icon: 'maple-leaf', category: 'Seasonal', contrast: 'medium' },
  { name: 'business', icon: 'building-office', category: 'Professional', contrast: 'high' },
  { name: 'acid', icon: 'water-drop', category: 'Vibrant', contrast: 'medium' },
  { name: 'lemonade', icon: 'lemon', category: 'Sweet', contrast: 'low' },
  { name: 'night', icon: 'moon', category: 'Dark', contrast: 'high' },
  { name: 'coffee', icon: 'coffee', category: 'Warm', contrast: 'medium' },
  { name: 'winter', icon: 'snowflake', category: 'Seasonal', contrast: 'low' },
  { name: 'dim', icon: 'cloud', category: 'Dark', contrast: 'medium' },
  { name: 'nord', icon: 'mountain', category: 'Cool', contrast: 'medium' },
  { name: 'sunset', icon: 'sunrise', category: 'Warm', contrast: 'medium' }
];

const categories = {
  'Default': ['light', 'dark'],
  'Professional': ['corporate', 'wireframe', 'business', 'cmyk'],
  'Nature': ['bumblebee', 'emerald', 'garden', 'forest', 'aqua'],
  'Dark': ['black', 'dracula', 'night', 'dim'],
  'Sweet': ['cupcake', 'valentine', 'pastel', 'lemonade'],
  'Retro': ['synthwave', 'retro'],
  'Seasonal': ['halloween', 'autumn', 'winter'],
  'Warm': ['coffee', 'sunset'],
  'Cool': ['nord'],
  'Chill': ['lofi'],
  'Magical': ['fantasy'],
  'Premium': ['luxury'],
  'Futuristic': ['cyberpunk'],
  'Vibrant': ['acid']
};

export default function ThemeSelector() {
  const [currentTheme, setCurrentTheme] = useState('dark');
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredTheme, setHoveredTheme] = useState(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setCurrentTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Add contrast class for better text visibility
    const themeData = themes.find(t => t.name === savedTheme);
    if (themeData?.contrast === 'low') {
      document.documentElement.classList.add('theme-low-contrast');
    } else {
      document.documentElement.classList.remove('theme-low-contrast');
    }
  }, []);

  const handleThemeChange = (theme) => {
    console.log('Theme changing to:', theme);
    setCurrentTheme(theme);
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Handle contrast for better visibility
    const themeData = themes.find(t => t.name === theme);
    if (themeData?.contrast === 'low') {
      document.documentElement.classList.add('theme-low-contrast');
    } else {
      document.documentElement.classList.remove('theme-low-contrast');
    }
    
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleToggleDropdown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Toggle dropdown clicked, current isOpen:', isOpen);
    setIsOpen(!isOpen);
  };

  const filteredThemes = themes.filter(theme => 
    theme.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCurrentThemeData = () => {
    return themes.find(theme => theme.name === currentTheme) || themes[1];
  };

  const getThemePreviewColors = (themeName) => {
    const colorMap = {
      light: ['#ffffff', '#f3f4f6', '#3b82f6'],
      dark: ['#1f2937', '#374151', '#60a5fa'],
      cupcake: ['#fef7ed', '#fed7aa', '#f97316'],
      synthwave: ['#1a0b2e', '#7209b7', '#f72585'],
      cyberpunk: ['#000000', '#00ff00', '#ff0080'],
      // Add more as needed...
    };
    return colorMap[themeName] || ['#64748b', '#94a3b8', '#3b82f6'];
  };

  return (
    <div className="dropdown dropdown-end">
      <button 
        className={`btn btn-circle transition-all duration-300 group hover:scale-110 ${
          isOpen ? 'btn-primary shadow-lg' : 'btn-ghost hover:btn-primary/20'
        }`}
        onClick={handleToggleDropdown}
        type="button"
      >
        <div className="relative">
          <div className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
            <Icon name="palette" size="md" />
          </div>
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
        </div>
      </button>

      {isOpen && (
        <div className="dropdown-content bg-base-100/95 backdrop-blur-md rounded-3xl z-[1] w-80 p-4 shadow-2xl border border-base-300/50 mt-2 animate-in slide-in-from-top-2 duration-300">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <Icon name="palette" size="sm" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Themes</h3>
                <p className="text-xs text-base-content/60">Choose your style</p>
              </div>
            </div>
            <button 
              className="btn btn-ghost btn-sm btn-circle"
              onClick={() => setIsOpen(false)}
            >
              <Icon name="close" size="sm" />
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search themes..."
              className="input input-bordered input-sm w-full pl-10 rounded-full bg-base-200/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/40">
              <Icon name="search" size="sm" />
            </div>
          </div>

          {/* Current Theme Display */}
          <div className="mb-4 p-3 rounded-2xl bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border border-primary/20">
            <div className="flex items-center gap-3">
              <div className="text-2xl">
                <Icon name={getCurrentThemeData().icon} size="lg" />
              </div>
              <div>
                <div className="font-semibold capitalize">{currentTheme}</div>
                <div className="text-xs text-base-content/60">Current theme</div>
              </div>
              <div className="ml-auto flex gap-1">
                {getThemePreviewColors(currentTheme).map((color, index) => (
                  <div 
                    key={index}
                    className="w-3 h-3 rounded-full border border-base-content/20"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Theme Categories */}
          <div className="max-h-80 overflow-y-auto custom-scrollbar">
            {searchTerm ? (
              /* Search Results */
              <div className="grid grid-cols-2 gap-2">
                {filteredThemes.map((theme) => (
                  <button
                    key={theme.name}
                    className={`p-3 rounded-2xl text-left transition-all duration-200 group relative overflow-hidden ${
                      currentTheme === theme.name 
                        ? 'bg-gradient-to-br from-primary/20 to-secondary/20 border-2 border-primary/50 scale-105' 
                        : 'bg-base-200/30 hover:bg-base-200/60 border border-transparent hover:border-primary/30 hover:scale-105'
                    }`}
                    onClick={() => handleThemeChange(theme.name)}
                    onMouseEnter={() => setHoveredTheme(theme.name)}
                    onMouseLeave={() => setHoveredTheme(null)}
                  >
                    <div className="flex items-center gap-2">
                      <Icon name={theme.icon} size="md" />
                      <div className="min-w-0 flex-1">
                        <div className="font-medium capitalize truncate text-sm">{theme.name}</div>
                        <div className="text-xs text-base-content/60">{theme.category}</div>
                      </div>
                    </div>
                    {hoveredTheme === theme.name && (
                      <div className="absolute top-1 right-1 flex gap-1">
                        {getThemePreviewColors(theme.name).map((color, index) => (
                          <div 
                            key={index}
                            className="w-2 h-2 rounded-full border border-base-content/20"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    )}
                    {currentTheme === theme.name && (
                      <div className="absolute top-1 right-1">
                        <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                          <Icon name="check" size="xs" color="text-primary-content" />
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              /* Categorized View */
              <div className="space-y-4">
                {Object.entries(categories).map(([category, categoryThemes]) => (
                  <div key={category}>
                    <h4 className="text-sm font-semibold text-base-content/80 mb-2 px-1">
                      {category}
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {categoryThemes.map((themeName) => {
                        const theme = themes.find(t => t.name === themeName);
                        if (!theme) return null;
                        
                        return (
                          <button
                            key={theme.name}
                            className={`p-3 rounded-2xl text-left transition-all duration-200 group relative overflow-hidden ${
                              currentTheme === theme.name 
                                ? 'bg-gradient-to-br from-primary/20 to-secondary/20 border-2 border-primary/50 scale-105' 
                                : 'bg-base-200/30 hover:bg-base-200/60 border border-transparent hover:border-primary/30 hover:scale-105'
                            }`}
                            onClick={() => handleThemeChange(theme.name)}
                            onMouseEnter={() => setHoveredTheme(theme.name)}
                            onMouseLeave={() => setHoveredTheme(null)}
                          >
                            <div className="flex items-center gap-2">
                              <Icon name={theme.icon} size="md" />
                              <div className="min-w-0 flex-1">
                                <div className="font-medium capitalize truncate text-sm">{theme.name}</div>
                              </div>
                            </div>
                            {hoveredTheme === theme.name && (
                              <div className="absolute top-1 right-1 flex gap-1">
                                {getThemePreviewColors(theme.name).map((color, index) => (
                                  <div 
                                    key={index}
                                    className="w-2 h-2 rounded-full border border-base-content/20"
                                    style={{ backgroundColor: color }}
                                  />
                                ))}
                              </div>
                            )}
                            {currentTheme === theme.name && (
                              <div className="absolute top-1 right-1">
                                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                  <Icon name="check" size="xs" color="text-primary-content" />
                                </div>
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="mt-4 pt-3 border-t border-base-300/50">
            <div className="flex gap-2">
              <button 
                className="btn btn-sm btn-ghost flex-1 rounded-full"
                onClick={() => handleThemeChange('light')}
              >
                <Icon name="sun" size="sm" /> Light
              </button>
              <button 
                className="btn btn-sm btn-ghost flex-1 rounded-full"
                onClick={() => handleThemeChange('dark')}
              >
                <Icon name="moon" size="sm" /> Dark
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: oklch(var(--bc) / 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: oklch(var(--bc) / 0.3);
        }
        .theme-low-contrast {
          --bc: 0.8;
        }
      `}</style>
    </div>
  );
}