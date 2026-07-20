import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Stat {
  label: string;
  value: number;
  suffix: string;
}

interface PanelData {
  tag: string;
  year: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  mobileImage: string;
  stats: Stat[];
}

const PANELS: PanelData[] = [
  {
    tag: '01 — ESCUCHAMOS',
    year: '',
    title: 'ESCUCHAMOS',
    subtitle: 'Cada negocio tiene una historia diferente',
    description:
      'Por eso nuestra primera tarea siempre es entender la tuya.',
    image: '/images/dinamo-2.jpeg',
    mobileImage: '/images/dinamo-2-mobile.jpeg',
    stats: [],
  },
  {
    tag: '02 — PLANEAMOS',
    year: '',
    title: 'PLANEAMOS',
    subtitle: 'Analizamos tu marca y definimos prioridades',
    description:
      'Construimos una estrategia que tenga sentido para el momento en el que se encuentra tu negocio.',
    image: '/images/dinamo-4.jpeg',
    mobileImage: '/images/dinamo-4-mobile.jpeg',
    stats: [],
  },
  {
    tag: '03 — CREAMOS',
    year: '',
    title: 'CREAMOS',
    subtitle: 'Diseño, contenido, fotografía, video y desarrollo',
    description:
      'Todo trabajando como un solo equipo.',
    image: '/images/dinamo-5.jpeg',
    mobileImage: '/images/dinamo-5-mobile.jpeg',
    stats: [],
  },
  {
    tag: '04 — ACOMPAÑAMOS',
    year: '',
    title: 'ACOMPAÑAMOS',
    subtitle: 'No desaparecemos después de entregar un proyecto',
    description:
      'Nos interesa que tu marca siga creciendo y que cada decisión tenga un propósito.',
    image: '/images/dinamo-6.jpeg',
    mobileImage: '/images/dinamo-6-mobile.jpeg',
    stats: [],
  },
];

export default function MilestonesScroll() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imgWrapRefs = useRef<(HTMLDivElement | null)[]>([]);
  const titleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tagRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const descRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const statRowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const statNumRefs = useRef<(HTMLSpanElement | null)[][]>(PANELS.map(() => []));

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // ─── DESKTOP: pin + horizontal scroll ───────────────────────────
      mm.add('(min-width: 768px)', () => {
        const section = sectionRef.current!;
        const track = trackRef.current!;

        track.style.width = `${PANELS.length * 100}vw`;

        const scrollTween = gsap.to(track, {
          x: () => -(track.scrollWidth - window.innerWidth),
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            pin: true,
            scrub: 1.5,
            end: () => `+=${track.scrollWidth - window.innerWidth}`,
            invalidateOnRefresh: true,
            onUpdate(self) {
              const active = Math.round(self.progress * (PANELS.length - 1));
              dotRefs.current.forEach((dot, i) => {
                if (!dot) return;
                dot.style.backgroundColor =
                  i === active ? '#f0503d' : 'rgba(255,255,255,0.2)';
                dot.style.width = i === active ? '28px' : '14px';
              });
            },
          },
        });

        PANELS.forEach((panelData, i) => {
          const panel = panelRefs.current[i];
          if (!panel) return;

          const common = {
            trigger: panel,
            containerAnimation: scrollTween,
            toggleActions: 'play none none reverse' as const,
          };

          // Parallax on background image
          const imgWrap = imgWrapRefs.current[i];
          if (imgWrap) {
            gsap.fromTo(
              imgWrap,
              { x: 100 },
              {
                x: -100,
                ease: 'none',
                scrollTrigger: {
                  trigger: panel,
                  containerAnimation: scrollTween,
                  start: 'left right',
                  end: 'right left',
                  scrub: true,
                },
              }
            );
          }

          // Tag slide-in
          const tagEl = tagRefs.current[i];
          if (tagEl) {
            gsap.fromTo(
              tagEl,
              { opacity: 0, x: -28 },
              {
                opacity: 1,
                x: 0,
                duration: 0.7,
                ease: 'power2.out',
                scrollTrigger: { ...common, start: 'left 82%' },
              }
            );
          }

          // Title reveal (clip + y)
          const titleEl = titleRefs.current[i];
          if (titleEl) {
            gsap.fromTo(
              titleEl,
              { y: 80, opacity: 0, clipPath: 'inset(0 0 100% 0)' },
              {
                y: 0,
                opacity: 1,
                clipPath: 'inset(0 0 0% 0)',
                duration: 1,
                ease: 'power4.out',
                scrollTrigger: { ...common, start: 'left 78%' },
              }
            );
          }

          // Accent line scale
          const lineEl = lineRefs.current[i];
          if (lineEl) {
            gsap.fromTo(
              lineEl,
              { scaleX: 0 },
              {
                scaleX: 1,
                duration: 0.8,
                ease: 'power2.inOut',
                delay: 0.15,
                scrollTrigger: { ...common, start: 'left 78%' },
              }
            );
          }

          // Description fade-up
          const descEl = descRefs.current[i];
          if (descEl) {
            gsap.fromTo(
              descEl,
              { opacity: 0, y: 24 },
              {
                opacity: 1,
                y: 0,
                duration: 0.7,
                ease: 'power2.out',
                delay: 0.2,
                scrollTrigger: { ...common, start: 'left 78%' },
              }
            );
          }

          // Stats row fade-up
          const statRow = statRowRefs.current[i];
          if (statRow) {
            gsap.fromTo(
              statRow,
              { opacity: 0, y: 32 },
              {
                opacity: 1,
                y: 0,
                duration: 0.7,
                ease: 'power2.out',
                delay: 0.3,
                scrollTrigger: { ...common, start: 'left 78%' },
              }
            );
          }

          // Stat counters
          panelData.stats.forEach((stat, si) => {
            const numEl = statNumRefs.current[i]?.[si];
            if (!numEl) return;
            const counter = { val: 0 };
            gsap.to(counter, {
              val: stat.value,
              duration: 1.6,
              ease: 'power2.out',
              snap: { val: 1 },
              scrollTrigger: { ...common, start: 'left 68%' },
              onUpdate() {
                numEl.textContent = Math.round(counter.val).toString();
              },
            });
          });
        });

        return () => {
          track.style.width = '';
        };
      });

      // ─── MOBILE: stacked vertical panels ────────────────────────────
      mm.add('(max-width: 767px)', () => {
        PANELS.forEach((panelData, i) => {
          const panel = panelRefs.current[i];
          if (!panel) return;

          const common = {
            trigger: panel,
            start: 'top 82%',
            toggleActions: 'play none none reverse' as const,
          };

          const tagEl = tagRefs.current[i];
          if (tagEl)
            gsap.fromTo(tagEl, { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out', scrollTrigger: common });

          const titleEl = titleRefs.current[i];
          if (titleEl)
            gsap.fromTo(titleEl, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', scrollTrigger: common });

          const lineEl = lineRefs.current[i];
          if (lineEl)
            gsap.fromTo(lineEl, { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: 'power2.inOut', delay: 0.1, scrollTrigger: common });

          const descEl = descRefs.current[i];
          if (descEl)
            gsap.fromTo(descEl, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 0.15, scrollTrigger: common });

          const statRow = statRowRefs.current[i];
          if (statRow)
            gsap.fromTo(statRow, { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 0.25, scrollTrigger: common });

          panelData.stats.forEach((stat, si) => {
            const numEl = statNumRefs.current[i]?.[si];
            if (!numEl) return;
            const counter = { val: 0 };
            gsap.to(counter, {
              val: stat.value,
              duration: 1.5,
              ease: 'power2.out',
              snap: { val: 1 },
              scrollTrigger: common,
              onUpdate() {
                numEl.textContent = Math.round(counter.val).toString();
              },
            });
          });
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <div id="proceso" className="bg-brand-dark pt-20 md:pt-28 pb-12 md:pb-16 px-6 md:px-12 lg:px-20">
        <div className="max-w-[1400px] mx-auto">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-brand-lime mb-3">Proceso</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium uppercase tracking-tighter text-white leading-none max-w-3xl mb-6">
            Nuestro proceso
          </h2>
          <p className="text-white/50 text-base md:text-lg leading-relaxed max-w-2xl">
            No creemos en las fórmulas mágicas. Creemos en conocer a las personas antes de tomar decisiones.
          </p>
        </div>
      </div>

    <section ref={sectionRef} className="relative bg-brand-dark overflow-hidden">

      {/* Horizontal track */}
      <div ref={trackRef} className="flex flex-col md:flex-row">
        {PANELS.map((panel, i) => (
          <div
            key={i}
            ref={(el) => { panelRefs.current[i] = el; }}
            className="relative w-screen h-screen flex-shrink-0 overflow-hidden"
          >

            {/* Background image with parallax wrapper */}
            <div className="absolute inset-0 overflow-hidden">
              <div
                ref={(el) => { imgWrapRefs.current[i] = el; }}
                className="absolute inset-0 scale-[1.15]"
              >
                <picture>
                  <source
                    media="(max-width: 767px)"
                    srcSet={panel.mobileImage}
                  />
                  <img
                    src={panel.image}
                    alt={panel.title.replace('\n', ' ')}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </picture>
              </div>
              {/* Gradient overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/20 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/30 to-transparent pointer-events-none" />
            </div>

            {/* Year watermark */}
            {panel.year && (
              <div
                aria-hidden="true"
                className="absolute right-4 top-1/3 -translate-y-1/2 font-black leading-none select-none pointer-events-none hidden lg:block"
                style={{ fontSize: 'clamp(80px, 14vw, 200px)', color: 'rgba(255,255,255,0.04)' }}
              >
                {panel.year}
              </div>
            )}

            {/* Panel index watermark */}
            <div
              aria-hidden="true"
              className="absolute right-8 bottom-16 font-black leading-none select-none pointer-events-none hidden lg:block"
              style={{ fontSize: 'clamp(60px, 7vw, 120px)', color: 'rgba(255,255,255,0.04)' }}
            >
              {String(i + 1).padStart(2, '0')}
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-between px-8 md:px-12 lg:px-16 xl:px-20 pt-24 md:pt-28 pb-10">

              {/* Top: tag */}
              <div>
                <span
                  ref={(el) => { tagRefs.current[i] = el; }}
                  className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-brand-lime"
                >
                  {panel.tag}
                </span>
              </div>

              {/* Middle: title + text */}
              <div className="flex-1 flex items-center">
                <div className="max-w-lg">
                  <div
                    ref={(el) => { titleRefs.current[i] = el; }}
                  >
                    <h2
                      className="text-3xl md:text-4xl lg:text-5xl font-medium uppercase leading-[0.88] text-white whitespace-pre-line"
                    >
                      {panel.title}
                    </h2>
                  </div>

                  {/* Lime accent line */}
                  <div
                    ref={(el) => { lineRefs.current[i] = el; }}
                    className="h-[2px] bg-brand-gold mt-6 origin-left"
                    style={{ width: '64px' }}
                  />

                  <p className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.25em] text-white/40 mt-4">
                    {panel.subtitle}
                  </p>

                  <p
                    ref={(el) => { descRefs.current[i] = el; }}
                    className="text-sm md:text-base text-white/55 mt-4 leading-relaxed"
                    style={{ maxWidth: '320px' }}
                  >
                    {panel.description}
                  </p>
                </div>
              </div>

              {/* Bottom: stats */}
              <div
                ref={(el) => { statRowRefs.current[i] = el; }}
                className={`flex gap-8 md:gap-10 lg:gap-14 ${panel.stats.length > 0 ? 'pt-6 border-t border-white/10' : ''}`}
              >
                {panel.stats.map((stat, si) => (
                  <div key={si} className="flex flex-col gap-1.5">
                    <div className="flex items-baseline gap-0.5">
                      <span
                        ref={(el) => {
                          if (!statNumRefs.current[i]) statNumRefs.current[i] = [];
                          statNumRefs.current[i][si] = el;
                        }}
                        className="font-black text-white tabular-nums"
                        style={{ fontSize: 'clamp(22px, 2.5vw, 36px)' }}
                      >
                        0
                      </span>
                      {stat.suffix && (
                        <span
                          className="font-black text-brand-lime"
                          style={{ fontSize: 'clamp(14px, 1.5vw, 22px)' }}
                        >
                          {stat.suffix}
                        </span>
                      )}
                    </div>
                    <span className="text-[9px] md:text-[10px] uppercase tracking-[0.25em] text-white/30 font-semibold">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Progress indicator — desktop only */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 hidden md:flex items-center gap-2">
        {PANELS.map((_, i) => (
          <div
            key={i}
            ref={(el) => { dotRefs.current[i] = el; }}
            className="h-[2px] rounded-full transition-all duration-300"
            style={{
              width: i === 0 ? '28px' : '14px',
              backgroundColor: i === 0 ? '#f0503d' : 'rgba(255,255,255,0.2)',
            }}
          />
        ))}
      </div>

    </section>
    </>
  );
}
