import React, { useEffect, useState } from 'react';
import { Play, Pause, RotateCcw, FastForward, Clock, Waves, Compass, ArrowRight } from 'lucide-react';

export default function TimelinePlayer({ timesteps, currentStepIdx, onStepChange, isPlaying, onTogglePlay }) {
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  const activeStep = timesteps?.[currentStepIdx] || null;

  // Animation Loop Effect
  useEffect(() => {
    let timer = null;
    if (isPlaying && timesteps && timesteps.length > 0) {
      const intervalMs = 1200 / playbackSpeed;
      timer = setInterval(() => {
        onStepChange((prevIdx) => {
          if (prevIdx >= timesteps.length - 1) {
            return 0; // Loop back to start
          }
          return prevIdx + 1;
        });
      }, intervalMs);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, timesteps, playbackSpeed, onStepChange]);

  if (!timesteps || timesteps.length === 0) return null;

  const totalSteps = timesteps.length;

  return (
    <div className="bs-card" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--border-light)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Clock size={18} color="var(--accent-primary)" />
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
            Flood Progression Animation Controller
          </h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>SPEED:</span>
          {[1, 2, 5].map((spd) => (
            <button
              key={spd}
              onClick={() => setPlaybackSpeed(spd)}
              style={{
                padding: '0.15rem 0.45rem',
                fontSize: '0.7rem',
                fontWeight: 700,
                borderRadius: '4px',
                border: playbackSpeed === spd ? '1px solid var(--accent-primary)' : '1px solid var(--border-light)',
                backgroundColor: playbackSpeed === spd ? 'var(--accent-light)' : '#FFFFFF',
                color: playbackSpeed === spd ? 'var(--accent-primary)' : 'var(--text-secondary)',
                cursor: 'pointer'
              }}
            >
              {spd}x
            </button>
          ))}
        </div>
      </div>

      {/* Main Scrubber Slider & Play Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.8rem' }}>
        <button
          onClick={onTogglePlay}
          className="btn-primary"
          style={{
            padding: '0.5rem 1rem',
            fontSize: '0.85rem',
            borderRadius: '8px',
            backgroundColor: isPlaying ? '#F59E0B' : 'var(--accent-primary)'
          }}
        >
          {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
          <span>{isPlaying ? 'Pause' : 'Play'}</span>
        </button>

        <button
          onClick={() => onStepChange(0)}
          className="btn-outline"
          title="Reset to T+0"
          style={{ padding: '0.5rem' }}
        >
          <RotateCcw size={16} />
        </button>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
          <input
            type="range"
            min="0"
            max={totalSteps - 1}
            value={currentStepIdx}
            onChange={(e) => onStepChange(Number(e.target.value))}
            style={{
              width: '100%',
              accentColor: 'var(--accent-primary)',
              cursor: 'pointer',
              height: '6px'
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            <span>T+0 min (Dam Breach)</span>
            <span>T+180 min</span>
            <span>T+360 min (6 hrs)</span>
          </div>
        </div>
      </div>

      {/* Live Hydrologic Telemetry Stats Bar */}
      {activeStep && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '0.6rem',
          backgroundColor: 'var(--bg-main)',
          padding: '0.6rem',
          borderRadius: '8px',
          border: '1px solid var(--border-light)'
        }}>
          <div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700 }}>ELAPSED TIME</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
              +{activeStep.timestep_min} min <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>({activeStep.timestep_hr}h)</span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700 }}>FLOOD FRONT REACH</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {activeStep.reach_dist_km} km
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700 }}>MAX WATER DEPTH</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: activeStep.max_depth_m > 5 ? '#DC2626' : '#F59E0B' }}>
              {activeStep.max_depth_m} m
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700 }}>FLOODED AREA</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {activeStep.flooded_area_sqkm} km²
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
