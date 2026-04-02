import { createSignal, onMount, onCleanup, For } from 'solid-js';

interface Bubble {
  id: number;
  left: number;
  size: number;
  color: string;
  duration: number;
}

const BUBBLE_COLORS = ['bg-red-400', 'bg-blue-400', 'bg-green-400', 'bg-yellow-400', 'bg-purple-400'];

export default function BubbleGame() {
  const [bubbles, setBubbles] = createSignal<Bubble[]>([]);
  const [score, setScore] = createSignal(0);
  let timerId: number;

  onMount(() => {
    timerId = window.setInterval(() => {
      setBubbles(prev => {
        if (prev.length > 7) return prev.slice(1);
        const newBubble: Bubble = {
          id: Date.now() + Math.random(),
          left: Math.random() * 80 + 10,
          size: Math.random() * 40 + 40,
          color: BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)],
          duration: Math.random() * 2 + 3
        };
        return [...prev, newBubble];
      });
    }, 1000);
  });

  onCleanup(() => clearInterval(timerId));

  const popBubble = (id: number) => {
    setBubbles(prev => prev.filter(b => b.id !== id));
    setScore(s => s + 1);
  };

  return (
    <div class="bg-white p-6 rounded-2xl shadow-lg border border-teal-100 flex flex-col h-96 relative overflow-hidden">
      <div class="flex justify-between items-center mb-4 z-10">
        <h3 class="font-bold text-xl text-teal-700">Atrapa las Burbujas</h3>
        <span class="bg-teal-100 text-teal-800 px-4 py-1 rounded-full font-bold">Puntos: {score()}</span>
      </div>

      <div class="flex-1 relative bg-gradient-to-b from-teal-50 to-cyan-100 rounded-xl overflow-hidden border border-gray-200">
        <style>
          {`
            @keyframes floatUp {
              0% { transform: translateY(100%) scale(1); opacity: 1; }
              100% { transform: translateY(-300px) scale(1.2); opacity: 0; }
            }
          `}
        </style>
        <For each={bubbles()}>
          {(bubble) => (
            <div
              onClick={() => popBubble(bubble.id)}
              class={`absolute bottom-[-20px] rounded-full cursor-pointer shadow-[inset_-5px_-5px_15px_rgba(0,0,0,0.1)] ${bubble.color}`}
              style={{
                left: `${bubble.left}%`,
                width: `${bubble.size}px`,
                height: `${bubble.size}px`,
                animation: `floatUp ${bubble.duration}s linear forwards`
              }}
            />
          )}
        </For>
      </div>
    </div>
  );
}
