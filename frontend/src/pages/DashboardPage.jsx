import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

import MapContainerView from '../components/MapContainer';
import MapControllerBar from '../components/MapControllerBar';
import DamDetailPanel from '../components/DamDetailPanel';
import DatasetSelector from '../components/DatasetSelector';
import BreachControls from '../components/BreachControls';
import TimelinePlayer from '../components/TimelinePlayer';
import RiskZonePanel from '../components/RiskZonePanel';
import EarlyWarningPanel from '../components/EarlyWarningPanel';
import LossDamagePanel from '../components/LossDamagePanel';
import HydrographChart from '../components/HydrographChart';
import SimulationEnginePanel from '../components/SimulationEnginePanel';
import ExportPanel from '../components/ExportPanel';

export default function DashboardPage({ activeSim, setActiveSim }) {
  const [dams, setDams] = useState([]);
  const [selectedDam, setSelectedDam] = useState(null);
  const [simulationResult, setSimulationResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const mapRef = useRef(null);

  // Animation player state
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Fetch seed dams list on load
  useEffect(() => {
    async function fetchDams() {
      try {
        const res = await axios.get('/api/dams');
        if (res.data && res.data.dams) {
          setDams(res.data.dams);
          const tehri = res.data.dams.find(d => d.id === 'dam-tehri') || res.data.dams[0];
          setSelectedDam(tehri);
        }
      } catch (err) {
        console.error('Failed to fetch dams list:', err);
      }
    }
    fetchDams();
  }, []);

  const handleSelectDam = (dam) => {
    setSelectedDam(dam);
    if (simulationResult && simulationResult.dam_id !== dam.id) {
      setIsPlaying(false);
    }
  };

  const handleAddCustomDataset = (newDam) => {
    setDams((prev) => [newDam, ...prev]);
    setSelectedDam(newDam);
  };

  const handleRunSimulation = async (params) => {
    setLoading(true);
    setIsPlaying(false);
    try {
      const res = await axios.post('/api/simulate', params);
      setSimulationResult(res.data);
      if (setActiveSim) setActiveSim(res.data);
      setCurrentStepIdx(0);
      setIsPlaying(true);
    } catch (err) {
      console.error('Simulation execution error:', err);
      alert('Simulation error: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const timesteps = simulationResult?.geojson_timesteps || [];
  const currentStep = timesteps[currentStepIdx] || null;
  const currentGeoJSON = currentStep?.geojson || null;

  return (
    <div className="dashboard-layout">
      {/* Fixed Left Map Column (Part A & B) */}
      <aside className="map-column">
        <div className="map-wrapper">
          <MapContainerView
            ref={mapRef}
            dams={dams}
            selectedDam={selectedDam}
            onSelectDam={handleSelectDam}
            currentGeoJSON={currentGeoJSON}
            riskZones={simulationResult?.risk_zones || null}
            geeSatelliteExtent={simulationResult?.gee_satellite_extent || null}
            onStartSimulate={(dam) => setSelectedDam(dam)}
          />
        </div>
        {/* Custom Below-Map Control Bar (Part B) */}
        <MapControllerBar mapRef={mapRef} />
      </aside>

      {/* Independently Scrollable Right Info Column (Part A) */}
      <main className="info-column">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Dataset & Hydro Infrastructure Selector */}
          <DatasetSelector
            dams={dams}
            selectedDam={selectedDam}
            onSelectDam={handleSelectDam}
            onAddCustomDataset={handleAddCustomDataset}
          />

          {/* Dam Detailed Specifications */}
          <DamDetailPanel dam={selectedDam} />

          {/* Breach Parameter Control Panel */}
          <BreachControls
            selectedDam={selectedDam}
            onRunSimulation={handleRunSimulation}
            loading={loading}
          />

          {/* Animation Timeline Scrub Controller */}
          {simulationResult && (
            <TimelinePlayer
              timesteps={timesteps}
              currentStepIdx={currentStepIdx}
              onStepChange={setCurrentStepIdx}
              isPlaying={isPlaying}
              onTogglePlay={() => setIsPlaying(!isPlaying)}
            />
          )}

          {/* Hydrodynamic Engine & Model Diagnostics */}
          {simulationResult && (
            <SimulationEnginePanel simulationResult={simulationResult} />
          )}

          {/* Recharts Outflow Hydrograph */}
          {simulationResult && (
            <HydrographChart
              breachParams={simulationResult.breach_params}
              damName={simulationResult.dam_name}
              engineUsed={simulationResult.engine_used}
              engineTier={simulationResult.engine_tier}
              engineLabel={simulationResult.engine_label}
            />
          )}

          {/* Loss & Damage Assessment Panel */}
          {simulationResult && (
            <LossDamagePanel lossDamage={simulationResult.loss_damage} />
          )}

          {/* GIS Data Export Bar */}
          {simulationResult && (
            <ExportPanel simulationData={simulationResult} />
          )}

          {/* Early Warning Emergency Alert Broadcast */}
          {simulationResult && (
            <EarlyWarningPanel
              riskZones={simulationResult.risk_zones}
              damName={simulationResult.dam_name}
            />
          )}

          {/* Downstream Risk Zones & Impact Arrival Times */}
          {simulationResult && (
            <RiskZonePanel
              riskZones={simulationResult.risk_zones}
              onSelectZone={(settlement) => {
                // Focus on selected settlement
              }}
            />
          )}
        </div>
      </main>
    </div>
  );
}
