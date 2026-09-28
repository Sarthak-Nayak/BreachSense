import React, { useState } from 'react';
import { Sliders, Flame, AlertOctagon, RefreshCw, Play } from 'lucide-react';

export default function BreachControls({ selectedDam, onRunSimulation, loading }) {
  const [breachType, setBreachType] = useState('overtopping');
  const [breachSize, setBreachSize] = useState('catastrophic');
  const [waterLevelPct, setWaterLevelPct] = useState(100);

  const isAdvanced = selectedDam?.engine_tier === 'advanced' || selectedDam?.is_pilot;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedDam || loading) return;
    onRunSimulation({
      damId: selectedDam.id,
      breachType,
      breachSize,
      waterLevelPct
    });
  };

  return (
    <div className="bs-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sliders size={18} color="var(--accent-primary)" />
          <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
            Breach Scenario Parameters
          </h3>
        </div>

        {selectedDam && (
          <span className="badge" style={{
            backgroundColor: isAdvanced ? '#DCFCE7' : '#F1F5F9',
            color: isAdvanced ? '#15803D' : '#475569',
            fontSize: '0.7rem',
            fontWeight: 700,
            border: `1px solid ${isAdvanced ? '#86EFAC' : '#CBD5E1'}`
          }}>
            {isAdvanced ? 'ADVANCED SPH + 1D HYDRO' : 'SIMPLIFIED BREACH'}
          </span>
        )}
      </div>

      {!selectedDam ? (
        <div style={{
          backgroundColor: '#FFFBEB',
          border: '1px solid #FDE68A',
          color: '#92400E',
          padding: '0.85rem',
          borderRadius: '8px',
          fontSize: '0.82rem',
          display: 'flex',
          gap: '0.6rem',
          alignItems: 'center'
        }}>
          <AlertOctagon size={24} style={{ flexShrink: 0 }} />
          <div>
            Select any dam on the map or dataset selector to configure breach parameters.
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          {/* Breach Type Selector */}
          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
              BREACH FAILURE MECHANISM
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.4rem' }}>
              {[
                { id: 'overtopping', label: 'Overtopping' },
                { id: 'piping', label: 'Piping Failure' },
                { id: 'structural', label: 'Structural' }
              ].map(item => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setBreachType(item.id)}
                  style={{
                    padding: '0.45rem 0.2rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    borderRadius: '6px',
                    border: breachType === item.id ? '2px solid var(--accent-primary)' : '1px solid var(--border-light)',
                    backgroundColor: breachType === item.id ? 'var(--accent-light)' : '#FFFFFF',
                    color: breachType === item.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Breach Size Selector */}
          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
              BREACH SCALE (VOLUME RELEASE)
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.4rem' }}>
              {[
                { id: 'small', label: 'Minor (35%)' },
                { id: 'medium', label: 'Moderate (65%)' },
                { id: 'catastrophic', label: 'Catastrophic (100%)' }
              ].map(item => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setBreachSize(item.id)}
                  style={{
                    padding: '0.45rem 0.2rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    borderRadius: '6px',
                    border: breachSize === item.id ? '2px solid var(--danger-end)' : '1px solid var(--border-light)',
                    backgroundColor: breachSize === item.id ? 'var(--danger-light)' : '#FFFFFF',
                    color: breachSize === item.id ? 'var(--danger-end)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Water Level Slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
              <span>INITIAL WATER LEVEL (% OF HFL)</span>
              <span style={{ color: 'var(--accent-primary)' }}>{waterLevelPct}%</span>
            </div>
            <input
              type="range"
              min="80"
              max="120"
              step="5"
              value={waterLevelPct}
              onChange={(e) => setWaterLevelPct(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
              <span>80% (Normal)</span>
              <span>100% (Full Level)</span>
              <span>120% (Overtopping)</span>
            </div>
          </div>

          {/* Trigger Button */}
          <button
            type="submit"
            className="btn-danger"
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', marginTop: '0.2rem', padding: '0.7rem' }}
          >
            {loading ? (
              <>
                <RefreshCw size={18} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
                {isAdvanced ? 'Running DualSPHysics SPH + 1D Saint-Venant Solver...' : 'Computing Froehlich 2D Hydrodynamic Routing...'}
              </>
            ) : (
              <>
                <Play size={18} fill="currentColor" /> Run {isAdvanced ? 'ADVANCED SPH + 1D HYDRO' : 'SIMULATION'}
              </>
            )}
          </button>
        </form>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
