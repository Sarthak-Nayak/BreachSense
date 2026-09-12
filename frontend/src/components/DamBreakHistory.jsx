import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Calendar,
  Droplets,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';

/* ---------------------------------------------------------------
   INCIDENT DATA  (8 verified events; break1–break5 cycled for img)
--------------------------------------------------------------- */
const incidents = [
  {
    id: 1,
    image: '/assets/history/break1.webp',
    title: 'Rasuwa / Nepal Flash Flood',
    date: '26 August 2026',
    location: 'Rasuwa, Nepal–Tibet border',
    river: 'Bhote Koshi – Trishuli corridor',
    damType: 'Glacier / ice-rock collapse → debris flow',
    cause:
      'A large high-altitude glacier/rock mass collapsed and released ice, rock, mud and debris into the river system.',
    casualties:
      '~1,380 confirmed dead (by 9 Sept); ~5,500 reported missing across Nepal and Tibet.',
    financialLoss:
      'At least 11 hydropower projects were severely affected.',
    links: {
      source: 'https://en.wikipedia.org/wiki/2026_Nepal%E2%80%93Tibet_floods',
      details: '',
    },
  },
  {
    id: 2,
    image: '/assets/history/break2.webp',
    title: 'Machhu-II Dam Failure',
    date: '11 August 1979',
    location: 'Morbi, Gujarat, India',
    river: 'Machhu River',
    damType: 'Masonry + earthfill dam',
    cause:
      'Extreme flooding overtopped the dam and washed away large sections of the earth embankment.',
    casualties:
      '~2,000 deaths widely reported; exact toll remains uncertain.',
    financialLoss:
      'Morbi and nearby villages heavily flooded; ~150,000 people affected.',
    links: {
      source: 'https://www.usbr.gov/tsc/techreferences/mands/mands-pdfs/AZ1130.pdf',
      details: 'https://en.wikipedia.org/wiki/1979_Machchhu_dam_failure',
    },
  },
  {
    id: 3,
    image: '/assets/history/break3.webp',
    title: 'Panshet Dam Failure',
    date: '12 July 1961',
    location: 'Pune, Maharashtra, India',
    river: 'Ambi → Mutha River',
    damType: 'Earthfill dam',
    cause:
      'Failure of Panshet Dam released a major flood into the Mutha system and inundated Pune.',
    casualties:
      'Hundreds of deaths reported; historical estimates vary.',
    financialLoss:
      'Large parts of Pune flooded; homes, roads and bridges damaged.',
    links: {
      source: 'https://en.wikipedia.org/wiki/Panshet_Dam',
      details: 'https://en.wikipedia.org/wiki/Panshet_Dam',
    },
  },
  {
    id: 4,
    image: '/assets/history/break4.avif',
    title: 'Tiware Dam Breach',
    date: '2–3 July 2019',
    location: 'Ratnagiri, Maharashtra, India',
    river: 'Local stream / downstream drainage',
    damType: 'Earthen irrigation dam',
    cause:
      'A breach developed after intense rainfall and rapidly flooded downstream villages.',
    casualties:
      '23–24 deaths in official and media accounts.',
    financialLoss:
      'Seven downstream villages affected; multiple houses swept away.',
    links: {
      source: 'https://www.newindianexpress.com/nation/2019/Jul/04/government-announces-sit-probe-after-maharashtra-dam-breach-kills-24-1999280.html',
      details: 'https://www.business-standard.com/article/pti-stories/sit-to-probe-breach-in-tiware-dam-mahajan-119070301523_1.html',
    },
  },
  {
    id: 5,
    image: '/assets/history/break5.webp',
    title: 'Annamayya Dam Failure',
    date: '19 November 2021',
    location: 'Kadapa, Andhra Pradesh, India',
    river: 'Cheyyeru River',
    damType: 'Earthen irrigation project',
    cause:
      'Extreme inflow overwhelmed the reservoir and caused the dam to breach, producing severe downstream flooding.',
    casualties:
      '33 dead; six remained untraced.',
    financialLoss:
      'Thousands of homes, farmland, livestock and local infrastructure damaged.',
    links: {
      source: 'https://www.hindustantimes.com/india-news/flood-after-annamayya-dam-breach-year-on-families-of-victims-struggle-to-pick-up-pieces-101668971900097.html',
      details: 'https://en.wikipedia.org/wiki/Annamayya_Dam',
    },
  },
  {
    id: 6,
    image: '/assets/history/break6.webp',
    title: 'Sikkim GLOF & Teesta-III Failure',
    date: '4 October 2023',
    location: 'North Sikkim, India',
    river: 'Teesta River',
    damType: 'Concrete hydropower dam',
    cause:
      'A GLOF from South Lhonak Lake produced a sudden Teesta surge and destroyed Chungthang / Teesta-III infrastructure.',
    casualties:
      '30 deaths and 81 missing reported by 7 October 2023.',
    financialLoss:
      'Teesta-III hydropower infrastructure, bridges, roads and settlements severely damaged.',
    links: {
      source: 'https://www.pib.gov.in/PressReleaseIframePage.aspx?PRID=1965603&lang=2&reg=3',
      details: 'https://ndmindia.mha.gov.in/ndmi/viewUploadedDocument?uid=D1157',
    },
  },
  {
    id: 7,
    image: '/assets/history/break7.avif',
    title: 'Chamoli Flash Flood',
    date: '7 February 2021',
    location: 'Chamoli, Uttarakhand, India',
    river: 'Rishiganga / Dhauliganga',
    damType: 'Hydropower projects',
    cause:
      'A massive rock–ice avalanche transformed into a destructive debris flow and flash flood.',
    casualties:
      '204 missing; 80 bodies recovered by July 2021.',
    financialLoss:
      '13.2 MW Rishiganga project washed away; 520 MW Tapovan project severely damaged.',
    links: {
      source: 'https://ndmindia.mha.gov.in/ndmi/viewUploadedDocument?uid=NEW207',
      details: 'https://en.wikipedia.org/wiki/2021_Uttarakhand_flood',
    },
  },
  {
    id: 8,
    image: '/assets/history/break1.webp',
    title: 'Bhote Koshi Flash Flood',
    date: '26 August 2026',
    location: 'Nepal–Tibet border',
    river: 'Bhote Koshi / Trishuli system',
    damType: 'Natural blockage + hydropower corridor',
    cause:
      'A large ice–rock–soil mass failure blocked the river; the blockage then breached releasing a destructive debris flood.',
    casualties:
      '~1,380 confirmed dead; ~5,500 still missing across Nepal and Tibet.',
    financialLoss:
      'Major damage to villages, roads, bridges and the Nepal–China border corridor.',
    links: {
      source: 'https://www.reuters.com/business/environment/nepal-floods-aftermath-through-lens-reuters-photographers-2026-09-09/',
      details: 'https://www.mofa.gov.np/content/1866/press-briefing-note-by-hon--minister-for/',
    },
  },
];

const TRANSITION_MS = 400;   // slide animation duration
const AUTO_INTERVAL = 2000;  // auto-advance every 2 s

/* ---------------------------------------------------------------
   MAIN COMPONENT
--------------------------------------------------------------- */
export default function DamBreakHistory() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  // slide direction: 'left' (next) | 'right' (prev)
  const [direction, setDirection] = useState('left');
  // phase: 'idle' | 'exit' | 'enter'
  const [phase, setPhase] = useState('idle');

  const intervalRef = useRef(null);
  const touchStartRef = useRef(null);
  const isAnimatingRef = useRef(false);

  /* ---------- navigation helpers ---------- */
  const navigate = useCallback((dir, targetIndex) => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    setDirection(dir);
    setPhase('exit');
    setTimeout(() => {
      setCurrentIndex(targetIndex);
      setPhase('enter');
      setTimeout(() => {
        setPhase('idle');
        isAnimatingRef.current = false;
      }, TRANSITION_MS);
    }, TRANSITION_MS);
  }, []);

  const goToNext = useCallback(() => {
    const next = (currentIndex + 1) % incidents.length;
    navigate('left', next);
  }, [currentIndex, navigate]);

  const goToPrev = useCallback(() => {
    const prev = (currentIndex - 1 + incidents.length) % incidents.length;
    navigate('right', prev);
  }, [currentIndex, navigate]);

  const goToIndex = useCallback((index) => {
    if (index === currentIndex) return;
    const dir = index > currentIndex ? 'left' : 'right';
    setIsAutoPlaying(false);
    navigate(dir, index);
  }, [currentIndex, navigate]);

  /* ---------- auto-play ---------- */
  useEffect(() => {
    if (!isAutoPlaying) return;
    intervalRef.current = setInterval(goToNext, AUTO_INTERVAL);
    return () => clearInterval(intervalRef.current);
  }, [isAutoPlaying, goToNext]);

  /* ---------- touch ---------- */
  const handleTouchStart = (e) => { touchStartRef.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (!touchStartRef.current) return;
    const diff = touchStartRef.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { diff > 0 ? goToNext() : goToPrev(); }
    touchStartRef.current = null;
  };

  /* ---------- slide CSS transform ---------- */
  const slideStyle = (() => {
    if (phase === 'exit') {
      return {
        opacity: 0,
        transform: direction === 'left' ? 'translateX(-60px)' : 'translateX(60px)',
        transition: `opacity ${TRANSITION_MS}ms ease, transform ${TRANSITION_MS}ms ease`,
      };
    }
    if (phase === 'enter') {
      return {
        opacity: 0,
        transform: direction === 'left' ? 'translateX(60px)' : 'translateX(-60px)',
        transition: 'none',
      };
    }
    // idle
    return {
      opacity: 1,
      transform: 'translateX(0)',
      transition: `opacity ${TRANSITION_MS}ms ease, transform ${TRANSITION_MS}ms ease`,
    };
  })();

  const incident = incidents[currentIndex];

  return (
    <div
      style={{ marginTop: '2.5rem' }}
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* ── HEADER ─────────────────────────────────────────────── */}
      <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          backgroundColor: '#FEF2F2', color: '#DC2626',
          padding: '0.35rem 0.85rem', borderRadius: '9999px',
          fontSize: '0.75rem', fontWeight: 700,
          border: '1px solid #FCA5A5', marginBottom: '0.75rem',
          letterSpacing: '0.03em', textTransform: 'uppercase',
        }}>
          <AlertTriangle size={14} />
          Historical Dam & Flash-Flood Events
        </div>
        <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          Lessons from Past Dam & Flash-Flood Disasters
        </h3>
        <p style={{
          fontSize: '0.85rem', color: 'var(--text-secondary)',
          maxWidth: '560px', margin: '0.4rem auto 0 auto', lineHeight: 1.6,
        }}>
          Verified examples from India and recent Himalayan events — showing why rapid
          flood-wave prediction matters.
        </p>
      </div>

      {/* ── CARD CONTAINER ─────────────────────────────────────── */}
      <div style={{ position: 'relative', maxWidth: '1000px', margin: '0 auto', padding: '0 28px' }}>

        {/* PREV button */}
        <NavBtn side="left" onClick={() => { setIsAutoPlaying(false); goToPrev(); }} />

        {/* NEXT button */}
        <NavBtn side="right" onClick={() => { setIsAutoPlaying(false); goToNext(); }} />

        {/* SLIDE WRAPPER */}
        <div style={{ overflow: 'hidden', borderRadius: 'var(--radius-lg)' }}>
          <div style={{
            ...slideStyle,
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-lg)',
            overflow: 'hidden',
          }}>
            <div className="dbh-grid" style={{
              display: 'grid',
              gridTemplateColumns: '380px 1fr',
              height: '420px',
            }}>

              {/* ── IMAGE PANEL ───────────────────────────────── */}
              <div style={{ position: 'relative', overflow: 'hidden', backgroundColor: '#1A1A1A' }}>
                <picture key={incident.id} style={{ width: '100%', height: '100%', display: 'block' }}>
                  <source srcSet={incident.image} type={
                    incident.image.endsWith('.avif') ? 'image/avif' :
                    incident.image.endsWith('.webp') ? 'image/webp' :
                    incident.image.endsWith('.png')  ? 'image/png'  :
                    'image/jpeg'
                  } />
                  <img
                    src={incident.image}
                    alt={incident.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                    onError={(e) => {
                      // hide broken image; dark bg from parent div shows instead
                      e.currentTarget.style.visibility = 'hidden';
                    }}
                  />
                </picture>
                {/* gradient overlay at bottom */}
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  height: '120px',
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.75))',
                  pointerEvents: 'none',
                }} />
                {/* counter pill */}
                <div style={{
                  position: 'absolute', top: '12px', left: '12px',
                  backgroundColor: 'rgba(0,0,0,0.65)', color: '#FFFFFF',
                  padding: '0.2rem 0.65rem', borderRadius: '6px',
                  fontSize: '0.72rem', fontWeight: 700, backdropFilter: 'blur(4px)',
                }}>
                  {currentIndex + 1} / {incidents.length}
                </div>
                {/* incident title over image */}
                <div style={{
                  position: 'absolute', bottom: '14px', left: '14px', right: '14px',
                  color: '#FFFFFF', fontSize: '0.9rem', fontWeight: 700, lineHeight: 1.3,
                  textShadow: '0 1px 4px rgba(0,0,0,0.8)',
                }}>
                  {incident.title}
                </div>
              </div>

              {/* ── INFO PANEL ────────────────────────────────── */}
              <div style={{
                padding: '1.5rem 1.75rem',
                display: 'flex', flexDirection: 'column', justifyContent: 'center',
                overflowY: 'auto',
              }}>
                {/* META CHIPS */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginBottom: '1rem' }}>
                  <MetaChip icon={<Calendar size={13} color="var(--accent-primary)" />} text={incident.date} />
                  <MetaChip icon={<MapPin size={13} color="#DC2626" />} text={incident.location} />
                  <MetaChip icon={<Droplets size={13} color="#0891B2" />} text={incident.river} />
                </div>

                {/* TYPE + CAUSE */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', marginBottom: '0.75rem' }}>
                  <InfoBox label="Dam / Event Type" value={incident.damType} />
                  <InfoBox label="Cause" value={incident.cause} />
                </div>

                {/* CASUALTIES */}
                <InfoBox label="Human impact" value={incident.casualties} danger style={{ marginBottom: '0.6rem' }} />

                {/* FINANCIAL */}
                <InfoBox label="Infrastructure & property impact" value={incident.financialLoss} warning style={{ marginTop: '0.6rem', marginBottom: '1rem' }} />

                {/* LINKS */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {incident.links.source && (
                    <SourceLink href={incident.links.source} label="Source" variant="primary" />
                  )}
                  {incident.links.details && (
                    <SourceLink href={incident.links.details} label="More details" variant="danger" />
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ── DOTS ──────────────────────────────────────────────── */}
        <div style={{
          display: 'flex', justifyContent: 'center', gap: '0.5rem',
          marginTop: '1.25rem', alignItems: 'center',
        }}>
          {incidents.map((_, i) => (
            <button
              key={i}
              onClick={() => goToIndex(i)}
              aria-label={`Go to incident ${i + 1}`}
              style={{
                width: currentIndex === i ? '24px' : '8px',
                height: '8px', borderRadius: '9999px',
                backgroundColor: currentIndex === i ? 'var(--accent-primary)' : '#D1D5DB',
                border: 'none', cursor: 'pointer', padding: 0,
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>

        {/* ── PROGRESS BAR ─────────────────────────────────────── */}
        <div style={{
          maxWidth: '220px', margin: '0.75rem auto 0',
          height: '3px', backgroundColor: '#E5E7EB',
          borderRadius: '9999px', overflow: 'hidden',
        }}>
          <div style={{
            width: `${((currentIndex + 1) / incidents.length) * 100}%`,
            height: '100%', backgroundColor: 'var(--accent-primary)',
            borderRadius: '9999px', transition: 'width 0.5s ease',
          }} />
        </div>
      </div>

      {/* ── RESPONSIVE CSS ────────────────────────────────────── */}
      <style>{`
        @media (max-width: 720px) {
          .dbh-grid {
            grid-template-columns: 1fr !important;
            height: auto !important;
          }
          .dbh-grid > div:first-child img {
            height: 240px !important;
          }
        }
      `}</style>
    </div>
  );
}

/* ---------------------------------------------------------------
   SUB-COMPONENTS
--------------------------------------------------------------- */
function NavBtn({ side, onClick }) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <button
      aria-label={side === 'left' ? 'Previous incident' : 'Next incident'}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'absolute',
        [side]: '-4px',
        top: '50%',
        transform: `translateY(-50%) scale(${hovered ? 1.08 : 1})`,
        width: '40px', height: '40px', borderRadius: '50%',
        backgroundColor: '#FFFFFF',
        border: '1px solid var(--border-light)',
        boxShadow: hovered ? '0 4px 14px rgba(0,0,0,0.15)' : '0 2px 8px rgba(0,0,0,0.1)',
        cursor: 'pointer', display: 'flex', alignItems: 'center',
        justifyContent: 'center', zIndex: 10,
        transition: 'box-shadow 0.2s ease, transform 0.2s ease',
      }}
    >
      {side === 'left'
        ? <ChevronLeft size={20} color="var(--text-primary)" />
        : <ChevronRight size={20} color="var(--text-primary)" />}
    </button>
  );
}

function MetaChip({ icon, text }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
      fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600,
      backgroundColor: '#F9FAFB', border: '1px solid #F3F4F6',
      padding: '0.2rem 0.55rem', borderRadius: '6px',
    }}>
      {icon} {text}
    </span>
  );
}

function InfoBox({ label, value, danger = false, warning = false, style: extraStyle }) {
  const bg = danger ? '#FEF2F2' : warning ? '#FFFBEB' : '#F9FAFB';
  const border = danger ? '#FCA5A5' : warning ? '#FDE68A' : '#F3F4F6';
  const labelClr = danger ? '#991B1B' : warning ? '#92400E' : 'var(--text-muted)';
  const textClr = danger ? '#7F1D1D' : warning ? '#78350F' : 'var(--text-primary)';
  return (
    <div style={{ backgroundColor: bg, borderRadius: '8px', padding: '0.6rem 0.75rem', border: `1px solid ${border}`, ...extraStyle }}>
      <div style={{ fontSize: '0.67rem', fontWeight: 700, color: labelClr, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.2rem' }}>
        {label}
      </div>
      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: textClr, lineHeight: 1.45 }}>
        {value}
      </div>
    </div>
  );
}

function SourceLink({ href, label, variant = 'primary' }) {
  if (!href) return null;
  const styles = {
    primary: { color: 'var(--accent-primary)', bg: 'var(--accent-light)', border: '#BFDBFE' },
    danger: { color: '#DC2626', bg: '#FEF2F2', border: '#FCA5A5' },
  };
  const s = styles[variant] || styles.primary;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
        fontSize: '0.73rem', fontWeight: 700, color: s.color,
        textDecoration: 'none', padding: '0.3rem 0.65rem',
        backgroundColor: s.bg, borderRadius: '6px', border: `1px solid ${s.border}`,
        transition: 'opacity 0.15s ease',
      }}
      onMouseOver={(e) => { e.currentTarget.style.opacity = '0.8'; }}
      onMouseOut={(e) => { e.currentTarget.style.opacity = '1'; }}
    >
      <ExternalLink size={12} /> {label}
    </a>
  );
}