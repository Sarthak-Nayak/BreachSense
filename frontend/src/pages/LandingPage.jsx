import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldAlert, Map, Sliders, Satellite, FileSpreadsheet, Activity, CheckCircle, Database } from 'lucide-react';
import DamBreakHistory from '../components/DamBreakHistory';

export default function LandingPage() {
  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>
      {/* Hero Section - Two Column Layout */}
      <section style={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid var(--border-light)',
        padding: '3.5rem 2rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
      }}>
        <div style={{
          maxWidth: '1300px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '3rem',
          alignItems: 'center'
        }}>
          {/* Left - Text Content */}
          <div>
            <h1 style={{
              fontSize: '2.6rem',
              fontWeight: 800,
              color: 'var(--text-primary)',
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              marginBottom: '1.25rem'
            }}>
              Dam Break Inundation Modelling &<br />
              <span style={{ color: 'var(--accent-primary)' }}>Hydrodynamic Early-Warning System</span>
            </h1>

            <p style={{
              fontSize: '1.05rem',
              color: 'var(--text-secondary)',
              maxWidth: '540px',
              lineHeight: 1.65,
              marginBottom: '2rem'
            }}>
              BreachSense delivers real-time dam failure simulations, downstream flood wave propagation routing, and instant risk zone warnings across India using open-source hydro-infrastructure datasets and Sentinel-1 SAR satellite imagery.
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/dashboard" className="btn-primary" style={{ fontSize: '1rem', padding: '0.85rem 1.75rem', borderRadius: '8px' }}>
                Launch Simulation Dashboard <ArrowRight size={18} />
              </Link>

              <Link to="/docs" className="btn-outline" style={{ fontSize: '1rem', padding: '0.85rem 1.5rem', borderRadius: '8px' }}>
                Read Technical Documentation
              </Link>
            </div>
          </div>

          {/* Right - Video */}
          <div style={{
            position: 'relative',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
            border: '1px solid var(--border-light)',
            aspectRatio: '16 / 10',
          }}>
            <video
              src="/vedio.mp4"
              autoPlay
              muted
              loop
              playsInline
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
            {/* Subtle overlay gradient at the bottom */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '60px',
              background: 'linear-gradient(transparent, rgba(0,0,0,0.15))',
              pointerEvents: 'none'
            }} />
          </div>
        </div>
      </section>

      {/* Problem Statement Section */}
      <section style={{ padding: '3.5rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            The Need for Hydrodynamic Breach Modelling
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', maxWidth: '650px', margin: '0.5rem auto 0 auto' }}>
            India manages over 5,300 large dams. Rapid climate shifts, extreme precipitation, and aging structural foundations make proactive inundation modelling vital for downstream life safety.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          <div className="bs-card">
            <div style={{ color: '#DC2626', marginBottom: '0.75rem' }}><ShieldAlert size={28} /></div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.4rem' }}>Catastrophic Outflow Risk</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Dam breaches release millions of cubic meters of water within minutes, sending high-velocity shockwaves down river valleys that flood downstream settlements.
            </p>
          </div>

          <div className="bs-card">
            <div style={{ color: '#F59E0B', marginBottom: '0.75rem' }}><Activity size={28} /></div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.4rem' }}>Critical Early Warning Lead-Time</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Every minute counts for disaster response authorities (NDRF/SDRF) to evacuate villages, safeguard critical infrastructure, and dispatch automated SMS alert sirens.
            </p>
          </div>

          <div className="bs-card">
            <div style={{ color: 'var(--accent-primary)', marginBottom: '0.75rem' }}><Database size={28} /></div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.4rem' }}>Dataset-Agnostic Open Framework</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              BreachSense ingests open-source NRLD dam registries, DEM elevation grids, and river centerlines to run standardized breach simulations on any Indian river basin.
            </p>
          </div>
        </div>

        {/* Dam Break History Sliding Cards */}
        <DamBreakHistory />
      </section>

      {/* Key Features Section (4-Column Grid) */}
      <section style={{ backgroundColor: '#FFFFFF', borderTop: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)', padding: '3.5rem 1.5rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Core Capabilities &amp; Engine Features
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
              An end-to-end early warning suite engineered for disaster management agencies.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }}>
            <div className="bs-card">
              <Map size={24} color="var(--accent-primary)" style={{ marginBottom: '0.6rem' }} />
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.3rem' }}>All-India Dam Selector</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                Interactive Bounded Leaflet map displaying 20+ major dams with structural parameters.
              </p>
            </div>

            <div className="bs-card">
              <Sliders size={24} color="#DC2626" style={{ marginBottom: '0.6rem' }} />
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.3rem' }}>Froehlich Breach Hydraulics</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                Computes peak breach discharge,formation time, and 2D flood extent timesteps.
              </p>
            </div>

            <div className="bs-card">
              <Satellite size={24} color="#0891B2" style={{ marginBottom: '0.6rem' }} />
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.3rem' }}>GEE Sentinel-1 SAR Layer</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                Cloud-penetrating radar satellite flood detection layer overlaid side-by-side.
              </p>
            </div>

            <div className="bs-card">
              <FileSpreadsheet size={24} color="#16A34A" style={{ marginBottom: '0.6rem' }} />
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.3rem' }}>One-Click GIS Export</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                Instant export of flood extent layers to ESRI Shapefile (`.shp.zip`) and Google Earth (`.kml`).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section style={{ padding: '3.5rem 1.5rem', maxWidth: '1100px', margin: '0 auto', flex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            How BreachSense Works
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
            4 simple steps from dam selection to actionable emergency dispatch.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', position: 'relative' }}>
          {[
            { step: '1', title: 'Select Dam / Dataset', desc: 'Pick any seeded Indian dam or upload custom DEM & river vector.' },
            { step: '2', title: 'Configure Breach', desc: 'Choose failure mode (Overtopping/Piping), scale, and reservoir head.' },
            { step: '3', title: 'Run Hydrodynamic Simulation', desc: 'Engine computes Froehlich outflow hydrograph and 2D flood routing.' },
            { step: '4', title: 'Inspect Risk & Export GIS', desc: 'View arrival times, loss & damage, and download Shapefile/KML.' }
          ].map((item) => (
            <div key={item.step} className="bs-card" style={{ textAlign: 'center', padding: '1.25rem 0.85rem' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'var(--accent-primary)',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 0.75rem auto'
              }}>
                {item.step}
              </div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.3rem' }}>{item.title}</h4>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <Link to="/dashboard" className="btn-danger" style={{ fontSize: '1rem', padding: '0.8rem 2rem', borderRadius: '8px' }}>
            Open Interactive Dashboard <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid var(--border-light)',
        padding: '1.5rem',
        textAlign: 'center',
        fontSize: '0.82rem',
        color: 'var(--text-secondary)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: '0.5rem' }}>
          <Link to="/" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 600 }}>Home</Link>
          <Link to="/dashboard" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 600 }}>Dashboard</Link>
          <Link to="/docs" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 600 }}>Documentation</Link>
        </div>
        <div>
          BreachSense
        </div>
      </footer>
    </div>
  );
}
