import { ReactNode, useRef, useState, useCallback } from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { useWindows, WindowType } from '../../context/WindowContext';
import { useTheme, IconSize } from '../../context/ThemeContext';

const ICON_SIZE_CONFIG: Record<IconSize, { size: number; grid: number; iconClass: string; labelClass: string }> = {
    large: { size: 90, grid: 100, iconClass: 'text-4xl', labelClass: 'text-xs' },
    medium: { size: 72, grid: 82, iconClass: 'text-3xl', labelClass: 'text-[10px]' },
    small: { size: 56, grid: 66, iconClass: 'text-2xl', labelClass: 'text-[9px]' },
};

interface DesktopIconProps {
    id: WindowType;
    icon: ReactNode;
    label: string;
    initialPosition?: { x: number; y: number };
}

export default function DesktopIcon({ id, icon, label, initialPosition }: DesktopIconProps) {
    const { openWindow } = useWindows();
    const { iconSize } = useTheme();
    const nodeRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const sizeConfig = ICON_SIZE_CONFIG[iconSize];

    const snapToGrid = useCallback((x: number, y: number) => ({
        x: Math.round(x / sizeConfig.grid) * sizeConfig.grid,
        y: Math.round(y / sizeConfig.grid) * sizeConfig.grid,
    }), [sizeConfig.grid]);

    const [position, setPosition] = useState(() => {
        if (initialPosition) {
            return snapToGrid(initialPosition.x, initialPosition.y);
        }
        return { x: 0, y: 0 };
    });
    const dragStartPos = useRef<{ x: number; y: number } | null>(null);

    const handleDragStart = (_e: DraggableEvent, data: DraggableData) => {
        dragStartPos.current = { x: data.x, y: data.y };
    };

    const handleDrag = (_e: DraggableEvent, data: DraggableData) => {
        // Only mark as dragging if moved more than 5 pixels
        if (dragStartPos.current) {
            const dx = Math.abs(data.x - dragStartPos.current.x);
            const dy = Math.abs(data.y - dragStartPos.current.y);
            if (dx > 5 || dy > 5) {
                setIsDragging(true);
            }
        }
    };

    const handleDragStop = useCallback((_e: DraggableEvent, data: DraggableData) => {
        // Snap to grid when dropped
        const snappedPosition = snapToGrid(data.x, data.y);
        setPosition(snappedPosition);

        // Small delay to prevent click from firing after drag
        setTimeout(() => {
            setIsDragging(false);
            dragStartPos.current = null;
        }, 0);
    }, [snapToGrid]);

    const handleClick = () => {
        // Only open window if not dragging
        if (!isDragging) {
            openWindow(id);
        }
    };

    return (
        <Draggable
            nodeRef={nodeRef}
            position={position}
            onStart={handleDragStart}
            onDrag={handleDrag}
            onStop={handleDragStop}
            bounds="parent"
        >
            <div
                ref={nodeRef}
                onClick={handleClick}
                className="desktop-icon absolute flex flex-col items-center justify-center p-2 rounded-lg gap-1 cursor-pointer select-none hover:bg-white/10 active:bg-white/20 transition-colors"
                style={{ width: `${sizeConfig.size}px`, height: `${sizeConfig.size}px` }}
            >
                <div className={`${sizeConfig.iconClass} text-white drop-shadow-lg pointer-events-none`}>
                    {icon}
                </div>
                <span className={`${sizeConfig.labelClass} text-white text-center font-medium drop-shadow-md line-clamp-2 pointer-events-none`}>
                    {label}
                </span>
            </div>
        </Draggable>
    );
}
