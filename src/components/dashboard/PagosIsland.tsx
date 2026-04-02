import { createSignal, onMount, For, Show } from 'solid-js';
import StripeModal from './StripeModal';

interface Payment {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: string;
  cardLast4?: string;
}

const nextPaymentDate = () => {
  const now = new Date();
  const next = new Date(now.getFullYear(), now.getMonth() + 1, 15);
  return next.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });
};

export default function PagosIsland() {
  const [payments, setPayments] = createSignal<Payment[]>([]);
  const [showStripeModal, setShowStripeModal] = createSignal(false);
  const [paymentAmount] = createSignal(3500);
  const [tutorEmail, setTutorEmail] = createSignal('');

  onMount(() => {
    const session = localStorage.getItem('pekes_session') || '';
    setTutorEmail(session);
    const all: Payment[] = JSON.parse(localStorage.getItem('pekes_payments') || '[]');
    setPayments(all.filter((p: any) => p.tutorEmail === session));
  });

  const handlePaymentSuccess = (data: any) => {
    const newPayment: Payment & { tutorEmail: string } = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      description: 'Pago mensual de colegiatura',
      amount: paymentAmount(),
      status: 'Pagado',
      cardLast4: data.cardLast4,
      tutorEmail: tutorEmail(),
    };
    const all = JSON.parse(localStorage.getItem('pekes_payments') || '[]');
    all.push(newPayment);
    localStorage.setItem('pekes_payments', JSON.stringify(all));
    setPayments([...payments(), newPayment]);
    setShowStripeModal(false);
  };

  return (
    <div class="space-y-6">
      <h2 class="text-xl font-extrabold text-pekes-dark">Pagos</h2>

      {/* Pending payment card */}
      <div class="bg-gradient-to-r from-pekes-dark to-pekes-primary rounded-2xl p-6 text-white shadow-md">
        <p class="text-sm font-semibold opacity-75 mb-1">📅 Próximo pago</p>
        <p class="text-3xl font-extrabold">${paymentAmount().toLocaleString('es-MX')} MXN</p>
        <p class="text-sm opacity-80 mt-1">Vence el {nextPaymentDate()}</p>
        <p class="text-xs opacity-60 mt-0.5">Colegiatura mensual</p>
        <button
          onClick={() => setShowStripeModal(true)}
          class="mt-4 px-6 py-2.5 rounded-full bg-white text-pekes-dark font-bold text-sm hover:opacity-90 transition-opacity shadow"
        >
          Realizar pago
        </button>
      </div>

      {/* Payment history */}
      <div class="bg-white rounded-2xl shadow-sm p-6">
        <h3 class="text-lg font-extrabold text-pekes-dark mb-4">Historial de pagos</h3>
        <Show when={payments().length === 0}>
          <p class="text-slate-400 text-sm text-center py-8">Aún no tienes pagos registrados</p>
        </Show>
        <Show when={payments().length > 0}>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-slate-100">
                  <th class="text-left pb-3 text-slate-500 font-semibold">Fecha</th>
                  <th class="text-left pb-3 text-slate-500 font-semibold">Descripción</th>
                  <th class="text-right pb-3 text-slate-500 font-semibold">Monto</th>
                  <th class="text-right pb-3 text-slate-500 font-semibold">Estado</th>
                </tr>
              </thead>
              <tbody>
                <For each={payments()}>
                  {(payment) => (
                    <tr class="border-b border-slate-50 last:border-0">
                      <td class="py-3 text-slate-600">{new Date(payment.date).toLocaleDateString('es-MX')}</td>
                      <td class="py-3 text-slate-800 font-medium">{payment.description}</td>
                      <td class="py-3 text-right font-bold text-pekes-primary">${payment.amount.toLocaleString('es-MX')} MXN</td>
                      <td class="py-3 text-right">
                        <span class="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold">{payment.status}</span>
                      </td>
                    </tr>
                  )}
                </For>
              </tbody>
            </table>
          </div>
        </Show>
      </div>

      <StripeModal
        show={showStripeModal()}
        amount={paymentAmount()}
        onClose={() => setShowStripeModal(false)}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
