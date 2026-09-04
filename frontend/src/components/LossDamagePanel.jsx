import React from 'react';
import { DollarSign, AlertCircle, Building, HeartPulse, GraduationCap, Cable, Anchor } from 'lucide-react';

export default function LossDamagePanel({ lossDamage }) {
  if (!lossDamage) return null;

  return (
    <div className="bs-card" style={{ borderTop: '4px solid var(--danger-start)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Building size={18} color="var(--danger-end)" />
          <h3 style={{ fontSize: '0.98rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
            Loss & Damage Assessment
          </h3>
        </div>

        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#92400E', backgroundColor: '#FEF3C7', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
          RAPID ESTIMATE
        </span>
      </div>

      {/* Main Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem', marginBottom: '0.8rem' }}>
        <div style={{ backgroundColor: 'var(--bg-main)', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border-light)' }}>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700 }}>POPULATION IMPACTED</div>
          <div style={{ fontSize: '1rem', fontWeight: 800, color: '#DC2626' }}>
            {lossDamage.total_population_affected ? lossDamage.total_population_affected.toLocaleString() : '0'}
          </div>
        </div>

        <div style={{ backgroundColor: 'var(--bg-main)', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border-light)' }}>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700 }}>CRITICAL INFRA AT RISK</div>
          <div style={{ fontSize: '1rem', fontWeight: 800, color: '#F59E0B' }}>
            {lossDamage.critical_infra_total || 0} Assets
          </div>
        </div>

        <div style={{ backgroundColor: 'var(--bg-main)', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border-light)' }}>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700 }}>ECONOMIC EXPOSURE</div>
          <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
            ₹ {lossDamage.economic_exposure_crores_inr || 0} Cr
          </div>
        </div>
      </div>

      {/* Infrastructure Breakdown Badges */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.4rem', fontSize: '0.72rem', marginBottom: '0.6rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-secondary)' }}>
          <HeartPulse size={14} color="#DC2626" />
          <span>Hospitals: <strong>{lossDamage.hospitals_at_risk || 0}</strong></span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-secondary)' }}>
          <GraduationCap size={14} color="#1D6FD9" />
          <span>Schools: <strong>{lossDamage.schools_at_risk || 0}</strong></span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-secondary)' }}>
          <Anchor size={14} color="#F59E0B" />
          <span>Bridges: <strong>{lossDamage.bridges_roads_at_risk || 0}</strong></span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-secondary)' }}>
          <Cable size={14} color="#16A34A" />
          <span>Power/Grid: <strong>{lossDamage.power_industrial_at_risk || 0}</strong></span>
        </div>
      </div>

      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
        *Approximation based on spatial intersection of flood extent with GIS asset registry & per-sqm exposure coefficient.
      </div>
    </div>
  );
}
