import { useState } from 'react';
import { IoMdSunny, IoMdMoon } from 'react-icons/io';
import { FaCheck, FaAlignLeft, FaAlignCenter, FaDesktop, FaPalette, FaWindowMaximize, FaChevronRight, FaClock, FaInfoCircle, FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import { BsGrid, BsListUl, BsDisplay, BsPersonCircle } from 'react-icons/bs';
import { useTheme, wallpapers, TaskbarAlignment, displayScaleOptions, accentColors, ClockFormat } from '../context/ThemeContext';

type SettingsSection = 'system' | 'personalization' | 'taskbar' | 'time' | 'about';

const settingsMenu = [
    { id: 'system' as const, label: 'System', icon: <BsDisplay className="text-lg" />, description: 'Display, scale, theme' },
    { id: 'personalization' as const, label: 'Personalization', icon: <FaPalette className="text-lg" />, description: 'Background, accent color' },
    { id: 'taskbar' as const, label: 'Taskbar', icon: <FaWindowMaximize className="text-lg" />, description: 'Taskbar behaviors' },
    { id: 'time' as const, label: 'Time & language', icon: <FaClock className="text-lg" />, description: 'Clock format, region' },
    { id: 'about' as const, label: 'About', icon: <FaInfoCircle className="text-lg" />, description: 'Device info, specs' },
];

export default function SettingsWindow() {
    const [activeSection, setActiveSection] = useState<SettingsSection>('system');
    const {
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
    } = useTheme();

    const renderContent = () => {
        switch (activeSection) {
            case 'system':
                return (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                                <BsPersonCircle className="text-3xl text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">System</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Display, scale, theme mode</p>
                            </div>
                        </div>

                        <div className="bg-white/50 dark:bg-white/5 rounded-lg p-4">
                            <div className="flex items-center gap-3 mb-4">
                                <FaDesktop className="text-xl" style={{ color: accentColor.color }} />
                                <h3 className="text-base font-medium text-gray-800 dark:text-white">Display</h3>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                                    <div>
                                        <p className="text-sm font-medium text-gray-800 dark:text-white">Scale</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Change the size of text, apps, and other items</p>
                                    </div>
                                    <select
                                        value={displayScale}
                                        onChange={(e) => setDisplayScale(parseInt(e.target.value) as 100 | 125 | 150 | 175)}
                                        className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2"
                                        style={{ '--tw-ring-color': accentColor.color } as React.CSSProperties}
                                    >
                                        {displayScaleOptions.map(scale => (
                                            <option key={scale} value={scale}>{scale}%</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex items-center justify-between py-3">
                                    <div>
                                        <p className="text-sm font-medium text-gray-800 dark:text-white">Theme mode</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Choose your default app mode</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => !isDark || toggleTheme()}
                                            className="flex items-center gap-2 px-4 py-2 rounded-md transition-all"
                                            style={!isDark ? { backgroundColor: accentColor.color, color: 'white' } : {}}
                                        >
                                            <IoMdSunny className="text-base" />
                                            <span className="text-sm">Light</span>
                                        </button>
                                        <button
                                            onClick={() => isDark || toggleTheme()}
                                            className="flex items-center gap-2 px-4 py-2 rounded-md transition-all bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                                            style={isDark ? { backgroundColor: accentColor.color, color: 'white' } : {}}
                                        >
                                            <IoMdMoon className="text-base" />
                                            <span className="text-sm">Dark</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'personalization':
                return (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-16 h-16 rounded-lg overflow-hidden" style={{ background: currentWallpaper.gradient }} />
                            <div>
                                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Personalization</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Background, accent color</p>
                            </div>
                        </div>

                        {/* Accent Color */}
                        <div className="bg-white/50 dark:bg-white/5 rounded-lg p-4">
                            <h3 className="text-base font-medium text-gray-800 dark:text-white mb-2">Accent color</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Choose your accent color</p>

                            <div className="grid grid-cols-6 gap-3">
                                {accentColors.map(color => (
                                    <button
                                        key={color.id}
                                        onClick={() => setAccentColor(color.id)}
                                        className="w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                                        style={{ backgroundColor: color.color }}
                                        title={color.name}
                                    >
                                        {accentColor.id === color.id && (
                                            <FaCheck className="text-white text-sm drop-shadow" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Background */}
                        <div className="bg-white/50 dark:bg-white/5 rounded-lg p-4">
                            <h3 className="text-base font-medium text-gray-800 dark:text-white mb-2">Background</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Choose a background wallpaper</p>

                            <div className="grid grid-cols-4 gap-3">
                                {wallpapers.map(wallpaper => (
                                    <button
                                        key={wallpaper.id}
                                        onClick={() => setWallpaper(wallpaper.id)}
                                        className="relative aspect-video rounded-lg overflow-hidden group transition-all"
                                        style={{
                                            outline: currentWallpaper.id === wallpaper.id ? `2px solid ${accentColor.color}` : 'none',
                                            outlineOffset: '2px'
                                        }}
                                        title={wallpaper.name}
                                    >
                                        <div
                                            className="absolute inset-0 transition-transform group-hover:scale-110"
                                            style={{ background: wallpaper.gradient }}
                                        />
                                        {currentWallpaper.id === wallpaper.id && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                                <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: accentColor.color }}>
                                                    <FaCheck className="text-white text-xs" />
                                                </div>
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 'taskbar':
                return (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-16 h-16 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                <FaWindowMaximize className="text-2xl text-gray-600 dark:text-gray-300" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Taskbar</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Taskbar behaviors and settings</p>
                            </div>
                        </div>

                        <div className="bg-white/50 dark:bg-white/5 rounded-lg p-4 space-y-4">
                            <h3 className="text-base font-medium text-gray-800 dark:text-white mb-4">Taskbar behaviors</h3>

                            <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                                <div>
                                    <p className="text-sm font-medium text-gray-800 dark:text-white">Taskbar alignment</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Position of taskbar items</p>
                                </div>
                                <div className="flex gap-2">
                                    {(['left', 'center'] as TaskbarAlignment[]).map((alignment) => (
                                        <button
                                            key={alignment}
                                            onClick={() => setTaskbarAlignment(alignment)}
                                            className="flex items-center gap-2 px-4 py-2 rounded-md transition-all"
                                            style={taskbarAlignment === alignment
                                                ? { backgroundColor: accentColor.color, color: 'white' }
                                                : { backgroundColor: isDark ? 'rgb(55, 65, 81)' : 'rgb(243, 244, 246)' }}
                                        >
                                            {alignment === 'left' ? <FaAlignLeft className="text-sm" /> : <FaAlignCenter className="text-sm" />}
                                            <span className="text-sm capitalize">{alignment}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center justify-between py-3">
                                <div>
                                    <p className="text-sm font-medium text-gray-800 dark:text-white">Taskbar buttons</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Show labels on taskbar buttons</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setTaskbarButtonStyle('icons')}
                                        className="flex items-center gap-2 px-4 py-2 rounded-md transition-all"
                                        style={taskbarButtonStyle === 'icons'
                                            ? { backgroundColor: accentColor.color, color: 'white' }
                                            : { backgroundColor: isDark ? 'rgb(55, 65, 81)' : 'rgb(243, 244, 246)' }}
                                    >
                                        <BsGrid className="text-sm" />
                                        <span className="text-sm">Icons</span>
                                    </button>
                                    <button
                                        onClick={() => setTaskbarButtonStyle('icons-labels')}
                                        className="flex items-center gap-2 px-4 py-2 rounded-md transition-all"
                                        style={taskbarButtonStyle === 'icons-labels'
                                            ? { backgroundColor: accentColor.color, color: 'white' }
                                            : { backgroundColor: isDark ? 'rgb(55, 65, 81)' : 'rgb(243, 244, 246)' }}
                                    >
                                        <BsListUl className="text-sm" />
                                        <span className="text-sm">Labels</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'time':
                return (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-16 h-16 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                <FaClock className="text-2xl" style={{ color: accentColor.color }} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Time & language</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Clock format, region settings</p>
                            </div>
                        </div>

                        <div className="bg-white/50 dark:bg-white/5 rounded-lg p-4">
                            <h3 className="text-base font-medium text-gray-800 dark:text-white mb-4">Date & time</h3>

                            <div className="flex items-center justify-between py-3">
                                <div>
                                    <p className="text-sm font-medium text-gray-800 dark:text-white">Clock format</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Choose 12-hour or 24-hour format</p>
                                </div>
                                <div className="flex gap-2">
                                    {(['12h', '24h'] as ClockFormat[]).map((format) => (
                                        <button
                                            key={format}
                                            onClick={() => setClockFormat(format)}
                                            className="flex items-center gap-2 px-4 py-2 rounded-md transition-all"
                                            style={clockFormat === format
                                                ? { backgroundColor: accentColor.color, color: 'white' }
                                                : { backgroundColor: isDark ? 'rgb(55, 65, 81)' : 'rgb(243, 244, 246)' }}
                                        >
                                            <span className="text-sm">{format === '12h' ? '12-hour' : '24-hour'}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'about':
                return (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                <span className="text-2xl font-bold text-white">SK</span>
                            </div>
                            <div>
                                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">About</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Portfolio information</p>
                            </div>
                        </div>

                        {/* Developer Info */}
                        <div className="bg-white/50 dark:bg-white/5 rounded-lg p-4">
                            <h3 className="text-base font-medium text-gray-800 dark:text-white mb-4">Developer</h3>

                            <div className="space-y-3">
                                <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Name</span>
                                    <span className="text-sm font-medium text-gray-800 dark:text-white">Shubham Kumar Prajapati</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Role</span>
                                    <span className="text-sm font-medium text-gray-800 dark:text-white">Fullstack Developer</span>
                                </div>
                                <div className="flex justify-between py-2">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Portfolio Version</span>
                                    <span className="text-sm font-medium text-gray-800 dark:text-white">1.0.0</span>
                                </div>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="bg-white/50 dark:bg-white/5 rounded-lg p-4">
                            <h3 className="text-base font-medium text-gray-800 dark:text-white mb-4">Connect</h3>

                            <div className="flex gap-3">
                                <a
                                    href="https://github.com/playkashyap"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors"
                                >
                                    <FaGithub className="text-lg" />
                                    <span className="text-sm">GitHub</span>
                                </a>
                                <a
                                    href="https://linkedin.com/in/playkashyap"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-colors"
                                    style={{ backgroundColor: '#0077b5' }}
                                >
                                    <FaLinkedin className="text-lg" />
                                    <span className="text-sm">LinkedIn</span>
                                </a>
                                <a
                                    href="mailto:contact@example.com"
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-colors"
                                    style={{ backgroundColor: accentColor.color }}
                                >
                                    <FaEnvelope className="text-lg" />
                                    <span className="text-sm">Email</span>
                                </a>
                            </div>
                        </div>

                        {/* Tech Stack */}
                        <div className="bg-white/50 dark:bg-white/5 rounded-lg p-4">
                            <h3 className="text-base font-medium text-gray-800 dark:text-white mb-4">Built with</h3>
                            <div className="flex flex-wrap gap-2">
                                {['React', 'TypeScript', 'Tailwind CSS', 'Vite'].map(tech => (
                                    <span
                                        key={tech}
                                        className="px-3 py-1 text-sm rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="h-full flex -m-4 bg-gray-50 dark:bg-[#202020]">
            {/* Sidebar */}
            <div className="w-64 bg-gray-100/80 dark:bg-[#2d2d2d] border-r border-gray-200 dark:border-gray-700 p-3 flex flex-col">
                <div className="px-3 py-4 mb-2">
                    <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Settings</h1>
                </div>

                <nav className="flex-1 space-y-1">
                    {settingsMenu.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveSection(item.id)}
                            className={`w-full flex items-center gap-3 px-3 py-3 rounded-md transition-all text-left ${activeSection === item.id
                                    ? 'bg-white dark:bg-white/10 shadow-sm'
                                    : 'hover:bg-white/50 dark:hover:bg-white/5'
                                }`}
                        >
                            <span style={{ color: activeSection === item.id ? accentColor.color : undefined }} className={activeSection === item.id ? '' : 'text-gray-600 dark:text-gray-400'}>
                                {item.icon}
                            </span>
                            <div className="flex-1 min-w-0">
                                <p className={`text-sm font-medium truncate ${activeSection === item.id
                                        ? 'text-gray-900 dark:text-white'
                                        : 'text-gray-700 dark:text-gray-300'
                                    }`}>
                                    {item.label}
                                </p>
                            </div>
                            <FaChevronRight className={`text-xs ${activeSection === item.id ? 'text-gray-400' : 'text-gray-300 dark:text-gray-600'
                                }`} />
                        </button>
                    ))}
                </nav>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 overflow-auto">
                {renderContent()}
            </div>
        </div>
    );
}
