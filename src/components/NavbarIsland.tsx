import { createSignal, onMount, onCleanup } from 'solid-js';

export default function NavbarIsland() {
  const [menuOpen, setMenuOpen] = createSignal(false);
  const [scrolled, setScrolled] = createSignal(false);

  const links = [
    { href: '#nosotros', label: 'Nosotros' },
    { href: '#servicios', label: 'Servicios' },
    { href: '#paquetes', label: 'Paquetes' },
    { href: '#juegos', label: 'Juegos' },
    { href: '#faq', label: 'FAQ' },
    { href: '#contacto', label: 'Contacto' },
  ];

  const handleScroll = () => setScrolled(window.scrollY > 10);

  onMount(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    onCleanup(() => {
      window.removeEventListener('scroll', handleScroll);
    });
  });

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav
      class="sticky top-0 z-40 transition-shadow duration-300"
      classList={{ 'shadow-md': scrolled(), 'shadow-none': !scrolled() }}
      style="background: rgba(255,255,255,0.97); backdrop-filter: blur(8px); border-bottom: 1px solid rgba(0,184,160,0.12);"
    >
      <div class="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <a href="#" class="flex items-center gap-2 text-xl font-extrabold text-slate-800 no-underline group">
          <span
            class="transition-colors group-hover:text-pekes-light"
            style="color: #00b8a0;"
          >
            Mis Pekes
          </span>
          <span aria-hidden="true" class="animate-bounce">🌻</span>
        </a>

        {/* Desktop links */}
        <div class="hidden md:flex items-center gap-5">
          {links.map((l) => (
            <a
              href={l.href}
              class="text-slate-500 hover:text-pekes-primary text-sm font-semibold transition-colors relative group"
              style="--pekes-primary: #00b8a0;"
              onClick={closeMenu}
            >
              {l.label}
              <span
                class="absolute -bottom-0.5 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-200 rounded"
                style="background: #00b8a0;"
              />
            </a>
          ))}
          <a
            href="/login"
            class="text-sm font-bold px-5 py-2 rounded-full transition-all hover:scale-105 hover:shadow-md"
            style="background: #00b8a0; color: #fff;"
          >
            Portal 🔑
          </a>
        </div>

        {/* Hamburger */}
        <button
          class="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-xl gap-1.5 transition-colors"
          style={{ background: menuOpen() ? 'rgba(0,184,160,0.1)' : 'transparent' }}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Menú"
          aria-expanded={menuOpen()}
        >
          <span
            class="block w-5 h-0.5 rounded transition-all duration-300"
            style={{
              background: '#00b8a0',
              transform: menuOpen() ? 'rotate(45deg) translate(4px, 4px)' : 'none',
            }}
          />
          <span
            class="block w-5 h-0.5 rounded transition-all duration-300"
            style={{
              background: '#00b8a0',
              opacity: menuOpen() ? '0' : '1',
            }}
          />
          <span
            class="block w-5 h-0.5 rounded transition-all duration-300"
            style={{
              background: '#00b8a0',
              transform: menuOpen() ? 'rotate(-45deg) translate(4px, -4px)' : 'none',
            }}
          />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        class="md:hidden overflow-hidden transition-all duration-300"
        style={{
          'max-height': menuOpen() ? '400px' : '0',
          opacity: menuOpen() ? '1' : '0',
        }}
      >
        <div class="px-6 pb-4 flex flex-col gap-1 border-t" style="border-color: rgba(0,184,160,0.12);">
          {links.map((l) => (
            <a
              href={l.href}
              class="text-slate-700 hover:text-white font-semibold text-sm py-3 px-4 rounded-xl transition-all"
              style="color: #334155;"
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = '#00b8a0';
                (e.currentTarget as HTMLElement).style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'transparent';
                (e.currentTarget as HTMLElement).style.color = '#334155';
              }}
              onClick={closeMenu}
            >
              {l.label}
            </a>
          ))}
          <a
            href="/login"
            class="text-center font-bold text-sm py-3 px-4 rounded-xl mt-2 transition-all"
            style="background: #00b8a0; color: #fff;"
            onClick={closeMenu}
          >
            Portal 🔑
          </a>
        </div>
      </div>
    </nav>
  );
}
