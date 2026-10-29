import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowUpRight, ArrowRight, ArrowDown, ArrowUp, Menu, X, Plus, Minus, MapPin, Copy, Check, Code2, Braces, Network, Cpu, Layers3, Database, Cloud, GitBranch, GraduationCap, Mail, Command, Search, LayoutDashboard, Users, CalendarDays, ChartNoAxesCombined, FolderOpen, LifeBuoy, Send, Sparkles, FileText, ChevronRight, Terminal, ExternalLink } from 'lucide-react';
import { profile, chapters, experiences, projects, capabilities, ragStages, exampleQuestions } from './content';
import './styles.css';

type IconType = typeof Code2;

function Icon({ icon: Component, size = 20 }: { icon: IconType; size?: number }) { return <Component size={size} strokeWidth={1.5} aria-hidden="true" />; }
function Tags({ items }: { items: string[] }) { return <div className="tags">{items.map(item => <span key={item}>{item}</span>)}</div>; }
function Chapter({ n, label, light = false }: { n: string; label: string; light?: boolean }) { return <div className={`chapter ${light ? 'light' : ''}`}><span className="chapter-square" /><span>{n} / {label}</span><span className="chapter-rule" /></div>; }

function TabBar({ id, labels, active, onChange }: { id: string; labels: string[]; active: number; onChange: (index: number) => void }) {
  function keyboard(event: React.KeyboardEvent, index: number) {
    let next = index;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % labels.length;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + labels.length) % labels.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = labels.length - 1;
    else return;
    event.preventDefault(); onChange(next); document.getElementById(`${id}-tab-${next}`)?.focus();
  }
  return <div className="tabbar" role="tablist" aria-label={id.replaceAll('-', ' ')}>{labels.map((label, i) => <button key={label} id={`${id}-tab-${i}`} role="tab" aria-selected={active === i} aria-controls={`${id}-panel-${i}`} tabIndex={active === i ? 0 : -1} onClick={() => onChange(i)} onKeyDown={e => keyboard(e, i)}>{label}</button>)}</div>;
}

function Navigation({ command }: { command: () => void }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const onScroll = () => { setScrolled(window.scrollY > 30); document.documentElement.style.setProperty('--progress', `${window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight) * 100}%`); };
    window.addEventListener('scroll', onScroll, { passive: true });
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) setActive(entry.target.id); }), { rootMargin: '-20% 0px -55% 0px' });
    chapters.forEach(c => { const el = document.getElementById(c.id); if (el) observer.observe(el); });
    return () => { window.removeEventListener('scroll', onScroll); observer.disconnect(); };
  }, []);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); toggleRef.current?.focus(); } };
    const onClick = (e: PointerEvent) => { if (!navRef.current?.contains(e.target as Node)) setOpen(false); };
    window.addEventListener('keydown', onKey); window.addEventListener('pointerdown', onClick);
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('pointerdown', onClick); };
  }, [open]);
  return <header className={`site-header ${scrolled ? 'scrolled' : ''}`}><nav ref={navRef} className="nav-shell" aria-label="Main navigation">
    <a href="#top" className="brand" aria-label="Kishorebabu, back to top">k<span>.</span><span className="brand-name">KISHOREBABU S</span></a>
    <div className={`nav-links ${open ? 'open' : ''}`} id="main-links">{chapters.map(c => <a key={c.id} href={`#${c.id}`} aria-current={active === c.id ? 'location' : undefined} onClick={() => setOpen(false)}>{c.short}</a>)}</div>
    <div className="nav-actions"><button className="command-button" onClick={command} aria-label="Open command menu"><Icon icon={Command} size={15} /><span>K</span></button><a href="#contact" className="nav-contact">Let’s talk <Icon icon={ArrowUpRight} size={16} /></a><button ref={toggleRef} className="menu-toggle" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls="main-links" onClick={() => setOpen(!open)}><Icon icon={open ? X : Menu} /></button></div>
  </nav></header>;
}

function Hero() {
  const scene = useRef<HTMLDivElement>(null);
  const [portraitLoaded, setPortraitLoaded] = useState(true);
  useEffect(() => {
    const node = scene.current; if (!node || matchMedia('(prefers-reduced-motion: reduce)').matches || window.innerWidth < 768) return;
    let cleanup: (() => void) | undefined; let canceled = false;
    const start = window.setTimeout(() => { import('./scene').then(({ mountScene }) => { if (!canceled) cleanup = mountScene(node); }).catch(() => {}); }, 350);
    return () => { canceled = true; clearTimeout(start); cleanup?.(); };
  }, []);
  return <section className="hero" id="top" aria-labelledby="hero-title">
    <div className="hero-grid" aria-hidden="true" /><div className="hero-glow" aria-hidden="true" />
    <div className="hero-topline"><span className="mono"><span className="status-dot" /> THE INTERSECTION OF CODE & CURIOSITY</span><span className="mono hero-edition">PORTFOLIO — VOL. 2026</span></div>
    <div className="hero-layout"><div className="hero-copy"><p className="eyebrow hero-intro">HELLO, I’M</p><h1 id="hero-title">KISHORE<span>BABU S<span className="title-star" aria-hidden="true">✳</span></span></h1><div className="role-line"><span className="role-dash" /><span>FULL-STACK DEVELOPER <b>/</b> AI ENGINEER</span></div><p className="hero-description">Beyond the interface.<br /><span>I build complete web applications, connect complex workflows, and develop AI-powered experiences.</span></p><div className="hero-ctas"><a className="button button-primary" href="#work">Explore my work <Icon icon={ArrowUpRight} /></a><a className="button button-text" href="#contact">Get in touch <Icon icon={ArrowRight} size={17} /></a></div><p className="hero-location"><Icon icon={MapPin} size={14} /> Based in Coimbatore, India <span>11.0168° N, 76.9558° E</span></p></div>
      <div className="hero-art"><div className="orbital orbital-one" /><div className="orbital orbital-two" /><div className="scene" ref={scene} aria-hidden="true" /><div className="portrait-frame"><div className="portrait-halo" />{portraitLoaded ? <img className="portrait" src={profile.portrait} alt="Kishorebabu S wearing glasses and a light blue shirt" width="907" height="1085" fetchPriority="high" onError={() => setPortraitLoaded(false)} /> : <div className="portrait-fallback" aria-label="Kishorebabu S"><Code2 size={100} strokeWidth={.6} /><span>KS</span></div>}<div className="portrait-shade" /></div><span className="floating-tag tag-react"><Icon icon={Braces} size={17} /> build.interface()</span><span className="floating-tag tag-ai"><span className="status-dot" /> intelligence.connect()</span><div className="portrait-caption"><span className="caption-icon"><Icon icon={Code2} size={22} /></span><div><strong>Human behind the systems.</strong><span>ENGINEERING WITH INTENTION</span></div><span className="caption-plus">+</span></div><div className="art-coordinate mono">SYS.01 <span>↗</span> HUMAN × TECHNOLOGY</div></div>
    </div><div className="hero-bottom"><a href="#about" className="scroll-link"><span className="scroll-icon"><Icon icon={ArrowDown} size={14} /></span> SCROLL TO EXPLORE</a><span className="mono">GOOD THINGS HAPPEN AT THE INTERSECTION.</span><span className="hero-index mono">01 <span>/ 06</span></span></div>
  </section>;
}

const systemNodes = [
  { title: 'Frontend', tech: 'React', icon: Code2, text: 'Interfaces built with React, Astro, and a thoughtful approach to user experience.' },
  { title: 'Backend', tech: 'Fastify', icon: Braces, text: 'Node.js and Fastify services that connect application workflows and integrations.' },
  { title: 'Data', tech: 'PostgreSQL', icon: Database, text: 'Structured application data with PostgreSQL and SQL.' },
  { title: 'Cloud', tech: 'AWS', icon: Cloud, text: 'Application deployment on AWS, including the Interngo platform.' },
  { title: 'Intelligence', tech: 'Python + RAG', icon: Sparkles, text: 'Python data processing and retrieval-augmented workflows that turn information into contextual answers.' },
];
function About() {
  const [node, setNode] = useState(0);
  return <><div className="manifesto-strip" aria-label="Build. Connect. Intelligence."><span>BUILD<span className="strip-dot">.</span></span><span className="strip-cross">✳</span><span>CONNECT<span className="strip-dot">.</span></span><span className="strip-cross">✳</span><span>INTELLIGENCE<span className="strip-dot">.</span></span><Icon icon={ArrowUpRight} size={48} /></div><section id="about" className="section about-section"><Chapter n="01" label="THE DEVELOPER" /><div className="about-layout"><div><h2>More than<br />just <em>code.</em></h2><p className="section-lead">Building systems that work.<br />Creating experiences that matter.</p><p className="body-copy">I’m Kishorebabu, a full-stack developer and AI engineer in Coimbatore. I work across the whole picture — from the first interface to the services and intelligence behind it.</p><p className="body-copy">My experience spans intern management systems, campus administration platforms, and retrieval-augmented conversational AI. Different challenges. One connected way of thinking.</p><a href="#experience" className="inline-link">A little about the journey <Icon icon={ArrowDown} size={16} /></a></div><div className="system-map"><div className="map-header mono"><span><span className="status-dot" /> A CONNECTED WAY OF THINKING</span><Icon icon={Network} size={17} /></div><div className="map-orbits" aria-hidden="true"><div /><div /><div /></div><div className="system-core"><span>k.</span><small>IDEA → EXPERIENCE</small></div><div className="system-nodes">{systemNodes.map((n, i) => <button key={n.title} className={`system-node node-${i} ${node === i ? 'selected' : ''}`} onClick={() => setNode(i)} aria-pressed={node === i}><Icon icon={n.icon} /><span>{n.title}</span><small>{n.tech}</small></button>)}</div><div className="map-description" aria-live="polite"><span className="mono">{String(node + 1).padStart(2, '0')} / {systemNodes[node].title.toUpperCase()}</span><p>{systemNodes[node].text}</p></div><p className="illustration-label">CAPABILITY MAP · SELECT A NODE TO EXPLORE</p></div></div></section></>;
}

function Experience() {
  const [active, setActive] = useState(0);
  return <section id="experience" className="section experience-section"><Chapter n="02" label="THE JOURNEY" /><div className="section-heading-row"><h2>The journey<br /><em>so far.</em></h2><p>Learning by building.<br />Growing with every challenge.</p></div><div className="experience-layout"><div className="experience-track">{experiences.map((e, i) => <button key={e.company} className={`experience-stop ${active === i ? 'selected' : ''}`} onClick={() => setActive(i)} aria-expanded={active === i} aria-controls={`experience-${i}`}><span className="timeline-point" /><span className="mono">{e.date}</span><strong>{e.company}</strong><span>{e.role}</span>{e.current && <span className="current-label"><span className="status-dot" /> CURRENT CHAPTER</span>}<span className="stop-arrow"><Icon icon={active === i ? Minus : Plus} /></span></button>)}</div><div className="experience-panels">{experiences.map((e, i) => <article id={`experience-${i}`} key={e.company} hidden={active !== i} className="experience-panel"><div className="panel-top"><span className="mono">EXPERIENCE.LOG</span><Icon icon={Terminal} size={18} /></div><span className="experience-number">0{2 - i}</span><div className="experience-content"><span className="mono lime">{e.company.toUpperCase()}</span><h3>{e.role}</h3><p>{e.description}</p><ul className="clean-list">{e.contributions.map(c => <li key={c}><Icon icon={ArrowUpRight} size={14} />{c}</li>)}</ul><Tags items={e.tags} /></div></article>)}</div></div></section>;
}

const internModules = [
  { label: 'Performance', icon: ChartNoAxesCombined, title: 'A clear view of progress.', text: 'Bring intern performance and daily updates into one connected workspace.', columns: ['Intern', 'Learning track', 'Latest update'], rows: [['Alex R.', 'Frontend', 'Submitted'], ['Sam K.', 'Backend', 'In review'], ['Jordan M.', 'Full-stack', 'Submitted']] },
  { label: 'Attendance', icon: CalendarDays, title: 'Every day, accounted for.', text: 'Review attendance records and keep day-to-day intern activity organized.', columns: ['Intern', 'Check-in', 'Status'], rows: [['Alex R.', '09:15', 'Present'], ['Sam K.', '09:20', 'Present'], ['Jordan M.', '—', 'On leave']] },
  { label: 'Resources', icon: FolderOpen, title: 'Knowledge, within reach.', text: 'Keep shared learning materials and helpful resources together.', columns: ['Resource', 'Category', 'Format'], rows: [['React essentials', 'Frontend', 'Guide'], ['API patterns', 'Backend', 'Document'], ['SQL fundamentals', 'Database', 'Guide']] },
  { label: 'Helpdesk', icon: LifeBuoy, title: 'Questions find their way.', text: 'Organize help requests so interns can keep moving through their work.', columns: ['Topic', 'Area', 'Status'], rows: [['Environment setup', 'Development', 'Open'], ['API clarification', 'Backend', 'In review'], ['Resource access', 'Learning', 'Resolved']] },
  { label: 'Analytics', icon: LayoutDashboard, title: 'Activity into perspective.', text: 'Review learning activity and attendance through a unified analytics view.', columns: ['View', 'Focus', 'Period'], rows: [['Attendance', 'Daily activity', 'This week'], ['Performance', 'Learning progress', 'This month'], ['Helpdesk', 'Support activity', 'This week']] },
  { label: 'Integrations', icon: GitBranch, title: 'The workflow keeps flowing.', text: 'Illustrating automatic EOD updates to Slack and interaction scheduling with Meet and email.', columns: ['Workflow', 'Connection', 'Action'], rows: [['EOD update', 'Slack', 'Post update'], ['Interaction', 'Google Meet', 'Schedule'], ['Invitation', 'Email', 'Notify']] },
];
function InterngoPreview() {
  const [active, setActive] = useState(0);
  const m = internModules[active];
  return <div className="product-preview interngo-preview"><div className="preview-top"><span className="window-dots"><i /><i /><i /></span><span className="mono">INTERNGO / WORKSPACE</span><span className="demo-label">ILLUSTRATIVE CONCEPT</span></div><div className="dashboard-shell"><aside className="dashboard-sidebar"><div className="product-logo"><span>i</span> interngo<span className="logo-period">.</span></div><span className="sidebar-heading mono">WORKSPACE</span>{internModules.map((mod, i) => <button key={mod.label} aria-pressed={active === i} onClick={() => setActive(i)} className={active === i ? 'active' : ''}><Icon icon={mod.icon} size={15} /><span>{mod.label}</span></button>)}<div className="sidebar-footer"><span className="avatar">KS</span><span>Kishorebabu S<small>Developer</small></span></div></aside><div className="dashboard-content" aria-live="polite"><div className="dashboard-breadcrumb">Workspace <ChevronRight size={11} /> {m.label}<span className="tiny-avatar">K</span></div><div className="dashboard-title"><div><span className="mono">A CONNECTED INTERN EXPERIENCE</span><h4>{m.title}</h4><p>{m.text}</p></div><span className="dashboard-date"><CalendarDays size={12} /> Demo workspace</span></div><div className="dashboard-widgets"><div className="activity-widget"><div><span>Learning activity</span><span className="chart-pill">THIS WEEK</span></div><div className="bar-chart">{[35, 55, 42, 75, 58, 85, 68, 92, 73, 85, 65, 96].map((h, i) => <span key={i} style={{ height: `${h}%` }} />)}</div><div className="chart-axis"><span>MON</span><span>WED</span><span>FRI</span><span>SUN</span></div></div><div className="workflow-widget"><span>Connected workflows</span><div className="mini-workflow"><span><Icon icon={FileText} size={16} /></span><i /><span><Icon icon={GitBranch} size={16} /></span><i /><span><Icon icon={Send} size={16} /></span></div><strong>Update. Connect. Deliver.</strong><p>EOD updates → Slack</p></div></div><div className="demo-table"><div className="demo-table-heading">{m.label} overview <span>EXAMPLE DATA</span></div><table><thead><tr>{m.columns.map(c => <th key={c}>{c}</th>)}</tr></thead><tbody>{m.rows.map(row => <tr key={row[0]}>{row.map((cell, i) => <td key={cell}>{i === 0 && <span className="table-dot" />}{i === 2 ? <span className="table-status">{cell}</span> : cell}</td>)}</tr>)}</tbody></table></div></div></div></div>;
}

const campusModules = [
  { label: 'Campus overview', title: 'A campus. In perspective.', description: 'A single view to review learning activity across trainers, workshops, and students.', icon: LayoutDashboard },
  { label: 'Trainers', title: 'Follow the people teaching.', description: 'Trainer monitoring interfaces bring workshop assignments and campus learning activity into view.', icon: Users },
  { label: 'Workshops', title: 'See learning in motion.', description: 'Follow workshop participation and elapsed days, and identify students who have not yet completed a workshop.', icon: CalendarDays },
  { label: 'Performance', title: 'Make progress visible.', description: 'Analytics interfaces help administrators review completion and identify top-performing students.', icon: ChartNoAxesCombined },
];
function CampusPreview() {
  const [active, setActive] = useState(0);
  return <div className="product-preview campus-preview"><div className="preview-top"><span className="campus-brand"><Layers3 size={17} /> FC LABS</span><span className="demo-label">ILLUSTRATIVE CONCEPT</span><span className="campus-window mono">CAMPUS / 01</span></div><TabBar id="campus" labels={campusModules.map(m => m.label)} active={active} onChange={setActive} />{campusModules.map((m, i) => <div key={m.label} id={`campus-panel-${i}`} role="tabpanel" aria-labelledby={`campus-tab-${i}`} tabIndex={0} hidden={active !== i} className="campus-panel"><div className="campus-headline"><span className="mono">LEARNING, CONNECTED.</span><h4>{m.title}</h4><p>{m.description}</p></div><div className="campus-visual"><div className="campus-ring"><svg viewBox="0 0 160 160" aria-hidden="true"><circle cx="80" cy="80" r="65" /><circle className="ring-highlight" cx="80" cy="80" r="65" /></svg><div><Icon icon={m.icon} size={26} /><strong>{m.label}</strong><small>CONNECTED VIEW</small></div></div><div className="campus-tracks">{['Workshop participation', 'Trainer activity', 'Student completion'].map((label, j) => <div key={label}><span>{label}<ArrowUpRight size={12} /></span><div className="track-segments">{Array.from({ length: 15 }, (_, k) => <i key={k} className={(k + i) % (j + 3) ? 'filled' : ''} />)}</div></div>)}<span className="illustration-label">CONCEPTUAL ACTIVITY VISUALIZATION</span></div></div></div>)}</div>;
}

function AIPreview() {
  const [stage, setStage] = useState(4);
  const [question, setQuestion] = useState<number | null>(null);
  return <div className="product-preview ai-preview"><div className="preview-top"><span className="ai-brand"><Sparkles size={17} /> AOKAH <span>/ CONTEXT ENGINE</span></span><span className="demo-label">ILLUSTRATIVE AI DEMO</span></div><div className="ai-body"><div className="ai-flow"><div className="ai-eyebrow mono"><span className="status-dot violet-dot" /> FROM INFORMATION TO UNDERSTANDING</div><div className="rag-stages">{ragStages.map(([name], i) => <React.Fragment key={name}><button className={stage === i ? 'selected' : ''} aria-pressed={stage === i} onClick={() => setStage(i)}><span className="rag-stage-number">0{i + 1}</span><Icon icon={i === 0 ? FileText : i === 4 ? Search : i === 5 ? Cpu : i === 6 ? Sparkles : Layers3} size={18} /><span>{name}</span></button>{i < ragStages.length - 1 && <span className="rag-connector" aria-hidden="true" />}</React.Fragment>)}</div><div className="rag-explanation" aria-live="polite"><strong>{ragStages[stage][0]}</strong><span>{ragStages[stage][1]}</span></div><p className="illustration-label">EXPLANATORY RAG WORKFLOW · SELECT A STAGE</p></div><div className="ai-conversation"><div className="ai-conversation-header"><span><Sparkles size={16} /> A little context goes a long way.</span><span className="mono">PREDEFINED DEMO</span></div>{question === null ? <div className="ai-welcome"><div className="ai-orb"><Sparkles size={25} /></div><h4>Ask better. Find context.</h4><p>Explore how retrieval can support a contextual response.</p></div> : <div className="conversation-answer" aria-live="polite"><p className="user-question">{exampleQuestions[question].question}</p><div className="assistant-answer"><Sparkles size={17} /><p>{exampleQuestions[question].answer}</p></div><div className="response-sources">{exampleQuestions[question].sources.map(s => <span key={s}><Check size={10} /> {s}</span>)}</div></div>}<div className="example-questions"><span className="mono">TRY AN EXAMPLE QUESTION</span>{exampleQuestions.map((q, i) => <button key={q.question} onClick={() => setQuestion(i)}>{q.question}<ArrowUpRight size={14} /></button>)}</div><p className="ai-disclaimer">Simulated examples. No connection to the actual AOKAH platform.</p></div></div></div>;
}

function ProjectShowcase({ project, children }: { project: typeof projects[number]; children: React.ReactNode }) {
  const [expanded, setExpanded] = useState(false);
  return <article className={`project-showcase theme-${project.theme}`} id={`project-${project.id}`}><div className="project-intro"><div><span className="project-index mono">{project.number} / {project.category}</span><h3>{project.name}<span>↗</span></h3></div><p>{project.summary}</p></div>{children}<div className="project-bottom"><div><span className="ownership"><Icon icon={Code2} size={15} />{project.ownership}</span><Tags items={project.tags} /></div><button className="project-expand" onClick={() => setExpanded(!expanded)} aria-expanded={expanded} aria-controls={`${project.id}-case-study`}>{expanded ? 'Close case study' : 'Explore the project'}<span><Icon icon={expanded ? Minus : ArrowUpRight} size={21} /></span></button></div><div id={`${project.id}-case-study`} className="case-study" hidden={!expanded}><div><span className="mono">THE IDEA</span><h4>{project.headline}</h4><p>{project.description}</p><span className="mono case-label">MY CONTRIBUTIONS</span><ul className="clean-list">{project.contributions.map(c => <li key={c}><ArrowUpRight size={15} />{c}</li>)}</ul></div><div><span className="mono">THE TOOLKIT</span><Tags items={project.stack} /><span className="mono case-label">{project.id === 'aokah' ? 'EXPLANATORY RAG FLOW' : 'ILLUSTRATIVE WORKFLOW'}</span><div className="case-workflow">{project.workflow.map((step, i) => <div key={step}><span>0{i + 1}</span>{step}{i < project.workflow.length - 1 && <ArrowDown size={14} />}</div>)}</div><p className="illustration-label">Visuals are interface concepts and explanatory illustrations, not verified application screenshots.{project.id === 'fclabs' && ' Backend technologies describe the project stack; my contribution was frontend development.'}</p>{/^https:\/\//.test(project.url) && <a className="inline-link" href={project.url} target="_blank" rel="noopener noreferrer">Visit project <ExternalLink size={14} /></a>}</div></div></article>;
}
function Work() { return <section id="work" className="section work-section"><Chapter n="03" label="SELECTED WORK" /><div className="section-heading-row"><h2>Ideas, made<br /><em>real.</em><span className="heading-period">↗</span></h2><div className="work-heading-copy"><p>Different problems.<br />Thoughtfully connected solutions.</p><span className="mono">THREE PROJECTS. MANY POSSIBILITIES.</span></div></div><ProjectShowcase project={projects[0]}><InterngoPreview /></ProjectShowcase><ProjectShowcase project={projects[1]}><CampusPreview /></ProjectShowcase><ProjectShowcase project={projects[2]}><AIPreview /></ProjectShowcase></section>; }

function Skills() {
  const [active, setActive] = useState(0);
  const icons = [Code2, Braces, Database, Cpu, Layers3, GitBranch];
  return <section id="skills" className="section skills-section"><Chapter n="04" label="THE TOOLKIT" /><div className="section-heading-row"><h2>The tools behind<br />the <em>thinking.</em></h2><p>Not a list of percentages.<br />A connected set of possibilities.</p></div><div className="skills-layout"><div className="skill-categories" role="tablist" aria-label="Skill categories" aria-orientation="vertical">{capabilities.map((c, i) => <button key={c.name} role="tab" id={`skill-tab-${i}`} aria-controls={`skill-panel-${i}`} aria-selected={i === active} tabIndex={i === active ? 0 : -1} onClick={() => setActive(i)} onKeyDown={e => { let next = i; if (e.key === 'ArrowDown') next = (i + 1) % capabilities.length; else if (e.key === 'ArrowUp') next = (i - 1 + capabilities.length) % capabilities.length; else if (e.key === 'Home') next = 0; else if (e.key === 'End') next = capabilities.length - 1; else return; e.preventDefault(); setActive(next); document.getElementById(`skill-tab-${next}`)?.focus(); }}><span className="mono">{c.icon}</span><Icon icon={icons[i]} /><strong>{c.name}</strong><ArrowUpRight size={18} /></button>)}</div><div className="skill-panels">{capabilities.map((c, i) => <div key={c.name} id={`skill-panel-${i}`} role="tabpanel" aria-labelledby={`skill-tab-${i}`} hidden={active !== i} tabIndex={0} className="skill-panel"><div className="skill-panel-top"><Icon icon={icons[i]} size={35} /><span className="mono">CAPABILITY / {c.icon}</span></div><h3>{c.name}</h3><p>{c.description}</p><div className="technology-cloud">{c.technologies.map((t, j) => <span key={t} style={{ animationDelay: `${j * 35}ms` }}><span className="tech-marker">{j % 2 ? '◇' : '⌘'}</span>{t}</span>)}</div>{c.projects.length > 0 ? <div className="connected-projects"><span className="mono"><GitBranch size={13} /> PUT TO WORK IN</span>{c.projects.map(p => <a href={`#project-${projects.find(project => project.name === p)?.id}`} key={p}>{p}<ArrowUpRight size={14} /></a>)}</div> : <div className="connected-projects"><span className="mono"><GitBranch size={13} /> DEVELOPMENT & COLLABORATION</span></div>}</div>)}</div></div><div className="education" id="education"><div className="education-symbol"><GraduationCap size={48} strokeWidth={1} /><span className="mono">FOUNDATION / 2026</span></div><div><span className="mono lime">WHERE THE FOUNDATION WAS BUILT</span><h3>B.Tech — Artificial Intelligence<br />and Machine Learning</h3><p>Hindusthan College of Engineering and Technology</p><span className="education-location"><MapPin size={13} /> Coimbatore, Tamil Nadu, India</span></div><span className="graduation-year">’26</span></div></section>;
}

const problems = [
  { name: 'Two Sum', category: 'Arrays', level: 'Easy' }, { name: 'Valid Anagram', category: 'Strings', level: 'Easy' }, { name: 'Merge Intervals', category: 'Arrays', level: 'Medium' },
  { name: 'Binary Search', category: 'Search', level: 'Easy' }, { name: 'Group Anagrams', category: 'Strings', level: 'Medium' }, { name: 'Search a 2D Matrix', category: 'Search', level: 'Medium' },
];
function Playground() {
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState<string | null>(null);
  const [text, setText] = useState('Building intelligent experiences');
  const tokens = text.match(/[\p{L}\p{N}]+|[^\s\p{L}\p{N}]/gu) ?? [];
  return <section id="playground" className="section playground-section"><Chapter n="05" label="BEYOND THE CODE" /><div className="section-heading-row"><h2>Curiosity doesn’t<br /><em>clock out.</em><span className="small-star">✳</span></h2><p>A place to experiment,<br />take things apart, and try again.</p></div><div className="experiments"><article className="experiment grid-experiment"><div className="experiment-heading"><span className="mono">EXPERIMENT / 01</span><Icon icon={LayoutDashboard} size={21} /></div><h3>LeetCode Grid Viewer<span>↗</span></h3><p>A different perspective on problem solving.</p><div className="problem-filters" aria-label="Filter example problems">{['All', 'Arrays', 'Strings', 'Search'].map(f => <button key={f} aria-pressed={filter === f} onClick={() => { setFilter(f); setSelected(null); }}>{f}</button>)}</div><div className="problem-grid">{problems.filter(p => filter === 'All' || p.category === filter).map((p, i) => <button key={p.name} onClick={() => setSelected(p.name)} aria-pressed={selected === p.name}><span className="mono">{String(problems.indexOf(p) + 1).padStart(2, '0')}<span className={p.level.toLowerCase()}>{p.level}</span></span><strong>{p.name}</strong><span>{p.category}<ArrowUpRight size={13} /></span></button>)}</div><p className="experiment-note" aria-live="polite">{selected ? `${selected} selected · illustrative problem explorer, not connected to LeetCode.` : 'INTERACTIVE CONCEPT · EXAMPLE PROBLEMS'}</p></article><article className="experiment token-experiment"><div className="experiment-heading"><span className="mono">EXPERIMENT / 02</span><Icon icon={Braces} size={22} /></div><h3>Tokenizer<span>↗</span></h3><p>A closer look at the pieces of language.</p><label htmlFor="token-input" className="mono">GIVE IT A FEW WORDS</label><div className="token-input-wrap"><textarea id="token-input" value={text} maxLength={240} onChange={e => setText(e.target.value)} spellCheck={false} /><span className="mono">{text.length}/240</span></div><div className="token-output-header mono"><span>ILLUSTRATIVE OUTPUT</span><span>{tokens.length} SEGMENTS</span></div><div className="token-output" aria-live="polite">{tokens.length ? tokens.map((token, i) => <span key={`${i}-${token}`} className={`token token-${i % 4}`}>{token}<small>{String(i).padStart(2, '0')}</small></span>) : <span className="empty-tokens">Type something to see its pieces.</span>}</div><p className="experiment-note">Word & punctuation splitting. Not a model-specific tokenizer.</p></article></div></section>;
}

function Contact({ copy }: { copy: (all?: boolean) => void }) {
  return <section id="contact" className="contact-section"><div className="section"><Chapter n="06" label="LET’S CONNECT" /><div className="contact-top"><span className="mono"><span className="status-dot" /> GOOD WORK STARTS WITH A CONVERSATION</span><Icon icon={ArrowUpRight} size={65} /></div><h2>Have something<br />worth <em>building?</em></h2><div className="contact-bottom"><p>Let’s connect and turn ideas into applications,<br />workflows, and intelligent experiences.</p><a className="button button-primary" href={`mailto:${profile.email}`}>Let’s talk <Icon icon={ArrowUpRight} size={23} /></a></div><div className="contact-details"><div><a className="email-address" href={`mailto:${profile.email}`}>{profile.email}</a><button className="copy-icon" onClick={() => copy()} aria-label="Copy email address"><Copy size={17} /></button></div><button className="copy-details" onClick={() => copy(true)}>Copy contact details<Copy size={14} /></button><span className="contact-location"><MapPin size={14} /> Coimbatore, India</span></div>{Object.entries(profile.socials).some(([,url]) => /^https:\/\//.test(url)) && <div className="social-links">{Object.entries(profile.socials).filter(([,url]) => /^https:\/\//.test(url)).map(([name,url]) => <a key={name} href={url} target="_blank" rel="noopener noreferrer">{name}<ArrowUpRight size={16} /></a>)}</div>}<footer><a href="#top" className="footer-brand">k<span>.</span></a><p>© {new Date().getFullYear()} Kishorebabu S <span>FULL-STACK DEVELOPER / AI ENGINEER</span></p><a href="#top" className="back-top">Back to top <ArrowUp size={16} /></a></footer></div></section>;
}

function CommandMenu({ open, close, copy }: { open: boolean; close: () => void; copy: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [search, setSearch] = useState('');
  useEffect(() => { if (open) { setSearch(''); dialog.current?.showModal(); } else dialog.current?.close(); }, [open]);
  const actions = [...chapters.map(c => ({ label: `Go to ${c.short}`, action: () => { location.hash = c.id; close(); } })), { label: 'Jump to Education', action: () => { location.hash = 'education'; close(); } }, { label: 'Copy Email', action: () => { copy(); close(); } }].filter(a => a.label.toLowerCase().includes(search.toLowerCase()));
  return <dialog ref={dialog} className="command-dialog" aria-labelledby="command-title" onCancel={close} onClick={e => { if (e.target === e.currentTarget) close(); }}><div className="command-search"><Search size={18} /><label id="command-title" className="sr-only" htmlFor="command-search">Find a chapter or action</label><input id="command-search" placeholder="Where would you like to go?" value={search} onChange={e => setSearch(e.target.value)} /><button onClick={close} aria-label="Close command menu"><X size={18} /></button></div><div className="command-list">{actions.length ? actions.map(a => <button key={a.label} onClick={a.action}><span>{a.label}</span><ArrowUpRight size={16} /></button>) : <p>No matching actions. Try “work” or “email”.</p>}</div><div className="command-footer mono"><span>QUICK NAVIGATION</span><span>ESC TO CLOSE</span></div></dialog>;
}

function App() {
  const [command, setCommand] = useState(false);
  const [toast, setToast] = useState('');
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => {
    const keyboard = (e: KeyboardEvent) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setCommand(v => !v); } };
    window.addEventListener('keydown', keyboard);
    const observer = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in-view'); observer.unobserve(e.target); } }), { threshold: .08 });
    document.querySelectorAll('.section-heading-row, .about-layout, .experience-layout, .project-showcase, .skills-layout, .education, .experiment').forEach(el => { el.classList.add('reveal-ready'); observer.observe(el); });
    return () => { window.removeEventListener('keydown', keyboard); observer.disconnect(); clearTimeout(toastTimer.current); };
  }, []);
  useEffect(() => {
    if (!matchMedia('(pointer:fine) and (prefers-reduced-motion:no-preference)').matches) return;
    const onMove = (e: PointerEvent) => { document.documentElement.style.setProperty('--pointer-x', `${e.clientX}px`); document.documentElement.style.setProperty('--pointer-y', `${e.clientY}px`); };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);
  async function copy(all = false) {
    const value = all ? `${profile.name}\n${profile.role}\n${profile.location}\n${profile.email}` : profile.email;
    let success = false;
    try { await navigator.clipboard.writeText(value); success = true; } catch {
      const textarea = document.createElement('textarea'); textarea.value = value; textarea.style.cssText = 'position:fixed;left:-9999px'; document.body.appendChild(textarea); textarea.select(); success = document.execCommand('copy'); textarea.remove();
    }
    setToast(success ? (all ? 'Contact details copied.' : 'Email address copied.') : `Copy this email: ${profile.email}`); clearTimeout(toastTimer.current); toastTimer.current = setTimeout(() => setToast(''), 4500);
  }
  return <><a className="skip-link" href="#about">Skip to main content</a><div className="page-progress" aria-hidden="true" /><div className="cursor-light" aria-hidden="true" /><Navigation command={() => setCommand(true)} /><main><Hero /><About /><Experience /><Work /><Skills /><Playground /><Contact copy={copy} /></main><CommandMenu open={command} close={() => setCommand(false)} copy={copy} /><div role="status" className={`toast ${toast ? 'visible' : ''}`}><Check size={17} />{toast}</div></>;
}

createRoot(document.getElementById('root')!).render(<App />);
