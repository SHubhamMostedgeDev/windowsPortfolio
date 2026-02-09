import { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaCheck } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

interface TodoItem {
    id: string;
    text: string;
    completed: boolean;
    createdAt: number;
}

type Filter = 'all' | 'active' | 'completed';

export default function TodoListWindow() {
    const { accentColor } = useTheme();
    const [todos, setTodos] = useState<TodoItem[]>([]);
    const [input, setInput] = useState('');
    const [filter, setFilter] = useState<Filter>('all');

    // Load from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('todolist-items');
        if (saved) {
            setTodos(JSON.parse(saved));
        }
    }, []);

    // Save to localStorage
    const saveToStorage = (items: TodoItem[]) => {
        localStorage.setItem('todolist-items', JSON.stringify(items));
        setTodos(items);
    };

    const addTodo = () => {
        const text = input.trim();
        if (!text) return;
        const newTodo: TodoItem = {
            id: `todo-${Date.now()}`,
            text,
            completed: false,
            createdAt: Date.now(),
        };
        saveToStorage([newTodo, ...todos]);
        setInput('');
    };

    const toggleTodo = (id: string) => {
        saveToStorage(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    const deleteTodo = (id: string) => {
        saveToStorage(todos.filter(t => t.id !== id));
    };

    const clearCompleted = () => {
        saveToStorage(todos.filter(t => !t.completed));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') addTodo();
    };

    const filtered = todos.filter(t => {
        if (filter === 'active') return !t.completed;
        if (filter === 'completed') return t.completed;
        return true;
    });

    const activeCount = todos.filter(t => !t.completed).length;
    const completedCount = todos.filter(t => t.completed).length;

    const filters: { key: Filter; label: string }[] = [
        { key: 'all', label: 'All' },
        { key: 'active', label: 'Active' },
        { key: 'completed', label: 'Completed' },
    ];

    return (
        <div className="h-full flex flex-col -m-4 bg-white dark:bg-[#1e1e1e]">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">My Tasks</h2>

                {/* Add input */}
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Add a new task..."
                        className="flex-1 px-3 py-2 rounded-md bg-gray-100 dark:bg-[#2d2d2d] text-sm text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-win-accent border border-gray-200 dark:border-gray-600"
                    />
                    <button
                        onClick={addTodo}
                        className="px-3 py-2 rounded-md text-white text-sm transition-colors hover:opacity-90"
                        style={{ backgroundColor: accentColor.color }}
                    >
                        <FaPlus />
                    </button>
                </div>

                {/* Filter tabs */}
                <div className="flex gap-1 mt-3">
                    {filters.map(f => (
                        <button
                            key={f.key}
                            onClick={() => setFilter(f.key)}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                                filter === f.key
                                    ? 'text-white'
                                    : 'bg-gray-100 dark:bg-[#2d2d2d] text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                            style={filter === f.key ? { backgroundColor: accentColor.color } : undefined}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Todo list */}
            <div className="flex-1 overflow-auto p-4">
                {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500">
                        <p className="text-sm">
                            {filter === 'all' ? 'No tasks yet. Add one above!' :
                             filter === 'active' ? 'No active tasks.' : 'No completed tasks.'}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {filtered.map(todo => (
                            <div
                                key={todo.id}
                                className="group flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-[#252526] border border-gray-100 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-500 transition-all"
                            >
                                {/* Checkbox */}
                                <button
                                    onClick={() => toggleTodo(todo.id)}
                                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                                        todo.completed
                                            ? 'text-white border-transparent'
                                            : 'border-gray-300 dark:border-gray-500 hover:border-gray-400'
                                    }`}
                                    style={todo.completed ? { backgroundColor: accentColor.color } : undefined}
                                >
                                    {todo.completed && <FaCheck className="text-[8px]" />}
                                </button>

                                {/* Text */}
                                <span className={`flex-1 text-sm transition-all ${
                                    todo.completed
                                        ? 'line-through text-gray-400 dark:text-gray-500'
                                        : 'text-gray-800 dark:text-white'
                                }`}>
                                    {todo.text}
                                </span>

                                {/* Delete */}
                                <button
                                    onClick={() => deleteTodo(todo.id)}
                                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded hover:bg-red-500 hover:text-white text-gray-400 transition-all"
                                >
                                    <FaTrash className="text-xs" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-2 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
                <span>{activeCount} task{activeCount !== 1 ? 's' : ''} remaining</span>
                {completedCount > 0 && (
                    <button
                        onClick={clearCompleted}
                        className="hover:text-red-500 transition-colors"
                    >
                        Clear completed ({completedCount})
                    </button>
                )}
            </div>
        </div>
    );
}
