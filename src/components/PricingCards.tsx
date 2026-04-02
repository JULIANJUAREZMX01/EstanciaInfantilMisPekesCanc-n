import { createSignal } from 'solid-js';

interface Package {
  id: string;
  title: string;
  emoji: string;
  badge?: string;
  badgeColor?: string;
  schedule: string;
  highlights: string[];
  extras: string[];
  note?: string;
  accentColor: string;
  gradientFrom: string;
  gradientTo: string;
  popular?: boolean;
}

const packages: Package[] = [
  {
    id: 'completo',
    title: 'Paquete Completo',
    emoji: '🌟',
    badge: 'Más Popular',
    badgeColor: '#ff8c42',
    schedule: 'Lun – Vie · 10 a 11 hrs',
    highlights: [
      '3 comidas incluidas',
      'Cuidado + enseñanza',
      'Educación + pedagogía',
      'Sáb / Dom: $250/día (hasta 10 hrs)',
    ],
    extras: ['Bebida / leche / fórmula: responsabilidad del tutor'],
    note: 'Feriados: verificar disponibilidad con anticipación',
    accentColor: '#ff8c42',
    gradientFrom: '#fff7f0',
    gradientTo: '#fff0e0',
    popular: true,
  },
  {
    id: 'semi',
    title: 'Paquete Semi',
    emoji: '🤝',
    schedule: 'Lun – Vie · 9 a 10 hrs',
    highlights: [
      'Todo lo del Paquete Completo',
      'Sáb / Dom: $250/día (hasta 8 hrs)',
      'Hora extra: $75',
    ],
    extras: [],
    accentColor: '#00b8a0',
    gradientFrom: '#f0fdf9',
    gradientTo: '#e6faf6',
  },
  {
    id: 'lite',
    title: 'Paquete Lite',
    emoji: '💡',
    schedule: 'Lun – Vie · hasta 8 hrs',
    highlights: [
      'Todo lo del Paquete Semi',
      'Sáb / Dom: $270/día (hasta 8 hrs)',
    ],
    extras: ['Horarios, extras y feriados pueden variar'],
    accentColor: '#457b9d',
    gradientFrom: '#f0f4ff',
    gradientTo: '#e8edfa',
  },
];

export default function PricingCards() {
  const [hovered, setHovered] = createSignal<string | null>(null);

  return (
    <div class="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
      {packages.map((pkg) => {
        const isHovered = () => hovered() === pkg.id;
        return (
          <div
            class="relative rounded-3xl overflow-hidden cursor-default transition-all duration-300"
            style={{
              background: `linear-gradient(145deg, ${pkg.gradientFrom}, ${pkg.gradientTo})`,
              border: `2px solid ${isHovered() ? pkg.accentColor : 'rgba(0,0,0,0.06)'}`,
              transform: isHovered() ? 'translateY(-8px) scale(1.02)' : pkg.popular ? 'translateY(-4px)' : 'none',
              'box-shadow': isHovered()
                ? `0 20px 60px ${pkg.accentColor}33`
                : pkg.popular
                ? `0 12px 40px ${pkg.accentColor}22`
                : '0 4px 20px rgba(0,0,0,0.06)',
            }}
            onMouseEnter={() => setHovered(pkg.id)}
            onMouseLeave={() => setHovered(null)}
          >
            {/* Popular badge */}
            {pkg.badge && (
              <div
                class="absolute top-4 right-4 text-white text-xs font-extrabold px-3 py-1 rounded-full animate-pulse-badge"
                style={{ background: pkg.badgeColor }}
              >
                {pkg.badge}
              </div>
            )}

            {/* Header */}
            <div
              class="px-7 pt-8 pb-5"
              style={{ borderBottom: `2px dashed ${pkg.accentColor}33` }}
            >
              <div
                class="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-4 transition-transform duration-300"
                style={{
                  background: `${pkg.accentColor}18`,
                  transform: isHovered() ? 'scale(1.1) rotate(-3deg)' : 'none',
                }}
              >
                {pkg.emoji}
              </div>
              <h3 class="text-lg font-extrabold mb-1" style={{ color: pkg.accentColor }}>
                {pkg.title}
              </h3>
              <p class="text-sm font-semibold text-slate-500">🗓️ {pkg.schedule}</p>
            </div>

            {/* Features */}
            <div class="px-7 py-5 flex-1">
              <ul class="space-y-2.5 mb-4">
                {pkg.highlights.map((h) => (
                  <li class="flex items-start gap-2 text-sm text-slate-600">
                    <span class="mt-0.5 flex-shrink-0" style={{ color: pkg.accentColor }}>✓</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
              {pkg.extras.length > 0 && (
                <div
                  class="rounded-xl px-4 py-3 mb-4"
                  style={{ background: `${pkg.accentColor}10` }}
                >
                  {pkg.extras.map((e) => (
                    <p class="text-xs text-slate-500 leading-relaxed">ℹ️ {e}</p>
                  ))}
                </div>
              )}
              {pkg.note && (
                <p class="text-xs text-slate-400 italic">{pkg.note}</p>
              )}
            </div>

            {/* CTA */}
            <div class="px-7 pb-7">
              <a
                href={`/login?paquete=${pkg.id}`}
                class="block text-center text-sm font-extrabold py-3 px-6 rounded-2xl transition-all duration-200"
                style={{
                  background: isHovered() ? pkg.accentColor : `${pkg.accentColor}18`,
                  color: isHovered() ? '#fff' : pkg.accentColor,
                  'box-shadow': isHovered() ? `0 6px 20px ${pkg.accentColor}44` : 'none',
                }}
              >
                Ver precios / Inscribirme →
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
}
