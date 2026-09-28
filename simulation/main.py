import os
import json
from fastapi import FastAPI, HTTPException, Response, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional

from breach_model import calculate_froehlich_breach
from flood_routing import route_flood_wave
from gee_satellite import get_sentinel1_satellite_flood_extent
from gis_exporter import export_kml, export_shapefile_zip

app = FastAPI(
    title="BreachSense Hydrodynamic Simulation API",
    description="Dataset-Agnostic Hydrodynamic Simulation Microservice for Dam Breach & Satellite Flood Detection",
    version="2.0.0"
)

# Permissive CORS middleware configured for internal service-to-service communication
# (e.g., server-to-server calls from Node/Express backend or client apps)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_DIR = os.getenv("DATA_DIR", os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data")))
if not os.path.exists(DATA_DIR):
    DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "data"))

def load_json_file(filename):
    filepath = os.path.join(DATA_DIR, filename)
    if not os.path.exists(filepath):
        alt_filepath = os.path.join(os.path.dirname(__file__), "data", filename)
        if os.path.exists(alt_filepath):
            filepath = alt_filepath
        else:
            raise FileNotFoundError(f"Data file not found at {filepath} or {alt_filepath}")
    with open(filepath, "r", encoding="utf-8") as f:
        return json.load(f)

class SimulateRequest(BaseModel):
    dam_id: str = Field(..., example="dam-tehri")
    breach_type: str = Field("overtopping", example="overtopping")
    breach_size: str = Field("catastrophic", example="catastrophic")
    water_level_pct: float = Field(100.0, example=100.0)

@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "BreachSense Hydrodynamic Engine",
        "dataset_agnostic": True,
        "gee_sentinel1": "Active"
    }

@app.post("/simulate")
def run_simulation(req: SimulateRequest):
    try:
        dams_data = load_json_file("dams.json")
        villages_data = load_json_file("villages.json")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load seed dataset: {str(e)}")
        
    dam = next((d for d in dams_data if d["id"] == req.dam_id), None)
    if not dam:
        # Generate dynamic dam object for custom dataset IDs
        dam = {
            "id": req.dam_id,
            "name": f"Custom Dam ({req.dam_id})",
            "river": "Local River",
            "state": "Custom Region",
            "district": "Custom District",
            "lat": 22.5,
            "lng": 78.5,
            "height_m": 85.0,
            "storage_capacity_mcm": 2500,
            "year_built": 2020,
            "nearest_city": "Nearest City",
            "type": "Custom Structure"
        }
        
    breach_params = calculate_froehlich_breach(
        height_m=dam["height_m"],
        storage_capacity_mcm=dam["storage_capacity_mcm"],
        breach_type=req.breach_type,
        breach_size=req.breach_size,
        water_level_pct=req.water_level_pct
    )
    
    routing_results = route_flood_wave(
        dam_info=dam,
        breach_params=breach_params,
        villages_seed=villages_data
    )
    
    satellite_result = get_sentinel1_satellite_flood_extent(dam["id"], dam)
    
    simulation_id = f"sim-{req.dam_id}-{req.breach_type}-{req.breach_size}"
    
    return {
        "simulation_id": simulation_id,
        "dam_id": dam["id"],
        "dam_name": dam["name"],
        "river": dam["river"],
        "state": dam["state"],
        "breach_type": req.breach_type,
        "breach_size": req.breach_size,
        "water_level_pct": req.water_level_pct,
        "breach_params": breach_params,
        "wave_speed_kmh": routing_results["wave_speed_kmh"],
        "total_timesteps": routing_results["total_timesteps"],
        "geojson_timesteps": routing_results["geojson_timesteps"],
        "risk_zones": routing_results["risk_zones"],
        "loss_damage": routing_results["loss_damage"],
        "gee_satellite_extent": satellite_result
    }

@app.get("/gee/sentinel1/{dam_id}")
def get_gee_satellite_layer(dam_id: str):
    try:
        dams_data = load_json_file("dams.json")
        dam = next((d for d in dams_data if d["id"] == dam_id), dams_data[0])
    except Exception:
        dam = {"id": dam_id, "name": "Dam", "lat": 22.5, "lng": 78.5}
        
    return get_sentinel1_satellite_flood_extent(dam_id, dam)

@app.post("/export/kml")
def export_simulation_kml(sim_data: dict):
    kml_content = export_kml(sim_data)
    dam_name = sim_data.get("dam_name", "Dam").replace(" ", "_")
    return Response(
        content=kml_content,
        media_type="application/vnd.google-earth.kml+xml",
        headers={"Content-Disposition": f"attachment; filename={dam_name}_flood_extent.kml"}
    )

@app.post("/export/shp")
def export_simulation_shp(sim_data: dict):
    zip_bytes = export_shapefile_zip(sim_data)
    dam_name = sim_data.get("dam_name", "Dam").replace(" ", "_")
    return Response(
        content=zip_bytes,
        media_type="application/zip",
        headers={"Content-Disposition": f"attachment; filename={dam_name}_shapefile.zip"}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
