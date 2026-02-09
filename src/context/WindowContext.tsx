import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

export type WindowType = 'about' | 'experience' | 'projects' | 'skills' | 'education' | 'contact' | 'settings' | 'minesweeper' | 'browser' | 'calculator' | 'notepad' | 'todolist' | 'musicplayer';

export interface WindowState {
    id: WindowType;
    title: string;
    isOpen: boolean;
    isMinimized: boolean;
    isMaximized: boolean;
    zIndex: number;
    position: { x: number; y: number };
    size: { width: number; height: number };
}

interface WindowContextType {
    windows: WindowState[];
    activeWindowId: WindowType | null;
    openWindow: (id: WindowType) => void;
    closeWindow: (id: WindowType) => void;
    minimizeWindow: (id: WindowType) => void;
    maximizeWindow: (id: WindowType) => void;
    focusWindow: (id: WindowType) => void;
    updateWindowPosition: (id: WindowType, position: { x: number; y: number }) => void;
    updateWindowSize: (id: WindowType, size: { width: number; height: number }) => void;
}

const windowDefaults: Record<WindowType, { title: string; size: { width: number; height: number } }> = {
    about: { title: 'About Me', size: { width: 600, height: 500 } },
    experience: { title: 'Experience', size: { width: 700, height: 550 } },
    projects: { title: 'Projects', size: { width: 800, height: 600 } },
    skills: { title: 'Skills', size: { width: 650, height: 500 } },
    education: { title: 'Education', size: { width: 600, height: 450 } },
    contact: { title: 'Contact', size: { width: 500, height: 450 } },
    settings: { title: 'Settings', size: { width: 850, height: 550 } },
    minesweeper: { title: 'Minesweeper', size: { width: 400, height: 500 } },
    browser: { title: 'Edge Browser', size: { width: 900, height: 600 } },
    calculator: { title: 'Calculator', size: { width: 320, height: 500 } },
    notepad: { title: 'Notepad', size: { width: 650, height: 500 } },
    todolist: { title: 'Todo List', size: { width: 500, height: 550 } },
    musicplayer: { title: 'Music Player', size: { width: 800, height: 550 } },
};

const WindowContext = createContext<WindowContextType | undefined>(undefined);

let highestZIndex = 100;

function getRandomPosition(): { x: number; y: number } {
    const maxX = window.innerWidth - 700;
    const maxY = window.innerHeight - 500;
    return {
        x: Math.max(50, Math.random() * maxX),
        y: Math.max(50, Math.random() * maxY * 0.5),
    };
}

export function WindowProvider({ children }: { children: ReactNode }) {
    const [windows, setWindows] = useState<WindowState[]>([]);
    const [activeWindowId, setActiveWindowId] = useState<WindowType | null>(null);

    const openWindow = useCallback((id: WindowType) => {
        setWindows(prev => {
            const existing = prev.find(w => w.id === id);
            if (existing) {
                // If minimized, restore it
                if (existing.isMinimized) {
                    highestZIndex++;
                    return prev.map(w =>
                        w.id === id ? { ...w, isMinimized: false, zIndex: highestZIndex } : w
                    );
                }
                // Otherwise just focus
                highestZIndex++;
                return prev.map(w =>
                    w.id === id ? { ...w, zIndex: highestZIndex } : w
                );
            }
            // Create new window
            highestZIndex++;
            const defaults = windowDefaults[id];
            return [...prev, {
                id,
                title: defaults.title,
                isOpen: true,
                isMinimized: false,
                isMaximized: false,
                zIndex: highestZIndex,
                position: getRandomPosition(),
                size: defaults.size,
            }];
        });
        setActiveWindowId(id);
    }, []);

    const closeWindow = useCallback((id: WindowType) => {
        setWindows(prev => prev.filter(w => w.id !== id));
        setActiveWindowId(prev => prev === id ? null : prev);
    }, []);

    const minimizeWindow = useCallback((id: WindowType) => {
        setWindows(prev => prev.map(w =>
            w.id === id ? { ...w, isMinimized: true } : w
        ));
        setActiveWindowId(prev => prev === id ? null : prev);
    }, []);

    const maximizeWindow = useCallback((id: WindowType) => {
        setWindows(prev => prev.map(w =>
            w.id === id ? { ...w, isMaximized: !w.isMaximized } : w
        ));
    }, []);

    const focusWindow = useCallback((id: WindowType) => {
        highestZIndex++;
        setWindows(prev => prev.map(w =>
            w.id === id ? { ...w, zIndex: highestZIndex, isMinimized: false } : w
        ));
        setActiveWindowId(id);
    }, []);

    const updateWindowPosition = useCallback((id: WindowType, position: { x: number; y: number }) => {
        setWindows(prev => prev.map(w =>
            w.id === id ? { ...w, position } : w
        ));
    }, []);

    const updateWindowSize = useCallback((id: WindowType, size: { width: number; height: number }) => {
        setWindows(prev => prev.map(w =>
            w.id === id ? { ...w, size } : w
        ));
    }, []);

    return (
        <WindowContext.Provider value={{
            windows,
            activeWindowId,
            openWindow,
            closeWindow,
            minimizeWindow,
            maximizeWindow,
            focusWindow,
            updateWindowPosition,
            updateWindowSize,
        }}>
            {children}
        </WindowContext.Provider>
    );
}

export function useWindows() {
    const context = useContext(WindowContext);
    if (!context) throw new Error('useWindows must be used within WindowProvider');
    return context;
}
