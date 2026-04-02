import { createSignal, For } from 'solid-js';

const COLORS = [
  { id: 'red', name: 'Rojo', hex: '#ef4444' },
  { id: 'blue', name: 'Azul', hex: '#3b82f6' },
  { id: 'green', name: 'Verde', hex: '#22c55e' },
  { id: 'yellow', name: 'Amarillo', hex: '#eab308' }
];

export default function ColorGame() {
  const [currentColor, setCurrentColor] = createSignal(COLORS[0]);

  return (
    <div class="bg-white p-6 rounded-2xl shadow-lg border border-teal-100 flex flex-col h-96">
      <h3 class="font-bold text-xl text-teal-700 mb-4">Aprende los Colores</h3>

      <div
        class="flex-1 rounded-xl transition-colors duration-500 flex items-center justify-center border border-gray-200 mb-6"
        style={{ "background-color": currentColor().hex }}
      >
        <h2 class="text-5xl font-black text-white uppercase tracking-widest drop-shadow-md">
          {currentColor().name}
        </h2>
      </div>

      <div class="grid grid-cols-4 gap-4">
        <For each={COLORS}>
          {(color) => (
            <button
              onClick={() => setCurrentColor(color)}
              class="h-16 rounded-xl shadow-md transition-transform hover:scale-105 active:scale-95"
              style={{ "background-color": color.hex }}
              aria-label={`Seleccionar color ${color.name}`}
            />
          )}
        </For>
      </div>
    </div>
  );
}
