import { useState, useEffect } from 'react';
import { FaSave, FaFolderOpen, FaFile, FaTrash } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

interface SavedNote {
    id: string;
    title: string;
    content: string;
    lastModified: number;
}

export default function NotepadWindow() {
    const { accentColor } = useTheme();
    const [content, setContent] = useState('');
    const [currentNoteId, setCurrentNoteId] = useState<string | null>(null);
    const [currentTitle, setCurrentTitle] = useState('Untitled');
    const [savedNotes, setSavedNotes] = useState<SavedNote[]>([]);
    const [showSidebar, setShowSidebar] = useState(true);
    const [isEdited, setIsEdited] = useState(false);

    // Load saved notes from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('notepad-notes');
        if (saved) {
            setSavedNotes(JSON.parse(saved));
        }
    }, []);

    // Save notes to localStorage
    const saveToLocalStorage = (notes: SavedNote[]) => {
        localStorage.setItem('notepad-notes', JSON.stringify(notes));
        setSavedNotes(notes);
    };

    const handleNewNote = () => {
        setContent('');
        setCurrentNoteId(null);
        setCurrentTitle('Untitled');
        setIsEdited(false);
    };

    const handleSave = () => {
        const noteId = currentNoteId || `note-${Date.now()}`;
        const title = currentTitle || 'Untitled';

        const newNote: SavedNote = {
            id: noteId,
            title,
            content,
            lastModified: Date.now(),
        };

        const existingIndex = savedNotes.findIndex(n => n.id === noteId);
        let updatedNotes: SavedNote[];

        if (existingIndex >= 0) {
            updatedNotes = [...savedNotes];
            updatedNotes[existingIndex] = newNote;
        } else {
            updatedNotes = [newNote, ...savedNotes];
        }

        saveToLocalStorage(updatedNotes);
        setCurrentNoteId(noteId);
        setIsEdited(false);
    };

    const handleLoad = (note: SavedNote) => {
        setContent(note.content);
        setCurrentNoteId(note.id);
        setCurrentTitle(note.title);
        setIsEdited(false);
    };

    const handleDelete = (noteId: string) => {
        const updatedNotes = savedNotes.filter(n => n.id !== noteId);
        saveToLocalStorage(updatedNotes);

        if (currentNoteId === noteId) {
            handleNewNote();
        }
    };

    const handleContentChange = (value: string) => {
        setContent(value);
        setIsEdited(true);
    };

    const handleTitleChange = (value: string) => {
        setCurrentTitle(value);
        setIsEdited(true);
    };

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="h-full flex -m-4 bg-white dark:bg-[#1e1e1e]">
            {/* Sidebar */}
            {showSidebar && (
                <div className="w-56 bg-gray-50 dark:bg-[#252526] border-r border-gray-200 dark:border-gray-700 flex flex-col">
                    {/* Sidebar header */}
                    <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                        <button
                            onClick={handleNewNote}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md text-white text-sm transition-colors"
                            style={{ backgroundColor: accentColor.color }}
                        >
                            <FaFile className="text-xs" />
                            New Note
                        </button>
                    </div>

                    {/* Notes list */}
                    <div className="flex-1 overflow-auto p-2">
                        {savedNotes.length === 0 ? (
                            <p className="text-xs text-gray-500 dark:text-gray-400 text-center p-4">
                                No saved notes yet
                            </p>
                        ) : (
                            <div className="space-y-1">
                                {savedNotes.map(note => (
                                    <div
                                        key={note.id}
                                        className={`group p-2 rounded-md cursor-pointer transition-colors ${currentNoteId === note.id
                                                ? 'bg-gray-200 dark:bg-gray-600'
                                                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                                            }`}
                                        onClick={() => handleLoad(note)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-gray-800 dark:text-white truncate">
                                                {note.title}
                                            </span>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(note.id);
                                                }}
                                                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500 hover:text-white rounded transition-all"
                                            >
                                                <FaTrash className="text-xs" />
                                            </button>
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                            {note.content.slice(0, 50) || 'Empty note'}
                                        </p>
                                        <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
                                            {formatDate(note.lastModified)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Main editor */}
            <div className="flex-1 flex flex-col">
                {/* Toolbar */}
                <div className="flex items-center gap-2 p-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#2d2d2d]">
                    <button
                        onClick={() => setShowSidebar(!showSidebar)}
                        className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        title="Toggle sidebar"
                    >
                        <FaFolderOpen className="text-sm text-gray-600 dark:text-gray-300" />
                    </button>

                    <div className="w-px h-5 bg-gray-300 dark:bg-gray-600" />

                    <input
                        type="text"
                        value={currentTitle}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        placeholder="Note title..."
                        className="flex-1 px-2 py-1 text-sm bg-transparent text-gray-800 dark:text-white focus:outline-none"
                    />

                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-3 py-1.5 rounded text-sm text-white transition-colors"
                        style={{ backgroundColor: accentColor.color }}
                        title="Save note"
                    >
                        <FaSave className="text-xs" />
                        Save
                    </button>

                    {isEdited && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">Unsaved changes</span>
                    )}
                </div>

                {/* Editor */}
                <textarea
                    value={content}
                    onChange={(e) => handleContentChange(e.target.value)}
                    placeholder="Start typing..."
                    className="flex-1 p-4 resize-none bg-white dark:bg-[#1e1e1e] text-gray-800 dark:text-white focus:outline-none font-mono text-sm leading-relaxed"
                    spellCheck={false}
                />

                {/* Status bar */}
                <div className="flex items-center justify-between px-3 py-1 bg-gray-100 dark:bg-[#007acc] text-xs">
                    <span className="text-gray-600 dark:text-white">
                        {content.length} characters | {content.split(/\s+/).filter(Boolean).length} words
                    </span>
                    <span className="text-gray-500 dark:text-white/80">
                        {content.split('\n').length} lines
                    </span>
                </div>
            </div>
        </div>
    );
}
