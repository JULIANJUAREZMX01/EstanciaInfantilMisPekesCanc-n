import { createSignal, onMount, For, Show } from 'solid-js';

interface Child {
  id: string;
  tutorEmail: string;
  nombre: string;
  fechaNacimiento: string;
  curp: string;
  cartillaVacunacion: string;
  grupoSanguineo: string;
  alergias: string[];
  preferenciaAlimentaria: string;
  atencionesEspeciales: string;
  medicamentos: string;
  medicoCabecera_nombre: string;
  medicoCabecera_telefono: string;
  hospitalPreferencia: string;
  foto: string;
  emergencia1_nombre: string;
  emergencia1_telefono: string;
  emergencia1_relacion: string;
  emergencia2_nombre: string;
  emergencia2_telefono: string;
  emergencia2_relacion: string;
}

const ALERGIAS_OPTIONS = ['Nueces', 'Lácteos', 'Gluten', 'Mariscos', 'Huevo', 'Polen', 'Latex', 'Ninguna', 'Otra'];
const GRUPOS_SANGUINEOS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const calcAge = (dob: string) =>
  Math.floor((Date.now() - new Date(dob).getTime()) / (365.25 * 24 * 3600 * 1000));

const emptyForm = (): Omit<Child, 'id' | 'tutorEmail'> => ({
  nombre: '',
  fechaNacimiento: '',
  curp: '',
  cartillaVacunacion: '',
  grupoSanguineo: 'O+',
  alergias: [],
  preferenciaAlimentaria: '',
  atencionesEspeciales: '',
  medicamentos: '',
  medicoCabecera_nombre: '',
  medicoCabecera_telefono: '',
  hospitalPreferencia: '',
  foto: '',
  emergencia1_nombre: '',
  emergencia1_telefono: '',
  emergencia1_relacion: '',
  emergencia2_nombre: '',
  emergencia2_telefono: '',
  emergencia2_relacion: '',
});

export default function MisPekesIsland() {
  const [children, setChildren] = createSignal<Child[]>([]);
  const [showModal, setShowModal] = createSignal(false);
  const [editChild, setEditChild] = createSignal<Child | null>(null);
  const [form, setForm] = createSignal(emptyForm());
  const [formError, setFormError] = createSignal('');
  const [tutorEmail, setTutorEmail] = createSignal('');

  onMount(() => {
    const session = localStorage.getItem('pekes_session') || '';
    setTutorEmail(session);
    const all: Child[] = JSON.parse(localStorage.getItem('pekes_children') || '[]');
    setChildren(all.filter((c) => c.tutorEmail === session));
  });

  const saveChildren = (list: Child[]) => {
    const all: Child[] = JSON.parse(localStorage.getItem('pekes_children') || '[]');
    const others = all.filter((c) => c.tutorEmail !== tutorEmail());
    localStorage.setItem('pekes_children', JSON.stringify([...others, ...list]));
    setChildren(list);
  };

  const openAdd = () => {
    setEditChild(null);
    setForm(emptyForm());
    setFormError('');
    setShowModal(true);
  };

  const openEdit = (child: Child) => {
    setEditChild(child);
    setForm({ ...child });
    setFormError('');
    setShowModal(true);
  };

  const deleteChild = (id: string) => {
    if (!confirm('¿Eliminar a este peke?')) return;
    const updated = children().filter((c) => c.id !== id);
    saveChildren(updated);
  };

  const toggleAlergia = (a: string) => {
    const current = form().alergias;
    const updated = current.includes(a) ? current.filter((x) => x !== a) : [...current, a];
    setForm({ ...form(), alergias: updated });
  };

  const handleFoto = (e: Event) => {
    const file = (e.currentTarget as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setForm({ ...form(), foto: ev.target?.result as string });
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    setFormError('');
    const f = form();
    if (!f.nombre || !f.fechaNacimiento) {
      setFormError('Nombre y fecha de nacimiento son requeridos.');
      return;
    }
    const existing = editChild();
    let updated: Child[];
    if (existing) {
      updated = children().map((c) => (c.id === existing.id ? { ...f, id: existing.id, tutorEmail: tutorEmail() } : c));
    } else {
      const newChild: Child = { ...f, id: crypto.randomUUID(), tutorEmail: tutorEmail() };
      updated = [...children(), newChild];
    }
    saveChildren(updated);
    setShowModal(false);
  };

  const fieldClass = 'border border-slate-200 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-pekes-primary text-slate-800 text-sm';
  const textareaClass = `${fieldClass} resize-none`;

  return (
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-extrabold text-pekes-dark">Mis Pekes</h2>
        <button
          onClick={openAdd}
          class="px-5 py-2 rounded-full bg-gradient-to-r from-pekes-primary to-pekes-light text-white font-bold text-sm shadow-md hover:opacity-90 transition-opacity"
        >
          + Agregar Peke
        </button>
      </div>

      <Show when={children().length === 0}>
        <div class="text-center py-16 text-slate-400">
          <div class="text-6xl mb-4">👶</div>
          <p class="text-lg font-semibold">Aún no has registrado ningún peke</p>
          <p class="text-sm mt-1">Presiona "Agregar Peke" para comenzar</p>
        </div>
      </Show>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <For each={children()}>
          {(child) => (
            <div class="bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-3">
              <div class="flex items-center gap-4">
                {child.foto ? (
                  <img src={child.foto} alt={child.nombre} class="w-16 h-16 rounded-full object-cover shadow" />
                ) : (
                  <div class="w-16 h-16 rounded-full bg-gradient-to-br from-pekes-pink to-pekes-coral flex items-center justify-center text-white text-2xl font-bold shadow">
                    {child.nombre.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <p class="font-bold text-pekes-dark text-base">{child.nombre}</p>
                  <p class="text-slate-500 text-sm">
                    {child.fechaNacimiento ? `${calcAge(child.fechaNacimiento)} años` : 'Edad desconocida'}
                  </p>
                  {child.grupoSanguineo && (
                    <span class="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-semibold">
                      {child.grupoSanguineo}
                    </span>
                  )}
                </div>
              </div>
              {child.alergias.length > 0 && (
                <div class="flex flex-wrap gap-1">
                  <For each={child.alergias}>
                    {(a) => <span class="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">{a}</span>}
                  </For>
                </div>
              )}
              <div class="flex gap-2 mt-auto">
                <button
                  onClick={() => openEdit(child)}
                  class="flex-1 py-1.5 rounded-full border border-pekes-primary text-pekes-primary text-sm font-semibold hover:bg-pekes-primary hover:text-white transition-colors"
                >
                  Editar
                </button>
                <button
                  onClick={() => deleteChild(child.id)}
                  class="flex-1 py-1.5 rounded-full border border-red-300 text-red-400 text-sm font-semibold hover:bg-red-50 transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          )}
        </For>
      </div>

      {/* Modal */}
      <Show when={showModal()}>
        <div class="fixed inset-0 z-50 flex items-start justify-center p-4 pt-8 overflow-y-auto">
          <div class="absolute inset-0 bg-black/50" onClick={() => setShowModal(false)} />
          <div class="relative bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl z-10 my-4">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-extrabold text-pekes-dark">
                {editChild() ? 'Editar Peke' : 'Nuevo Peke'}
              </h3>
              <button onClick={() => setShowModal(false)} class="text-slate-400 hover:text-slate-600 text-2xl leading-none">&times;</button>
            </div>

            <form onSubmit={handleSubmit} class="space-y-5">
              {/* Basic info */}
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-semibold text-slate-700 mb-1">Nombre completo *</label>
                  <input type="text" class={fieldClass} value={form().nombre} onInput={(e) => setForm({ ...form(), nombre: e.currentTarget.value })} required />
                </div>
                <div>
                  <label class="block text-sm font-semibold text-slate-700 mb-1">Fecha de nacimiento *</label>
                  <input type="date" class={fieldClass} value={form().fechaNacimiento} onInput={(e) => setForm({ ...form(), fechaNacimiento: e.currentTarget.value })} required />
                </div>
                <div>
                  <label class="block text-sm font-semibold text-slate-700 mb-1">CURP / Número de Acta</label>
                  <input type="text" class={fieldClass} value={form().curp} onInput={(e) => setForm({ ...form(), curp: e.currentTarget.value })} />
                </div>
                <div>
                  <label class="block text-sm font-semibold text-slate-700 mb-1">Cartilla de vacunación</label>
                  <input type="text" class={fieldClass} value={form().cartillaVacunacion} onInput={(e) => setForm({ ...form(), cartillaVacunacion: e.currentTarget.value })} />
                </div>
                <div>
                  <label class="block text-sm font-semibold text-slate-700 mb-1">Grupo sanguíneo</label>
                  <select class={fieldClass} value={form().grupoSanguineo} onChange={(e) => setForm({ ...form(), grupoSanguineo: e.currentTarget.value })}>
                    <For each={GRUPOS_SANGUINEOS}>{(g) => <option value={g}>{g}</option>}</For>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-semibold text-slate-700 mb-1">Foto del peke</label>
                  <input type="file" accept="image/*" class={fieldClass} onChange={handleFoto} />
                </div>
              </div>

              {/* Alergias */}
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2">Alergias</label>
                <div class="flex flex-wrap gap-2">
                  <For each={ALERGIAS_OPTIONS}>
                    {(a) => (
                      <button
                        type="button"
                        onClick={() => toggleAlergia(a)}
                        class="px-3 py-1 rounded-full text-sm font-semibold border transition-colors"
                        classList={{
                          'bg-pekes-primary text-white border-pekes-primary': form().alergias.includes(a),
                          'bg-white text-slate-600 border-slate-300 hover:border-pekes-primary': !form().alergias.includes(a),
                        }}
                      >
                        {a}
                      </button>
                    )}
                  </For>
                </div>
              </div>

              {/* Medical */}
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-semibold text-slate-700 mb-1">Preferencia alimentaria</label>
                  <textarea class={textareaClass} rows={2} value={form().preferenciaAlimentaria} onInput={(e) => setForm({ ...form(), preferenciaAlimentaria: e.currentTarget.value })} />
                </div>
                <div>
                  <label class="block text-sm font-semibold text-slate-700 mb-1">Atenciones especiales</label>
                  <textarea class={textareaClass} rows={2} value={form().atencionesEspeciales} onInput={(e) => setForm({ ...form(), atencionesEspeciales: e.currentTarget.value })} />
                </div>
                <div>
                  <label class="block text-sm font-semibold text-slate-700 mb-1">Medicamentos</label>
                  <textarea class={textareaClass} rows={2} value={form().medicamentos} onInput={(e) => setForm({ ...form(), medicamentos: e.currentTarget.value })} />
                </div>
                <div>
                  <label class="block text-sm font-semibold text-slate-700 mb-1">Hospital de preferencia</label>
                  <input type="text" class={fieldClass} value={form().hospitalPreferencia} onInput={(e) => setForm({ ...form(), hospitalPreferencia: e.currentTarget.value })} />
                </div>
              </div>

              {/* Doctor */}
              <div>
                <p class="text-sm font-bold text-slate-700 mb-2">Médico de cabecera</p>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-semibold text-slate-700 mb-1">Nombre</label>
                    <input type="text" class={fieldClass} value={form().medicoCabecera_nombre} onInput={(e) => setForm({ ...form(), medicoCabecera_nombre: e.currentTarget.value })} />
                  </div>
                  <div>
                    <label class="block text-sm font-semibold text-slate-700 mb-1">Teléfono</label>
                    <input type="text" class={fieldClass} value={form().medicoCabecera_telefono} onInput={(e) => setForm({ ...form(), medicoCabecera_telefono: e.currentTarget.value })} />
                  </div>
                </div>
              </div>

              {/* Emergency contacts */}
              <div>
                <p class="text-sm font-bold text-slate-700 mb-2">Contacto de emergencia 1</p>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input type="text" class={fieldClass} placeholder="Nombre" value={form().emergencia1_nombre} onInput={(e) => setForm({ ...form(), emergencia1_nombre: e.currentTarget.value })} />
                  <input type="text" class={fieldClass} placeholder="Teléfono" value={form().emergencia1_telefono} onInput={(e) => setForm({ ...form(), emergencia1_telefono: e.currentTarget.value })} />
                  <input type="text" class={fieldClass} placeholder="Relación" value={form().emergencia1_relacion} onInput={(e) => setForm({ ...form(), emergencia1_relacion: e.currentTarget.value })} />
                </div>
              </div>

              <div>
                <p class="text-sm font-bold text-slate-700 mb-2">Contacto de emergencia 2</p>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input type="text" class={fieldClass} placeholder="Nombre" value={form().emergencia2_nombre} onInput={(e) => setForm({ ...form(), emergencia2_nombre: e.currentTarget.value })} />
                  <input type="text" class={fieldClass} placeholder="Teléfono" value={form().emergencia2_telefono} onInput={(e) => setForm({ ...form(), emergencia2_telefono: e.currentTarget.value })} />
                  <input type="text" class={fieldClass} placeholder="Relación" value={form().emergencia2_relacion} onInput={(e) => setForm({ ...form(), emergencia2_relacion: e.currentTarget.value })} />
                </div>
              </div>

              {formError() && <p class="text-red-500 text-sm">{formError()}</p>}

              <button
                type="submit"
                class="w-full py-3 rounded-full bg-gradient-to-r from-pekes-primary to-pekes-light text-white font-bold shadow-md hover:opacity-90 transition-opacity"
              >
                {editChild() ? 'Guardar cambios' : 'Agregar Peke'}
              </button>
            </form>
          </div>
        </div>
      </Show>
    </div>
  );
}
