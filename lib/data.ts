export const personalInfo = {
  name: "James Duong",
  headline: "Computer Science Student & Software Engineer",
  intro:
    "Senior Computer Science student at San Diego State University graduating in May 2026. I enjoy building polished web applications, practical backend systems, and thoughtful AI-driven tools with a strong focus on usability, performance, and clear implementation details.",
  email: "duongjames7@gmail.com",
  phone: "(619) 538-5556",
  location: "San Diego, CA",
  github: "https://github.com/",
  linkedin: "https://linkedin.com/in/",
  resumeUrl: "/James_Duong_CS_Resume_2026.pdf",
};

export const skills = {
  languages: ["TypeScript", "JavaScript", "Python", "Java", "C/C++", "HTML/CSS"],
  frameworks: ["React", "Next.js", "Django REST", "PyTorch", "Pandas"],
  tools: ["Git", "Docker", "Unix/Linux", "Figma", "Jira"],
};

export const experiences = [
  {
    id: "sdsu-capstone",
    role: "Capstone Software Engineer (Frontend)",
    company: "SDSU Adaptive Testing Platform",
    date: "August 2025 - Present",
    description: [
      "Built and shipped 15 responsive UI screens across student and instructor workflows using React and TypeScript.",
      "Integrated 20+ REST endpoints from a Django backend, including authentication, CRUD flows, and resilient loading and error states.",
      "Improved perceived performance through debounced inputs, cleaner request handling, and smoother UI state transitions.",
      "Collaborated on a 4-person team using Git, code reviews, and iterative feature delivery while preparing the app for cloud deployment with Docker.",
    ],
  },
];

export const projects = [
  {
    id: "adaptive-testing",
    title: "Adaptive Testing Platform",
    description:
      "Frontend work for an adaptive testing platform built with React and TypeScript, focused on role-based workflows, API integration, and a smoother experience for students and instructors.",
    tech: ["React", "TypeScript", "Django REST", "Docker"],
    github: "https://github.com/",
    live: "",
    featured: true,
    overview:
      "This project serves as the frontend for an adaptive testing platform at San Diego State University. The application supports student and instructor workflows with responsive screens, authenticated flows, and structured API-driven interactions.",
    problem:
      "Educational tools often become difficult to manage when they need to support multiple user roles, protected content, and consistent data flow between the interface and backend services.",
    role:
      "Frontend Engineer on a 4-person capstone team. I focused on building responsive interfaces, integrating backend endpoints, and improving frontend usability across core platform workflows.",
    features: [
      "Responsive screens for authentication, dashboards, profile management, settings, and quiz-related workflows",
      "Role-aware navigation and protected frontend flows aligned with backend authorization rules",
      "Integrated API flows with loading, validation, and error handling for a more reliable user experience",
    ],
    implementationDetails:
      "I built interface components in React with TypeScript and connected them to a Django REST backend through structured API calls. My work centered on routing, form and state handling, auth-aware UI behavior, and making request-driven screens feel predictable and responsive.",
    challenges:
      "One of the biggest challenges was keeping frontend behavior aligned with backend permissions while also maintaining a smooth user experience. That required careful handling of protected routes, session-aware rendering, and edge cases across different roles.",
    learning:
      "This project strengthened my experience with React, TypeScript, REST integration, and the day-to-day tradeoffs involved in building production-style frontend features within a team setting.",
    future:
      "Next steps include deeper deployment polish, additional analytics views, and continued refinement of performance and usability across more complex test workflows.",
  },
  {
    id: "ai-resume-matcher",
    title: "AI Resume Matching Tool",
    description:
      "Collaborative NLP prototype that compares resumes with job descriptions using Doc2Vec and cosine similarity, supported by a preprocessing and evaluation workflow in Python.",
    tech: ["Python", "NLP", "Doc2Vec", "Pandas", "Gensim", "PyMuPDF"],
    github: "https://github.com/",
    live: "",
    featured: true,
    overview:
      "This project explores how natural language processing can support resume-to-job matching beyond basic keyword checks. The workflow processes job postings and resume text, prepares documents for vectorization, and compares similarity scores between resumes and selected roles.",
    problem:
      "Simple keyword matching can miss relevant experience when wording differs across resumes and job descriptions. The goal was to explore a more semantic approach to alignment scoring using document embeddings.",
    role:
      "Contributed to a group project by documenting the technical workflow, clarifying the preprocessing and modeling pipeline, and helping translate the system into a clearer end-to-end implementation story.",
    features: [
      "Job-posting filtering pipeline that removes incomplete entries and prepares a cleaner dataset for downstream analysis",
      "PDF resume extraction with PyMuPDF followed by text cleaning and preprocessing",
      "Doc2Vec-based document comparison using cosine similarity between resume and job-description representations",
    ],
    implementationDetails:
      "The workflow begins by filtering job-posting data from CSV files, removing entries without descriptions, and producing a cleaner dataset for analysis. Resume text is extracted from uploaded PDFs, cleaned by removing stopwords and selected personal data categories, and then prepared alongside job-description text for Doc2Vec training and similarity scoring.",
    challenges:
      "A core challenge was presenting resume-job matching as more than a keyword search while keeping the pipeline understandable and reproducible. The project also highlighted how sensitive results can be to preprocessing quality and dataset design.",
    learning:
      "Through this project, I gained exposure to text preprocessing, document embeddings, similarity scoring, and the importance of clearly documenting technical workflows in collaborative ML projects.",
    future:
      "Future improvements include broader evaluation, stronger ranking logic, and a cleaner demo interface for exploring similarity results more interactively.",
  },
  {
    id: "medical-summarizer",
    title: "Medical Conversation Summarizer",
    description:
      "Hackathon prototype that turns speech into text and summarizes medical-style conversations, with an emphasis on data preparation, model experimentation, and privacy-aware design.",
    tech: ["Flutter", "Python", "NLP", "PyTorch"],
    github: "https://github.com/",
    live: "",
    featured: true,
    overview:
      "Built during the SDSU Big Data Hackathon, this prototype explored how speech-to-text and summarization could reduce manual overhead when working with clinical-style conversations. The project focused on quickly validating the workflow rather than shipping a production-ready healthcare product.",
    problem:
      "Medical and healthcare-style conversations can be time-consuming to review and reformat manually. We wanted to prototype a workflow that could move from spoken input to a more concise written summary while considering privacy from the start.",
    role:
      "Contributed on the ML side by helping obtain data, support model training, and shape the summarization workflow for a team-built hackathon prototype.",
    features: [
      "Speech-to-text step that converts spoken dialogue into text for downstream processing",
      "Summarization stage that transforms transcript content into a shorter, more usable output",
      "Privacy-aware project framing for handling sensitive healthcare-related conversations",
    ],
    implementationDetails:
      "My work focused on data collection and model-related experimentation for the summarization portion of the project. The overall prototype combined speech-to-text output with a summarization step, allowing the team to demonstrate an end-to-end concept during the hackathon.",
    challenges:
      "Privacy was one of the most important constraints because healthcare-related dialogue requires careful handling. The project also had to balance limited hackathon time with the difficulty of building a meaningful language-processing prototype.",
    learning:
      "This project gave me hands-on experience working on an ML-focused hackathon prototype, especially around data preparation, model training, and building under tight time constraints.",
    future:
      "Future work would include improving summary quality, refining the structure of generated notes, and exploring stronger privacy and security practices for sensitive conversational data.",
  },
];
