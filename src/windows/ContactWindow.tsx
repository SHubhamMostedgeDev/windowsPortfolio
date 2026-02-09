import { useState } from 'react';
import { FaEnvelope, FaPhone, FaLinkedin, FaGithub, FaPaperPlane } from 'react-icons/fa';
import { portfolioData } from '../data/portfolioData';

export default function ContactWindow() {
    const { personal } = portfolioData;
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Create mailto link
        const subject = `Portfolio Contact from ${formData.name}`;
        const body = `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`;
        window.location.href = `mailto:${personal.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    };

    return (
        <div className="h-full flex flex-col">
            <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-win-accent to-purple-500 bg-clip-text text-transparent">
                Get in Touch
            </h2>

            {/* Contact info */}
            <div className="grid grid-cols-2 gap-3 mb-6">
                <a
                    href={`mailto:${personal.email}`}
                    className="flex items-center gap-3 p-3 rounded-lg bg-white/30 dark:bg-black/20 hover:bg-white/40 dark:hover:bg-black/30 transition-colors"
                >
                    <div className="w-10 h-10 rounded-lg bg-win-accent flex items-center justify-center">
                        <FaEnvelope className="text-white" />
                    </div>
                    <div className="min-w-0">
                        <div className="text-xs text-gray-500 dark:text-gray-400">Email</div>
                        <div className="text-sm text-gray-800 dark:text-gray-200 truncate">{personal.email}</div>
                    </div>
                </a>

                <a
                    href={`tel:${personal.phone}`}
                    className="flex items-center gap-3 p-3 rounded-lg bg-white/30 dark:bg-black/20 hover:bg-white/40 dark:hover:bg-black/30 transition-colors"
                >
                    <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center">
                        <FaPhone className="text-white" />
                    </div>
                    <div className="min-w-0">
                        <div className="text-xs text-gray-500 dark:text-gray-400">Phone</div>
                        <div className="text-sm text-gray-800 dark:text-gray-200 truncate">{personal.phone}</div>
                    </div>
                </a>

                <a
                    href={personal.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg bg-white/30 dark:bg-black/20 hover:bg-white/40 dark:hover:bg-black/30 transition-colors"
                >
                    <div className="w-10 h-10 rounded-lg bg-[#0077b5] flex items-center justify-center">
                        <FaLinkedin className="text-white" />
                    </div>
                    <div className="min-w-0">
                        <div className="text-xs text-gray-500 dark:text-gray-400">LinkedIn</div>
                        <div className="text-sm text-gray-800 dark:text-gray-200 truncate">shubham7080</div>
                    </div>
                </a>

                <a
                    href={personal.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg bg-white/30 dark:bg-black/20 hover:bg-white/40 dark:hover:bg-black/30 transition-colors"
                >
                    <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center">
                        <FaGithub className="text-white" />
                    </div>
                    <div className="min-w-0">
                        <div className="text-xs text-gray-500 dark:text-gray-400">GitHub</div>
                        <div className="text-sm text-gray-800 dark:text-gray-200 truncate">playkashyap</div>
                    </div>
                </a>
            </div>

            {/* Contact form */}
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
                <div className="space-y-3 flex-1">
                    <input
                        type="text"
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-lg bg-white/50 dark:bg-black/30 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-win-accent"
                        required
                    />
                    <input
                        type="email"
                        placeholder="Your Email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-lg bg-white/50 dark:bg-black/30 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-win-accent"
                        required
                    />
                    <textarea
                        placeholder="Your Message"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-2.5 rounded-lg bg-white/50 dark:bg-black/30 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-win-accent resize-none"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-win-accent text-white font-medium hover:bg-win-accent-hover transition-colors"
                >
                    <FaPaperPlane />
                    Send Message
                </button>
            </form>
        </div>
    );
}
