import { createSignal, onMount, For, Show } from 'solid-js';

export default function PerfilIsland() {
  const [nombre, setNombre] = createSignal('');
  const [email, setEmail] = createSignal('');
  const [telefono, setTelefono] = createSignal('');
  const [relacion, setRelacion] = createSignal('');
  const [editMode, setEditMode] = createSignal(false);
  const [saved, setSaved] = createSignal(false);
  const [error, setError] = createSignal('');

  onMount(() => {
    const session = localStorage.getItem('pekes_session');
    if (!session) return;
    const users = JSON.parse(localStorage.getItem('pekes_users') || '[]');
    const user = users.find((u: any) => u.email === session);
    if (user) {
      setNombre(user.nombre || '');
      setEmail(user.email || '');
      setTelefono(user.telefono || '');
      setRelacion(user.relacion || '');
    }
  });

  const handleSave = () => {
    setError('');
    if (!nombre().trim() || !telefono().trim()) {
      setError('Nombre y teléfono son requeridos.');
      return;
    }
    const users = JSON.parse(localStorage.getItem('pekes_users') || '[]');
    const idx = users.findIndex((u: any) => u.email === email());
    if (idx !== -1) {
      users[idx].nombre = nombre();
      users[idx].telefono = telefono();
      users[idx].relacion = relacion();
      localStorage.setItem('pekes_users', JSON.stringify(users));
    }
    setEditMode(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const inputClass = 'border border-slate-200 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-pekes-primary text-slate-800';
  const readonlyClass = 'bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 w-full text-slate-600';

  return (
    <div class="max-w-lg mx-auto">
      <div class="bg-white rounded-2xl shadow-sm p-8">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-extrabold text-pekes-dark">Mi Perfil</h2>
          <button
            onClick={() => setEditMode(!editMode())}
            class="px-4 py-2 rounded-full text-sm font-semibold border border-pekes-primary text-pekes-primary hover:bg-pekes-primary hover:text-white transition-colors"
          >
            {editMode() ? 'Cancelar' : '✏️ Editar'}
          </button>
        </div>

        <div class="flex flex-col items-center mb-6">
          <div class="w-20 h-20 rounded-full bg-gradient-to-br from-pekes-primary to-pekes-light flex items-center justify-center text-white text-3xl font-bold shadow-md">
            {nombre() ? nombre().charAt(0).toUpperCase() : '?'}
          </div>
          <p class="mt-3 text-lg font-bold text-slate-800">{nombre()}</p>
          <p class="text-slate-500 text-sm">{email()}</p>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Nombre completo</label>
            {editMode() ? (
              <input type="text" class={inputClass} value={nombre()} onInput={(e) => setNombre(e.currentTarget.value)} />
            ) : (
              <div class={readonlyClass}>{nombre()}</div>
            )}
          </div>

          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Correo electrónico</label>
            <div class={readonlyClass}>{email()}</div>
          </div>

          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Teléfono</label>
            {editMode() ? (
              <input type="text" class={inputClass} value={telefono()} onInput={(e) => setTelefono(e.currentTarget.value)} maxLength={10} />
            ) : (
              <div class={readonlyClass}>{telefono()}</div>
            )}
          </div>

          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Relación con el menor</label>
            {editMode() ? (
              <select class={inputClass} value={relacion()} onChange={(e) => setRelacion(e.currentTarget.value)}>
                <option value="mamá">Mamá</option>
                <option value="papá">Papá</option>
                <option value="tutor">Tutor</option>
                <option value="otro">Otro</option>
              </select>
            ) : (
              <div class={readonlyClass}>{relacion()}</div>
            )}
          </div>

          {error() && <p class="text-red-500 text-sm">{error()}</p>}
          {saved() && <p class="text-green-600 text-sm font-semibold">✅ Perfil actualizado correctamente.</p>}

          <Show when={editMode()}>
            <button
              onClick={handleSave}
              class="w-full py-3 rounded-full bg-gradient-to-r from-pekes-primary to-pekes-light text-white font-bold shadow-md hover:opacity-90 transition-opacity"
            >
              Guardar cambios
            </button>
          </Show>
        </div>
      </div>
    </div>
  );
}
