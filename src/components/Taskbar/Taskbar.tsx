import { useState, useEffect } from 'react';
import { BsWindows } from 'react-icons/bs';
import { IoMdSunny, IoMdMoon } from 'react-icons/io';
import { FaUser, FaBriefcase, FaCode, FaTools, FaGraduationCap, FaEnvelope, FaCog, FaBomb, FaGlobe, FaWifi, FaVolumeUp } from 'react-icons/fa';
import { useWindows, WindowType } from '../../context/WindowContext';
import { useTheme } from '../../context/ThemeContext';
import StartMenu from '../StartMenu/StartMenu';

// Icon mapping for taskbar
const windowIcons: Record<WindowType, React.ReactNode> = {
    about: <FaUser className="text-base" />,
    experience: <FaBriefcase className="text-base" />,
    projects: <FaCode className="text-base" />,
    skills: <FaTools className="text-base" />,
    education: <FaGraduationCap className="text-base" />,
    contact: <FaEnvelope className="text-base" />,
    settings: <FaCog className="text-base" />,
    minesweeper: <FaBomb className="text-base" />,
    browser: <FaGlobe className="text-base" />,
};

export default function Taskbar() {
    const { windows, focusWindow } = useWindows();
    const { isDark, toggleTheme, taskbarAlignment, taskbarButtonStyle, accentColor, clockFormat } = useTheme();
    const [time, setTime] = useState(new Date());
    const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: clockFormat === '12h',
        });
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    // Determine layout classes based on alignment
    const taskbarContentClass = taskbarAlignment === 'center'
        ? 'justify-center'
        : 'justify-start pl-2';

    return (
        <>
            {/* Start Menu */}
            {isStartMenuOpen && (
                <StartMenu onClose={() => setIsStartMenuOpen(false)} />
            )}

            {/* Taskbar */}
            <div className={`fixed bottom-0 left-0 right-0 h-12 taskbar-glass flex items-center ${taskbarContentClass} z-[9999]`}>
                {/* Center/Left section - Start button and open apps */}
                <div className="flex items-center gap-0.5 px-1">
                    {/* Start Button */}
                    <button
                        onClick={() => setIsStartMenuOpen(!isStartMenuOpen)}
                        className={`w-12 h-10 flex items-center justify-center transition-all rounded ${isStartMenuOpen
                            ? 'bg-black/5 dark:bg-white/10'
                            : 'hover:bg-black/5 dark:hover:bg-white/8'
                            }`}
                    >
                        <BsWindows className="text-xl text-gray-700 dark:text-white" />
                    </button>

                    {/* Divider */}
                    {windows.length > 0 && (
                        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
                    )}

                    {/* Open windows */}
                    {windows.map(window => (
                        <button
                            key={window.id}
                            onClick={() => focusWindow(window.id)}
                            className={`h-10 flex items-center gap-2 transition-all rounded relative ${taskbarButtonStyle === 'icons' ? 'w-12 justify-center' : 'px-3'
                                } ${window.isMinimized
                                    ? 'hover:bg-black/5 dark:hover:bg-white/8'
                                    : 'bg-black/5 dark:bg-white/8 hover:bg-black/8 dark:hover:bg-white/12'
                                }`}
                            title={window.title}
                        >
                            {/* Icon */}
                            <span className={window.isMinimized ? 'text-gray-500 dark:text-gray-400' : 'text-gray-700 dark:text-gray-200'}>
                                {windowIcons[window.id]}
                            </span>

                            {/* Label (only if icons-labels style) */}
                            {taskbarButtonStyle === 'icons-labels' && (
                                <span className={`text-sm max-w-[100px] truncate ${window.isMinimized
                                    ? 'text-gray-500 dark:text-gray-400'
                                    : 'text-gray-700 dark:text-gray-200'
                                    }`}>
                                    {window.title}
                                </span>
                            )}

                            {/* Windows 11 style accent indicator - uses accent color */}
                            {!window.isMinimized && (
                                <span
                                    className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-[3px] rounded-full"
                                    style={{ backgroundColor: accentColor.color }}
                                />
                            )}
                            {window.isMinimized && (
                                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-[3px] bg-gray-400 dark:bg-gray-500 rounded-full" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Right section - System tray */}
                <div className="absolute right-0 flex items-center h-full">
                    {/* System icons */}
                    <div className="flex items-center gap-0.5 px-2 h-10 hover:bg-black/5 dark:hover:bg-white/8 rounded transition-all cursor-pointer">
                        <FaWifi className="text-sm text-gray-600 dark:text-gray-300" />
                        <FaVolumeUp className="text-sm text-gray-600 dark:text-gray-300 ml-2" />
                    </div>

                    {/* Theme toggle */}
                    <button
                        onClick={toggleTheme}
                        className="w-10 h-10 flex items-center justify-center rounded hover:bg-black/5 dark:hover:bg-white/8 transition-all"
                    >
                        {isDark ? (
                            <IoMdSunny className="text-lg text-yellow-500" />
                        ) : (
                            <IoMdMoon className="text-lg text-gray-600" />
                        )}
                    </button>

                    {/* Time and Date */}
                    <div className="flex flex-col items-end justify-center px-3 h-10 hover:bg-black/5 dark:hover:bg-white/8 rounded transition-all cursor-pointer">
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-200 leading-tight">
                            {formatTime(time)}
                        </span>
                        <span className="text-[11px] text-gray-500 dark:text-gray-400 leading-tight">
                            {formatDate(time)}
                        </span>
                    </div>

                    {/* Show desktop button */}
                    <div className="w-1 h-full bg-transparent hover:bg-black/10 dark:hover:bg-white/10 cursor-pointer" />
                </div>
            </div>
        </>
    );
}
