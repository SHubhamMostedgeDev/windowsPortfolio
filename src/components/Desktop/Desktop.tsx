import { useState, useEffect, useCallback, useMemo } from 'react';
import { FaUser, FaBriefcase, FaCode, FaTools, FaGraduationCap, FaEnvelope, FaCog, FaBomb, FaGlobe, FaListAlt, FaMusic } from 'react-icons/fa';
import { useTheme, IconSize } from '../../context/ThemeContext';
import { useWindows, WindowType } from '../../context/WindowContext';
import DesktopIcon from '../DesktopIcon/DesktopIcon';
import Taskbar from '../Taskbar/Taskbar';
import Window from '../Window/Window';
import ContextMenu from '../ContextMenu/ContextMenu';
import AboutWindow from '../../windows/AboutWindow';
import ExperienceWindow from '../../windows/ExperienceWindow';
import ProjectsWindow from '../../windows/ProjectsWindow';
import SkillsWindow from '../../windows/SkillsWindow';
import EducationWindow from '../../windows/EducationWindow';
import ContactWindow from '../../windows/ContactWindow';
import SettingsWindow from '../../windows/SettingsWindow';
import MinesweeperWindow from '../../windows/MinesweeperWindow';
import BrowserWindow from '../../windows/BrowserWindow';
import CalculatorWindow from '../../windows/CalculatorWindow';
import NotepadWindow from '../../windows/NotepadWindow';
import TodoListWindow from '../../windows/TodoListWindow';
import MusicPlayerWindow from '../../windows/MusicPlayerWindow';

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
    { id: 'todolist', icon: <FaListAlt />, label: 'Todo List' },
    { id: 'musicplayer', icon: <FaMusic />, label: 'Music' },
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
    calculator: <CalculatorWindow />,
    notepad: <NotepadWindow />,
    todolist: <TodoListWindow />,
    musicplayer: <MusicPlayerWindow />,
};

const ICON_GRID_SIZES: Record<IconSize, { size: number; gap: number }> = {
    large: { size: 90, gap: 10 },
    medium: { size: 72, gap: 10 },
    small: { size: 56, gap: 10 },
};

export default function Desktop() {
    const { currentWallpaper, iconSize, iconSortOrder } = useTheme();
    const { windows } = useWindows();
    const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number; isOpen: boolean }>({ x: 0, y: 0, isOpen: false });

    const gridConfig = ICON_GRID_SIZES[iconSize];
    const gridStep = gridConfig.size + gridConfig.gap;

    const sortedIcons = useMemo(() => {
        if (iconSortOrder === 'name-asc') {
            return [...desktopIcons].sort((a, b) => a.label.localeCompare(b.label));
        }
        if (iconSortOrder === 'name-desc') {
            return [...desktopIcons].sort((a, b) => b.label.localeCompare(a.label));
        }
        return desktopIcons;
    }, [iconSortOrder]);

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
        const iconsPerColumn = Math.max(1, Math.floor(availableHeight / gridStep));

        const col = Math.floor(index / iconsPerColumn);
        const row = index % iconsPerColumn;

        return {
            x: col * gridStep,
            y: row * gridStep
        };
    }, [windowSize.height, gridStep]);

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY, isOpen: true });
    };

    const handleClick = () => {
        if (contextMenu.isOpen) {
            setContextMenu({ ...contextMenu, isOpen: false });
        }
    };

    return (
        <div
            className="w-full h-full relative overflow-hidden transition-all duration-500"
            style={{ background: currentWallpaper.gradient }}
            onContextMenu={handleContextMenu}
            onClick={handleClick}
        >
            {/* Desktop Icons Container */}
            <div className="absolute top-4 left-4 right-4 bottom-16 z-10">
                {sortedIcons.map((icon, index) => (
                    <DesktopIcon
                        key={`${icon.id}-${windowSize.width}-${windowSize.height}-${iconSize}-${iconSortOrder}`}
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
                    <Window
                        key={window.id}
                        id={window.id}
                        title={window.title}
                        isMaximized={window.isMaximized}
                        isMinimized={window.isMinimized}
                        zIndex={window.zIndex}
                        position={window.position}
                        size={window.size}
                    >
                        {windowComponents[window.id]}
                    </Window>
                ))}
            </div>

            {/* Context Menu */}
            {contextMenu.isOpen && (
                <ContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    onClose={() => setContextMenu({ ...contextMenu, isOpen: false })}
                />
            )}

            {/* Taskbar */}
            <Taskbar />
        </div>
    );
}
