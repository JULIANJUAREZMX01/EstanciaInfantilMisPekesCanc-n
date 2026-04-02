import { createSignal, onMount, For, Show } from 'solid-js';

interface Package {
  id: string;
  name: string;
  icon: string;
  gradient: string;
  hours: string;
  price: string;
  features: string[];
}

const packages: Package[] = [
  {
    id: 'completo',
    name: 'Paquete Completo',
    icon: '🌟',
    gradient: 'from-pekes-primary to-pekes-light',
    hours: 'Lun-Vie · 10-11 hrs',
    price: 'Consultar precio',
    features: [
      '3 comidas incluidas',
      'Cuidado + Enseñanza + Educación + Pedagogía',
      'NO incluye bebida/leche/fórmula',
      'Sáb/Dom extra $250/día hasta 10 hrs',
      'Feriados: consultar disponibilidad',
    ],
  },
  {
    id: 'semi',
    name: 'Paquete Semi',
    icon: '🤝',
    gradient: 'from-pekes-blue to-blue-400',
    hours: 'Lun-Vie · 9-10 hrs',
    price: 'Consultar precio',
    features: [
      'Todo lo del Paquete Completo',
      'Sáb/Dom extra $250/día hasta 8 hrs',
      'Hora extra: $75',
    ],
  },
  {
    id: 'lite',
    name: 'Paquete Lite',
    icon: '💡',
    gradient: 'from-pekes-coral to-orange-400',
    hours: 'Lun-Vie · hasta 8 hrs',
    price: 'Consultar precio',
    features: [
      'Todo lo del Paquete Semi',
      'Sáb/Dom extra $270/día hasta 8 hrs',
      'Horarios/extras/feriados varían',
    ],
  },
];

interface Enrollment {
  tutorEmail: string;
  childId: string;
  packageId: string;
  startDate: string;
}

interface Child {
  id: string;
  nombre: string;
  tutorEmail: string;
}

export default function PaquetesIsland() {
  const [selectedPackage, setSelectedPackage] = createSignal('');
  const [children, setChildren] = createSignal<Child[]>([]);
  const [showEnrollForm, setShowEnrollForm] = createSignal(false);
  const [selectedChild, setSelectedChild] = createSignal('');
  const [startDate, setStartDate] = createSignal('');
  const [enrollment, setEnrollment] = createSignal<Enrollment | null>(null);
  const [saved, setSaved] = createSignal(false);
  const [tutorEmail, setTutorEmail] = createSignal('');

  onMount(() => {
    const session = localStorage.getItem('pekes_session') || '';
    setTutorEmail(session);
    const allChildren: Child[] = JSON.parse(localStorage.getItem('pekes_children') || '[]');
    setChildren(allChildren.filter((c) => c.tutorEmail === session));
    const allEnrollments: Enrollment[] = JSON.parse(localStorage.getItem('pekes_enrollment') || '[]');
    const active = allEnrollments.find((e) => e.tutorEmail === session);
    if (active) setEnrollment(active);
  });

  const handleSelectPackage = (id: string) => {
    setSelectedPackage(id);
    setShowEnrollForm(true);
  };

  const handleEnroll = (e: Event) => {
    e.preventDefault();
    if (!selectedChild() || !startDate()) return;
    const newEnrollment: Enrollment = {
      tutorEmail: tutorEmail(),
      childId: selectedChild(),
      packageId: selectedPackage(),
      startDate: startDate(),
    };
    const all: Enrollment[] = JSON.parse(localStorage.getItem('pekes_enrollment') || '[]');
    const filtered = all.filter((e) => e.tutorEmail !== tutorEmail());
    localStorage.setItem('pekes_enrollment', JSON.stringify([...filtered, newEnrollment]));
    setEnrollment(newEnrollment);
    setShowEnrollForm(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const getChildName = (id: string) => children().find((c) => c.id === id)?.nombre || id;
  const getPackageName = (id: string) => packages.find((p) => p.id === id)?.name || id;

  const inputClass = 'border border-slate-200 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-pekes-primary text-slate-800 text-sm';

  return (
    <div class="space-y-8">
      <h2 class="text-xl font-extrabold text-pekes-dark">Paquetes de Servicio</h2>

      {/* Active enrollment card */}
      <Show when={enrollment()}>
        <div class="bg-gradient-to-r from-pekes-primary to-pekes-light rounded-2xl p-6 text-white shadow-md">
          <p class="text-sm font-semibold opacity-80 mb-1">📌 Inscripción activa</p>
          <p class="text-lg font-extrabold">{getPackageName(enrollment()!.packageId)}</p>
          <p class="text-sm opacity-90 mt-1">Peke: {getChildName(enrollment()!.childId)} · Inicio: {enrollment()!.startDate}</p>
          <button
            onClick={() => {
              if (confirm('¿Estás seguro de que deseas cancelar la inscripción?')) {
                localStorage.removeItem('pekes_enrollment');
                setEnrollment(null);
                setShowEnrollForm(false);
              }
            }}
            class="mt-3 text-xs underline opacity-75 hover:opacity-100"
          >
            Cancelar inscripción
          </button>
        </div>
      </Show>

      {saved() && (
        <div class="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm font-semibold">
          ✅ Inscripción confirmada correctamente.
        </div>
      )}

      {/* Package cards */}
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <For each={packages}>
          {(pkg) => (
            <div class="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-100">
              <div class={`bg-gradient-to-r ${pkg.gradient} p-6 text-white`}>
                <div class="text-4xl mb-2">{pkg.icon}</div>
                <h3 class="text-xl font-extrabold">{pkg.name}</h3>
                <p class="text-sm opacity-90 mt-1">{pkg.hours}</p>
                <p class="text-lg font-bold mt-2">{pkg.price}</p>
              </div>
              <div class="p-6 space-y-3">
                <ul class="space-y-2">
                  <For each={pkg.features}>
                    {(feat) => (
                      <li class="flex items-start gap-2 text-sm text-slate-600">
                        <span class="text-pekes-primary mt-0.5">✓</span>
                        {feat}
                      </li>
                    )}
                  </For>
                </ul>
                <button
                  onClick={() => handleSelectPackage(pkg.id)}
                  class="w-full mt-4 py-2.5 rounded-full bg-gradient-to-r from-pekes-primary to-pekes-light text-white font-bold text-sm shadow hover:opacity-90 transition-opacity"
                >
                  Seleccionar paquete
                </button>
              </div>
            </div>
          )}
        </For>
      </div>

      {/* Enrollment form */}
      <Show when={showEnrollForm()}>
        <div class="bg-white rounded-2xl shadow-sm p-6 border border-pekes-primary/30">
          <h3 class="text-lg font-extrabold text-pekes-dark mb-4">Confirmar inscripción</h3>
          <form onSubmit={handleEnroll} class="space-y-4 max-w-md">
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-1">Peke a inscribir</label>
              <select class={inputClass} value={selectedChild()} onChange={(e) => setSelectedChild(e.currentTarget.value)} required>
                <option value="">Seleccionar peke...</option>
                <For each={children()}>
                  {(c) => <option value={c.id}>{c.nombre}</option>}
                </For>
              </select>
              <Show when={children().length === 0}>
                <p class="text-amber-600 text-xs mt-1">⚠️ Primero registra un peke en "Mis Pekes".</p>
              </Show>
            </div>
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-1">Paquete seleccionado</label>
              <input type="text" class={inputClass} value={getPackageName(selectedPackage())} readOnly />
            </div>
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-1">Fecha de inicio</label>
              <input type="date" class={inputClass} value={startDate()} onInput={(e) => setStartDate(e.currentTarget.value)} required />
            </div>
            <div class="flex gap-3">
              <button type="submit" class="flex-1 py-3 rounded-full bg-gradient-to-r from-pekes-primary to-pekes-light text-white font-bold text-sm shadow hover:opacity-90 transition-opacity">
                Confirmar inscripción
              </button>
              <button type="button" onClick={() => setShowEnrollForm(false)} class="px-4 py-3 rounded-full border border-slate-300 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </Show>
    </div>
  );
}
