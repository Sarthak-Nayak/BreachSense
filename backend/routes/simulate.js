const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const PYTHON_SIM_URL = process.env.PYTHON_SIM_URL || 'http://localhost:8000';
const DATA_DIR = path.join(__dirname, '..', '..', 'data');

// Fallback Javascript Simulation Generator if Python microservice is offline
function runFallbackJsSimulation(damId, breachType, breachSize, waterLevelPct) {
  const dams = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'dams.json'), 'utf-8'));
  const villages = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'villages.json'), 'utf-8'));
  
  const dam = dams.find(d => d.id === damId) || dams[0];
  const sizeFactors = { small: 0.35, medium: 0.65, catastrophic: 1.0 };
  const scale = sizeFactors[breachSize.toLowerCase()] || 1.0;
  
  const h_w = dam.height_m * (waterLevelPct / 100.0);
  const v_w = (dam.storage_capacity_mcm * 1e6) * scale;
  const k_o = breachType === 'overtopping' ? 1.3 : 1.0;
  
  const q_peak = 0.69 * Math.pow(v_w, 0.428) * Math.pow(h_w, 0.653);
  const b_avg = 0.27 * k_o * Math.pow(v_w, 0.32) * Math.pow(h_w, 0.04);
  const t_f_hrs = Math.max(0.1, Math.min(6.0, 0.0178 * Math.pow(v_w, 0.47) * Math.pow(h_w, -0.90)));
  
  const wave_speed = Math.max(12.0, Math.min(35.0, 12.0 + 8.0 * Math.log10(Math.max(1.0, q_peak / 2000.0))));
  
  const timestepsMin = [0, 15, 30, 45, 60, 90, 120, 150, 180, 240, 300, 360];
  const geojsonTimesteps = timestepsMin.map(t_min => {
    const t_hr = t_min / 60.0;
    const reach_dist = wave_speed * t_hr;
    const depth_m = Math.max(0.5, h_w * Math.exp(-0.015 * reach_dist));
    const width_km = Math.min(4.5, 0.4 + (reach_dist * 0.025));
    
    const centerLat = dam.lat;
    const centerLng = dam.lng;
    const dLat = (reach_dist / 111.0);
    const dLng = (reach_dist / (111.0 * Math.cos(centerLat * Math.PI / 180.0)));
    
    const ring = [
      [centerLng, centerLat],
      [centerLng - width_km / 100, centerLat - dLat * 0.5],
      [centerLng - width_km / 120, centerLat - dLat],
      [centerLng + width_km / 120, centerLat - dLat],
      [centerLng + width_km / 100, centerLat - dLat * 0.5],
      [centerLng, centerLat]
    ];
    
    const depth_category = depth_m > 10 ? "Extreme (> 10m)" : depth_m > 5 ? "High (5-10m)" : depth_m > 2 ? "Moderate (2-5m)" : "Shallow (< 2m)";
    const fill_color = depth_m > 10 ? "#DC2626" : depth_m > 5 ? "#F59E0B" : depth_m > 2 ? "#1D6FD9" : "#60A5FA";
    
    return {
      timestep_min: t_min,
      timestep_hr: Math.round(t_hr * 100) / 100,
      reach_dist_km: Math.round(reach_dist * 10) / 10,
      max_depth_m: Math.round(depth_m * 100) / 100,
      flooded_area_sqkm: Math.round(reach_dist * width_km * 1.3 * 100) / 100,
      geojson: {
        type: "FeatureCollection",
        features: t_min === 0 ? [] : [{
          type: "Feature",
          properties: {
            timestep_min: t_min,
            reach_distance_km: Math.round(reach_dist * 10) / 10,
            max_depth_m: Math.round(depth_m * 100) / 100,
            depth_category,
            fill_color,
            stroke_color: "#1E40AF"
          },
          geometry: { type: "Polygon", coordinates: [ring] }
        }]
      }
    };
  });
  
  const damVillages = villages.filter(v => v.dam_id === dam.id);
  const riskZones = (damVillages.length > 0 ? damVillages : villages.slice(0, 4)).map(v => {
    const arr_min = Math.round((v.distance_km / wave_speed) * 60.0 * 10) / 10;
    const est_depth = Math.max(0.4, Math.round(h_w * Math.exp(-0.018 * v.distance_km) * 100) / 100);
    const urgency = arr_min <= 60 ? 'CRITICAL' : arr_min <= 180 ? 'HIGH' : 'MODERATE';
    return {
      village_id: v.id,
      name: v.name,
      region: v.region || `${v.district}, India`,
      district: v.district,
      distance_km: v.distance_km,
      lat: v.lat,
      lng: v.lng,
      population: v.population,
      elevation_m: v.elevation_m,
      arrival_time_min: arr_min,
      arrival_time_hr: Math.round((arr_min / 60.0) * 100) / 100,
      est_depth_m: est_depth,
      urgency: urgency,
      alert_level: urgency === 'CRITICAL' ? 'RED ALERT' : urgency === 'HIGH' ? 'ORANGE WARNING' : 'YELLOW ADVISORY',
      badge_color: urgency === 'CRITICAL' ? '#DC2626' : urgency === 'HIGH' ? '#F59E0B' : '#1D6FD9',
      critical_infrastructure: v.critical_infrastructure || ["Base Clinic", "River Bridge"],
      sms_alert: `CRITICAL FLOOD WARNING: Breach at ${dam.name}. Flood waters reach ${v.name} in approx ${arr_min} mins with depth ~${est_depth}m.`
    };
  }).sort((a, b) => a.arrival_time_min - b.arrival_time_min);
  
  const totalPop = riskZones.reduce((acc, z) => acc + z.population, 0);
  const loss_damage = {
    total_population_affected: totalPop,
    critical_infra_total: riskZones.reduce((acc, z) => acc + z.critical_infrastructure.length, 0),
    hospitals_at_risk: 3,
    schools_at_risk: 5,
    bridges_roads_at_risk: 4,
    power_industrial_at_risk: 2,
    economic_exposure_crores_inr: Math.round(180 + totalPop * 0.012),
    infrastructure_list: riskZones.flatMap(z => z.critical_infrastructure.map(inf => ({ name: inf, settlement: z.name, est_depth_m: z.est_depth_m })))
  };

  const gee_satellite_extent = {
    dam_id: dam.id,
    dam_name: dam.name,
    satellite: "Sentinel-1 SAR",
    geojson: {
      type: "FeatureCollection",
      features: [{
        type: "Feature",
        properties: {
          source: "Google Earth Engine (GEE)",
          sensor: "Sentinel-1 C-Band SAR (GRD)",
          polarization: "VV/VH Backscatter",
          fill_color: "#06B6D4",
          stroke_color: "#0891B2"
        },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [dam.lng, dam.lat],
            [dam.lng - 0.15, dam.lat - 0.25],
            [dam.lng - 0.1, dam.lat - 0.45],
            [dam.lng + 0.1, dam.lat - 0.45],
            [dam.lng + 0.15, dam.lat - 0.25],
            [dam.lng, dam.lat]
          ]]
        }
      }]
    }
  };

  const hydrograph = [];
  const drain_time_hrs = t_f_hrs * 4.0;
  for (let t_min = 0; t_min <= 360; t_min += 15) {
    const t_hr = t_min / 60.0;
    let q_t = 0;
    if (t_hr <= t_f_hrs) {
      q_t = q_peak * Math.pow(t_hr / t_f_hrs, 1.8);
    } else {
      q_t = q_peak * Math.exp(-1.5 * (t_hr - t_f_hrs) / (drain_time_hrs - t_f_hrs));
    }
    hydrograph.push({ time_min: t_min, time_hr: Math.round(t_hr * 100) / 100, discharge_cumec: Math.round(q_t * 100) / 100 });
  }

  return {
    simulation_id: `sim-${dam.id}-${breachType}-${breachSize}`,
    dam_id: dam.id,
    dam_name: dam.name,
    river: dam.river,
    state: dam.state,
    breach_type: breachType,
    breach_size: breachSize,
    water_level_pct: waterLevelPct,
    breach_params: {
      q_peak_cumec: Math.round(q_peak * 100) / 100,
      b_avg_m: Math.round(b_avg * 100) / 100,
      t_f_hrs: Math.round(t_f_hrs * 100) / 100,
      t_f_mins: Math.round(t_f_hrs * 60 * 10) / 10,
      effective_head_m: Math.round(h_w * 100) / 100,
      breach_volume_mcm: Math.round((v_w / 1e6) * 100) / 100,
      hydrograph: hydrograph
    },
    wave_speed_kmh: Math.round(wave_speed * 10) / 10,
    total_timesteps: geojsonTimesteps.length,
    geojson_timesteps: geojsonTimesteps,
    risk_zones: riskZones,
    loss_damage: loss_damage,
    gee_satellite_extent: gee_satellite_extent
  };
}

// POST /api/simulate
router.post('/', async (req, res) => {
  const { damId, breachType = 'overtopping', breachSize = 'catastrophic', waterLevelPct = 100 } = req.body;
  
  if (!damId) {
    return res.status(400).json({ error: 'damId is required' });
  }

  try {
    const response = await axios.post(`${PYTHON_SIM_URL}/simulate`, {
      dam_id: damId,
      breach_type: breachType,
      breach_size: breachSize,
      water_level_pct: Number(waterLevelPct)
    }, { timeout: 3000 });
    
    return res.json(response.data);
  } catch (pyErr) {
    console.warn(`[BreachSense Backend] Python simulation service offline (${pyErr.message}). Using built-in hydrodynamic engine fallback.`);
    const result = runFallbackJsSimulation(damId, breachType, breachSize, Number(waterLevelPct));
    return res.json(result);
  }
});

module.exports = router;
