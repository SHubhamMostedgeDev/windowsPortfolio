import { useState } from 'react';
import { FaCalendarAlt, FaGithub, FaBuilding, FaUser } from 'react-icons/fa';
import { portfolioData } from '../data/portfolioData';

type ProjectTab = 'company' | 'personal';

export default function ProjectsWindow() {
    const [activeTab, setActiveTab] = useState<ProjectTab>('company');
    const { companyProjects, personalProjects } = portfolioData;

    const projects = activeTab === 'company' ? companyProjects : personalProjects;

    return (
        <div className="h-full flex flex-col">
            <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-win-accent to-purple-500 bg-clip-text text-transparent">
                Projects
            </h2>

            {/* Tabs */}
            <div className="flex gap-2 mb-4">
                <button
                    onClick={() => setActiveTab('company')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'company'
                            ? 'bg-win-accent text-white'
                            : 'bg-white/30 dark:bg-black/20 text-gray-700 dark:text-gray-300 hover:bg-white/40 dark:hover:bg-black/30'
                        }`}
                >
                    <FaBuilding />
                    Company Projects
                </button>
                <button
                    onClick={() => setActiveTab('personal')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'personal'
                            ? 'bg-win-accent text-white'
                            : 'bg-white/30 dark:bg-black/20 text-gray-700 dark:text-gray-300 hover:bg-white/40 dark:hover:bg-black/30'
                        }`}
                >
                    <FaUser />
                    Personal Projects
                </button>
            </div>

            {/* Projects Grid */}
            <div className="flex-1 overflow-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {projects.map(project => (
                        <div
                            key={project.id}
                            className="bg-white/30 dark:bg-black/20 rounded-lg p-4 project-card"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                                    {project.name}
                                </h3>
                                {'github' in project && project.github && (
                                    <a
                                        href={project.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                    >
                                        <FaGithub className="text-xl" />
                                    </a>
                                )}
                            </div>

                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                                <FaCalendarAlt className="text-win-accent" />
                                {project.period}
                            </div>

                            {/* Tech stack */}
                            <div className="flex flex-wrap gap-1.5 mb-3">
                                {project.tech.map((tech, i) => (
                                    <span
                                        key={i}
                                        className="px-2 py-0.5 rounded text-xs font-medium bg-win-accent/20 text-win-accent dark:text-blue-400"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>

                            {/* Description */}
                            <ul className="space-y-1">
                                {project.description.map((item, i) => (
                                    <li key={i} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                                        <span className="text-win-accent mt-1">•</span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
