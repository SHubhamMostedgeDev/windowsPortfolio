import { ReactNode, useRef, useState, useCallback } from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { VscChromeMinimize, VscChromeMaximize, VscChromeClose, VscChromeRestore } from 'react-icons/vsc';
import { useWindows, WindowType } from '../../context/WindowContext';

interface WindowProps {
    id: WindowType;
    title: string;
    children: ReactNode;
    isMaximized: boolean;
    isMinimized: boolean;
    zIndex: number;
    position: { x: number; y: number };
    size: { width: number; height: number };
}

type ResizeDirection = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw' | null;

export default function Window({
    id,
    title,
    children,
    isMaximized,
    isMinimized,
    zIndex,
    position,
    size,
}: WindowProps) {
    const { closeWindow, minimizeWindow, maximizeWindow, focusWindow, updateWindowPosition, updateWindowSize } = useWindows();
    const nodeRef = useRef<HTMLDivElement>(null);
    const [isResizing, setIsResizing] = useState(false);
    const resizeRef = useRef<{
        startX: number;
        startY: number;
        startWidth: number;
        startHeight: number;
        startPosX: number;
        startPosY: number;
        direction: ResizeDirection;
    } | null>(null);

    const handleDrag = (_e: DraggableEvent, data: DraggableData) => {
        updateWindowPosition(id, { x: data.x, y: data.y });
    };

    const handleMouseDown = () => {
        focusWindow(id);
    };

    const startResize = useCallback((e: React.MouseEvent, direction: ResizeDirection) => {
        e.preventDefault();
        e.stopPropagation();
        setIsResizing(true);
        resizeRef.current = {
            startX: e.clientX,
            startY: e.clientY,
            startWidth: size.width,
            startHeight: size.height,
            startPosX: position.x,
            startPosY: position.y,
            direction,
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (!resizeRef.current) return;

            const { startX, startY, startWidth, startHeight, startPosX, startPosY, direction } = resizeRef.current;
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;

            let newWidth = startWidth;
            let newHeight = startHeight;
            let newX = startPosX;
            let newY = startPosY;

            // Handle horizontal resizing
            if (direction?.includes('e')) {
                newWidth = Math.max(300, startWidth + deltaX);
            }
            if (direction?.includes('w')) {
                const possibleWidth = startWidth - deltaX;
                if (possibleWidth >= 300) {
                    newWidth = possibleWidth;
                    newX = startPosX + deltaX;
                }
            }

            // Handle vertical resizing
            if (direction?.includes('s')) {
                newHeight = Math.max(200, startHeight + deltaY);
            }
            if (direction?.includes('n')) {
                const possibleHeight = startHeight - deltaY;
                if (possibleHeight >= 200) {
                    newHeight = possibleHeight;
                    newY = startPosY + deltaY;
                }
            }

            updateWindowSize(id, { width: newWidth, height: newHeight });
            if (newX !== startPosX || newY !== startPosY) {
                updateWindowPosition(id, { x: newX, y: newY });
            }
        };

        const handleMouseUp = () => {
            setIsResizing(false);
            resizeRef.current = null;
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }, [id, size, position, updateWindowSize, updateWindowPosition]);

    if (isMaximized) {
        return (
            <div
                className="fixed inset-0 glass window-shadow window-enter flex flex-col pointer-events-auto rounded-none"
                style={{ zIndex, top: 0, bottom: 48, display: isMinimized ? 'none' : undefined }}
                onMouseDown={handleMouseDown}
            >
                {/* Title Bar */}
                <div className="flex items-center justify-between h-9 px-4 select-none bg-transparent">
                    <span className="text-sm font-normal text-gray-700 dark:text-gray-300">{title}</span>
                    <div className="flex items-center -mr-2">
                        <button
                            onClick={() => minimizeWindow(id)}
                            className="w-12 h-9 flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/8 transition-colors"
                        >
                            <VscChromeMinimize className="text-[13px] text-gray-600 dark:text-gray-400" />
                        </button>
                        <button
                            onClick={() => maximizeWindow(id)}
                            className="w-12 h-9 flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/8 transition-colors"
                        >
                            <VscChromeRestore className="text-[13px] text-gray-600 dark:text-gray-400" />
                        </button>
                        <button
                            onClick={() => closeWindow(id)}
                            className="w-12 h-9 flex items-center justify-center hover:bg-[#c42b1c] group transition-colors"
                        >
                            <VscChromeClose className="text-[13px] text-gray-600 dark:text-gray-400 group-hover:text-white" />
                        </button>
                    </div>
                </div>
                {/* Content */}
                <div className="flex-1 overflow-auto p-4 text-gray-800 dark:text-gray-200">
                    {children}
                </div>
            </div>
        );
    }

    return (
        <Draggable
            nodeRef={nodeRef}
            handle=".window-handle"
            position={position}
            onDrag={handleDrag}
            bounds="parent"
            disabled={isResizing}
        >
            <div
                ref={nodeRef}
                className="absolute glass window-shadow rounded-lg window-enter flex flex-col overflow-visible pointer-events-auto"
                style={{
                    zIndex,
                    width: size.width,
                    height: size.height,
                    minWidth: 300,
                    minHeight: 200,
                    display: isMinimized ? 'none' : undefined,
                }}
                onMouseDown={handleMouseDown}
            >
                {/* Title Bar */}
                <div className="window-handle flex items-center justify-between h-9 px-4 cursor-move select-none rounded-t-lg bg-transparent">
                    <span className="text-sm font-normal text-gray-700 dark:text-gray-300">{title}</span>
                    <div className="flex items-center -mr-2">
                        <button
                            onClick={() => minimizeWindow(id)}
                            className="w-12 h-9 flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/8 transition-colors rounded-none"
                        >
                            <VscChromeMinimize className="text-[13px] text-gray-600 dark:text-gray-400" />
                        </button>
                        <button
                            onClick={() => maximizeWindow(id)}
                            className="w-12 h-9 flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/8 transition-colors rounded-none"
                        >
                            <VscChromeMaximize className="text-[13px] text-gray-600 dark:text-gray-400" />
                        </button>
                        <button
                            onClick={() => closeWindow(id)}
                            className="w-12 h-9 flex items-center justify-center hover:bg-[#c42b1c] group transition-colors rounded-tr-lg"
                        >
                            <VscChromeClose className="text-[13px] text-gray-600 dark:text-gray-400 group-hover:text-white" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto p-4 text-gray-800 dark:text-gray-200 rounded-b-lg">
                    {children}
                </div>

                {/* Resize Handles */}
                {/* Corners */}
                <div
                    className="absolute -bottom-1 -right-1 w-4 h-4 cursor-se-resize z-10"
                    onMouseDown={(e) => startResize(e, 'se')}
                />
                <div
                    className="absolute -bottom-1 -left-1 w-4 h-4 cursor-sw-resize z-10"
                    onMouseDown={(e) => startResize(e, 'sw')}
                />
                <div
                    className="absolute -top-1 -right-1 w-4 h-4 cursor-ne-resize z-10"
                    onMouseDown={(e) => startResize(e, 'ne')}
                />
                <div
                    className="absolute -top-1 -left-1 w-4 h-4 cursor-nw-resize z-10"
                    onMouseDown={(e) => startResize(e, 'nw')}
                />
                {/* Edges */}
                <div
                    className="absolute top-2 bottom-2 -right-1 w-2 cursor-e-resize z-10"
                    onMouseDown={(e) => startResize(e, 'e')}
                />
                <div
                    className="absolute top-2 bottom-2 -left-1 w-2 cursor-w-resize z-10"
                    onMouseDown={(e) => startResize(e, 'w')}
                />
                <div
                    className="absolute -bottom-1 left-2 right-2 h-2 cursor-s-resize z-10"
                    onMouseDown={(e) => startResize(e, 's')}
                />
                <div
                    className="absolute -top-1 left-2 right-2 h-2 cursor-n-resize z-10"
                    onMouseDown={(e) => startResize(e, 'n')}
                />
            </div>
        </Draggable>
    );
}
