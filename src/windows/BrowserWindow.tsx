import { useState, useCallback, KeyboardEvent } from 'react';
import { FaArrowLeft, FaArrowRight, FaRedo, FaHome, FaLock, FaStar, FaGlobe } from 'react-icons/fa';

const BOOKMARKS = [
    { name: 'Google', url: 'https://www.google.com/webhp?igu=1' },
    { name: 'GitHub', url: 'https://github.com' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com' },
    { name: 'YouTube', url: 'https://www.youtube.com' },
];

const DEFAULT_URL = 'https://www.google.com/webhp?igu=1';

export default function BrowserWindow() {
    const [url, setUrl] = useState(DEFAULT_URL);
    const [inputUrl, setInputUrl] = useState(DEFAULT_URL);
    const [history, setHistory] = useState<string[]>([DEFAULT_URL]);
    const [historyIndex, setHistoryIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const navigateTo = useCallback((newUrl: string) => {
        let formattedUrl = newUrl.trim();

        // Add https if no protocol
        if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
            // Check if it looks like a URL
            if (formattedUrl.includes('.') && !formattedUrl.includes(' ')) {
                formattedUrl = 'https://' + formattedUrl;
            } else {
                // Treat as search query
                formattedUrl = `https://www.google.com/search?q=${encodeURIComponent(formattedUrl)}&igu=1`;
            }
        }

        setUrl(formattedUrl);
        setInputUrl(formattedUrl);
        setIsLoading(true);

        // Update history
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(formattedUrl);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    }, [history, historyIndex]);

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            navigateTo(inputUrl);
        }
    };

    const goBack = () => {
        if (historyIndex > 0) {
            const newIndex = historyIndex - 1;
            setHistoryIndex(newIndex);
            setUrl(history[newIndex]);
            setInputUrl(history[newIndex]);
            setIsLoading(true);
        }
    };

    const goForward = () => {
        if (historyIndex < history.length - 1) {
            const newIndex = historyIndex + 1;
            setHistoryIndex(newIndex);
            setUrl(history[newIndex]);
            setInputUrl(history[newIndex]);
            setIsLoading(true);
        }
    };

    const refresh = () => {
        setIsLoading(true);
        // Force iframe reload by briefly clearing and resetting url
        const currentUrl = url;
        setUrl('about:blank');
        setTimeout(() => setUrl(currentUrl), 50);
    };

    const goHome = () => {
        navigateTo(DEFAULT_URL);
    };

    return (
        <div className="h-full flex flex-col -m-4 bg-gray-100 dark:bg-gray-800">
            {/* Browser Toolbar */}
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-200 dark:bg-gray-700 border-b border-gray-300 dark:border-gray-600">
                {/* Navigation buttons */}
                <div className="flex items-center gap-1">
                    <button
                        onClick={goBack}
                        disabled={historyIndex === 0}
                        className="p-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Back"
                    >
                        <FaArrowLeft className="text-sm text-gray-700 dark:text-gray-300" />
                    </button>
                    <button
                        onClick={goForward}
                        disabled={historyIndex >= history.length - 1}
                        className="p-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Forward"
                    >
                        <FaArrowRight className="text-sm text-gray-700 dark:text-gray-300" />
                    </button>
                    <button
                        onClick={refresh}
                        className="p-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                        title="Refresh"
                    >
                        <FaRedo className={`text-sm text-gray-700 dark:text-gray-300 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                    <button
                        onClick={goHome}
                        className="p-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                        title="Home"
                    >
                        <FaHome className="text-sm text-gray-700 dark:text-gray-300" />
                    </button>
                </div>

                {/* Address bar */}
                <div className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600">
                    <FaLock className="text-xs text-green-600" />
                    <input
                        type="text"
                        value={inputUrl}
                        onChange={(e) => setInputUrl(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1 bg-transparent text-sm text-gray-800 dark:text-gray-200 outline-none"
                        placeholder="Search or enter URL"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <FaGlobe className="text-xl text-blue-500" />
                </div>
            </div>

            {/* Bookmarks bar */}
            <div className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-600">
                <FaStar className="text-xs text-gray-500 mr-2" />
                {BOOKMARKS.map((bookmark) => (
                    <button
                        key={bookmark.name}
                        onClick={() => navigateTo(bookmark.url)}
                        className="px-2 py-1 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                    >
                        {bookmark.name}
                    </button>
                ))}
            </div>

            {/* Browser content */}
            <div className="flex-1 relative bg-white">
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-800 z-10">
                        <div className="flex flex-col items-center gap-3">
                            <FaGlobe className="text-5xl text-blue-500 animate-pulse" />
                            <span className="text-sm text-gray-500">Loading...</span>
                        </div>
                    </div>
                )}
                <iframe
                    src={url}
                    title="Browser"
                    className="w-full h-full border-0"
                    onLoad={() => setIsLoading(false)}
                    sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                />
            </div>
        </div>
    );
}
