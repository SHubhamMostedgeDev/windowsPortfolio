import { FaGithub, FaLinkedin, FaEnvelope, FaPhone } from 'react-icons/fa';
import { portfolioData } from '../data/portfolioData';

export default function AboutWindow() {
    const { personal } = portfolioData;

    return (
        <div className="h-full flex flex-col gap-6">
            {/* Header with avatar and name */}
            <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-win-accent via-blue-400 to-purple-500 flex items-center justify-center shadow-lg">
                    <span className="text-3xl font-bold text-white">SK</span>
                </div>
                <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-win-accent to-purple-500 bg-clip-text text-transparent">
                        {personal.name}
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">{personal.role}</p>
                </div>
            </div>

            {/* Bio */}
            <div className="bg-white/30 dark:bg-black/20 rounded-lg p-4">
                <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    About
                </h2>
                <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                    {personal.bio}
                </p>
            </div>

            {/* Social Links */}
            <div>
                <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                    Connect
                </h2>
                <div className="flex flex-wrap gap-3">
                    <a
                        href={personal.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors"
                    >
                        <FaGithub className="text-lg" />
                        <span className="text-sm">GitHub</span>
                    </a>
                    <a
                        href={personal.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0077b5] text-white hover:bg-[#006399] transition-colors"
                    >
                        <FaLinkedin className="text-lg" />
                        <span className="text-sm">LinkedIn</span>
                    </a>
                    <a
                        href={`mailto:${personal.email}`}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-win-accent text-white hover:bg-win-accent-hover transition-colors"
                    >
                        <FaEnvelope className="text-lg" />
                        <span className="text-sm">Email</span>
                    </a>
                    <a
                        href={`tel:${personal.phone}`}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
                    >
                        <FaPhone className="text-lg" />
                        <span className="text-sm">Call</span>
                    </a>
                </div>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-4 mt-auto">
                <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-win-accent">2+</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Years Experience</div>
                </div>
                <div className="bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-500">5+</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Projects</div>
                </div>
                <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-orange-500">15+</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Technologies</div>
                </div>
            </div>
        </div>
    );
}
