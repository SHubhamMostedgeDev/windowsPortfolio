import { FaBuilding, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';
import { portfolioData } from '../data/portfolioData';

export default function ExperienceWindow() {
    const { experience } = portfolioData;

    return (
        <div className="h-full">
            <h2 className="text-xl font-bold mb-6 bg-gradient-to-r from-win-accent to-purple-500 bg-clip-text text-transparent">
                Work Experience
            </h2>

            <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-4 top-2 bottom-2 w-0.5 timeline-line" />

                {/* Experience items */}
                <div className="space-y-6">
                    {experience.map((exp, index) => (
                        <div key={exp.id} className="relative pl-10">
                            {/* Timeline dot */}
                            <div className="absolute left-2 top-1 w-5 h-5 rounded-full bg-win-accent border-4 border-white dark:border-gray-800 shadow-lg" />

                            {/* Card */}
                            <div className="bg-white/30 dark:bg-black/20 rounded-lg p-4 project-card">
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${index === 0
                                            ? 'bg-green-500/20 text-green-600 dark:text-green-400'
                                            : 'bg-gray-500/20 text-gray-600 dark:text-gray-400'
                                        }`}>
                                        {index === 0 ? 'Current' : 'Past'}
                                    </span>
                                </div>

                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                                    {exp.role}
                                </h3>

                                <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                                    <span className="flex items-center gap-1">
                                        <FaBuilding className="text-win-accent" />
                                        {exp.company}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <FaMapMarkerAlt className="text-win-accent" />
                                        {exp.location}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <FaCalendarAlt className="text-win-accent" />
                                        {exp.period}
                                    </span>
                                </div>

                                <ul className="mt-3 space-y-1.5">
                                    {exp.description.map((item, i) => (
                                        <li key={i} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                                            <span className="text-win-accent mt-1">•</span>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
