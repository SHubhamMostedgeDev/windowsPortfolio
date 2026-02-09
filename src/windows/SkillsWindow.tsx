import { FaCode, FaLayerGroup, FaTools, FaCubes } from 'react-icons/fa';
import { portfolioData } from '../data/portfolioData';

const skillCategories = [
    { key: 'languages', label: 'Languages', icon: <FaCode />, color: 'from-blue-500 to-cyan-400' },
    { key: 'frameworks', label: 'Frameworks', icon: <FaLayerGroup />, color: 'from-purple-500 to-pink-400' },
    { key: 'tools', label: 'Developer Tools', icon: <FaTools />, color: 'from-orange-500 to-yellow-400' },
    { key: 'libraries', label: 'Libraries', icon: <FaCubes />, color: 'from-green-500 to-teal-400' },
] as const;

export default function SkillsWindow() {
    const { skills } = portfolioData;

    return (
        <div className="h-full">
            <h2 className="text-xl font-bold mb-6 bg-gradient-to-r from-win-accent to-purple-500 bg-clip-text text-transparent">
                Technical Skills
            </h2>

            <div className="space-y-6">
                {skillCategories.map(category => (
                    <div key={category.key}>
                        {/* Category header */}
                        <div className="flex items-center gap-2 mb-3">
                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center text-white`}>
                                {category.icon}
                            </div>
                            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                {category.label}
                            </h3>
                        </div>

                        {/* Skills */}
                        <div className="flex flex-wrap gap-2">
                            {skills[category.key].map((skill, index) => (
                                <span
                                    key={index}
                                    className="skill-badge px-3 py-1.5 rounded-lg text-sm font-medium text-gray-800 dark:text-gray-200"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
