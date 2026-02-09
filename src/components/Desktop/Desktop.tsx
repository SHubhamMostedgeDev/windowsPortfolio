import { useState, useEffect, useCallback } from 'react';
import { FaUser, FaBriefcase, FaCode, FaTools, FaGraduationCap, FaEnvelope, FaCog, FaBomb, FaGlobe } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';
import { useWindows, WindowType } from '../../context/WindowContext';
import DesktopIcon from '../DesktopIcon/DesktopIcon';
import Taskbar from '../Taskbar/Taskbar';
import Window from '../Window/Window';
import AboutWindow from '../../windows/AboutWindow';
import ExperienceWindow from '../../windows/ExperienceWindow';
import ProjectsWindow from '../../windows/ProjectsWindow';
import SkillsWindow from '../../windows/SkillsWindow';
import EducationWindow from '../../windows/EducationWindow';
import ContactWindow from '../../windows/ContactWindow';
import SettingsWindow from '../../windows/SettingsWindow';
import MinesweeperWindow from '../../windows/MinesweeperWindow';
import BrowserWindow from '../../windows/BrowserWindow';

const desktopIcons: { id: WindowType; icon: React.ReactNode; label: string }[] = [
    { id: 'browser', icon: <FaGlobe />, label: 'Edge' },
    { id: 'about', icon: <FaUser />, label: 'About Me' },
    { id: 'experience', icon: <FaBriefcase />, label: 'Experience' },
    { id: 'projects', icon: <FaCode />, label: 'Projects' },
    { id: 'skills', icon: <FaTools />, label: 'Skills' },
    { id: 'education', icon: <FaGraduationCap />, label: 'Education' },
    { id: 'contact', icon: <FaEnvelope />, label: 'Contact' },
    { id: 'settings', icon: <FaCog />, label: 'Settings' },
    { id: 'minesweeper', icon: <FaBomb />, label: 'Minesweeper' },
];

const windowComponents: Record<WindowType, React.ReactNode> = {
    about: <AboutWindow />,
    experience: <ExperienceWindow />,
    projects: <ProjectsWindow />,
    skills: <SkillsWindow />,
    education: <EducationWindow />,
    contact: <ContactWindow />,
    settings: <SettingsWindow />,
    minesweeper: <MinesweeperWindow />,
    browser: <BrowserWindow />,
};

const ICON_SIZE = 90;
const ICON_GAP = 10;
const GRID_SIZE = ICON_SIZE + ICON_GAP;

export default function Desktop() {
    const { currentWallpaper } = useTheme();
    const { windows } = useWindows();
    const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

    // Handle window resize
    useEffect(() => {
        const handleResize = (): void => {
            setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Calculate icon position in a column-first grid layout
    const getIconPosition = useCallback((index: number) => {
        // Available height for icons (subtract taskbar height and padding)
        const availableHeight = windowSize.height - 48 - 32; // 48px taskbar, 32px padding
        const iconsPerColumn = Math.max(1, Math.floor(availableHeight / GRID_SIZE));

        const col = Math.floor(index / iconsPerColumn);
        const row = index % iconsPerColumn;

        return {
            x: col * GRID_SIZE,
            y: row * GRID_SIZE
        };
    }, [windowSize.height]);

    return (
        <div
            className="w-full h-full relative overflow-hidden transition-all duration-500"
            style={{ background: currentWallpaper.gradient }}
        >
            {/* Desktop Icons Container */}
            <div className="absolute top-4 left-4 right-4 bottom-16 z-10">
                {desktopIcons.map((icon, index) => (
                    <DesktopIcon
                        key={`${icon.id}-${windowSize.width}-${windowSize.height}`}
                        id={icon.id}
                        icon={icon.icon}
                        label={icon.label}
                        initialPosition={getIconPosition(index)}
                    />
                ))}
            </div>

            {/* Windows */}
            <div className="absolute inset-0 mb-12 pointer-events-none">
                {windows.map(window => (
                    !window.isMinimized && (
                        <Window
                            key={window.id}
                            id={window.id}
                            title={window.title}
                            isMaximized={window.isMaximized}
                            zIndex={window.zIndex}
                            position={window.position}
                            size={window.size}
                        >
                            {windowComponents[window.id]}
                        </Window>
                    )
                ))}
            </div>

            {/* Taskbar */}
            <Taskbar />
        </div>
    );
}
