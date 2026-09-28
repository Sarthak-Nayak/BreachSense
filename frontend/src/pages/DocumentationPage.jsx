import React, { useEffect } from 'react';
import { BookOpen, Code, Database, Layers, ShieldCheck, ArrowUpRight, FileCode, Server, Activity, Wrench } from 'lucide-react';

export default function DocumentationPage() {
  // Defensive scroll to section with null checks
  const scrollToSection = (id) => {
    if (!id) return;
    const el = document.getElementById(id);
    if (el && typeof el.scrollIntoView === 'function') {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Scroll to top on initial page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const tocItems = [
    { id: 'overview', label: '1. Overview & Problem Statement' },
    { id: 'architecture', label: '2. System Architecture' },
    { id: 'usage', label: '3. How to Use the Dashboard' },
    { id: 'datasources', label: '4. Open-Source Data Sources' },
    { id: 'methodology', label: '5. Hydraulic Methodology' },
    { id: 'limitations', label: '6. Limitations & Production Roadmap' },
    { id: 'apiref', label: '7. API Endpoints Reference' }
  ];

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: 'calc(100vh - 60px)' }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem 1.5rem',
        display: 'grid',
        gridTemplateColumns: '260px 1fr',
        gap: '2rem'
      }}>
        {/* Left Sticky Table of Contents Sidebar */}
        <aside style={{
          position: 'sticky',
          top: '80px',
          height: 'fit-content',
          backgroundColor: '#FFFFFF',
          padding: '1.25rem',
          borderRadius: '10px',
          border: '1px solid var(--border-light)',
          boxShadow: 'var(--shadow-card)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
            <BookOpen size={18} color="var(--accent-primary)" />
            <span>Table of Contents</span>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.82rem' }}>
            {tocItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToSection(item.id)}
                style={{
                  textAlign: 'left',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  fontWeight: 600,
                  padding: '0.35rem 0.5rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  if (e.currentTarget) {
                    e.currentTarget.style.color = 'var(--accent-primary)';
                    e.currentTarget.style.backgroundColor = 'var(--accent-light)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (e.currentTarget) {
                    e.currentTarget.style.color = 'var(--text-secondary)';
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Right Content Area */}
        <main style={{ maxWidth: '780px' }}>
          {/* Header */}
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              BreachSense Documentation &amp; Technical Manual
            </h1>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
              Comprehensive reference for the hydro-infrastructure dam breach modeling pipeline, dataset specifications, and system integration.
            </p>
          </div>

          {/* Section 1: Overview */}
          <section id="overview" className="bs-card" style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
              1. Overview &amp; Problem Statement
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '0.8rem' }}>
              <strong>BreachSense</strong> is a dam-break inundation modelling and early-warning web application built for Indian hydro-infrastructure. Developed for <strong>Smart India Hackathon (Problem Statement 161: Dam Break Inundation Modelling Using Hydrodynamic Modelling of any River)</strong>.
            </p>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              The platform enables disaster management authorities (CWC, NDRF, SDRF) and hydro-engineers to simulate dam failure scenarios across any Indian river basin, calculate downstream flood wave arrival times, assess population and critical infrastructure exposure, and generate exportable GIS spatial layers (.shp / .kml).
            </p>
          </section>

          {/* Section 2: System Architecture */}
          <section id="architecture" className="bs-card" style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
              2. System Architecture
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
              BreachSense operates as a 3-tier decoupled architecture:
            </p>
            <div style={{
              backgroundColor: '#F0F2F5',
              padding: '1rem',
              borderRadius: '8px',
              fontFamily: 'monospace',
              fontSize: '0.78rem',
              color: 'var(--text-primary)',
              lineHeight: 1.5,
              marginBottom: '1rem',
              border: '1px solid var(--border-light)'
            }}>
              [React + Leaflet Frontend] &lt;--REST--&gt; [Node.js Express Backend] &lt;--HTTP--&gt; [Python FastAPI Engine]<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+--&gt; [Froehlich Breach Model]<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+--&gt; [2D Flood Routing Engine]<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+--&gt; [GEE Sentinel-1 SAR Layer]<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+--&gt; [GIS Shapefile/KML Exporter]
            </div>
          </section>

          {/* Section 3: Usage Guide */}
          <section id="usage" className="bs-card" style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
              3. How to Use the Dashboard
            </h2>
            <ol style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.7, paddingLeft: '1.25rem' }}>
              <li><strong>Select a Dam or Ingest Dataset:</strong> Click any dam marker on the interactive map or select from the top dropdown panel.</li>
              <li><strong>Configure Failure Scenario:</strong> Select the failure mode (Overtopping / Piping / Structural), breach scale factor (Minor 35% to Catastrophic 100%), and initial reservoir water level %.</li>
              <li><strong>Run Simulation:</strong> Click "Run Hydrodynamic Simulation" to compute breach outflow hydraulics and 2D spatial flood routing.</li>
              <li><strong>Scrub Timeline:</strong> Use the playback scrubber (T+0 min to T+360 min) to observe minute-by-minute flood extent progression.</li>
              <li><strong>Export Spatial Layers:</strong> Click "Download .SHP (Zipped)" or "Download .KML" to obtain GIS spatial data for QGIS/ArcGIS.</li>
            </ol>
          </section>

          {/* Section 4: Data Sources */}
          <section id="datasources" className="bs-card" style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
              4. Open-Source Data Sources
            </h2>
            <ul style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.7, paddingLeft: '1.25rem' }}>
              <li><strong>National Register of Large Dams (NRLD / CWC):</strong> Seed dam specifications (height, capacity, crest elevation, river, year built).</li>
              <li><strong>SRTM / Bhoonidhi 30m DEM:</strong> Terrain topography and valley elevation slopes.</li>
              <li><strong>OpenStreetMap (OSM) River Vectors:</strong> River centerlines and downstream settlement locations.</li>
              <li><strong>Google Earth Engine (GEE) Sentinel-1 SAR:</strong> Synthetic Aperture Radar (C-band) imagery for cloud-independent water detection.</li>
            </ul>
          </section>

          {/* Section 5: Methodology */}
          <section id="methodology" className="bs-card" style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
              5. Hydraulic &amp; Hydrodynamic Methodology
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                BreachSense implements a <strong>two-tier hydrodynamic architecture</strong>, providing high-fidelity physical SPH &amp; 1D hydrodynamic modeling for pilot infrastructure while preserving fast empirical fallbacks for standard dams.
              </p>

              {/* Advanced Engine Tier */}
              <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '1rem' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1E293B', marginTop: 0, marginBottom: '0.4rem' }}>
                  A. Advanced Tier: DualSPHysics SPH + 1D Saint-Venant Routing (Pilot Dams)
                </h3>
                <ul style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, paddingLeft: '1.2rem', margin: 0 }}>
                  <li style={{ marginBottom: '0.4rem' }}>
                    <strong>Near-Field SPH Modeling (DualSPHysics):</strong> Simulates 3D fluid-structure interaction in the immediate near-field zone (200m–500m around breach structure). Uses open-source DualSPHysics CPU engine with Tait Equation of State ($P = B[(\rho/\rho_0)^\gamma - 1]$) and cubic spline kernel smoothing over discrete fluid particles. Precomputed via <code>precompute_sph.py</code> and cached for sub-second API delivery.
                  </li>
                  <li>
                    <strong>Far-Field 1D Hydrodynamic Routing (Delft3D-Equivalent):</strong> Solves the 1D Saint-Venant shallow water equations (continuity dA/dt + dQ/dx = 0 and momentum friction slope S_f = S_0 - dy/dx - (v/g)(dv/dx) - (1/g)(dv/dt)) driven by the SPH upstream boundary hydrograph Q_SPH(t). This applies the exact same hydrodynamic methodology as Delft3D's D-Flow 1D module natively in Python (<code>dflow_routing.py</code>).
                  </li>
                </ul>
              </div>

              {/* Simplified Engine Tier */}
              <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '1rem' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1E293B', marginTop: 0, marginBottom: '0.4rem' }}>
                  B. Simplified Tier: Empirical Breach + Hydrologic Wave Celerity
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0, marginBottom: '0.4rem' }}>
                  For non-pilot dams, peak outflow discharge $Q_p$ is estimated using <strong>Froehlich (2008)</strong> empirical regressions:
                </p>
                <div style={{
                  backgroundColor: '#FFFFFF',
                  padding: '0.6rem 0.8rem',
                  borderRadius: '6px',
                  fontFamily: 'monospace',
                  fontSize: '0.82rem',
                  color: 'var(--accent-primary)',
                  border: '1px solid var(--border-light)'
                }}>
                  Q_p = 0.69 \times (V_w^{0.428}) \times (h_w^{0.653})
                </div>
              </div>
            </div>
          </section>

          {/* Section 6: Limitations */}
          <section id="limitations" className="bs-card" style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
              6. System Scope &amp; Production Roadmap
            </h2>
            <ul style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.7, paddingLeft: '1.25rem' }}>
              <li><strong>Near-Field SPH Scope:</strong> SPH domain is intentionally constrained to a 200m–500m near-field zone to ensure CPU solver tractability and precomputed hydrograph caching.</li>
              <li><strong>Hydrodynamic 1D Engine:</strong> Far-field routing implements 1D Saint-Venant shallow water equations (Delft3D D-Flow 1D equivalent) natively in Python, avoiding the multi-gigabyte container overhead of the full Delft3D desktop binary suite.</li>
              <li><strong>Production Roadmap:</strong> Multi-node GPU-accelerated DualSPHysics clusters, live CWC reservoir telemetry integration, and automated SMS gateway alert dispatch.</li>
            </ul>
          </section>

          {/* Section 7: API Reference */}
          <section id="apiref" className="bs-card">
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
              7. Backend API Endpoints Reference
            </h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', fontSize: '0.8rem', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-light)' }}>
                    <th style={{ padding: '0.5rem' }}>Method</th>
                    <th style={{ padding: '0.5rem' }}>Endpoint</th>
                    <th style={{ padding: '0.5rem' }}>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '0.5rem', fontWeight: 700, color: '#16A34A' }}>GET</td>
                    <td style={{ padding: '0.5rem', fontFamily: 'monospace' }}>/api/dams</td>
                    <td style={{ padding: '0.5rem' }}>List all seeded dams</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '0.5rem', fontWeight: 700, color: '#1D6FD9' }}>POST</td>
                    <td style={{ padding: '0.5rem', fontFamily: 'monospace' }}>/api/simulate</td>
                    <td style={{ padding: '0.5rem' }}>Run breach simulation</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '0.5rem', fontWeight: 700, color: '#1D6FD9' }}>POST</td>
                    <td style={{ padding: '0.5rem', fontFamily: 'monospace' }}>/api/export</td>
                    <td style={{ padding: '0.5rem' }}>Download .shp / .kml GIS layers</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
