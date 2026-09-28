import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { TrendingUp, Cpu, Zap, Activity } from 'lucide-react';

export default function HydrographChart({ breachParams, damName, engineUsed, engineTier, engineLabel }) {
  if (!breachParams || !breachParams.hydrograph) return null;

  const data = breachParams.hydrograph;
  const qPeak = breachParams.q_peak_cumec;
  const tfMins = breachParams.t_f_mins;

  const isAdvanced = engineTier === 'advanced' || engineUsed === 'sph_dflow1d';
  const badgeText = isAdvanced
    ? 'Advanced (SPH + 1D Hydrodynamic Routing)'
    : 'Simplified (Empirical Breach Model)';

  return (
    <div className="bs-card">
      {/* Hydrograph Header & Engine Badge */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp size={18} color="var(--accent-primary)" />
            <h3 style={{ fontSize: '0.98rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
              Breach Discharge Hydrograph Q(t)
            </h3>
          </div>

          {/* Engine Tier Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.2rem 0.55rem',
            borderRadius: '12px',
            fontSize: '0.72rem',
            fontWeight: 700,
            backgroundColor: isAdvanced ? '#DCFCE7' : '#F1F5F9',
            color: isAdvanced ? '#15803D' : '#475569',
            border: `1px solid ${isAdvanced ? '#86EFAC' : '#CBD5E1'}`
          }}>
            {isAdvanced ? <Cpu size={12} /> : <Zap size={12} />}
            <span>{badgeText}</span>
          </div>
        </div>

        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          Peak Outflow: <strong style={{ color: '#DC2626' }}>{qPeak.toLocaleString()} m³/s</strong> (at t={tfMins}m)
        </div>
      </div>

      <div style={{ width: '100%', height: '180px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorQ" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isAdvanced ? '#059669' : '#1D6FD9'} stopOpacity={0.4}/>
                <stop offset="95%" stopColor={isAdvanced ? '#059669' : '#1D6FD9'} stopOpacity={0.0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E4E8" />
            <XAxis
              dataKey="time_min"
              stroke="#5F6368"
              fontSize={11}
              tickFormatter={(val) => `+${val}m`}
            />
            <YAxis
              stroke="#5F6368"
              fontSize={11}
              tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E4E8',
                borderRadius: '6px',
                fontSize: '0.75rem',
                boxShadow: '0 4px 6px rgba(0,0,0,0.08)'
              }}
              formatter={(value) => [`${Number(value).toLocaleString()} m³/s`, 'Discharge Q']}
              labelFormatter={(label) => `Time: +${label} mins (${(label/60).toFixed(1)}h)`}
            />
            <Area
              type="monotone"
              dataKey="discharge_cumec"
              stroke={isAdvanced ? '#059669' : '#1D6FD9'}
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorQ)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: '0.5rem',
        paddingTop: '0.4rem',
        borderTop: '1px solid var(--border-light)',
        fontSize: '0.72rem',
        color: 'var(--text-muted)'
      }}>
        <span>{isAdvanced ? 'DualSPHysics SPH Particle Solver + 1D Saint-Venant Routing' : 'Froehlich (2008) Empirical Outflow Model'}</span>
        <span>Average Breach Width: <strong>{breachParams.b_avg_m} m</strong></span>
      </div>
    </div>
  );
}
