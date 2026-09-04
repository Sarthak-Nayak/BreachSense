import React, { useState } from 'react';
import { BellRing, Send, Check, AlertTriangle, ShieldAlert, Radio } from 'lucide-react';

export default function EarlyWarningPanel({ riskZones, damName }) {
  const [copiedId, setCopiedId] = useState(null);
  const [broadcastActive, setBroadcastActive] = useState(false);

  if (!riskZones || riskZones.length === 0) return null;

  const criticalZones = riskZones.filter(z => z.urgency === 'CRITICAL' || z.urgency === 'HIGH');

  const handleCopySMS = (zone) => {
    navigator.clipboard.writeText(zone.sms_alert);
    setCopiedId(zone.village_id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleTriggerBroadcast = () => {
    setBroadcastActive(true);
    setTimeout(() => setBroadcastActive(false), 4000);
  };

  return (
    <div className="bs-card" style={{ borderLeft: '4px solid #DC2626' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BellRing size={18} color="#DC2626" className="spin" style={{ animation: 'pulse-red 1.5s infinite' }} />
          <h3 style={{ fontSize: '0.98rem', fontWeight: 700, margin: 0, color: '#991B1B' }}>
            Early Warning & Emergency Dispatch System
          </h3>
        </div>

        <button
          onClick={handleTriggerBroadcast}
          className="btn-danger"
          style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
        >
          <Radio size={14} /> {broadcastActive ? 'SIRENS BROADCASTING...' : 'Simulate Emergency Siren'}
        </button>
      </div>

      {broadcastActive && (
        <div style={{
          backgroundColor: '#DC2626',
          color: '#FFFFFF',
          padding: '0.6rem',
          borderRadius: '6px',
          fontSize: '0.8rem',
          fontWeight: 700,
          textAlign: 'center',
          marginBottom: '0.75rem',
          boxShadow: '0 4px 10px rgba(220,38,38,0.4)',
          animation: 'pulse-red 1s infinite'
        }}>
          🚨 MOCK EMERGENCY BROADCAST ACTIVATED: Downstream Alert Sirens & SMS Gateway Triggered for {damName} Reach!
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {criticalZones.slice(0, 3).map((zone) => (
          <div
            key={zone.village_id}
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #FCA5A5',
              borderRadius: '8px',
              padding: '0.65rem',
              boxShadow: '0 1px 2px rgba(220,38,38,0.06)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#DC2626', fontWeight: 700, fontSize: '0.82rem' }}>
                <AlertTriangle size={15} />
                <span>⚠ {zone.name} — Flood arrives in {zone.arrival_time_min} min</span>
              </div>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#991B1B' }}>
                Depth ~{zone.est_depth_m}m
              </span>
            </div>

            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontFamily: 'monospace' }}>
              "{zone.sms_alert}"
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem' }}>
              <button
                onClick={() => handleCopySMS(zone)}
                className="btn-outline"
                style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}
              >
                {copiedId === zone.village_id ? <Check size={12} color="#16A34A" /> : <Send size={12} />}
                {copiedId === zone.village_id ? 'Copied Alert!' : 'Copy SMS Payload'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
