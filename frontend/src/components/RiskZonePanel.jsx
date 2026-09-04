import React from 'react';
import { AlertCircle, Clock, MapPin, Users, Mountain, ShieldAlert } from 'lucide-react';

export default function RiskZonePanel({ riskZones, onSelectZone }) {
  if (!riskZones || riskZones.length === 0) {
    return (
      <div className="bs-card" style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem 1rem' }}>
        <AlertCircle size={32} color="var(--text-muted)" style={{ marginBottom: '0.5rem' }} />
        <h4 style={{ fontSize: '0.9rem', fontWeight: 600 }}>No Simulation Results Active</h4>
        <p style={{ fontSize: '0.78rem', marginTop: '0.2rem' }}>Run a breach simulation to compute downstream inundation arrival times and risk zones.</p>
      </div>
    );
  }

  // Sort cards by arrival_time_min ascending (soonest arrival first)
  const sortedZones = [...riskZones].sort((a, b) => a.arrival_time_min - b.arrival_time_min);

  return (
    <div className="bs-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldAlert size={18} color="#DC2626" />
          <h3 style={{ fontSize: '0.98rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
            Downstream Impact & Arrival Times
          </h3>
        </div>
        <span className="badge badge-critical">
          {sortedZones.length} Risk Locations
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '380px', overflowY: 'auto', paddingRight: '0.2rem' }}>
        {sortedZones.map((settlement) => {
          const riskLevel = settlement.urgency.toLowerCase(); // critical, high, moderate
          
          return (
            <div
              key={settlement.village_id}
              className={`settlement-card settlement-${riskLevel}`}
              onClick={() => onSelectZone && onSelectZone(settlement)}
              style={{ cursor: 'pointer' }}
            >
              {/* Header */}
              <div className="settlement-header">
                <h4>
                  {settlement.name}{' '}
                  <span className="region">({settlement.region || settlement.district})</span>
                </h4>
                <span className={`advisory-badge advisory-${riskLevel}`}>
                  {settlement.urgency} ADVISORY
                </span>
              </div>

              {/* 3-Column Structured Stats Grid (Part A4) */}
              <div className="settlement-stats-grid">
                <div className="stat">
                  <span className="stat-label">Distance</span>
                  <span className="stat-value">{settlement.distance_km} km</span>
                </div>

                <div className="stat">
                  <span className="stat-label">Flood arrival</span>
                  <span className="stat-value stat-highlight">
                    {settlement.arrival_time_min} min ({settlement.arrival_time_hr}h)
                  </span>
                </div>

                <div className="stat">
                  <span className="stat-label">Expected depth</span>
                  <span className="stat-value stat-danger">
                    ~{settlement.est_depth_m} m
                  </span>
                </div>
              </div>

              {/* Separate Meta Row with Icon & Gap Separators (Part A4 - No line sharing without gaps) */}
              <div className="settlement-meta">
                <span>
                  <Users size={14} color="var(--accent-primary)" />
                  Pop: <strong>{settlement.population.toLocaleString()}</strong>
                </span>
                <span>
                  <Mountain size={14} color="var(--accent-primary)" />
                  Elev: <strong>{settlement.elevation_m} m</strong>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
