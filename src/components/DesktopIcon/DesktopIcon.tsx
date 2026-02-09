import { ReactNode, useRef, useState, useCallback } from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { useWindows, WindowType } from '../../context/WindowContext';

// Grid size for snapping (matches icon size)
const GRID_SIZE = 100;

interface DesktopIconProps {
    id: WindowType;
    icon: ReactNode;
    label: string;
    initialPosition?: { x: number; y: number };
}

// Snap position to grid
const snapToGrid = (x: number, y: number): { x: number; y: number } => {
    return {
        x: Math.round(x / GRID_SIZE) * GRID_SIZE,
        y: Math.round(y / GRID_SIZE) * GRID_SIZE,
    };
};

export default function DesktopIcon({ id, icon, label, initialPosition }: DesktopIconProps) {
    const { openWindow } = useWindows();
    const nodeRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
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
    }, []);

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
                className="desktop-icon absolute flex flex-col items-center justify-center p-2 rounded-lg w-[90px] h-[90px] gap-1 cursor-pointer select-none hover:bg-white/10 active:bg-white/20 transition-colors"
            >
                <div className="text-4xl text-white drop-shadow-lg pointer-events-none">
                    {icon}
                </div>
                <span className="text-xs text-white text-center font-medium drop-shadow-md line-clamp-2 pointer-events-none">
                    {label}
                </span>
            </div>
        </Draggable>
    );
}
