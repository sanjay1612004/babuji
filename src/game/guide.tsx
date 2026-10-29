import { useState } from 'react';
import { ArrowRight, Compass, EyeOff, MapPin, Sparkles, Volume2, VolumeX, X } from 'lucide-react';
import { guideMessages, zones } from './config';

export function Nova({ location, next, travel, hidden, hide, reducedMotion }: { location: string; next: string; travel: () => void; hidden: boolean; hide: (value: boolean) => void; reducedMotion: boolean }) {
  const [expanded, setExpanded] = useState(true);
  const [muted, setMuted] = useState(true);
  const [message, setMessage] = useState('');
  const index = zones.findIndex(z => z.id === location);
  const text = message || (index < 0 ? 'Hey! I’m NOVA, your guide. Choose an area below or follow the glowing trail. No gaming experience needed.' : guideMessages[index]);
  function say(value: string) {
    setMessage(value);
    if (!muted && 'speechSynthesis' in window) { speechSynthesis.cancel(); speechSynthesis.speak(new SpeechSynthesisUtterance(value)); }
  }
  if (hidden) return <button className="nova-restore" onClick={() => hide(false)}><Sparkles size={18} /> Show NOVA</button>;
  return <aside className={`nova-guide ${expanded ? 'expanded' : ''}`} aria-label="NOVA navigation guide">
    <div className="nova-heading"><button className="nova-toggle" aria-expanded={expanded} onClick={() => setExpanded(!expanded)}><span className={`nova-orb ${reducedMotion ? 'still' : ''}`}><i /><i /></span><span><strong>NOVA</strong><small>Your Codeverse guide</small></span></button><button className="icon-button" aria-label={muted ? 'Enable NOVA voice' : 'Mute NOVA voice'} onClick={() => { setMuted(!muted); if ('speechSynthesis' in window) speechSynthesis.cancel(); }}>{muted ? <VolumeX size={15} /> : <Volume2 size={15} />}</button><button className="icon-button" aria-label="Hide NOVA" onClick={() => { hide(true); if ('speechSynthesis' in window) speechSynthesis.cancel(); }}><EyeOff size={15} /></button>{expanded && <button className="icon-button" aria-label="Dismiss guide bubble" onClick={() => setExpanded(false)}><X size={15} /></button>}</div>
    {expanded && <><p key={location}>{text}</p><div className="nova-help"><button onClick={() => say(`You are in ${zones.find(z => z.id === location)?.name || 'the central hub'}. Use Explore Areas to jump anywhere.`)}><MapPin size={13} /> Where am I?</button><button onClick={() => say(`Next: ${zones.find(z => z.id === next)?.name || 'the central hub'}. Select Guide me to travel there instantly.`)}>What’s next? <ArrowRight size={13} /></button><button className="nova-travel" onClick={travel}><Compass size={14} /> Guide me</button></div></>}
  </aside>;
}

const steps = [
  ['Move your way.', 'Use WASD or arrow keys to walk. Or select any labeled destination for instant travel.'],
  ['One click to discover.', 'Press E near a terminal, or click Open area. Every project and contact detail is available immediately.'],
  ['Follow the light.', 'The bright floor arrows point to your next stop. Explore Areas lets you jump anywhere.'],
  ['You’re never lost.', 'NOVA can guide you anytime. Return to Hub brings you home in one click.'],
];
export function Tutorial({ finish }: { finish: () => void }) {
  const [step, setStep] = useState(0);
  return <div className="tutorial"><span className="eyebrow">A QUICK INTRODUCTION · {step + 1} / 4</span><div className="tutorial-icon"><Compass size={36} /></div><h3>{steps[step][0]}</h3><p>{steps[step][1]}</p><div className="tutorial-dots">{steps.map((_, i) => <span key={i} className={i === step ? 'active' : ''} />)}</div><button className="btn primary" onClick={() => step === 3 ? finish() : setStep(step + 1)}>{step === 3 ? 'Let’s explore' : 'Next tip'} <ArrowRight size={16} /></button><button className="text-button" onClick={finish}>Skip tutorial</button></div>;
}
