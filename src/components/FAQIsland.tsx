import { createSignal } from 'solid-js';

const faqs = [
  {
    q: '¿Cuáles son los requisitos de inscripción?',
    a: 'Se requiere: Acta de nacimiento, cartilla de vacunación actualizada, comprobante de domicilio, datos de contacto de emergencia y datos médicos relevantes (alergias, medicamentos). Todo se gestiona fácilmente desde nuestro Portal familiar.',
  },
  {
    q: '¿Qué edades atienden?',
    a: 'Recibimos niños desde 43 días de nacidos (lactantes) hasta 6 años (preescolar). Contamos con áreas separadas por etapa de desarrollo para garantizar atención personalizada.',
  },
  {
    q: '¿Cuál es el horario de atención?',
    a: 'Lunes a viernes, 7:00 AM a 5:00 PM. Los fines de semana están disponibles con costo extra según el paquete elegido. Los feriados requieren verificación de disponibilidad previa.',
  },
  {
    q: '¿Cómo es la comunicación con los padres?',
    a: 'Enviamos reportes diarios vía WhatsApp con fotos y notas de actividades. Realizamos reuniones mensuales con las cuidadoras asignadas y publicamos un boletín educativo trimestral.',
  },
  {
    q: '¿Qué incluyen los paquetes?',
    a: 'Todos los paquetes incluyen cuidado, enseñanza, educación y pedagogía. El Paquete Completo y Semi incluyen 3 comidas diarias. Las bebidas, leche o fórmula son responsabilidad del tutor. Consulta los detalles en la sección de Paquetes.',
  },
  {
    q: '¿Cómo se realizan los pagos?',
    a: 'Los pagos se realizan de forma mensual adelantada. Aceptamos transferencia bancaria y efectivo. Para más detalles sobre costos y métodos de pago, contáctanos vía WhatsApp o ingresa al Portal familiar.',
  },
];

export default function FAQIsland() {
  const [open, setOpen] = createSignal<number | null>(null);

  const toggle = (i: number) => setOpen((prev) => (prev === i ? null : i));

  return (
    <div class="space-y-3">
      {faqs.map((faq, i) => {
        const isOpen = () => open() === i;
        return (
          <div
            class="rounded-2xl overflow-hidden transition-all duration-300"
            style={{
              background: '#fff',
              border: `1px solid ${isOpen() ? '#00b8a0' : 'rgba(0,0,0,0.06)'}`,
              'box-shadow': isOpen() ? '0 4px 24px rgba(0,184,160,0.12)' : '0 1px 4px rgba(0,0,0,0.04)',
            }}
          >
            <button
              class="w-full text-left px-6 py-5 flex justify-between items-center gap-4 cursor-pointer"
              onClick={() => toggle(i)}
              aria-expanded={isOpen()}
            >
              <span class="font-bold text-slate-800 text-sm leading-snug">{faq.q}</span>
              <span
                class="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-300"
                style={{
                  background: isOpen() ? '#00b8a0' : 'rgba(0,184,160,0.1)',
                  color: isOpen() ? '#fff' : '#00b8a0',
                  transform: isOpen() ? 'rotate(45deg)' : 'none',
                }}
                aria-hidden="true"
              >
                +
              </span>
            </button>
            <div
              class="overflow-hidden transition-all duration-300"
              style={{
                'max-height': isOpen() ? '300px' : '0',
                opacity: isOpen() ? '1' : '0',
              }}
            >
              <p class="px-6 pb-5 text-slate-500 text-sm leading-relaxed">{faq.a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
