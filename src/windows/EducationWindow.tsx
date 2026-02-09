import { FaGraduationCap, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';
import { portfolioData } from '../data/portfolioData';

export default function EducationWindow() {
    const { education } = portfolioData;

    return (
        <div className="h-full">
            <h2 className="text-xl font-bold mb-6 bg-gradient-to-r from-win-accent to-purple-500 bg-clip-text text-transparent">
                Education
            </h2>

            <div className="space-y-4">
                {education.map((edu, index) => (
                    <div
                        key={edu.id}
                        className="bg-white/30 dark:bg-black/20 rounded-lg p-4 project-card relative overflow-hidden"
                    >
                        {/* Decorative gradient */}
                        <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${index === 0 ? 'from-win-accent to-purple-500' :
                                index === 1 ? 'from-green-500 to-teal-500' :
                                    'from-orange-500 to-red-500'
                            }`} />

                        <div className="pl-4">
                            <div className="flex items-start gap-3">
                                <div className={`w-12 h-12 rounded-lg flex items-center justify-center shadow-lg ${index === 0 ? 'bg-gradient-to-br from-win-accent to-purple-500' :
                                        index === 1 ? 'bg-gradient-to-br from-green-500 to-teal-500' :
                                            'bg-gradient-to-br from-orange-500 to-red-500'
                                    }`}>
                                    <FaGraduationCap className="text-white text-xl" />
                                </div>

                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                                        {edu.institution}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {edu.degree}
                                    </p>

                                    <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                                        <span className="flex items-center gap-1">
                                            <FaMapMarkerAlt className="text-win-accent" />
                                            {edu.location}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <FaCalendarAlt className="text-win-accent" />
                                            {edu.period}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
