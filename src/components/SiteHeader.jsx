import { useEffect, useState } from 'react';
import { siteConfig } from '../config/site';

export default function SiteHeader({ Logo, Button, Icon, navigate }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    const closeOnEscape = (event) => event.key === 'Escape' && setOpen(false);
    document.body.classList.add('menu-is-open');
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.classList.remove('menu-is-open');
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [open]);

  const go = (event, path) => {
    event.preventDefault();
    setOpen(false);
    navigate(path);
  };

  return (
    <header className={`site-header ${open ? 'menu-open' : ''}`}>
      <Logo />
      <nav aria-label="Основная навигация">
        {siteConfig.nav.map(([label, path]) => (
          <a href={path} key={path} onClick={(event) => go(event, path)}>{label}</a>
        ))}
        <Button href="/calculator">Рассчитать стоимость</Button>
        <div className="mobile-contact">
          <a href={`tel:${siteConfig.contacts.phone}`}><Icon name="phone" />{siteConfig.contacts.phone}</a>
          <a href={siteConfig.contacts.whatsapp}>WhatsApp</a>
        </div>
      </nav>
      <a className="desktop-phone" href={`tel:${siteConfig.contacts.phone}`}>
        <Icon name="phone" />{siteConfig.contacts.phone}
      </a>
      <button className="menu" type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label={open ? 'Закрыть меню' : 'Открыть меню'}>
        <Icon name={open ? 'close' : 'menu'} />
      </button>
    </header>
  );
}
