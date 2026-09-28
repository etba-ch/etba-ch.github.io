import { useEffect, useRef, useState } from 'react';
import Brand from './Brand';

const NAV_LINKS = [
  { href: '#about', label: 'About' },
  { href: '#pillars', label: 'What we do' },
  { href: '#events', label: 'Events & news' },
  { href: '#team', label: 'Team' },
  { href: '#membership', label: 'Membership' },
];

const NARROW_QUERY = '(max-width: 880px)';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [narrow, setNarrow] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia(NARROW_QUERY);
    const apply = () => {
      setNarrow(mq.matches);
      if (!mq.matches) setOpen(false);
    };
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    if (narrow && !open) nav.setAttribute('inert', '');
    else nav.removeAttribute('inert');
  }, [narrow, open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-wrap">
        <Brand />

        <button
          ref={toggleRef}
          className="nav-toggle"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="primary-nav"
          onClick={() => setOpen(value => !value)}
        >
          <span /><span /><span />
        </button>

        <nav
          ref={navRef}
          id="primary-nav"
          className={`primary-nav ${open ? 'open' : ''}`}
          aria-label="Primary"
        >
          {NAV_LINKS.map(link => (
            <a key={link.href} href={link.href} onClick={close}>{link.label}</a>
          ))}
          <a href="#membership" className="nav-cta" onClick={close}>Join us →</a>
        </nav>
      </div>
    </header>
  );
}
