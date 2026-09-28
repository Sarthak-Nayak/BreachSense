import React from 'react';
import { Building2, Compass, Waves, Calendar, ShieldCheck, Ruler, Database } from 'lucide-react';

export default function DamDetailPanel({ dam }) {
  if (!dam) {
    return (
      <div className="bs-card" style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem 1rem' }}>
        <Building2 size={36} color="var(--text-muted)" style={{ marginBottom: '0.5rem' }} />
        <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>No Dam Selected</h4>
        <p style={{ fontSize: '0.8rem', marginTop: '0.2rem' }}>Click any dam marker on the map to inspect structural parameters.</p>
      </div>
    );
  }

  return (
    <div className="bs-card">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            {dam.name}
          </h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            {dam.river} &bull; {dam.state} ({dam.district})
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.2rem' }}>
          {dam.engine_tier === 'advanced' || dam.is_pilot ? (
            <span className="badge" style={{ backgroundColor: '#DCFCE7', color: '#15803D', border: '1px solid #86EFAC', fontWeight: 700, fontSize: '0.72rem', padding: '0.2rem 0.5rem' }}>
              ADVANCED SPH + 1D HYDRO
            </span>
          ) : (
            <span className="badge" style={{ backgroundColor: '#F1F5F9', color: '#475569', border: '1px solid #CBD5E1', fontWeight: 600, fontSize: '0.72rem', padding: '0.2rem 0.5rem' }}>
              SIMPLIFIED BREACH
            </span>
          )}
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '0.75rem',
        marginTop: '0.75rem',
        paddingTop: '0.75rem',
        borderTop: '1px solid var(--border-light)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Ruler size={16} color="var(--accent-primary)" />
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Dam Height</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{dam.height_m} m</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Database size={16} color="var(--accent-primary)" />
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Storage Volume</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{dam.storage_capacity_mcm.toLocaleString()} MCM</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Compass size={16} color="var(--accent-primary)" />
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Crest Length</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{dam.length_m ? `${dam.length_m} m` : 'N/A'}</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Calendar size={16} color="var(--accent-primary)" />
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Year Built</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{dam.year_built}</div>
          </div>
        </div>
      </div>

      <div style={{
        backgroundColor: 'var(--bg-subtle)',
        padding: '0.6rem 0.8rem',
        borderRadius: '6px',
        marginTop: '0.75rem',
        fontSize: '0.78rem',
        color: 'var(--text-secondary)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.2rem'
      }}>
        <div><strong>Structure Type:</strong> {dam.type}</div>
        <div><strong>Spillway Capacity:</strong> {dam.spillway_capacity_cumec ? `${dam.spillway_capacity_cumec.toLocaleString()} m³/s` : 'N/A'}</div>
        <div><strong>Downstream Cities:</strong> {dam.downstream_city}</div>
      </div>

      {/* Hydrodynamic Engine Tier Physics Breakdown */}
      <div style={{
        marginTop: '0.75rem',
        padding: '0.65rem 0.8rem',
        borderRadius: '6px',
        backgroundColor: dam.engine_tier === 'advanced' || dam.is_pilot ? '#F0FDF4' : '#F8FAFC',
        border: `1px solid ${dam.engine_tier === 'advanced' || dam.is_pilot ? '#DCFCE7' : '#E2E8F0'}`,
        fontSize: '0.74rem'
      }}>
        <div style={{ fontWeight: 700, color: dam.engine_tier === 'advanced' || dam.is_pilot ? '#166534' : '#334155', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <ShieldCheck size={14} color={dam.engine_tier === 'advanced' || dam.is_pilot ? '#15803D' : '#475569'} />
          {dam.engine_tier === 'advanced' || dam.is_pilot ? 'ADVANCED ENGINE TIER (Pilot Dam)' : 'SIMPLIFIED ENGINE TIER (Standard Dam)'}
        </div>
        <div style={{ color: 'var(--text-secondary)', lineHeight: 1.4 }}>
          {dam.engine_tier === 'advanced' || dam.is_pilot ? (
            <span>
              Couples <strong>DualSPHysics SPH</strong> near-field particle hydrodynamics (Tait EOS, 8,000+ particles) with <strong>1D Saint-Venant shallow water equations</strong> (Delft3D D-Flow FM equivalent) for wave routing.
            </span>
          ) : (
            <span>
              Employs <strong>Froehlich (2008) empirical outflow model</strong> ($Q_p = 0.69 V_w^{0.428} h_w^{0.653}$) coupled with 2D hydrologic wave celerity routing.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
