import { createSignal, onMount, For, Show, Switch, Match } from 'solid-js';
import MisPekesIsland from './MisPekesIsland';
import PaquetesIsland from './PaquetesIsland';
import TiendaIsland from './TiendaIsland';
import CalendarioIsland from './CalendarioIsland';
import PagosIsland from './PagosIsland';
import PerfilIsland from './PerfilIsland';

interface Props {
  activePage: string;
}

const navItems = [
  { id: 'inicio', icon: '🏠', label: 'Inicio', href: '/dashboard/' },
  { id: 'mis-pekes', icon: '👶', label: 'Mis Pekes', href: '/dashboard/mis-pekes' },
  { id: 'paquetes', icon: '📦', label: 'Paquetes', href: '/dashboard/paquetes' },
  { id: 'tienda', icon: '🛒', label: 'Tienda', href: '/dashboard/tienda' },
  { id: 'calendario', icon: '📅', label: 'Calendario', href: '/dashboard/calendario' },
  { id: 'pagos', icon: '💳', label: 'Pagos', href: '/dashboard/pagos' },
  { id: 'perfil', icon: '👤', label: 'Perfil', href: '/dashboard/perfil' },
];

const pageTitles: Record<string, string> = {
  inicio: 'Inicio',
  'mis-pekes': 'Mis Pekes',
  paquetes: 'Paquetes',
  tienda: 'Tienda',
  calendario: 'Calendario',
  pagos: 'Pagos',
  perfil: 'Perfil',
};

const quickActions = [
  { id: 'mis-pekes', icon: '👶', label: 'Mis Pekes', color: 'from-pekes-pink to-pink-400', href: '/dashboard/mis-pekes' },
  { id: 'paquetes', icon: '📦', label: 'Paquetes', color: 'from-pekes-primary to-pekes-light', href: '/dashboard/paquetes' },
  { id: 'tienda', icon: '🛒', label: 'Tienda', color: 'from-pekes-coral to-orange-400', href: '/dashboard/tienda' },
  { id: 'calendario', icon: '📅', label: 'Calendario', color: 'from-pekes-blue to-blue-400', href: '/dashboard/calendario' },
  { id: 'pagos', icon: '💳', label: 'Pagos', color: 'from-pekes-dark to-teal-700', href: '/dashboard/pagos' },
  { id: 'perfil', icon: '👤', label: 'Perfil', color: 'from-pekes-green to-green-400', href: '/dashboard/perfil' },
];

function InicioContent(props: { userName: string; userEmail: string }) {
  const [childrenCount, setChildrenCount] = createSignal(0);
  const [attendanceDays, setAttendanceDays] = createSignal(0);

  onMount(() => {
    const session = localStorage.getItem('pekes_session') || '';
    const allChildren = JSON.parse(localStorage.getItem('pekes_children') || '[]');
    setChildrenCount(allChildren.filter((c: any) => c.tutorEmail === session).length);

    const att: Record<string, string> = JSON.parse(localStorage.getItem('pekes_attendance') || '{}');
    const now = new Date();
    const prefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-`;
    setAttendanceDays(Object.keys(att).filter((k) => k.startsWith(prefix)).length);
  });

  const firstName = () => props.userName.split(' ')[0] || props.userName;

  return (
    <div class="space-y-6">
      {/* Welcome card */}
      <div class="bg-gradient-to-r from-pekes-dark to-pekes-primary rounded-2xl p-8 text-white shadow-lg">
        <p class="text-sm font-semibold opacity-75">Bienvenido al portal de</p>
        <h1 class="text-3xl font-extrabold mt-1">¡Hola, {firstName()}! 👋</h1>
        <p class="text-sm opacity-75 mt-2">Estancia Infantil Mis Pekes · Cancún</p>
      </div>

      {/* Stats row */}
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="bg-white rounded-2xl shadow-sm p-5 flex flex-col gap-1">
          <p class="text-3xl font-extrabold text-pekes-primary">{childrenCount()}</p>
          <p class="text-slate-600 text-sm font-semibold">👶 Mis Pekes</p>
          <a href="/dashboard/mis-pekes" class="text-xs text-pekes-primary hover:underline mt-1">Ver detalles →</a>
        </div>
        <div class="bg-white rounded-2xl shadow-sm p-5 flex flex-col gap-1">
          <p class="text-3xl font-extrabold text-pekes-coral">Consultar</p>
          <p class="text-slate-600 text-sm font-semibold">💳 Próximo pago</p>
          <a href="/dashboard/pagos" class="text-xs text-pekes-primary hover:underline mt-1">Ir a pagos →</a>
        </div>
        <div class="bg-white rounded-2xl shadow-sm p-5 flex flex-col gap-1">
          <p class="text-3xl font-extrabold text-pekes-green">{attendanceDays()}</p>
          <p class="text-slate-600 text-sm font-semibold">📅 Días este mes</p>
          <a href="/dashboard/calendario" class="text-xs text-pekes-primary hover:underline mt-1">Ver calendario →</a>
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <h2 class="text-lg font-extrabold text-pekes-dark mb-3">Acciones rápidas</h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <For each={quickActions}>
            {(action) => (
              <a
                href={action.href}
                class={`bg-gradient-to-br ${action.color} rounded-2xl p-4 text-white flex flex-col items-center gap-2 shadow-sm hover:shadow-md hover:scale-105 transition-all`}
              >
                <span class="text-3xl">{action.icon}</span>
                <span class="text-xs font-bold">{action.label}</span>
              </a>
            )}
          </For>
        </div>
      </div>
    </div>
  );
}

export default function DashboardShell(props: Props) {
  const [sidebarOpen, setSidebarOpen] = createSignal(true);
  const [userName, setUserName] = createSignal('');
  const [userEmail, setUserEmail] = createSignal('');

  onMount(() => {
    const session = localStorage.getItem('pekes_session');
    if (!session) {
      window.location.href = '/login';
      return;
    }
    setUserEmail(session);
    const users = JSON.parse(localStorage.getItem('pekes_users') || '[]');
    const user = users.find((u: any) => u.email === session);
    if (user) setUserName(user.nombre || session);
    else setUserName(session);
  });

  const initials = () => {
    const name = userName();
    if (!name) return '?';
    const parts = name.split(' ');
    return parts.length >= 2
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : name.slice(0, 2).toUpperCase();
  };

  const handleLogout = () => {
    localStorage.removeItem('pekes_session');
    window.location.href = '/';
  };

  return (
    <div class="flex h-screen overflow-hidden bg-pekes-cream font-sans">
      {/* Sidebar overlay for mobile */}
      <Show when={sidebarOpen()}>
        <div
          class="fixed inset-0 bg-black/30 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      </Show>

      {/* Sidebar */}
      <aside
        class="fixed lg:static inset-y-0 left-0 z-30 w-64 bg-pekes-dark text-white flex flex-col transition-transform duration-300"
        classList={{
          'translate-x-0': sidebarOpen(),
          '-translate-x-full': !sidebarOpen(),
          'lg:translate-x-0': true,
        }}
      >
        {/* Logo */}
        <div class="flex items-center justify-between p-5 border-b border-white/10">
          <a href="/dashboard/" class="flex items-center gap-2">
            <span class="text-2xl">🧸</span>
            <span class="text-xl font-extrabold">Mis Pekes</span>
          </a>
          <button
            onClick={() => setSidebarOpen(false)}
            class="lg:hidden text-white/60 hover:text-white text-xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Nav */}
        <nav class="flex-1 py-4 overflow-y-auto">
          <For each={navItems}>
            {(item) => (
              <a
                href={item.href}
                class="flex items-center gap-3 px-5 py-3 text-sm font-semibold transition-colors hover:bg-white/10"
                classList={{
                  'bg-pekes-primary/30 border-l-4 border-pekes-primary': props.activePage === item.id,
                  'border-l-4 border-transparent': props.activePage !== item.id,
                }}
              >
                <span class="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </a>
            )}
          </For>
        </nav>

        {/* Logout */}
        <div class="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            class="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          >
            <span>🚪</span>
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div class="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <header class="bg-white shadow-sm px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div class="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen())}
              class="text-xl text-slate-500 hover:text-slate-700 transition-colors"
            >
              ☰
            </button>
            <h1 class="text-lg font-extrabold text-pekes-dark">
              {pageTitles[props.activePage] || 'Dashboard'}
            </h1>
          </div>
          <div class="flex items-center gap-4">
            <button class="text-xl text-slate-400 hover:text-slate-600 transition-colors" title="Notificaciones">🔔</button>
            <div class="flex items-center gap-2">
              <div class="w-9 h-9 rounded-full bg-gradient-to-br from-pekes-primary to-pekes-light flex items-center justify-center text-white text-sm font-bold shadow">
                {initials()}
              </div>
              <span class="text-sm font-semibold text-slate-700 hidden sm:block">{userName()}</span>
            </div>
          </div>
        </header>

        {/* Content area */}
        <main class="flex-1 overflow-y-auto p-6">
          <Switch>
            <Match when={props.activePage === 'inicio'}>
              <InicioContent userName={userName()} userEmail={userEmail()} />
            </Match>
            <Match when={props.activePage === 'mis-pekes'}>
              <MisPekesIsland />
            </Match>
            <Match when={props.activePage === 'paquetes'}>
              <PaquetesIsland />
            </Match>
            <Match when={props.activePage === 'tienda'}>
              <TiendaIsland />
            </Match>
            <Match when={props.activePage === 'calendario'}>
              <CalendarioIsland />
            </Match>
            <Match when={props.activePage === 'pagos'}>
              <PagosIsland />
            </Match>
            <Match when={props.activePage === 'perfil'}>
              <PerfilIsland />
            </Match>
          </Switch>
        </main>
      </div>
    </div>
  );
}
