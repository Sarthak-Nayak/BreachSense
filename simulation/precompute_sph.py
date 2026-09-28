"""
Precompute & Cache SPH Near-Field Breach Hydrographs
=====================================================
Runs the SPH near-field breach simulation for all pilot dams and saves
the resulting discharge hydrographs to simulation/data/sph_cache/<dam_id>.json.

This cached real SPH output is loaded by main.py for advanced pilot dam simulations.
"""

import os
import sys
import json

# Add simulation dir to python path
SIM_DIR = os.path.dirname(os.path.abspath(__file__))
if SIM_DIR not in sys.path:
    sys.path.insert(0, SIM_DIR)

from breach_model import calculate_froehlich_breach
from sph_engine import run_sph_simulation_for_dam

def precompute_all_sph_caches():
    data_dir = os.path.join(SIM_DIR, "data")
    cache_dir = os.path.join(data_dir, "sph_cache")
    os.makedirs(cache_dir, exist_ok=True)
    
    dams_file = os.path.join(data_dir, "dams.json")
    if not os.path.exists(dams_file):
        print(f"Error: dams.json not found at {dams_file}")
        return
        
    with open(dams_file, "r", encoding="utf-8") as f:
        dams = json.load(f)
        
    pilot_dams = [d for d in dams if d.get("is_pilot") or d.get("engine_tier") == "advanced"]
    print(f"Precomputing SPH near-field simulation caches for {len(pilot_dams)} pilot dam(s)...")
    
    for dam in pilot_dams:
        dam_id = dam["id"]
        print(f" -> Running SPH Near-Field Simulation for {dam['name']} ({dam_id})...")
        
        # Calculate baseline parameters
        breach_params = calculate_froehlich_breach(
            height_m=dam["height_m"],
            storage_capacity_mcm=dam["storage_capacity_mcm"],
            breach_type="overtopping",
            breach_size="catastrophic",
            water_level_pct=100.0
        )
        
        # Run SPH simulation engine
        sph_result = run_sph_simulation_for_dam(dam, breach_params)
        
        # Cache file path
        cache_file = os.path.join(cache_dir, f"{dam_id}.json")
        with open(cache_file, "w", encoding="utf-8") as f:
            json.dump(sph_result, f, indent=2)
            
        print(f"    Saved SPH hydrograph cache to {cache_file} (Peak Q: {sph_result['q_peak_cumec']} m3/s)")
        
    print("\nSPH Precomputation Complete! All pilot dam caches generated successfully.")

if __name__ == "__main__":
    precompute_all_sph_caches()
