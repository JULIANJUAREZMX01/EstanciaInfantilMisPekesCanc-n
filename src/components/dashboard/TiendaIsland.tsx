import { createSignal, onMount, For, Show } from 'solid-js';
import StripeModal from './StripeModal';

interface Product {
  id: string;
  name: string;
  price: number | null;
  emoji: string;
  desc: string;
}

interface CartItem {
  product: Product;
  qty: number;
}

interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  cardLast4: string;
}

const products: Product[] = [
  { id: 'panales', name: 'Pañales (paquete)', price: 450, emoji: '🍼', desc: 'Paquete de pañales para bebé' },
  { id: 'toallitas', name: 'Toallitas húmedas', price: 60, emoji: '🧻', desc: 'Toallitas húmedas para bebé' },
  { id: 'ropa', name: 'Ropa Interior de Emergencia', price: null, emoji: '👕', desc: 'Consultar talla y precio' },
  { id: 'biberon', name: 'Biberón', price: null, emoji: '🍶', desc: 'Consultar precio' },
];

export default function TiendaIsland() {
  const [quantities, setQuantities] = createSignal<Record<string, number>>({});
  const [cart, setCart] = createSignal<CartItem[]>([]);
  const [showCart, setShowCart] = createSignal(false);
  const [showStripeModal, setShowStripeModal] = createSignal(false);
  const [orderTotal, setOrderTotal] = createSignal(0);
  const [orders, setOrders] = createSignal<Order[]>([]);

  onMount(() => {
    const session = localStorage.getItem('pekes_session') || '';
    const all: Order[] = JSON.parse(localStorage.getItem('pekes_orders') || '[]');
    setOrders(all.filter((o: any) => o.tutorEmail === session));
  });

  const getQty = (id: string) => quantities()[id] || 0;

  const changeQty = (id: string, delta: number) => {
    const current = getQty(id);
    const next = Math.max(0, current + delta);
    setQuantities({ ...quantities(), [id]: next });
  };

  const addToCart = (product: Product) => {
    const qty = getQty(product.id);
    if (qty === 0) return;
    const existing = cart().find((c) => c.product.id === product.id);
    if (existing) {
      setCart(cart().map((c) => c.product.id === product.id ? { ...c, qty: c.qty + qty } : c));
    } else {
      setCart([...cart(), { product, qty }]);
    }
    setQuantities({ ...quantities(), [product.id]: 0 });
    setShowCart(true);
  };

  const removeFromCart = (id: string) => setCart(cart().filter((c) => c.product.id !== id));

  const cartTotal = () =>
    cart().reduce((sum, item) => sum + (item.product.price || 0) * item.qty, 0);

  const handleCheckout = () => {
    setOrderTotal(cartTotal());
    setShowStripeModal(true);
  };

  const handlePaymentSuccess = (data: any) => {
    const session = localStorage.getItem('pekes_session') || '';
    const newOrder: Order & { tutorEmail: string } = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      items: cart(),
      total: cartTotal(),
      cardLast4: data.cardLast4,
      tutorEmail: session,
    };
    const all = JSON.parse(localStorage.getItem('pekes_orders') || '[]');
    all.push(newOrder);
    localStorage.setItem('pekes_orders', JSON.stringify(all));
    setOrders([...orders(), newOrder]);
    setCart([]);
    setShowCart(false);
    setShowStripeModal(false);
  };

  return (
    <div class="space-y-8">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-extrabold text-pekes-dark">Tienda</h2>
        <button
          onClick={() => setShowCart(!showCart())}
          class="relative px-4 py-2 rounded-full bg-pekes-primary text-white font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          🛒 Carrito
          {cart().length > 0 && (
            <span class="absolute -top-1 -right-1 w-5 h-5 bg-pekes-coral rounded-full text-xs font-bold flex items-center justify-center">
              {cart().length}
            </span>
          )}
        </button>
      </div>

      {/* Product grid */}
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <For each={products}>
          {(product) => (
            <div class="bg-white rounded-2xl shadow-sm p-5 flex flex-col gap-3 border border-slate-100">
              <div class="text-4xl text-center">{product.emoji}</div>
              <div>
                <p class="font-bold text-slate-800 text-center">{product.name}</p>
                <p class="text-slate-500 text-xs text-center mt-0.5">{product.desc}</p>
              </div>
              <p class="text-center font-extrabold text-pekes-primary">
                {product.price ? `$${product.price.toLocaleString('es-MX')} MXN` : 'Consultar precio'}
              </p>
              <Show when={product.price !== null}>
                <div class="flex items-center justify-center gap-3">
                  <button
                    onClick={() => changeQty(product.id, -1)}
                    class="w-8 h-8 rounded-full border border-slate-300 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
                  >
                    −
                  </button>
                  <span class="text-base font-bold w-6 text-center">{getQty(product.id)}</span>
                  <button
                    onClick={() => changeQty(product.id, 1)}
                    class="w-8 h-8 rounded-full border border-slate-300 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => addToCart(product)}
                  disabled={getQty(product.id) === 0}
                  class="w-full py-2 rounded-full bg-gradient-to-r from-pekes-primary to-pekes-light text-white font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-40"
                >
                  Agregar al carrito
                </button>
              </Show>
              <Show when={product.price === null}>
                <a
                  href="https://wa.me/529981234567"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="w-full py-2 rounded-full bg-green-500 text-white font-bold text-sm text-center hover:opacity-90 transition-opacity"
                >
                  Consultar por WhatsApp
                </a>
              </Show>
            </div>
          )}
        </For>
      </div>

      {/* Cart panel */}
      <Show when={showCart() && cart().length > 0}>
        <div class="bg-white rounded-2xl shadow-sm p-6 border border-slate-100">
          <h3 class="text-lg font-extrabold text-pekes-dark mb-4">🛒 Tu carrito</h3>
          <div class="space-y-3 mb-4">
            <For each={cart()}>
              {(item) => (
                <div class="flex items-center justify-between">
                  <div>
                    <p class="font-semibold text-slate-800 text-sm">{item.product.emoji} {item.product.name}</p>
                    <p class="text-slate-500 text-xs">x{item.qty} · ${(item.product.price! * item.qty).toLocaleString('es-MX')} MXN</p>
                  </div>
                  <button onClick={() => removeFromCart(item.product.id)} class="text-red-400 hover:text-red-600 text-lg leading-none">×</button>
                </div>
              )}
            </For>
          </div>
          <div class="border-t border-slate-100 pt-4 flex items-center justify-between">
            <p class="font-extrabold text-pekes-dark">Total: ${cartTotal().toLocaleString('es-MX')} MXN</p>
            <button
              onClick={handleCheckout}
              class="px-6 py-2.5 rounded-full bg-gradient-to-r from-pekes-primary to-pekes-light text-white font-bold text-sm shadow hover:opacity-90 transition-opacity"
            >
              Proceder al pago
            </button>
          </div>
        </div>
      </Show>

      {/* Order history */}
      <Show when={orders().length > 0}>
        <div class="bg-white rounded-2xl shadow-sm p-6 border border-slate-100">
          <h3 class="text-lg font-extrabold text-pekes-dark mb-4">Historial de pedidos</h3>
          <div class="space-y-3">
            <For each={orders()}>
              {(order) => (
                <div class="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                  <div>
                    <p class="font-semibold text-slate-800 text-sm">{new Date(order.date).toLocaleDateString('es-MX')}</p>
                    <p class="text-slate-500 text-xs">•••• {order.cardLast4}</p>
                  </div>
                  <p class="font-bold text-pekes-primary">${order.total.toLocaleString('es-MX')} MXN</p>
                </div>
              )}
            </For>
          </div>
        </div>
      </Show>

      <StripeModal
        show={showStripeModal()}
        amount={orderTotal()}
        onClose={() => setShowStripeModal(false)}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
