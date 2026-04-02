import { createSignal, onMount, For, Show } from 'solid-js';

type AttendanceType = 'asistencia' | 'inasistencia' | 'extra' | 'feriado';

const DAYS_OF_WEEK = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

const CYCLE: (AttendanceType | '')[] = ['', 'asistencia', 'inasistencia', 'extra'];

const dayColors: Record<AttendanceType, string> = {
  asistencia: 'bg-green-400 text-white',
  inasistencia: 'bg-red-400 text-white',
  extra: 'bg-amber-400 text-white',
  feriado: 'bg-blue-400 text-white',
};

export default function CalendarioIsland() {
  const now = new Date();
  const [currentYear, setCurrentYear] = createSignal(now.getFullYear());
  const [currentMonth, setCurrentMonth] = createSignal(now.getMonth());
  const [attendance, setAttendance] = createSignal<Record<string, AttendanceType>>({});

  onMount(() => {
    const saved = JSON.parse(localStorage.getItem('pekes_attendance') || '{}');
    setAttendance(saved);
  });

  const daysInMonth = () => new Date(currentYear(), currentMonth() + 1, 0).getDate();
  const firstDayOfWeek = () => new Date(currentYear(), currentMonth(), 1).getDay();

  const dateKey = (day: number) =>
    `${currentYear()}-${String(currentMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  const toggleDay = (day: number) => {
    const key = dateKey(day);
    const current = attendance()[key] || '';
    const idx = CYCLE.indexOf(current as AttendanceType | '');
    const next = CYCLE[(idx + 1) % CYCLE.length];
    const updated = { ...attendance() };
    if (next === '') {
      delete updated[key];
    } else {
      updated[key] = next as AttendanceType;
    }
    setAttendance(updated);
    localStorage.setItem('pekes_attendance', JSON.stringify(updated));
  };

  const prevMonth = () => {
    if (currentMonth() === 0) { setCurrentYear(currentYear() - 1); setCurrentMonth(11); }
    else setCurrentMonth(currentMonth() - 1);
  };

  const nextMonth = () => {
    if (currentMonth() === 11) { setCurrentYear(currentYear() + 1); setCurrentMonth(0); }
    else setCurrentMonth(currentMonth() + 1);
  };

  const totalDays = () => {
    const prefix = `${currentYear()}-${String(currentMonth() + 1).padStart(2, '0')}-`;
    return Object.entries(attendance()).filter(([k]) => k.startsWith(prefix)).length;
  };

  return (
    <div class="space-y-6">
      <h2 class="text-xl font-extrabold text-pekes-dark">Calendario de Asistencias</h2>

      <div class="bg-white rounded-2xl shadow-sm p-6">
        {/* Month navigation */}
        <div class="flex items-center justify-between mb-6">
          <button onClick={prevMonth} class="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors">‹</button>
          <h3 class="text-lg font-extrabold text-pekes-dark">
            {MONTHS[currentMonth()]} {currentYear()}
          </h3>
          <button onClick={nextMonth} class="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors">›</button>
        </div>

        {/* Day headers */}
        <div class="grid grid-cols-7 gap-1 mb-2">
          <For each={DAYS_OF_WEEK}>
            {(d) => <div class="text-center text-xs font-bold text-slate-400 py-1">{d}</div>}
          </For>
        </div>

        {/* Calendar grid */}
        <div class="grid grid-cols-7 gap-1">
          {/* Empty cells for offset */}
          <For each={Array(firstDayOfWeek()).fill(null)}>
            {() => <div />}
          </For>
          {/* Day cells */}
          <For each={Array.from({ length: daysInMonth() }, (_, i) => i + 1)}>
            {(day) => {
              const key = dateKey(day);
              const att = () => attendance()[key] as AttendanceType | undefined;
              return (
                <button
                  onClick={() => toggleDay(day)}
                  class="aspect-square rounded-xl text-sm font-semibold flex items-center justify-center transition-all hover:scale-105"
                  classList={{
                    [dayColors[att()!]]: !!att(),
                    'bg-slate-50 text-slate-700 hover:bg-slate-100': !att(),
                  }}
                >
                  {day}
                </button>
              );
            }}
          </For>
        </div>

        {/* Legend */}
        <div class="flex flex-wrap gap-3 mt-6 pt-4 border-t border-slate-100">
          <span class="text-sm text-slate-500 flex items-center gap-1"><span class="w-3 h-3 rounded-full bg-green-400 inline-block" /> Asistencia</span>
          <span class="text-sm text-slate-500 flex items-center gap-1"><span class="w-3 h-3 rounded-full bg-red-400 inline-block" /> Inasistencia</span>
          <span class="text-sm text-slate-500 flex items-center gap-1"><span class="w-3 h-3 rounded-full bg-amber-400 inline-block" /> Día extra</span>
          <span class="text-sm text-slate-500 flex items-center gap-1"><span class="w-3 h-3 rounded-full bg-blue-400 inline-block" /> Feriado</span>
        </div>

        <p class="text-slate-500 text-sm mt-3">
          📊 Días marcados este mes: <strong class="text-pekes-dark">{totalDays()}</strong>
        </p>
        <p class="text-slate-400 text-xs mt-1">Haz clic en un día para cambiar su estado</p>
      </div>
    </div>
  );
}
