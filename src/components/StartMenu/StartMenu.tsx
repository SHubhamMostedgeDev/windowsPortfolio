import { useRef, useEffect } from 'react';
import { FaUser, FaBriefcase, FaCode, FaTools, FaGraduationCap, FaEnvelope, FaCog, FaBomb, FaGlobe, FaCalculator, FaStickyNote, FaListAlt, FaMusic } from 'react-icons/fa';
import { useWindows, WindowType } from '../../context/WindowContext';
import { useTheme } from '../../context/ThemeContext';

interface StartMenuProps {
    onClose: () => void;
}

const pinnedApps: { id: WindowType; icon: React.ReactNode; label: string }[] = [
    { id: 'browser', icon: <FaGlobe />, label: 'Edge' },
    { id: 'calculator', icon: <FaCalculator />, label: 'Calculator' },
    { id: 'notepad', icon: <FaStickyNote />, label: 'Notepad' },
    { id: 'settings', icon: <FaCog />, label: 'Settings' },
    { id: 'minesweeper', icon: <FaBomb />, label: 'Minesweeper' },
    { id: 'todolist', icon: <FaListAlt />, label: 'Todo List' },
    { id: 'musicplayer', icon: <FaMusic />, label: 'Music' },
    { id: 'projects', icon: <FaCode />, label: 'Projects' },
    { id: 'about', icon: <FaUser />, label: 'About Me' },
    { id: 'experience', icon: <FaBriefcase />, label: 'Experience' },
    { id: 'skills', icon: <FaTools />, label: 'Skills' },
    { id: 'education', icon: <FaGraduationCap />, label: 'Education' },
    { id: 'contact', icon: <FaEnvelope />, label: 'Contact' },
];

export default function StartMenu({ onClose }: StartMenuProps) {
    const { openWindow } = useWindows();
    const { taskbarAlignment } = useTheme();
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                // Check if click is on taskbar start button
                const target = event.target as HTMLElement;
                if (!target.closest('[data-start-button]')) {
                    onClose();
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    const handleAppClick = (id: WindowType) => {
        openWindow(id);
        onClose();
    };

    // Position based on taskbar alignment
    const positionClass = taskbarAlignment === 'center'
        ? 'left-1/2 -translate-x-1/2'
        : 'left-4';

    return (
        <div
            ref={menuRef}
            className={`fixed bottom-14 w-[600px] glass rounded-lg window-shadow start-menu-enter z-[9998] ${positionClass}`}
        >
            {/* Search bar */}
            <div className="p-4 border-b border-white/10 dark:border-white/5">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search apps, settings, and documents"
                        className="w-full px-4 py-2.5 rounded-full bg-white/50 dark:bg-black/30 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-win-accent"
                    />
                </div>
            </div>

            {/* Pinned apps section */}
            <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">Pinned</span>
                </div>
                <div className="grid grid-cols-5 gap-2">
                    {pinnedApps.map(app => (
                        <button
                            key={app.id}
                            onClick={() => handleAppClick(app.id)}
                            className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-white/20 dark:hover:bg-white/10 transition-colors"
                        >
                            <div className="text-2xl text-gray-700 dark:text-gray-300 mb-2">
                                {app.icon}
                            </div>
                            <span className="text-xs text-gray-700 dark:text-gray-300 text-center">
                                {app.label}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* User section */}
            <div className="p-4 border-t border-white/10 dark:border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-win-accent to-blue-400 flex items-center justify-center">
                        <span className="text-white font-bold">SK</span>
                    </div>
                    <div>
                        <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                            Shubham Kumar Prajapati
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                            Fullstack Developer
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
