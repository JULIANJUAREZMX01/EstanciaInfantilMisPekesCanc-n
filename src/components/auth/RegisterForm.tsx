import { createSignal } from 'solid-js';

async function hashPIN(pin: string): Promise<string> {
  const data = new TextEncoder().encode(pin);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export default function RegisterForm() {
  const [nombre, setNombre] = createSignal('');
  const [email, setEmail] = createSignal('');
  const [telefono, setTelefono] = createSignal('');
  const [relacion, setRelacion] = createSignal('mamá');
  const [pin, setPin] = createSignal('');
  const [confirmPin, setConfirmPin] = createSignal('');
  const [error, setError] = createSignal('');
  const [loading, setLoading] = createSignal(false);

  const inputClass = 'border border-slate-200 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-pekes-primary text-slate-800';

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setError('');

    if (!nombre() || !email() || !telefono() || !pin() || !confirmPin()) {
      setError('Todos los campos son requeridos.');
      return;
    }
    if (!/^\d{4}$/.test(pin())) {
      setError('El PIN debe ser exactamente 4 dígitos numéricos.');
      return;
    }
    if (pin() !== confirmPin()) {
      setError('Los PINs no coinciden.');
      return;
    }

    const users = JSON.parse(localStorage.getItem('pekes_users') || '[]');
    if (users.find((u: any) => u.email === email())) {
      setError('Este correo ya está registrado. Intenta iniciar sesión.');
      return;
    }

    setLoading(true);
    const pinHash = await hashPIN(pin());
    users.push({ nombre: nombre(), email: email(), telefono: telefono(), relacion: relacion(), pinHash });
    localStorage.setItem('pekes_users', JSON.stringify(users));
    localStorage.setItem('pekes_session', email());
    window.location.href = '/dashboard/';
  };

  return (
    <div class="w-full max-w-lg">
      <div class="bg-white rounded-2xl shadow-lg p-8 w-full">
        <div class="text-center mb-6">
          <h1 class="text-2xl font-extrabold text-pekes-dark">Crear cuenta</h1>
          <p class="text-slate-500 text-sm mt-1">Completa tus datos de tutor</p>
        </div>

        <form onSubmit={handleSubmit} class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Nombre completo del tutor</label>
            <input
              type="text"
              class={inputClass}
              value={nombre()}
              onInput={(e) => setNombre(e.currentTarget.value)}
              placeholder="Ana García López"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Correo electrónico</label>
            <input
              type="email"
              class={inputClass}
              value={email()}
              onInput={(e) => setEmail(e.currentTarget.value)}
              placeholder="tu@correo.com"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Teléfono</label>
            <input
              type="text"
              class={inputClass}
              value={telefono()}
              onInput={(e) => setTelefono(e.currentTarget.value)}
              maxLength={10}
              placeholder="10 dígitos"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Relación con el menor</label>
            <select
              class={inputClass}
              value={relacion()}
              onChange={(e) => setRelacion(e.currentTarget.value)}
            >
              <option value="mamá">Mamá</option>
              <option value="papá">Papá</option>
              <option value="tutor">Tutor</option>
              <option value="otro">Otro</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">PIN (4 dígitos)</label>
            <input
              type="password"
              class={inputClass}
              value={pin()}
              onInput={(e) => setPin(e.currentTarget.value)}
              maxLength={4}
              pattern="[0-9]*"
              placeholder="••••"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Confirmar PIN</label>
            <input
              type="password"
              class={inputClass}
              value={confirmPin()}
              onInput={(e) => setConfirmPin(e.currentTarget.value)}
              maxLength={4}
              pattern="[0-9]*"
              placeholder="••••"
              required
            />
          </div>

          {error() && (
            <p class="text-red-500 text-sm text-center">{error()}</p>
          )}

          <button
            type="submit"
            disabled={loading()}
            class="w-full py-3 rounded-full bg-gradient-to-r from-pekes-primary to-pekes-light text-white font-bold text-base shadow-md hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {loading() ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>
      </div>
    </div>
  );
}
