type P = { className?: string };
const base = { fill: "none", stroke: "currentColor", strokeWidth: 2.2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
export const IconLearn = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z" /><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5" /><path d="M9 8h7M9 12h5" /></svg>
);
export const IconArena = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><path d="M13 2 4 14h7l-1 8 9-12h-7z" /></svg>
);
export const IconRank = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><path d="M8 21V11H3v10zM15 21V5h-6v16zM21 21v-7h-6v7z" /></svg>
);
export const IconMe = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>
);
export const IconClose = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><path d="M6 6l12 12M18 6 6 18" /></svg>
);
export const IconBack = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><path d="M15 5l-7 7 7 7" /></svg>
);
export const IconStar = ({ className, filled }: P & { filled?: boolean }) => (
  <svg viewBox="0 0 24 24" className={className} fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} strokeLinejoin="round"><path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" /></svg>
);
export const IconLock = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>
);
export const IconSound = ({ className, off }: P & { off?: boolean }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><path d="M4 9v6h4l5 4V5L8 9z" />{off ? <path d="m17 9 4 6M21 9l-4 6" /> : <path d="M16 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" />}</svg>
);
