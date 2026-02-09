import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Wallpaper gradients
export const wallpapers = [
    {
        id: 'win11-default',
        name: 'Windows 11 Default',
        gradient: 'linear-gradient(135deg, #0078d4 0%, #00bcf2 50%, #88d7f7 100%)',
    },
    {
        id: 'sunset',
        name: 'Sunset',
        gradient: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 50%, #ff9ff3 100%)',
    },
    {
        id: 'aurora',
        name: 'Aurora',
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #66a6ff 100%)',
    },
    {
        id: 'forest',
        name: 'Forest',
        gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    },
    {
        id: 'ocean',
        name: 'Ocean',
        gradient: 'linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)',
    },
    {
        id: 'night',
        name: 'Night Sky',
        gradient: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
    },
    {
        id: 'rose',
        name: 'Rose',
        gradient: 'linear-gradient(135deg, #ee9ca7 0%, #ffdde1 100%)',
    },
    {
        id: 'cosmic',
        name: 'Cosmic',
        gradient: 'linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%)',
    },
];

// Accent colors - Windows 11 style palette
export const accentColors = [
    { id: 'blue', name: 'Blue', color: '#0078d4' },
    { id: 'purple', name: 'Purple', color: '#8764b8' },
    { id: 'pink', name: 'Pink', color: '#e74856' },
    { id: 'red', name: 'Red', color: '#c42b1c' },
    { id: 'orange', name: 'Orange', color: '#f7630c' },
    { id: 'yellow', name: 'Yellow', color: '#ffc83d' },
    { id: 'green', name: 'Green', color: '#0e7a0d' },
    { id: 'teal', name: 'Teal', color: '#00b7c3' },
    { id: 'slate', name: 'Slate', color: '#7a7574' },
    { id: 'lavender', name: 'Lavender', color: '#b146c2' },
    { id: 'mint', name: 'Mint', color: '#00cc6a' },
    { id: 'navy', name: 'Navy', color: '#0063b1' },
];

export type TaskbarAlignment = 'left' | 'center';
export type TaskbarButtonStyle = 'icons' | 'icons-labels';
export type DisplayScale = 100 | 125 | 150 | 175;
export type ClockFormat = '12h' | '24h';

export const displayScaleOptions: DisplayScale[] = [100, 125, 150, 175];

interface ThemeContextType {
    isDark: boolean;
    toggleTheme: () => void;
    currentWallpaper: typeof wallpapers[0];
    setWallpaper: (id: string) => void;
    taskbarAlignment: TaskbarAlignment;
    setTaskbarAlignment: (alignment: TaskbarAlignment) => void;
    taskbarButtonStyle: TaskbarButtonStyle;
    setTaskbarButtonStyle: (style: TaskbarButtonStyle) => void;
    displayScale: DisplayScale;
    setDisplayScale: (scale: DisplayScale) => void;
    accentColor: typeof accentColors[0];
    setAccentColor: (id: string) => void;
    clockFormat: ClockFormat;
    setClockFormat: (format: ClockFormat) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [isDark, setIsDark] = useState(() => {
        const saved = localStorage.getItem('theme');
        return saved ? saved === 'dark' : true;
    });

    const [currentWallpaper, setCurrentWallpaper] = useState(() => {
        const savedId = localStorage.getItem('wallpaper');
        return wallpapers.find(w => w.id === savedId) || wallpapers[0];
    });

    const [taskbarAlignment, setTaskbarAlignmentState] = useState<TaskbarAlignment>(() => {
        const saved = localStorage.getItem('taskbarAlignment');
        return (saved as TaskbarAlignment) || 'center';
    });

    const [taskbarButtonStyle, setTaskbarButtonStyleState] = useState<TaskbarButtonStyle>(() => {
        const saved = localStorage.getItem('taskbarButtonStyle');
        return (saved as TaskbarButtonStyle) || 'icons-labels';
    });

    const [displayScale, setDisplayScaleState] = useState<DisplayScale>(() => {
        const saved = localStorage.getItem('displayScale');
        return (saved ? parseInt(saved) : 100) as DisplayScale;
    });

    const [accentColor, setAccentColorState] = useState(() => {
        const savedId = localStorage.getItem('accentColor');
        return accentColors.find(c => c.id === savedId) || accentColors[0];
    });

    const [clockFormat, setClockFormatState] = useState<ClockFormat>(() => {
        const saved = localStorage.getItem('clockFormat');
        return (saved as ClockFormat) || '12h';
    });

    useEffect(() => {
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDark]);

    useEffect(() => {
        localStorage.setItem('wallpaper', currentWallpaper.id);
    }, [currentWallpaper]);

    useEffect(() => {
        localStorage.setItem('taskbarAlignment', taskbarAlignment);
    }, [taskbarAlignment]);

    useEffect(() => {
        localStorage.setItem('taskbarButtonStyle', taskbarButtonStyle);
    }, [taskbarButtonStyle]);

    useEffect(() => {
        localStorage.setItem('displayScale', displayScale.toString());
        document.documentElement.style.fontSize = `${displayScale}%`;
    }, [displayScale]);

    useEffect(() => {
        localStorage.setItem('accentColor', accentColor.id);
        // Apply accent color as CSS variable
        document.documentElement.style.setProperty('--accent-color', accentColor.color);
    }, [accentColor]);

    useEffect(() => {
        localStorage.setItem('clockFormat', clockFormat);
    }, [clockFormat]);

    const toggleTheme = () => setIsDark(prev => !prev);

    const setWallpaper = (id: string) => {
        const wallpaper = wallpapers.find(w => w.id === id);
        if (wallpaper) setCurrentWallpaper(wallpaper);
    };

    const setTaskbarAlignment = (alignment: TaskbarAlignment) => {
        setTaskbarAlignmentState(alignment);
    };

    const setTaskbarButtonStyle = (style: TaskbarButtonStyle) => {
        setTaskbarButtonStyleState(style);
    };

    const setDisplayScale = (scale: DisplayScale) => {
        setDisplayScaleState(scale);
    };

    const setAccentColor = (id: string) => {
        const color = accentColors.find(c => c.id === id);
        if (color) setAccentColorState(color);
    };

    const setClockFormat = (format: ClockFormat) => {
        setClockFormatState(format);
    };

    return (
        <ThemeContext.Provider value={{
            isDark,
            toggleTheme,
            currentWallpaper,
            setWallpaper,
            taskbarAlignment,
            setTaskbarAlignment,
            taskbarButtonStyle,
            setTaskbarButtonStyle,
            displayScale,
            setDisplayScale,
            accentColor,
            setAccentColor,
            clockFormat,
            setClockFormat,
        }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used within ThemeProvider');
    return context;
}
