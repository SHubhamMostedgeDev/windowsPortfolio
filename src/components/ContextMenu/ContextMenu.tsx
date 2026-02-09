import { useState, useEffect, useRef } from 'react';
import { FaSyncAlt, FaCog, FaCalculator, FaStickyNote, FaDesktop, FaSortAmountDown, FaThLarge, FaCheck, FaChevronRight } from 'react-icons/fa';
import { useWindows } from '../../context/WindowContext';
import { useTheme, IconSize, IconSortOrder } from '../../context/ThemeContext';

interface ContextMenuProps {
    x: number;
    y: number;
    onClose: () => void;
}

const viewOptions: { value: IconSize; label: string }[] = [
    { value: 'large', label: 'Large icons' },
    { value: 'medium', label: 'Medium icons' },
    { value: 'small', label: 'Small icons' },
];

const sortOptions: { value: IconSortOrder; label: string }[] = [
    { value: 'default', label: 'Default' },
    { value: 'name-asc', label: 'Name (A \u2192 Z)' },
    { value: 'name-desc', label: 'Name (Z \u2192 A)' },
];

export default function ContextMenu({ x, y, onClose }: ContextMenuProps) {
    const menuRef = useRef<HTMLDivElement>(null);
    const { openWindow } = useWindows();
    const { iconSize, setIconSize, iconSortOrder, setIconSortOrder } = useTheme();
    const [activeSubmenu, setActiveSubmenu] = useState<'view' | 'sort' | null>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    const handleRefresh = () => {
        window.location.reload();
    };

    const handlePersonalize = () => {
        openWindow('settings');
        onClose();
    };

    const handleDisplaySettings = () => {
        openWindow('settings');
        onClose();
    };

    const handleOpenApp = (appId: 'calculator' | 'notepad') => {
        openWindow(appId);
        onClose();
    };

    const menuLeft = Math.min(x, window.innerWidth - 224);
    const menuTop = Math.min(y, window.innerHeight - 300);
    const submenuOnLeft = menuLeft + 224 + 192 > window.innerWidth;

    const btnClass = "w-full text-left flex items-center gap-3 px-3 py-1.5 rounded hover:bg-black/5 dark:hover:bg-white/10 text-gray-800 dark:text-gray-200 transition-colors";
    const submenuClass = "absolute top-0 w-48 bg-white/95 dark:bg-[#2d2d2d]/95 backdrop-blur-md rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1.5 z-[10000]";
    const submenuStyle = submenuOnLeft ? { right: '100%', marginRight: '4px' } : { left: '100%', marginLeft: '4px' };

    return (
        <div
            ref={menuRef}
            className="fixed w-56 bg-white/95 dark:bg-[#2d2d2d]/95 backdrop-blur-md rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1.5 z-[9999] text-sm animate-in fade-in zoom-in-95 duration-100"
            style={{ left: menuLeft, top: menuTop }}
        >
            <div className="px-1 space-y-0.5">
                {/* View with submenu */}
                <div
                    className="relative"
                    onMouseEnter={() => setActiveSubmenu('view')}
                    onMouseLeave={() => setActiveSubmenu(null)}
                >
                    <button className={btnClass}>
                        <FaThLarge className="text-gray-500 dark:text-gray-400 w-4" />
                        <span className="flex-1">View</span>
                        <FaChevronRight className="text-[10px] text-gray-400" />
                    </button>

                    {activeSubmenu === 'view' && (
                        <div className={submenuClass} style={submenuStyle}>
                            <div className="px-1 space-y-0.5">
                                {viewOptions.map(option => (
                                    <button
                                        key={option.value}
                                        onClick={() => { setIconSize(option.value); onClose(); }}
                                        className={btnClass}
                                    >
                                        <span className="w-4 flex items-center justify-center">
                                            {iconSize === option.value && <FaCheck className="text-[10px]" />}
                                        </span>
                                        <span>{option.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sort by with submenu */}
                <div
                    className="relative"
                    onMouseEnter={() => setActiveSubmenu('sort')}
                    onMouseLeave={() => setActiveSubmenu(null)}
                >
                    <button className={btnClass}>
                        <FaSortAmountDown className="text-gray-500 dark:text-gray-400 w-4" />
                        <span className="flex-1">Sort by</span>
                        <FaChevronRight className="text-[10px] text-gray-400" />
                    </button>

                    {activeSubmenu === 'sort' && (
                        <div className={submenuClass} style={submenuStyle}>
                            <div className="px-1 space-y-0.5">
                                {sortOptions.map(option => (
                                    <button
                                        key={option.value}
                                        onClick={() => { setIconSortOrder(option.value); onClose(); }}
                                        className={btnClass}
                                    >
                                        <span className="w-4 flex items-center justify-center">
                                            {iconSortOrder === option.value && <FaCheck className="text-[10px]" />}
                                        </span>
                                        <span>{option.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <button onClick={handleRefresh} className={btnClass}>
                    <FaSyncAlt className="text-gray-500 dark:text-gray-400 w-4" />
                    <span>Refresh</span>
                </button>
            </div>

            <div className="my-1.5 border-t border-gray-200 dark:border-gray-700 mx-1" />

            <div className="px-1 space-y-0.5">
                <button onClick={() => handleOpenApp('notepad')} className={btnClass}>
                    <FaStickyNote className="text-gray-500 dark:text-gray-400 w-4" />
                    <span>New Text Document</span>
                </button>

                <button onClick={() => handleOpenApp('calculator')} className={btnClass}>
                    <FaCalculator className="text-gray-500 dark:text-gray-400 w-4" />
                    <span>Calculator</span>
                </button>
            </div>

            <div className="my-1.5 border-t border-gray-200 dark:border-gray-700 mx-1" />

            <div className="px-1 space-y-0.5">
                <button onClick={handleDisplaySettings} className={btnClass}>
                    <FaDesktop className="text-gray-500 dark:text-gray-400 w-4" />
                    <span>Display settings</span>
                </button>

                <button onClick={handlePersonalize} className={btnClass}>
                    <FaCog className="text-gray-500 dark:text-gray-400 w-4" />
                    <span>Personalize</span>
                </button>
            </div>
        </div>
    );
}
