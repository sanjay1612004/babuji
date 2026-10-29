export type ZoneId = 'identity' | 'career' | 'projects' | 'skills' | 'lab' | 'connection';
export const zones: { id: ZoneId; name: string; subtitle: string; color: string; position: [number, number]; symbol: string }[] = [
  { id: 'identity', name: 'Identity terminal', subtitle: 'Meet the developer', color: '#00D9FF', position: [-21, 7], symbol: '01' },
  { id: 'career', name: 'Career gateway', subtitle: 'Explore the journey', color: '#FF8A35', position: [-18, -18], symbol: '02' },
  { id: 'projects', name: 'Project universe', subtitle: 'Three worlds. Real work.', color: '#FF48B8', position: [5, -25], symbol: '03' },
  { id: 'skills', name: 'Skill nexus', subtitle: 'Explore the technologies', color: '#A5FF43', position: [24, -10], symbol: '04' },
  { id: 'lab', name: 'Innovation lab', subtitle: 'Stay curious', color: '#A77BFF', position: [23, 15], symbol: '05' },
  { id: 'connection', name: 'Connection portal', subtitle: 'Start a conversation', color: '#FFD95A', position: [0, 26], symbol: '06' },
];
export const missionDefinitions = [
  { id: 'identity', zone: 'identity', title: 'Discover the developer', badge: 'Developer Discovered', description: 'Explore all three engineering capabilities.' },
  { id: 'career', zone: 'career', title: 'Explore the journey', badge: 'Career Explorer', description: 'Activate both career gates.' },
  { id: 'interngo', zone: 'projects', title: 'Restore the workflow', badge: 'Workflow Architect', description: 'Connect Attendance → Performance → Analytics.' },
  { id: 'fclabs', zone: 'projects', title: 'Activate the campus', badge: 'Campus Systems Explorer', description: 'Find the incomplete workshop in a fictional campus.' },
  { id: 'aokah', zone: 'projects', title: 'Awaken the AI core', badge: 'AI Core Activated', description: 'Follow four stages and choose relevant sample context.' },
  { id: 'skills', zone: 'skills', title: 'Build the tech constellation', badge: 'Tech Constellation Builder', description: 'Connect one illustrative technology pipeline.' },
  { id: 'lab', zone: 'lab', title: 'Enter the innovation lab', badge: 'Experimental Thinker', description: 'Explore a problem tile and try the text segmenter.' },
  { id: 'connection', zone: 'connection', title: 'Open the connection gate', badge: 'Connection Gate Open', description: 'Discover the contact terminal. Sending a message is never required.' },
];
export type Quality = 'low' | 'medium' | 'high';
export type GameSettings = { quality: Quality; reducedMotion: boolean; particles: boolean; sound: boolean; remember: boolean; contrast: boolean };
export type ProgressValue = string | number | boolean | string[] | number[];
export type Progress = { completed: string[]; visited: string[]; data: Record<string, ProgressValue> };
export const emptyProgress = (): Progress => ({ completed: [], visited: [], data: {} });
export const STORAGE_KEY = 'kishore-exe-v2';
export const controls = [ ['W A S D / ↑ ↓ ← →', 'Move through the world'], ['DRAG', 'Orbit the camera'], ['SHIFT', 'Sprint'], ['SPACE', 'Jump'], ['E / ENTER', 'Interact nearby'], ['M', 'World map'], ['J / TAB', 'Mission journal'], ['ESC', 'Pause / close panel'], ['R', 'Reset camera'], ['H', 'Hide / show HUD'] ];
export const workflowModules = ['Attendance', 'Performance', 'Analytics'];
export const skillPipelines = { 'Full-stack': ['React', 'Node.js', 'Fastify', 'PostgreSQL'], 'AI workflow': ['Python', 'LangChain', 'RAG', 'LLM'] };
export const campusStudents = [
  { id: 'alex', name: 'Alex R.', workshop: 'React Studio', trainer: 'Mira', days: 5, completed: true, score: 82 },
  { id: 'sam', name: 'Sam K.', workshop: 'API Workshop', trainer: 'Dev', days: 4, completed: true, score: 94 },
  { id: 'jamie', name: 'Jamie M.', workshop: 'React Studio', trainer: 'Mira', days: 3, completed: false, score: 68 },
];
export const sampleSources = {
  PDF: 'PROJECT ATLAS\n\nMilestone M2:   Prototype review\nScheduled: 18 November 2026.\n\nProject Orion: Data migration on 27 November 2026.',
  CSV: 'project,milestone,event,date\nAtlas,M2,Prototype review,18 November 2026\nOrion,M4,Data migration,27 November 2026',
};
export const contextFragments = [
  { id: 'orion', text: 'Project Orion · Data migration · 27 November 2026.', relevant: false, explanation: 'This passage describes another project. Matching a date alone is not enough.' },
  { id: 'atlas-review', text: 'Project Atlas · Milestone M2 · Prototype review · 18 November 2026.', relevant: true, explanation: 'This passage matches both the project and the requested milestone.' },
  { id: 'atlas-kickoff', text: 'Project Atlas · Team kickoff · 4 November 2026.', relevant: false, explanation: 'The project matches, but the kickoff is a different event from the prototype review.' },
];

export const zoneLabels = ['About me', 'My journey', 'My projects', 'My skills', 'My lab', 'Contact me'];
export const guideMessages = [
  'This is where Kishore’s story begins. Read his profile or explore Frontend, Backend, and AI.',
  'From a developer internship to full-stack development. Select either career station to explore.',
  'Three projects, three different challenges. Read any case study or try a short optional demo.',
  'Explore six technology groups. Select a technology to see its related projects.',
  'An AI and Machine Learning degree, plus two small experiments. Try a problem tile or the text segmenter.',
  'You’ve reached the connection portal. Send an email or copy Kishore’s details whenever you’re ready.',
];
