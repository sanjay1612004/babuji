export const profile = {
  name: 'Kishorebabu S',
  role: 'Full-Stack Developer / AI Engineer',
  email: 's.kishorebabu8@gmail.com',
  location: 'Coimbatore, Tamil Nadu, India',
  portrait: '/assets/kishorebabu.png',
  canonicalUrl: 'https://kishorebabu-engineering-portfolio.peachycrow19.chatgpt.site',
  socials: { GitHub: '', LinkedIn: '', LeetCode: '' },
};

export const chapters = [
  { id: 'about', label: 'The developer', short: 'About' },
  { id: 'experience', label: 'The journey', short: 'Journey' },
  { id: 'work', label: 'Selected work', short: 'Work' },
  { id: 'skills', label: 'The toolkit', short: 'Toolkit' },
  { id: 'playground', label: 'Beyond the code', short: 'Playground' },
  { id: 'contact', label: "Let’s connect", short: 'Contact' },
];

export const experiences = [
  { role: 'Full Stack Developer', company: 'Codingmart Technologies', date: 'SEP 2026 — PRESENT', current: true, description: 'Continuing the journey across web applications and AI-related projects.', contributions: ['Continue development work across web applications and AI-related projects.', 'Apply previous experience in full-stack development, application workflows, and AI integration.'], tags: ['Full-stack development', 'Application workflows', 'AI integration'] },
  { role: 'Developer Intern', company: 'Finestcoder', date: 'OCT 2025 — AUG 2026', current: false, description: 'Turning ideas into working applications, one feature at a time.', contributions: ['Developed features for intern management and campus learning tools.', 'Contributed to conversational AI workflows.', 'Worked independently on assigned features and collaborated with development teams.'], tags: ['React', 'Fastify', 'PostgreSQL', 'Python', 'RAG'] },
];

export const projects = [
  {
    id: 'interngo', name: 'Interngo', category: 'FULL-STACK DEVELOPMENT', number: '01', theme: 'lime',
    headline: 'One platform.\nA connected intern experience.',
    summary: 'From attendance to end-of-day updates. An end-to-end platform that brings the entire intern experience together.',
    description: 'Developed an intern management application end to end, consolidating performance tracking, attendance, resources, helpdesk operations, and analytics into one platform.',
    ownership: 'Complete frontend & backend development',
    contributions: ['Built the complete frontend and backend, with PostgreSQL storage and deployment on AWS.', 'Developed intern performance tracking, attendance management, and analytics functionality.', 'Built resource management and helpdesk workflows.', 'Implemented daily end-of-day updates with automatic Slack posting.', 'Integrated interaction scheduling using Google Meet and email invitations.'],
    tags: ['React', 'Node.js', 'Fastify', 'PostgreSQL', 'AWS'],
    stack: ['React', 'TanStack Query', 'Tailwind CSS', 'React Compiler', 'Axios', 'Node.js', 'Fastify', 'PostgreSQL', 'AWS', 'Slack', 'Google Meet'],
    workflow: ['React interface', 'Fastify API', 'PostgreSQL', 'AWS deployment'], url: '',
  },
  {
    id: 'fclabs', name: 'FC Labs', category: 'FRONTEND DEVELOPMENT', number: '02', theme: 'cyan',
    headline: 'Campus activity.\nClearer insights.',
    summary: 'A clearer picture of learning. Interfaces that help principals follow workshops, trainers, participation, and student performance.',
    description: 'Developed the frontend for a college administration panel as part of a four-member team, helping principals monitor campus learning activities, trainers, workshops, and student performance.',
    ownership: 'Frontend development · four-member team',
    contributions: ['Built interfaces for monitoring trainers and campus workshops.', 'Supported tracking workshop participants and elapsed workshop days.', 'Developed views to identify students who had not completed workshops.', 'Built analytics interfaces for top-performing students.', 'Supported administrators in reviewing learning and workshop participation.'],
    tags: ['Astro', 'React', 'Axios', 'Fastify'],
    stack: ['Astro', 'React', 'Axios', 'Node.js', 'Fastify', 'PostgreSQL'],
    workflow: ['Campus activity', 'Frontend views', 'Participation insights', 'Administrator review'], url: '',
  },
  {
    id: 'aokah', name: 'AOKAH', category: 'AI ENGINEERING', number: '03', theme: 'violet',
    headline: 'Complex information.\nNow conversational.',
    summary: 'Connecting unstructured data to contextual answers. AI workflows for a Global Capability Center orchestration platform.',
    description: 'Contributed to an AI-powered conversational platform that helps users retrieve contextual information about global capability centers, projects, subprojects, milestones, and tasks.',
    ownership: 'AI workflows & conversational retrieval contributions',
    contributions: ['Developed Python workflows to extract, clean, and transform PDF and CSV information.', 'Applied NLP and text processing to structure unstructured information.', 'Contributed to retrieval-augmented generation and improved contextual relevance.', 'Worked with LLMs and prompt engineering for structured responses.', 'Supported AI integration using Python, FastAPI, and REST APIs.', 'Collaborated on data quality, retrieval accuracy, and conversational reliability.'],
    tags: ['Python', 'LangChain', 'RAG', 'FastAPI'],
    stack: ['Python', 'Generative AI', 'LLMs', 'LangChain', 'RAG', 'FastAPI', 'REST APIs', 'NLP', 'Hugging Face', 'Pandas', 'NumPy', 'SQL'],
    workflow: ['Documents', 'Extraction', 'Cleaning', 'Chunking', 'Retrieval', 'LLM', 'Response'], url: '',
  },
];

export const capabilities = [
  { name: 'Frontend', icon: '01', description: 'The interface between people and possibility.', technologies: ['React', 'Astro', 'Tailwind CSS', 'TanStack Query', 'React Compiler', 'Axios'], projects: ['Interngo', 'FC Labs'] },
  { name: 'Backend', icon: '02', description: 'The logic that keeps everything connected.', technologies: ['Node.js', 'Fastify', 'REST APIs'], projects: ['Interngo', 'AOKAH'] },
  { name: 'Databases & Cloud', icon: '03', description: 'A dependable foundation for applications.', technologies: ['PostgreSQL', 'SQL', 'AWS'], projects: ['Interngo', 'AOKAH'] },
  { name: 'AI & Machine Learning', icon: '04', description: 'Making information useful, contextual, and conversational.', technologies: ['Python', 'Generative AI', 'Large Language Models', 'LangChain', 'Retrieval-Augmented Generation', 'Prompt Engineering', 'NLP', 'Hugging Face'], projects: ['AOKAH'] },
  { name: 'Data Processing', icon: '05', description: 'Transforming raw information into usable context.', technologies: ['Pandas', 'NumPy', 'JSON'], projects: ['AOKAH'] },
  { name: 'Development Tools', icon: '06', description: 'The tools I use to build and collaborate.', technologies: ['Git', 'GitHub'], projects: [] },
];

export const ragStages = [
  ['Documents', 'Start with source information in documents and structured files.'],
  ['Extraction', 'Read text and tabular information from sources such as PDF and CSV files.'],
  ['Cleaning', 'Normalize text and remove noise to prepare useful information.'],
  ['Chunking', 'Divide information into focused passages that can be retrieved.'],
  ['Retrieval', 'Find passages relevant to the question and supply supporting context.'],
  ['LLM', 'Use the question and retrieved context to compose a structured answer.'],
  ['Response', 'Return a contextual explanation grounded in the retrieved information.'],
];

export const exampleQuestions = [
  { question: 'How can an AI assistant retrieve information about project milestones?', answer: 'A retrieval workflow first finds source passages about the requested project and its milestones. Those passages become context for the language model, which can organize the documented milestones into an answer. Missing dates or statuses should be acknowledged rather than invented.', sources: ['Retrieve relevant passages', 'Add project context', 'Generate a grounded answer'] },
  { question: 'What happens to a PDF before it becomes useful context?', answer: 'The text is extracted, cleaned, and divided into focused passages. A retrieval step can then find passages relevant to a question. The selected context is passed to a language model to support its response.', sources: ['Extract text', 'Clean and process', 'Retrieve context'] },
];
