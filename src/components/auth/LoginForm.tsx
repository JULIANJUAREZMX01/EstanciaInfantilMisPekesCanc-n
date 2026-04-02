import { createSignal, onMount } from 'solid-js';

export default function LoginForm() {
  const [email, setEmail] = createSignal('');
  const [pin, setPin] = createSignal('');
  const [error, setError] = createSignal('');
  const [loading, setLoading] = createSignal(false);

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const users = JSON.parse(localStorage.getItem('pekes_users') || '[]');
    const user = users.find((u: any) => u.email === email() && u.pin === pin());
    if (user) {
      localStorage.setItem('pekes_session', email());
      window.location.href = '/dashboard/';
    } else {
      setError('Credenciales incorrectas. Verifica tu correo y PIN.');
      setLoading(false);
    }
  };

  const inputClass = 'border border-slate-200 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-pekes-primary text-slate-800';

  return (
    <div class="w-full max-w-md">
      <div class="bg-white rounded-2xl shadow-lg p-8 w-full">
        <div class="text-center mb-6">
          <h1 class="text-2xl font-extrabold text-pekes-dark">¡Bienvenido de vuelta!</h1>
          <p class="text-slate-500 text-sm mt-1">Ingresa tus datos para continuar</p>
        </div>

        <form onSubmit={handleSubmit} class="space-y-5">
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

          {error() && (
            <p class="text-red-500 text-sm text-center">{error()}</p>
          )}

          <button
            type="submit"
            disabled={loading()}
            class="w-full py-3 rounded-full bg-gradient-to-r from-pekes-primary to-pekes-light text-white font-bold text-base shadow-md hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {loading() ? 'Iniciando...' : 'Iniciar sesión'}
          </button>
        </form>
      </div>
    </div>
  );
}
