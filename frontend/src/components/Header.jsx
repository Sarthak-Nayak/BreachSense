import React from 'react';
import { ShieldAlert, Waves, MapPin, Activity } from 'lucide-react';

export default function Header({ damsCount, activeSim }) {
  return (
    <header style={{
      backgroundColor: '#FFFFFF',
      borderBottom: '1px solid var(--border-light)',
      padding: '0.85rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #1D6FD9 0%, #0F4C9C 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF',
          boxShadow: '0 2px 6px rgba(29, 111, 217, 0.3)'
        }}>
          <Waves size={24} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>
              Breach
            </h1>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
            Dam Break Inundation Modelling & Hydrodynamic Early-Warning System (India)
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          <MapPin size={16} color="#1D6FD9" />
          <span><strong>{damsCount}</strong> Major Dams Seeded</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          <Activity size={16} color="#16A34A" />
          <span><strong>2</strong> Pilot Models Active</span>
        </div>

        {activeSim && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            backgroundColor: '#FEF2F2',
            color: '#DC2626',
            padding: '0.35rem 0.75rem',
            borderRadius: '6px',
            fontSize: '0.8rem',
            fontWeight: 700,
            border: '1px solid #FCA5A5',
            animation: 'pulse-red 2s infinite'
          }}>
            <ShieldAlert size={15} />
            <span>SIMULATION ACTIVE ({activeSim.dam_name})</span>
          </div>
        )}
      </div>
    </header>
  );
}
