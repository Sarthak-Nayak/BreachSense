import React, { useState } from 'react';
import { Database, Upload, Layers, CheckCircle2, FileText } from 'lucide-react';

export default function DatasetSelector({ dams, selectedDam, onSelectDam, onAddCustomDataset }) {
  const [activeTab, setActiveTab] = useState('select'); // 'select' or 'upload'
  const [customName, setCustomName] = useState('');
  const [customRiver, setCustomRiver] = useState('');
  const [customHeight, setCustomHeight] = useState('90');
  const [customStorage, setCustomStorage] = useState('2800');
  const [demFileName, setDemFileName] = useState('');
  const [riverFileName, setRiverFileName] = useState('');

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customName) return;
    
    const newDam = {
      id: `custom-${Date.now()}`,
      name: customName,
      river: customRiver || 'Custom River',
      state: 'User Dataset',
      district: 'Custom District',
      lat: 23.5,
      lng: 78.5,
      height_m: Number(customHeight),
      length_m: 650,
      storage_capacity_mcm: Number(customStorage),
      year_built: 2024,
      nearest_city: 'Custom Location',
      downstream_city: 'Downstream Reach',
      is_pilot: true,
      type: 'Custom Hydro Dataset'
    };
    
    onAddCustomDataset(newDam);
    setActiveTab('select');
  };

  return (
    <div className="bs-card" style={{ borderLeft: '4px solid var(--accent-primary)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Database size={18} color="var(--accent-primary)" />
          <h3 style={{ fontSize: '0.98rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
            Dataset & Hydro Infrastructure Selector
          </h3>
        </div>

        <div style={{ display: 'flex', gap: '0.3rem' }}>
          <button
            onClick={() => setActiveTab('select')}
            style={{
              padding: '0.25rem 0.6rem',
              fontSize: '0.72rem',
              fontWeight: 700,
              borderRadius: '4px',
              border: activeTab === 'select' ? '1px solid var(--accent-primary)' : '1px solid var(--border-light)',
              backgroundColor: activeTab === 'select' ? 'var(--accent-light)' : '#FFFFFF',
              color: activeTab === 'select' ? 'var(--accent-primary)' : 'var(--text-secondary)',
              cursor: 'pointer'
            }}
          >
            Seeded Dams ({dams.length})
          </button>

          <button
            onClick={() => setActiveTab('upload')}
            style={{
              padding: '0.25rem 0.6rem',
              fontSize: '0.72rem',
              fontWeight: 700,
              borderRadius: '4px',
              border: activeTab === 'upload' ? '1px solid var(--accent-primary)' : '1px solid var(--border-light)',
              backgroundColor: activeTab === 'upload' ? 'var(--accent-light)' : '#FFFFFF',
              color: activeTab === 'upload' ? 'var(--accent-primary)' : 'var(--text-secondary)',
              cursor: 'pointer'
            }}
          >
            + Add Custom Dataset
          </button>
        </div>
      </div>

      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.6rem', fontStyle: 'italic', backgroundColor: '#F0F7FF', padding: '0.4rem 0.6rem', borderRadius: '4px' }}>
        Simulation framework is dataset-agnostic — demo dams shown below; any Indian river/dam with DEM + basic specs can be added.
      </p>

      {activeTab === 'select' ? (
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', maxHeight: '110px', overflowY: 'auto' }}>
          {dams.map((dam) => {
            const isSelected = selectedDam?.id === dam.id;
            return (
              <button
                key={dam.id}
                onClick={() => onSelectDam(dam)}
                style={{
                  padding: '0.35rem 0.65rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  borderRadius: '6px',
                  border: isSelected ? '2px solid var(--accent-primary)' : '1px solid var(--border-light)',
                  backgroundColor: isSelected ? 'var(--accent-light)' : '#FFFFFF',
                  color: isSelected ? 'var(--accent-primary)' : 'var(--text-primary)',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
              >
                {dam.is_pilot && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#DC2626' }}></span>}
                {dam.name}
              </button>
            );
          })}
        </div>
      ) : (
        <form onSubmit={handleCustomSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.78rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
            <div>
              <label style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>DAM / PROJECT NAME</label>
              <input
                type="text"
                placeholder="e.g. Polavaram Dam"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                style={{ width: '100%', padding: '0.35rem', borderRadius: '4px', border: '1px solid var(--border-light)', marginTop: '0.2rem' }}
                required
              />
            </div>
            <div>
              <label style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>RIVER CENTERLINE</label>
              <input
                type="text"
                placeholder="e.g. Godavari River"
                value={customRiver}
                onChange={(e) => setCustomRiver(e.target.value)}
                style={{ width: '100%', padding: '0.35rem', borderRadius: '4px', border: '1px solid var(--border-light)', marginTop: '0.2rem' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
            <div>
              <label style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>DEM FILE (.TIF / GEOJSON)</label>
              <input
                type="file"
                onChange={(e) => setDemFileName(e.target.files[0]?.name || '')}
                style={{ fontSize: '0.7rem', marginTop: '0.2rem' }}
              />
            </div>
            <div>
              <label style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>RIVER SHAPEFILE (.SHP / .ZIP)</label>
              <input
                type="file"
                onChange={(e) => setRiverFileName(e.target.files[0]?.name || '')}
                style={{ fontSize: '0.7rem', marginTop: '0.2rem' }}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ fontSize: '0.78rem', padding: '0.45rem', justifyContent: 'center' }}
          >
            <Upload size={14} /> Ingest Custom Dataset into Pipeline
          </button>
        </form>
      )}
    </div>
  );
}
