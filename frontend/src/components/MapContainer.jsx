import React, { useEffect, useState, forwardRef } from 'react';
import { MapContainer as LeafletMap, TileLayer, CircleMarker, Popup, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Waves, Satellite, Info, ShieldAlert } from 'lucide-react';

// Map recenter hook when dam is selected by user
function MapRecenter({ selectedDam }) {
  const map = useMap();
  useEffect(() => {
    if (selectedDam) {
      map.flyTo([selectedDam.lat, selectedDam.lng], 9, { duration: 1.2 });
    }
  }, [selectedDam, map]);
  return null;
}

const MapContainerView = forwardRef(({ dams, selectedDam, onSelectDam, currentGeoJSON, riskZones, geeSatelliteExtent, onStartSimulate }, ref) => {
  const [showSatelliteLayer, setShowSatelliteLayer] = useState(true);

  const indiaCenter = [22.9734, 78.6569];
  const indiaBounds = [
    [6.0, 68.0],   // Southwest
    [37.5, 97.5]   // Northeast
  ];

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '12px 12px 0 0', overflow: 'hidden', border: '1px solid var(--border-light)', borderBottom: 'none' }}>
      <LeafletMap
        ref={ref}
        center={indiaCenter}
        zoom={5}
        minZoom={4}
        maxZoom={12}
        maxBounds={indiaBounds}
        maxBoundsViscosity={1.0}
        zoomControl={false} /* Disabled built-in zoom controls to use custom Part B controller bar */
        style={{ width: '100%', height: '100%', background: '#F8FAFC' }}
        scrollWheelZoom={true}
      >
        <MapRecenter selectedDam={selectedDam} />

        {/* Clean, Watermark-Free OpenStreetMap Tile Layer */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          maxZoom={18}
        />

        {/* Dam Circle Markers */}
        {dams.map((dam) => {
          const isPilot = dam.is_pilot;
          const isSelected = selectedDam?.id === dam.id;

          return (
            <CircleMarker
              key={dam.id}
              center={[dam.lat, dam.lng]}
              radius={isPilot ? 9 : 7}
              pathOptions={{
                color: isPilot ? '#DC2626' : '#1D6FD9',
                fillColor: isPilot ? '#DC2626' : '#1D6FD9',
                fillOpacity: isSelected ? 1.0 : 0.85,
                weight: isSelected ? 3 : 2
              }}
              eventHandlers={{
                click: () => onSelectDam(dam)
              }}
            >
              <Popup>
                <div style={{ padding: '0.2rem', minWidth: '220px', fontFamily: 'var(--font-sans)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                      {dam.name}
                    </h3>
                    {isPilot ? (
                      <span className="badge badge-pilot">PILOT MODEL</span>
                    ) : (
                      <span className="badge badge-coming">SEED DATA</span>
                    )}
                  </div>

                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '0.75rem' }}>
                    <div><strong>River:</strong> {dam.river}</div>
                    <div><strong>State:</strong> {dam.state} ({dam.district})</div>
                    <div><strong>Height:</strong> {dam.height_m} m | <strong>Capacity:</strong> {dam.storage_capacity_mcm} MCM</div>
                    <div><strong>Built:</strong> {dam.year_built} | <strong>Type:</strong> {dam.type}</div>
                  </div>

                  <button
                    className="btn-danger"
                    style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem', padding: '0.45rem' }}
                    onClick={() => onStartSimulate(dam)}
                  >
                    <Waves size={16} /> Select & Configure Simulation
                  </button>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}

        {/* Dynamic Inundation GeoJSON Layer */}
        {currentGeoJSON && (
          <GeoJSON
            key={JSON.stringify(currentGeoJSON)}
            data={currentGeoJSON}
            style={(feature) => ({
              fillColor: feature.properties.fill_color || '#DC2626',
              fillOpacity: 0.65,
              weight: 2,
              color: feature.properties.stroke_color || '#991B1B',
              opacity: 0.9
            })}
          />
        )}

        {/* Google Earth Engine (GEE) Sentinel-1 SAR Satellite Layer Overlay */}
        {showSatelliteLayer && geeSatelliteExtent?.geojson && (
          <GeoJSON
            key={JSON.stringify(geeSatelliteExtent.geojson)}
            data={geeSatelliteExtent.geojson}
            style={() => ({
              fillColor: '#06B6D4',
              fillOpacity: 0.35,
              weight: 2.5,
              color: '#0891B2',
              dashArray: '4, 4'
            })}
          />
        )}

        {/* Downstream Settlement Circle Markers */}
        {riskZones && riskZones.map((v) => (
          <CircleMarker
            key={v.village_id}
            center={[v.lat, v.lng]}
            radius={5}
            pathOptions={{
              color: v.badge_color,
              fillColor: '#FFFFFF',
              fillOpacity: 1.0,
              weight: 2.5
            }}
          >
            <Popup>
              <div style={{ fontSize: '0.8rem', padding: '0.2rem' }}>
                <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{v.name}</strong>
                <div style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                  <div>Distance: <strong>{v.distance_km} km</strong> downstream</div>
                  <div>Arrival Time: <strong style={{ color: v.badge_color }}>{v.arrival_time_min} mins</strong></div>
                  <div>Expected Depth: <strong>~{v.est_depth_m} m</strong></div>
                  <div>Population: <strong>{v.population.toLocaleString()}</strong></div>
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </LeafletMap>

      {/* Floating GEE Satellite Layer Toggle Bar */}
      <div style={{
        position: 'absolute',
        top: '16px',
        right: '16px',
        zIndex: 1000,
        backgroundColor: '#FFFFFF',
        padding: '0.5rem 0.8rem',
        borderRadius: '8px',
        boxShadow: 'var(--shadow-card)',
        border: '1px solid var(--border-light)',
        fontSize: '0.78rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem'
      }}>
        <Satellite size={16} color="#0891B2" />
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontWeight: 600, color: 'var(--text-primary)' }}>
          <input
            type="checkbox"
            checked={showSatelliteLayer}
            onChange={(e) => setShowSatelliteLayer(e.target.checked)}
            style={{ accentColor: '#0891B2', cursor: 'pointer' }}
          />
          Live Satellite Flood Layer (GEE Sentinel-1 SAR)
        </label>
      </div>

      {/* Map Legend */}
      <div style={{
        position: 'absolute',
        bottom: '16px',
        left: '16px',
        zIndex: 1000,
        backgroundColor: '#FFFFFF',
        padding: '0.65rem 0.85rem',
        borderRadius: '8px',
        boxShadow: 'var(--shadow-card)',
        border: '1px solid var(--border-light)',
        fontSize: '0.75rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.4rem'
      }}>
        <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Inundation & Satellite Legend</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#60A5FA' }}></span>
          <span>Shallow (&lt; 2m)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#1D6FD9' }}></span>
          <span>Moderate (2m - 5m)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#F59E0B' }}></span>
          <span>High Depth (5m - 10m)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#DC2626' }}></span>
          <span>Extreme Depth (&gt; 10m)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingTop: '0.2rem', borderTop: '1px solid var(--border-light)' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#06B6D4', border: '1px dashed #0891B2' }}></span>
          <span>GEE Sentinel-1 SAR Water Extent</span>
        </div>
      </div>
    </div>
  );
});

export default MapContainerView;
