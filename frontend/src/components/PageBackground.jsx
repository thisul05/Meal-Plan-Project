import { useLocation } from 'react-router-dom';

// Each page gets its own healthy-meal photo from Unsplash.
// TO UNDO: remove <PageBackground /> from App.jsx — no other files change.
const PAGES = {
  '/': {
    url: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1920&q=80&fit=crop',
    overlay: 'linear-gradient(135deg,rgba(15,23,42,.72) 0%,rgba(30,58,138,.55) 60%,rgba(124,58,237,.45) 100%)',
  },
  '/login': {
    url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1920&q=80&fit=crop',
    overlay: 'linear-gradient(160deg,rgba(15,23,42,.78) 0%,rgba(20,83,45,.55) 100%)',
  },
  '/register': {
    url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1920&q=80&fit=crop',
    overlay: 'linear-gradient(160deg,rgba(15,23,42,.78) 0%,rgba(20,83,45,.55) 100%)',
  },
  '/verify-email': {
    url: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=1920&q=80&fit=crop',
    overlay: 'rgba(15,23,42,.65)',
  },
  '/saved-plans': {
    url: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=1920&q=80&fit=crop',
    overlay: 'linear-gradient(160deg,rgba(15,23,42,.72) 0%,rgba(30,58,138,.5) 100%)',
  },
  '/diary': {
    url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920&q=80&fit=crop',
    overlay: 'linear-gradient(160deg,rgba(15,23,42,.7) 0%,rgba(124,58,237,.45) 100%)',
  },
};

const FALLBACK = PAGES['/'];

export default function PageBackground() {
  const { pathname } = useLocation();
  const page = PAGES[pathname] ?? FALLBACK;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: -1,
      backgroundImage: `url(${page.url})`,
      backgroundSize: 'cover', backgroundPosition: 'center',
      transition: 'background-image .4s ease',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: page.overlay,
        backdropFilter: 'blur(1.5px)',
      }} />
    </div>
  );
}
