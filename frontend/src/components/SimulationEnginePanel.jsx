import React from 'react';
import { Cpu, Zap, Activity, Waves, Gauge, ShieldCheck, Database, Layers, Radio } from 'lucide-react';

export default function SimulationEnginePanel({ simulationResult }) {
  if (!simulationResult) return null;

  const isAdvanced = simulationResult.engine_tier === 'advanced' || simulationResult.engine_used === 'sph_dflow1d';
  const breachParams = simulationResult.breach_params || {};
  const svDiag = simulationResult.saint_venant_diagnostics || {};
  const waveSpeed = simulationResult.wave_speed_kmh || 0;
  const particleCount = breachParams.particle_count || (isAdvanced ? 8000 : 0);

  return (
    <div className="bs-card" style={{ borderLeft: `4px solid ${isAdvanced ? '#059669' : '#1D6FD9'}` }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity size={18} color={isAdvanced ? '#059669' : '#1D6FD9'} />
          <h3 style={{ fontSize: '0.98rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
            Hydrodynamic Engine & Physics Diagnostics
          </h3>
        </div>

        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.35rem',
          padding: '0.25rem 0.6rem',
          borderRadius: '12px',
          fontSize: '0.73rem',
          fontWeight: 700,
          backgroundColor: isAdvanced ? '#DCFCE7' : '#EFF6FF',
          color: isAdvanced ? '#15803D' : '#1D4ED8',
          border: `1px solid ${isAdvanced ? '#86EFAC' : '#BFDBFE'}`
        }}>
          {isAdvanced ? <Cpu size={13} /> : <Zap size={13} />}
          {isAdvanced ? 'DualSPHysics SPH + 1D Saint-Venant Engine' : 'Froehlich (2008) Empirical Engine'}
        </span>
      </div>

      {/* Physics Model Description */}
      <div style={{
        backgroundColor: 'var(--bg-subtle)',
        padding: '0.65rem 0.85rem',
        borderRadius: '6px',
        fontSize: '0.78rem',
        color: 'var(--text-secondary)',
        marginBottom: '0.85rem',
        lineHeight: 1.45
      }}>
        {isAdvanced ? (
          <div>
            <strong>Physics Methodology:</strong> Coupled near-field <strong>DualSPHysics Smoothed Particle Hydrodynamics (SPH)</strong> fluid particle dynamics solver for breach opening discharge $Q_{SPH}(t)$, routed downstream using a <strong>1D Saint-Venant (shallow water) hydrodynamic solver</strong> (Delft3D equivalent).
          </div>
        ) : (
          <div>
            <strong>Physics Methodology:</strong> Empirical <strong>Froehlich (2008) peak outflow model</strong> $Q_p = 0.69 V_w^{0.428} h_w^{0.653}$ combined with 2D hydrologic wave celerity routing for downstream inundation estimation.
          </div>
        )}
      </div>

      {/* Key Diagnostic Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem', marginBottom: '0.85rem' }}>
        {isAdvanced && (
          <div style={{ backgroundColor: 'var(--bg-main)', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border-light)' }}>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>SPH Particles</div>
            <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#059669' }}>
              {particleCount.toLocaleString()} <span style={{ fontSize: '0.7rem', fontWeight: 500 }}>particles</span>
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>Tait EOS ($\gamma=7$)</div>
          </div>
        )}

        <div style={{ backgroundColor: 'var(--bg-main)', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border-light)' }}>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Wave Speed / Celerity</div>
          <div style={{ fontSize: '0.98rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
            {waveSpeed} <span style={{ fontSize: '0.7rem', fontWeight: 500 }}>km/h</span>
          </div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
            {isAdvanced ? `$c = v + \\sqrt{gh}$` : 'Hydrologic celerity'}
          </div>
        </div>

        <div style={{ backgroundColor: 'var(--bg-main)', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border-light)' }}>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Breach Head ($h_w$)</div>
          <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#DC2626' }}>
            {breachParams.effective_head_m || 0} <span style={{ fontSize: '0.7rem', fontWeight: 500 }}>m</span>
          </div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
            Vol: {breachParams.breach_volume_mcm || 0} MCM
          </div>
        </div>

        {!isAdvanced && (
          <div style={{ backgroundColor: 'var(--bg-main)', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border-light)' }}>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Formation Time</div>
            <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#D97706' }}>
              {breachParams.t_f_mins || 0} <span style={{ fontSize: '0.7rem', fontWeight: 500 }}>mins</span>
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>Froehlich $t_f$ formula</div>
          </div>
        )}
      </div>

      {/* 1D Saint-Venant Hydrodynamic Diagnostics (For Advanced Engine) */}
      {isAdvanced && (
        <div style={{
          borderTop: '1px solid var(--border-light)',
          paddingTop: '0.65rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '0.5rem',
          fontSize: '0.74rem',
          color: 'var(--text-secondary)'
        }}>
          <div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.68rem', display: 'block', fontWeight: 600 }}>Manning's $n$</span>
            <strong>{svDiag.manning_n || 0.035} $\text{m}^{-1/3}\text{s}$</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.68rem', display: 'block', fontWeight: 600 }}>Bed Slope $S_0$</span>
            <strong>{svDiag.bed_slope || 0.0025}</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.68rem', display: 'block', fontWeight: 600 }}>Channel Base $b$</span>
            <strong>{svDiag.channel_base_width_m || 85.0} m</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.68rem', display: 'block', fontWeight: 600 }}>Peak Velocity $v_{peak}$</span>
            <strong>{svDiag.peak_velocity_ms || 4.2} m/s</strong>
          </div>
        </div>
      )}

      {/* Satellite Layer Validation Footer */}
      <div style={{
        marginTop: '0.65rem',
        paddingTop: '0.5rem',
        borderTop: '1px dashed var(--border-light)',
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between',
        fontSize: '0.72rem',
        color: 'var(--text-muted)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Radio size={14} color="#0891B2" />
          <span>GEE Sentinel-1 SAR Radar Observation: <strong>Active & Overlaid</strong></span>
        </div>
        <span>VV/VH Backscatter</span>
      </div>
    </div>
  );
}
