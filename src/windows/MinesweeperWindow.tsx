import { useState, useCallback, useEffect } from 'react';
import { FaBomb, FaFlag, FaSmile, FaSadTear, FaStar } from 'react-icons/fa';

type CellState = {
    isMine: boolean;
    isRevealed: boolean;
    isFlagged: boolean;
    adjacentMines: number;
};

type GameStatus = 'playing' | 'won' | 'lost';
type Difficulty = 'easy' | 'medium' | 'hard';

const DIFFICULTIES: Record<Difficulty, { rows: number; cols: number; mines: number }> = {
    easy: { rows: 8, cols: 8, mines: 10 },
    medium: { rows: 12, cols: 12, mines: 30 },
    hard: { rows: 16, cols: 16, mines: 60 },
};

function createBoard(rows: number, cols: number, mines: number): CellState[][] {
    // Initialize empty board
    const board: CellState[][] = Array(rows).fill(null).map(() =>
        Array(cols).fill(null).map(() => ({
            isMine: false,
            isRevealed: false,
            isFlagged: false,
            adjacentMines: 0,
        }))
    );

    // Place mines randomly
    let minesPlaced = 0;
    while (minesPlaced < mines) {
        const row = Math.floor(Math.random() * rows);
        const col = Math.floor(Math.random() * cols);
        if (!board[row][col].isMine) {
            board[row][col].isMine = true;
            minesPlaced++;
        }
    }

    // Calculate adjacent mines
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (!board[row][col].isMine) {
                let count = 0;
                for (let dr = -1; dr <= 1; dr++) {
                    for (let dc = -1; dc <= 1; dc++) {
                        const nr = row + dr;
                        const nc = col + dc;
                        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc].isMine) {
                            count++;
                        }
                    }
                }
                board[row][col].adjacentMines = count;
            }
        }
    }

    return board;
}

const NUMBER_COLORS: Record<number, string> = {
    1: 'text-blue-600',
    2: 'text-green-600',
    3: 'text-red-600',
    4: 'text-purple-700',
    5: 'text-amber-700',
    6: 'text-cyan-600',
    7: 'text-gray-800',
    8: 'text-gray-600',
};

export default function MinesweeperWindow() {
    const [difficulty, setDifficulty] = useState<Difficulty>('easy');
    const [board, setBoard] = useState<CellState[][]>([]);
    const [gameStatus, setGameStatus] = useState<GameStatus>('playing');
    const [flagsRemaining, setFlagsRemaining] = useState(0);
    const [time, setTime] = useState(0);
    const [isFirstClick, setIsFirstClick] = useState(true);

    const config = DIFFICULTIES[difficulty];

    const initGame = useCallback(() => {
        setBoard(createBoard(config.rows, config.cols, config.mines));
        setGameStatus('playing');
        setFlagsRemaining(config.mines);
        setTime(0);
        setIsFirstClick(true);
    }, [config]);

    useEffect(() => {
        initGame();
    }, [initGame]);

    useEffect(() => {
        let timer: number;
        if (gameStatus === 'playing' && !isFirstClick) {
            timer = window.setInterval(() => {
                setTime(t => t + 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [gameStatus, isFirstClick]);

    const revealCell = (row: number, col: number) => {
        if (gameStatus !== 'playing') return;

        const cell = board[row][col];
        if (cell.isRevealed || cell.isFlagged) return;

        if (isFirstClick) {
            setIsFirstClick(false);
        }

        const newBoard = board.map(r => r.map(c => ({ ...c })));

        if (cell.isMine) {
            // Game over - reveal all mines
            newBoard.forEach(r => r.forEach(c => {
                if (c.isMine) c.isRevealed = true;
            }));
            setBoard(newBoard);
            setGameStatus('lost');
            return;
        }

        // Flood fill for empty cells
        const reveal = (r: number, c: number) => {
            if (r < 0 || r >= config.rows || c < 0 || c >= config.cols) return;
            if (newBoard[r][c].isRevealed || newBoard[r][c].isFlagged || newBoard[r][c].isMine) return;

            newBoard[r][c].isRevealed = true;

            if (newBoard[r][c].adjacentMines === 0) {
                for (let dr = -1; dr <= 1; dr++) {
                    for (let dc = -1; dc <= 1; dc++) {
                        reveal(r + dr, c + dc);
                    }
                }
            }
        };

        reveal(row, col);
        setBoard(newBoard);

        // Check win condition
        const allNonMinesRevealed = newBoard.every(r =>
            r.every(c => c.isMine || c.isRevealed)
        );
        if (allNonMinesRevealed) {
            setGameStatus('won');
        }
    };

    const toggleFlag = (e: React.MouseEvent, row: number, col: number) => {
        e.preventDefault();
        if (gameStatus !== 'playing') return;

        const cell = board[row][col];
        if (cell.isRevealed) return;

        const newBoard = board.map(r => r.map(c => ({ ...c })));
        newBoard[row][col].isFlagged = !cell.isFlagged;
        setBoard(newBoard);
        setFlagsRemaining(prev => cell.isFlagged ? prev + 1 : prev - 1);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="h-full flex flex-col items-center select-none">
            {/* Difficulty selector */}
            <div className="flex gap-2 mb-3">
                {(['easy', 'medium', 'hard'] as Difficulty[]).map(d => (
                    <button
                        key={d}
                        onClick={() => setDifficulty(d)}
                        className={`px-3 py-1 rounded text-sm font-medium transition-all ${difficulty === d
                                ? 'bg-win-accent text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                            }`}
                    >
                        {d.charAt(0).toUpperCase() + d.slice(1)}
                    </button>
                ))}
            </div>

            {/* Status bar */}
            <div className="flex items-center justify-between w-full max-w-xs mb-3 px-2">
                <div className="flex items-center gap-1 text-sm font-mono bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                    <FaFlag className="text-red-500" />
                    <span className="w-6 text-center">{flagsRemaining}</span>
                </div>

                <button
                    onClick={initGame}
                    className="text-2xl hover:scale-110 transition-transform"
                >
                    {gameStatus === 'won' ? (
                        <FaStar className="text-yellow-500" />
                    ) : gameStatus === 'lost' ? (
                        <FaSadTear className="text-red-500" />
                    ) : (
                        <FaSmile className="text-yellow-500" />
                    )}
                </button>

                <div className="text-sm font-mono bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded w-16 text-center">
                    {formatTime(time)}
                </div>
            </div>

            {/* Game board */}
            <div
                className="grid gap-0.5 bg-gray-400 dark:bg-gray-600 p-1 rounded"
                style={{
                    gridTemplateColumns: `repeat(${config.cols}, minmax(0, 1fr))`,
                }}
            >
                {board.map((row, rowIdx) =>
                    row.map((cell, colIdx) => (
                        <button
                            key={`${rowIdx}-${colIdx}`}
                            onClick={() => revealCell(rowIdx, colIdx)}
                            onContextMenu={(e) => toggleFlag(e, rowIdx, colIdx)}
                            disabled={gameStatus !== 'playing'}
                            className={`w-6 h-6 flex items-center justify-center text-xs font-bold transition-all ${cell.isRevealed
                                    ? cell.isMine
                                        ? 'bg-red-500'
                                        : 'bg-gray-100 dark:bg-gray-300'
                                    : 'bg-gray-300 dark:bg-gray-500 hover:bg-gray-200 dark:hover:bg-gray-400 shadow-sm'
                                }`}
                            style={{ fontSize: '10px' }}
                        >
                            {cell.isRevealed ? (
                                cell.isMine ? (
                                    <FaBomb className="text-gray-800" />
                                ) : cell.adjacentMines > 0 ? (
                                    <span className={NUMBER_COLORS[cell.adjacentMines]}>
                                        {cell.adjacentMines}
                                    </span>
                                ) : null
                            ) : cell.isFlagged ? (
                                <FaFlag className="text-red-500" />
                            ) : null}
                        </button>
                    ))
                )}
            </div>

            {/* Game over message */}
            {gameStatus !== 'playing' && (
                <div className={`mt-4 text-lg font-bold ${gameStatus === 'won' ? 'text-green-500' : 'text-red-500'
                    }`}>
                    {gameStatus === 'won' ? '🎉 You Win!' : '💥 Game Over!'}
                </div>
            )}

            {/* Instructions */}
            <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
                Left click to reveal • Right click to flag
            </div>
        </div>
    );
}
