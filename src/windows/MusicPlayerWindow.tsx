import { useState, useRef, useEffect, useCallback } from 'react';
import {
    FaPlay, FaPause, FaStepForward, FaStepBackward,
    FaVolumeUp, FaVolumeMute, FaFolderOpen, FaYoutube,
    FaSearch, FaSpinner, FaTimes, FaMusic, FaList,
    FaRandom, FaRedo, FaExpand, FaCompress
} from 'react-icons/fa';
import { MdLibraryMusic, MdQueueMusic } from 'react-icons/md';
import { useTheme } from '../context/ThemeContext';

interface YouTubeTrack {
    type: 'youtube';
    id: string;
    title: string;
    artist: string;
    youtubeId: string;
    thumbnail?: string;
    duration?: number;
}

interface LocalTrack {
    type: 'local';
    id: string;
    title: string;
    artist: string;
    url: string;
    isVideo: boolean;
    duration?: number;
}

type Track = YouTubeTrack | LocalTrack;
type Tab = 'home' | 'library' | 'youtube' | 'local';

const defaultPlaylist: YouTubeTrack[] = [
    { type: 'youtube', id: 'yt-1', title: 'Blinding Lights', artist: 'The Weeknd', youtubeId: '4NRXx6U8ABQ', thumbnail: 'https://i.ytimg.com/vi/4NRXx6U8ABQ/hqdefault.jpg' },
    { type: 'youtube', id: 'yt-2', title: 'Shape of You', artist: 'Ed Sheeran', youtubeId: 'JGwWNGJdvx8', thumbnail: 'https://i.ytimg.com/vi/JGwWNGJdvx8/hqdefault.jpg' },
    { type: 'youtube', id: 'yt-3', title: 'Starboy', artist: 'The Weeknd', youtubeId: '34Na4j8AVgA', thumbnail: 'https://i.ytimg.com/vi/34Na4j8AVgA/hqdefault.jpg' },
    { type: 'youtube', id: 'yt-4', title: 'Levitating', artist: 'Dua Lipa', youtubeId: 'TUVcZfQe-Kw', thumbnail: 'https://i.ytimg.com/vi/TUVcZfQe-Kw/hqdefault.jpg' },
    { type: 'youtube', id: 'yt-5', title: 'Heat Waves', artist: 'Glass Animals', youtubeId: 'mRD0-GxDwSs', thumbnail: 'https://i.ytimg.com/vi/mRD0-GxDwSs/hqdefault.jpg' },
    { type: 'youtube', id: 'yt-6', title: 'As It Was', artist: 'Harry Styles', youtubeId: 'H5v3kku4y6Q', thumbnail: 'https://i.ytimg.com/vi/H5v3kku4y6Q/hqdefault.jpg' },
];

// Updated Piped instances that are more reliable
const PIPED_INSTANCES = [
    'https://pipedapi.kavin.rocks',
    'https://api.piped.yt',
    'https://pipedapi.adminforge.de',
    'https://piped-api.garudalinux.org',
    'https://pipedapi.drgns.space'
];

async function searchYouTube(query: string): Promise<YouTubeTrack[]> {
    for (const instance of PIPED_INSTANCES) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

            const res = await fetch(`${instance}/search?q=${encodeURIComponent(query)}&filter=videos`, {
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (!res.ok) continue;
            const data = await res.json();
            const items = data.items || data;
            if (!Array.isArray(items)) continue;

            return items
                .filter((item: any) => (item.url || item.id) && !item.isShort)
                .slice(0, 20)
                .map((item: any, i: number) => {
                    const videoId = item.url
                        ? item.url.replace('/watch?v=', '')
                        : item.id;
                    return {
                        type: 'youtube' as const,
                        id: `search-${Date.now()}-${i}`,
                        title: item.title || 'Unknown Title',
                        artist: item.uploaderName || item.uploader || 'YouTube',
                        youtubeId: videoId,
                        thumbnail: item.thumbnail,
                        duration: item.duration
                    };
                });
        } catch (e) {
            console.warn(`Failed to fetch from ${instance}`, e);
            continue;
        }
    }
    return [];
}

const formatTime = (s: number) => {
    if (!s || isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
};

export default function MusicPlayerWindow() {
    const { accentColor } = useTheme();

    // State
    const [activeTab, setActiveTab] = useState<Tab>('home');
    const [currentTrack, setCurrentTrack] = useState<Track | null>(defaultPlaylist[0]);
    const [youtubeList, setYoutubeList] = useState<YouTubeTrack[]>(defaultPlaylist);
    const [localFiles, setLocalFiles] = useState<LocalTrack[]>([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState('');
    const [layout, setLayout] = useState<'grid' | 'list'>('grid');
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [viewMode, setViewMode] = useState<'library' | 'nowPlaying'>('library');

    // Refs
    const mediaRef = useRef<HTMLAudioElement | HTMLVideoElement | null>(null);
    const playerContainerRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Derived state
    const currentList: Track[] = activeTab === 'local' ? localFiles : youtubeList;
    const isLocalCurrent = currentTrack?.type === 'local';
    const isVideoCurrent = isLocalCurrent && (currentTrack as LocalTrack).isVideo;
    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    // Search Handler
    const handleSearch = async () => {
        const q = searchQuery.trim();
        if (!q) return;

        setIsSearching(true);
        setSearchError('');
        setActiveTab('youtube');
        setViewMode('library');

        const results = await searchYouTube(q);
        if (results.length > 0) {
            setYoutubeList(results);
        } else {
            setSearchError('No results found. Try a different query.');
        }
        setIsSearching(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSearch();
    };

    // File Handling
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const newTracks: LocalTrack[] = Array.from(files).map((file, i) => ({
            type: 'local',
            id: `local-${Date.now()}-${i}`,
            title: file.name.replace(/\.[^/.]+$/, ''),
            artist: 'Local File',
            url: URL.createObjectURL(file),
            isVideo: file.type.startsWith('video/'),
            duration: 0
        }));

        setLocalFiles(prev => [...prev, ...newTracks]);
        if (newTracks.length > 0 && localFiles.length === 0) {
            setCurrentTrack(newTracks[0]);
            setActiveTab('local');
        }
        e.target.value = ''; // Reset input
    };

    // Playback Control
    const selectTrack = (track: Track) => {
        setCurrentTrack(track);
        setIsPlaying(true);
        setViewMode('nowPlaying');
    };

    const togglePlay = useCallback(() => {
        if (!mediaRef.current && currentTrack?.type !== 'youtube') return;

        // For YouTube iframe, we handle state, the iframe reacts to prop changes if we implemented a proper wrapper (simplified here)
        // With simple iframe embed, direct control is limited without the YT Iframe API. 
        // We'll rely on state for UI and auto-play param for iframe reload on track change.

        if (isLocalCurrent && mediaRef.current) {
            if (isPlaying) mediaRef.current.pause();
            else mediaRef.current.play();
        }

        setIsPlaying(!isPlaying);
    }, [isPlaying, isLocalCurrent, currentTrack]);

    const playNext = useCallback(() => {
        if (!currentTrack) return;
        const list = activeTab === 'local' ? localFiles : youtubeList;
        const idx = list.findIndex(t => t.id === currentTrack.id);
        if (idx < list.length - 1) {
            setCurrentTrack(list[idx + 1]);
            setIsPlaying(true);
        }
    }, [currentTrack, activeTab, localFiles, youtubeList]);

    const playPrev = useCallback(() => {
        if (!currentTrack) return;
        const list = activeTab === 'local' ? localFiles : youtubeList;
        const idx = list.findIndex(t => t.id === currentTrack.id);
        if (idx > 0) {
            setCurrentTrack(list[idx - 1]);
            setIsPlaying(true);
        } else if (currentTime > 3 && mediaRef.current) {
            mediaRef.current.currentTime = 0;
        }
    }, [currentTrack, activeTab, localFiles, youtubeList, currentTime]);

    const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const time = Number(e.target.value);
        if (mediaRef.current) {
            mediaRef.current.currentTime = time;
        }
        setCurrentTime(time);
    };

    const toggleFullscreen = () => {
        if (!playerContainerRef.current) return;
        if (document.fullscreenElement) {
            document.exitFullscreen();
            setIsFullscreen(false);
        } else {
            playerContainerRef.current.requestFullscreen();
            setIsFullscreen(true);
        }
    };

    // Effect for local media
    useEffect(() => {
        if (isLocalCurrent && mediaRef.current) {
            mediaRef.current.volume = isMuted ? 0 : volume;
            if (isPlaying) {
                mediaRef.current.play().catch(() => setIsPlaying(false));
            } else {
                mediaRef.current.pause();
            }
        }
    }, [currentTrack, isPlaying, volume, isMuted, isLocalCurrent]);

    // Render Items
    const renderTrackItem = (track: Track, index: number) => {
        const isCurrent = currentTrack?.id === track.id;

        if (layout === 'grid') {
            return (
                <div
                    key={track.id}
                    onClick={() => selectTrack(track)}
                    className={`group relative flex flex-col gap-2 p-3 rounded-lg cursor-pointer transition-all hover:bg-black/5 dark:hover:bg-white/10 ${isCurrent ? 'bg-black/5 dark:bg-white/10' : ''}`}
                >
                    <div className="aspect-video w-full rounded-md overflow-hidden bg-gray-200 dark:bg-gray-800 relative">
                        {track.type === 'youtube' && track.thumbnail ? (
                            <img src={track.thumbnail} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                {track.type === 'local' && track.isVideo ? <FaPlay /> : <FaMusic className="text-4xl" />}
                            </div>
                        )}

                        {/* Hover Play Button */}
                        <div className={`absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity ${isCurrent && isPlaying ? 'opacity-100' : ''}`}>
                            <div className="w-10 h-10 rounded-full bg-win-accent flex items-center justify-center text-white shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                                {isCurrent && isPlaying ? <FaPause /> : <FaPlay className="ml-0.5" />}
                            </div>
                        </div>
                    </div>
                    <div className="min-w-0">
                        <p className={`font-medium text-sm truncate ${isCurrent ? 'text-win-accent' : 'text-gray-900 dark:text-gray-100'}`}>{track.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{track.artist}</p>
                    </div>
                </div>
            );
        }

        return (
            <div
                key={track.id}
                onClick={() => selectTrack(track)}
                className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors hover:bg-black/5 dark:hover:bg-white/10 ${isCurrent ? 'bg-black/5 dark:bg-white/10' : ''}`}
            >
                <div className="w-8 flex justify-center text-xs text-gray-400">
                    {isCurrent && isPlaying ? <div className="w-3 h-3 bg-win-accent rounded-full animate-pulse" /> : index + 1}
                </div>
                <div className="w-10 h-10 rounded overflow-hidden bg-gray-200 dark:bg-gray-800 flex-shrink-0">
                    {track.type === 'youtube' && track.thumbnail ? (
                        <img src={track.thumbnail} alt="" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center"><FaMusic className="text-gray-400" /></div>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${isCurrent ? 'text-win-accent' : 'text-gray-900 dark:text-gray-100'}`}>{track.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{track.artist}</p>
                </div>
                <div className="text-xs text-gray-500 px-2">
                    {/* Duration would go here */}
                </div>
            </div>
        );
    };

    return (
        <div className="flex h-full bg-[#f3f3f3] dark:bg-[#202020] text-gray-900 dark:text-white select-none overflow-hidden -m-4">
            {/* Sidebar */}
            <div className="w-64 bg-[#f9f9f9] dark:bg-[#2c2c2c] border-r border-gray-200 dark:border-[#353535] flex flex-col z-10">
                <div className="p-6 pb-2">
                    <div className="flex items-center gap-2 mb-6 text-win-accent">
                        <div className="w-8 h-8 rounded-full bg-win-accent text-white flex items-center justify-center">
                            <FaPlay className="ml-1 text-sm" />
                        </div>
                        <span className="font-semibold text-lg tracking-tight text-gray-900 dark:text-white">Media Player</span>
                    </div>

                    <div className="relative">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                        <input
                            type="text"
                            className="w-full bg-white dark:bg-[#353535] border border-gray-200 dark:border-[#404040] rounded-md py-1.5 pl-9 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-win-accent transition-shadow placeholder-gray-500"
                            placeholder="Search YouTube..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        {searchQuery && (
                            <button onClick={() => setSearchQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                                <FaTimes className="text-sm" />
                            </button>
                        )}
                    </div>
                </div>

                <nav className="flex-1 overflow-y-auto px-2 space-y-0.5 mt-2">
                    <button
                        onClick={() => setViewMode('nowPlaying')}
                        className={`w-full flex items-center gap-3 px-4 py-2 text-sm rounded-md transition-colors ${viewMode === 'nowPlaying' ? 'bg-black/5 dark:bg-white/10 font-medium' : 'hover:bg-black/5 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400'}`}
                    >
                        <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                        <span>Now Playing</span>
                    </button>

                    <div className="pt-4 pb-2 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Library</div>

                    <button
                        onClick={() => { setActiveTab('home'); setViewMode('library'); }}
                        className={`w-full flex items-center gap-3 px-4 py-2 text-sm rounded-md transition-colors ${viewMode === 'library' && activeTab === 'home' ? 'bg-black/5 dark:bg-white/10 font-medium' : 'hover:bg-black/5 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400'}`}
                    >
                        <MdLibraryMusic className="text-lg" />
                        <span>Home</span>
                    </button>
                    <button
                        onClick={() => { setActiveTab('youtube'); setViewMode('library'); }}
                        className={`w-full flex items-center gap-3 px-4 py-2 text-sm rounded-md transition-colors ${viewMode === 'library' && activeTab === 'youtube' ? 'bg-black/5 dark:bg-white/10 font-medium' : 'hover:bg-black/5 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400'}`}
                    >
                        <FaYoutube className="text-lg" />
                        <span>YouTube</span>
                    </button>
                    <button
                        onClick={() => { setActiveTab('local'); setViewMode('library'); }}
                        className={`w-full flex items-center gap-3 px-4 py-2 text-sm rounded-md transition-colors ${viewMode === 'library' && activeTab === 'local' ? 'bg-black/5 dark:bg-white/10 font-medium' : 'hover:bg-black/5 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400'}`}
                    >
                        <FaFolderOpen className="text-lg" />
                        <span>My Music</span>
                    </button>

                    <div className="pt-4 pb-2 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Playlists</div>
                    <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                        <MdQueueMusic className="text-lg" />
                        <span>Favorites</span>
                    </button>
                </nav>

                <div className="p-4 border-t border-gray-200 dark:border-[#353535]">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="audio/*,video/*"
                        multiple
                        onChange={handleFileSelect}
                        className="hidden"
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full py-2 bg-gray-200 dark:bg-[#353535] hover:bg-gray-300 dark:hover:bg-[#404040] text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-2"
                    >
                        <FaFolderOpen /> Open Files
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 bg-[#f3f3f3] dark:bg-[#202020] relative">
                {viewMode === 'library' ? (
                    <>
                        {/* Header */}
                        <header className="h-16 px-6 flex items-center justify-between z-10">
                            <h1 className="text-2xl font-semibold tracking-tight">
                                {activeTab === 'home' && 'Home'}
                                {activeTab === 'youtube' && (isSearching ? 'Search Results' : 'YouTube Trending')}
                                {activeTab === 'local' && 'My Music Library'}
                            </h1>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setLayout(layout === 'grid' ? 'list' : 'grid')}
                                    className="p-2 text-gray-600 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/10 rounded-md"
                                    title="Toggle Layout"
                                >
                                    {layout === 'grid' ? <FaList /> : <MdLibraryMusic />}
                                </button>
                            </div>
                        </header>

                        {/* Content Area */}
                        <main className="flex-1 overflow-y-auto px-6 pb-24">
                            {/* Hero / Feature (Only on Home) */}
                            {activeTab === 'home' && (
                                <div className="mb-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-8 text-white shadow-lg relative overflow-hidden">
                                    <div className="relative z-10">
                                        <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
                                        <p className="text-indigo-100 mb-6 max-w-md">Pick up where you left off or explore new trending music from YouTube.</p>
                                        <button
                                            onClick={() => handleSearch()} // Quick way to start exploring
                                            className="bg-white text-indigo-600 px-6 py-2.5 rounded-full font-semibold shadow-md hover:shadow-lg hover:bg-gray-50 transition-all"
                                        >
                                            Explore Now
                                        </button>
                                    </div>
                                    <FaMusic className="absolute -bottom-8 -right-8 text-9xl text-white/10 rotate-12" />
                                </div>
                            )}

                            {/* Loading State */}
                            {isSearching && (
                                <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                                    <FaSpinner className="text-3xl animate-spin mb-4 text-win-accent" />
                                    <p>Searching YouTube...</p>
                                </div>
                            )}

                            {/* Error State */}
                            {!isSearching && searchError && activeTab === 'youtube' && (
                                <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                                    <p className="text-red-500 mb-2">{searchError}</p>
                                    <button onClick={handleSearch} className="text-win-accent hover:underline">Try Again</button>
                                </div>
                            )}

                            {/* Track Grid */}
                            {!isSearching && (
                                <div className={layout === 'grid' ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4" : "space-y-1"}>
                                    {activeTab === 'home' ? (
                                        defaultPlaylist.map((track, i) => renderTrackItem(track, i))
                                    ) : (
                                        currentList.length > 0 ? (
                                            currentList.map((track, i) => renderTrackItem(track, i))
                                        ) : (
                                            <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-400">
                                                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                                                    {activeTab === 'local' ? <FaFolderOpen className="text-2xl" /> : <FaSearch className="text-2xl" />}
                                                </div>
                                                <p>No tracks found</p>
                                                {activeTab === 'local' && <button onClick={() => fileInputRef.current?.click()} className="mt-2 text-win-accent hover:underline">Open Local Files</button>}
                                            </div>
                                        )
                                    )}
                                </div>
                            )}
                        </main>
                    </>
                ) : (
                    <div className="flex-1 bg-black flex flex-col items-center justify-center relative overflow-hidden pb-24">
                        {/* Now Playing View */}
                        <div className="absolute top-4 left-4 z-20">
                            <button onClick={() => setViewMode('library')} className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors">
                                <FaStepBackward className="rotate-180" />
                            </button>
                        </div>

                        <div className="w-full h-full flex items-center justify-center">
                            {currentTrack?.type === 'youtube' ? (
                                <iframe
                                    key={currentTrack.youtubeId}
                                    width="100%"
                                    height="100%"
                                    src={`https://www.youtube.com/embed/${currentTrack.youtubeId}?autoplay=${isPlaying ? 1 : 0}&enablejsapi=1&controls=1&rel=0`}
                                    title={currentTrack.title}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    className="w-full h-full"
                                />
                            ) : isVideoCurrent ? (
                                <video
                                    ref={mediaRef as React.RefObject<HTMLVideoElement>}
                                    key={currentTrack?.id}
                                    src={(currentTrack as LocalTrack).url}
                                    className="w-full h-full object-contain"
                                    onTimeUpdate={e => setCurrentTime((e.target as HTMLVideoElement).currentTime)}
                                    onLoadedMetadata={e => setDuration((e.target as HTMLVideoElement).duration)}
                                    onEnded={playNext}
                                    onClick={togglePlay}
                                />
                            ) : (
                                <div className="flex flex-col items-center animate-fade-in">
                                    <audio
                                        ref={mediaRef as React.RefObject<HTMLAudioElement>}
                                        key={currentTrack?.id}
                                        src={(currentTrack as LocalTrack)?.url}
                                        onTimeUpdate={e => setCurrentTime((e.target as HTMLAudioElement).currentTime)}
                                        onLoadedMetadata={e => setDuration((e.target as HTMLAudioElement).duration)}
                                        onEnded={playNext}
                                    />
                                    <div
                                        className="w-64 h-64 rounded-xl shadow-2xl flex items-center justify-center mb-8 relative overflow-hidden"
                                        style={{ background: `linear-gradient(135deg, ${accentColor.color}40, ${accentColor.color}10)` }}
                                    >
                                        <FaMusic className="text-8xl drop-shadow-lg" style={{ color: accentColor.color }} />
                                        {isPlaying && <div className="absolute inset-0 bg-white/5 animate-pulse" />}
                                    </div>
                                    <h2 className="text-2xl font-bold text-white mb-2 text-center px-4">{currentTrack?.title}</h2>
                                    <p className="text-gray-400 text-lg">{currentTrack?.artist}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Bottom Player Bar */}
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-[#f3f3f3]/90 dark:bg-[#202020]/90 backdrop-blur-md border-t border-gray-200 dark:border-[#353535] flex items-center px-4 z-50">
                    {/* Track Info */}
                    <div className="w-1/4 flex items-center gap-4">
                        {currentTrack && (
                            <>
                                <div
                                    className="w-14 h-14 rounded-md bg-gray-200 dark:bg-gray-800 overflow-hidden shadow-sm relative group cursor-pointer"
                                    onClick={() => setViewMode('nowPlaying')}
                                >
                                    {currentTrack.type === 'youtube' && currentTrack.thumbnail ? (
                                        <img src={currentTrack.thumbnail} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center"><FaMusic className="text-gray-400" /></div>
                                    )}
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <FaExpand className="text-white" />
                                    </div>
                                </div>
                                <div className="min-w-0">
                                    <p className="font-medium text-sm truncate text-gray-900 dark:text-white hover:underline cursor-pointer" onClick={() => setViewMode('nowPlaying')}>{currentTrack.title}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{currentTrack.artist}</p>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Controls */}
                    <div className="flex-1 flex flex-col items-center max-w-2xl mx-auto">
                        <div className="flex items-center gap-6 mb-1">
                            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"><FaRandom size={14} /></button>
                            <button onClick={playPrev} className="text-gray-600 dark:text-gray-300 hover:text-win-accent transition-colors"><FaStepBackward size={18} /></button>
                            <button
                                onClick={togglePlay}
                                className="w-10 h-10 rounded-full bg-win-accent text-white flex items-center justify-center hover:scale-105 transition-transform shadow-md"
                            >
                                {isPlaying ? <FaPause size={14} /> : <FaPlay size={14} className="ml-0.5" />}
                            </button>
                            <button onClick={playNext} className="text-gray-600 dark:text-gray-300 hover:text-win-accent transition-colors"><FaStepForward size={18} /></button>
                            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"><FaRedo size={14} /></button>
                        </div>
                        <div className="w-full flex items-center gap-3">
                            <span className="text-xs text-gray-500 w-10 text-right font-mono">{formatTime(currentTime)}</span>
                            <div className="flex-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full relative group cursor-pointer">
                                <div
                                    className="absolute left-0 top-0 bottom-0 rounded-full"
                                    style={{ width: `${progress}%`, backgroundColor: accentColor.color }}
                                >
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max={duration || 100}
                                    value={currentTime}
                                    onChange={seek}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                            </div>
                            <span className="text-xs text-gray-500 w-10 font-mono">{formatTime(duration)}</span>
                        </div>
                    </div>

                    {/* Volume & Extras */}
                    <div className="w-1/4 flex items-center justify-end gap-3">
                        <div className="flex items-center gap-2 group">
                            <button onClick={() => setIsMuted(!isMuted)} className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                                {isMuted || volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
                            </button>
                            <div className="w-20 h-1 bg-gray-300 dark:bg-gray-600 rounded-full relative overflow-hidden">
                                <div className="absolute left-0 top-0 bottom-0" style={{ width: `${isMuted ? 0 : volume * 100}%`, backgroundColor: accentColor.color }} />
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.05"
                                    value={isMuted ? 0 : volume}
                                    onChange={(e) => {
                                        setVolume(Number(e.target.value));
                                        setIsMuted(Number(e.target.value) === 0);
                                    }}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                            </div>
                        </div>
                        <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1" />
                        <button onClick={toggleFullscreen} className="text-gray-600 dark:text-gray-400 hover:text-win-accent">
                            {isFullscreen ? <FaCompress /> : <FaExpand />}
                        </button>
                    </div>
                </div>

                {/* Fullscreen Overlay */}
                <div ref={playerContainerRef} className={`fixed inset-0 bg-black z-[100] ${isFullscreen ? 'flex' : 'hidden'} items-center justify-center`}>
                    <div className="w-full h-full relative">
                        {currentTrack?.type === 'youtube' ? (
                            <iframe
                                key={`fs-${currentTrack.youtubeId}`}
                                width="100%"
                                height="100%"
                                src={`https://www.youtube.com/embed/${currentTrack.youtubeId}?autoplay=${isPlaying ? 1 : 0}&enablejsapi=1&controls=1&rel=0`}
                                title={currentTrack.title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                className="w-full h-full"
                            />
                        ) : isVideoCurrent ? (
                            <video
                                key={`fs-${currentTrack?.id}`}
                                src={(currentTrack as LocalTrack).url}
                                className="w-full h-full object-contain"
                                autoPlay={isPlaying}
                                controls
                                onClick={togglePlay}
                            />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900">
                                <FaMusic className="text-9xl mb-8" style={{ color: accentColor.color }} />
                                <h2 className="text-4xl font-bold text-white mb-2">{currentTrack?.title}</h2>
                                <p className="text-gray-400 text-2xl">{currentTrack?.artist}</p>
                            </div>
                        )}
                        <button onClick={toggleFullscreen} className="absolute top-4 right-4 text-white p-2 bg-black/50 rounded-full hover:bg-black/70 z-50">
                            <FaCompress size={24} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
