export const portfolioData = {
    personal: {
        name: 'Shubham Kumar Prajapati',
        role: 'Fullstack Developer',
        email: 'jackwill021@gmail.com',
        phone: '+91 7080364716',
        linkedin: 'https://www.linkedin.com/in/shubham7080/',
        github: 'https://github.com/playkashyap',
        bio: `Passionate Fullstack Developer with expertise in building responsive UIs and robust backend systems. 
Experienced in React, Angular, Next.js, Node.js, and TypeScript. Currently working on surveillance applications 
with face recognition and GPU acceleration at Mostedge. Previously at Cosmotech AI, where I developed 
enterprise applications including HRIS and PMS systems.`,
    },

    experience: [
        {
            id: 1,
            company: 'Mostedge',
            role: 'Fullstack Developer',
            location: 'Vadodra, India',
            period: 'July 2025 - Present',
            description: [
                'Building Surveillance application for Keeping Eye on C Stores remotely with face recognition and logging with GPU acceleration',
                'Developed RESTful APIs with Node.js (TypeScript), Python with MSSQL and PostgreSQL',
                'Actively participating in hosting the Backend with GPU cloud instances',
                'Used CUDA and Other GPU technologies to speedup model processing with Video encoding and decoding',
            ],
        },
        {
            id: 2,
            company: 'Cosmotech AI',
            role: 'Software Developer (Frontend and Backend)',
            location: 'Noida, India',
            period: 'June 2023 - May 2025',
            description: [
                'Built responsive UIs using React, Angular, Next.js, HTML, CSS, and TypeScript',
                'Developed RESTful APIs with Node.js (TypeScript) and MongoDB for real-time data operations',
                'Integrated APIs to enhance interactivity and dynamic content',
                'Used Git for version control; participated in agile ceremonies including sprint planning and daily standups',
            ],
        },
        {
            id: 3,
            company: 'Cosmotech AI',
            role: 'Frontend Developer Intern',
            location: 'Noida, India',
            period: 'January 2023 - June 2023',
            description: [
                'Contributed to UI development using React, Angular, HTML, CSS, and TypeScript',
                'Assisted in API integration and dynamic content updates',
                'Participated in agile processes and collaborated using Git for version control',
                'Participated in daily stand-ups and team meetings with sprint planning',
            ],
        },
    ],

    companyProjects: [
        {
            id: 1,
            name: 'HRIS - Front-end',
            tech: ['Next.js', 'React', 'Tailwind', 'Zustand', 'Context API', 'TypeScript'],
            period: 'Aug 2024 - May 2025',
            description: [
                'Developed a pixel-perfect, responsive UI with a custom sidebar using Tailwind and reusable React components',
                'Built a dynamic drag-and-drop dashboard for customizable user workflows and widget arrangements',
                'Managed global state efficiently using Zustand and Context API across multiple modules',
                'Created custom dynamic organizational chart which can be exported to a PDF',
            ],
        },
        {
            id: 2,
            name: 'PMS - Front-end',
            tech: ['Angular', 'RxJs', 'Bootstrap', 'Apex Charts', 'Ngrx', 'TypeScript'],
            period: 'July 2023 - May 2025',
            description: ['Property Management System with advanced charting and state management'],
        },
        {
            id: 3,
            name: 'Rate System - Front-end',
            tech: ['React', 'Vite', 'Bootstrap', 'Apex Charts', 'Context API', 'JavaScript'],
            period: 'Jan 2023 - May 2025',
            description: ['Rate calculation and management system with interactive charts'],
        },
    ],

    personalProjects: [
        {
            id: 1,
            name: 'HandFlow',
            tech: ['Python', 'OpenCV', 'Mediapipe', 'CNN', 'TensorFlow', 'NumPy'],
            period: 'Aug 2022 - Apr 2023',
            description: [
                'A proposed Framework for Controlling Basic Computer Functionalities with Hand Gesture',
                'Created a real-time video program with 96% accuracy for static gestures and 97% accuracy for dynamic gestures',
                'Executed diverse computer functions based on recognized gestures, including zooming, saving, and minimizing windows',
            ],
            github: 'https://github.com/playkashyap',
        },
        {
            id: 2,
            name: 'Brain Tumor Detection',
            tech: ['Python', 'SVM', 'Image Processing'],
            period: 'Aug 2021 - Jan 2022',
            description: [
                'Applied advanced algorithms including pre-processing, segmentation, and SVM classification for brain tumor detection',
                'Published a paper titled "Image Processing based Brain Tumor Detection" at ICFIRTP-2022',
            ],
        },
    ],

    skills: {
        languages: ['JavaScript', 'HTML/CSS', 'TypeScript', 'MongoDB', 'GraphQL', 'SQL'],
        frameworks: ['ReactJs', 'Node.js', 'Express.js', 'Tailwind', 'Bootstrap', 'Material-UI', 'Angular', 'NextJs'],
        tools: ['Git', 'VS Code', 'MongoDB Atlas', 'Postman', 'MongoDB Compass', 'MS Azure'],
        libraries: ['MUI', 'RxJs', 'Axios', 'Body Parser', 'bCrypt', 'JWT', 'Moment', 'Angular Material', 'ThreeJs', 'ShadCn UI', 'Tanstack'],
    },

    education: [
        {
            id: 1,
            institution: 'Sharda University',
            location: 'Gr Noida, India',
            degree: 'Bachelor of Computer Science and Technology',
            period: 'Aug 2019 - Aug 2023',
        },
        {
            id: 2,
            institution: 'Columbus International School',
            location: 'Ballia, India',
            degree: 'Higher Secondary (81%)',
            period: 'Mar 2016 - Apr 2018',
        },
        {
            id: 3,
            institution: 'Columbus International School',
            location: 'Ballia, India',
            degree: 'Secondary (10 CGPA)',
            period: 'Mar 2014 - Mar 2016',
        },
    ],
};
