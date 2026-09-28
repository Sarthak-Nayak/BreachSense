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
        {dam.is_pilot ? (
          <span className="badge badge-pilot">PILOT MODEL</span>
        ) : (
          <span className="badge badge-coming">STANDARD DAM</span>
        )}
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
    </div>
  );
}
