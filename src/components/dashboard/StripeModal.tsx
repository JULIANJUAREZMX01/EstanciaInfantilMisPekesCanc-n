// TODO: Integrate real Stripe.js with publishable key
import { createSignal, Show } from 'solid-js';

interface Props {
  show: boolean;
  amount: number;
  onClose: () => void;
  onSuccess: (paymentData: any) => void;
}

export default function StripeModal(props: Props) {
  const [cardNumber, setCardNumber] = createSignal('');
  const [expiry, setExpiry] = createSignal('');
  const [cvv, setCvv] = createSignal('');
  const [cardName, setCardName] = createSignal('');
  const [loading, setLoading] = createSignal(false);
  const [success, setSuccess] = createSignal(false);
  const [fieldError, setFieldError] = createSignal('');

  const formatCardNumber = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2);
    return digits;
  };

  const handlePay = (e: Event) => {
    e.preventDefault();
    setFieldError('');
    const rawCard = cardNumber().replace(/\s/g, '');
    if (rawCard.length !== 16) { setFieldError('Número de tarjeta inválido.'); return; }
    if (expiry().length < 5) { setFieldError('Fecha de expiración inválida.'); return; }
    if (cvv().length < 3) { setFieldError('CVV inválido.'); return; }
    if (!cardName().trim()) { setFieldError('Nombre en la tarjeta requerido.'); return; }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      const last4 = rawCard.slice(-4);
      props.onSuccess({ cardLast4: last4, amount: props.amount, date: new Date().toISOString() });
    }, 2000);
  };

  const handleClose = () => {
    setSuccess(false);
    setCardNumber('');
    setExpiry('');
    setCvv('');
    setCardName('');
    setFieldError('');
    setLoading(false);
    props.onClose();
  };

  const inputClass = 'border border-slate-200 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-pekes-primary text-slate-800 text-sm';

  return (
    <div
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      classList={{ hidden: !props.show }}
    >
      <div class="absolute inset-0 bg-black/50" onClick={handleClose} />
      <div class="relative bg-white rounded-2xl shadow-xl p-8 w-full max-w-md z-10">
        <Show when={!success()}>
          <div class="text-center mb-6">
            <div class="text-3xl mb-2">💳</div>
            <h2 class="text-xl font-extrabold text-pekes-dark flex items-center justify-center gap-2">
              Pago Seguro
              <span class="text-green-500 text-base">🔒</span>
            </h2>
            <p class="text-slate-500 text-sm mt-1">Powered by Stripe</p>
          </div>

          <form onSubmit={handlePay} class="space-y-4">
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-1">Número de tarjeta</label>
              <input
                type="text"
                class={inputClass}
                value={cardNumber()}
                onInput={(e) => setCardNumber(formatCardNumber(e.currentTarget.value))}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
              />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-1">Expiración</label>
                <input
                  type="text"
                  class={inputClass}
                  value={expiry()}
                  onInput={(e) => setExpiry(formatExpiry(e.currentTarget.value))}
                  placeholder="MM/YY"
                  maxLength={5}
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-1">CVV</label>
                <input
                  type="password"
                  class={inputClass}
                  value={cvv()}
                  onInput={(e) => setCvv(e.currentTarget.value.replace(/\D/g, '').slice(0, 3))}
                  placeholder="•••"
                  maxLength={3}
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-1">Nombre en la tarjeta</label>
              <input
                type="text"
                class={inputClass}
                value={cardName()}
                onInput={(e) => setCardName(e.currentTarget.value)}
                placeholder="NOMBRE APELLIDO"
              />
            </div>

            {fieldError() && <p class="text-red-500 text-sm text-center">{fieldError()}</p>}

            <button
              type="submit"
              disabled={loading()}
              class="w-full py-3 rounded-full bg-gradient-to-r from-pekes-primary to-pekes-light text-white font-bold text-base shadow-md hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading() ? (
                <span class="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                `Pagar $${props.amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN`
              )}
            </button>

            <button type="button" onClick={handleClose} class="w-full text-slate-400 text-sm hover:text-slate-600 transition-colors mt-1">
              Cancelar
            </button>
          </form>
        </Show>

        <Show when={success()}>
          <div class="text-center py-6">
            <div class="text-6xl mb-4 animate-bounce">✅</div>
            <h2 class="text-2xl font-extrabold text-pekes-dark mb-2">¡Pago exitoso!</h2>
            <p class="text-slate-500 text-sm mb-6">Tu pago ha sido procesado correctamente.</p>
            <button
              onClick={handleClose}
              class="px-8 py-3 rounded-full bg-gradient-to-r from-pekes-primary to-pekes-light text-white font-bold shadow-md hover:opacity-90 transition-opacity"
            >
              Cerrar
            </button>
          </div>
        </Show>
      </div>
    </div>
  );
}
