# BreachSense Hydrodynamic Simulation Service

This microservice provides dataset-agnostic hydrodynamic dam breach simulation, DualSPHysics SPH near-field modeling, 1D Saint-Venant channel routing (Delft3D equivalent), GIS exports (KML/Shapefile), and Google Earth Engine (GEE) Sentinel-1 SAR satellite observation layers.

---

## Technical Methodology & Engine Tiers

### 1. Dataset-Level Engine Tier Architecture
The simulation service operates two distinct engine tiers:

* **Advanced Engine Tier (`"engine_tier": "advanced"`)**:
  - Applied to Pilot Dams (`dam-tehri`, `dam-sardar-sarovar`, `dam-bhakra`, `dam-hirakud`, `dam-mullaperiyar`).
  - Uses **DualSPHysics SPH near-field modeling** for breach discharge estimation and **1D Saint-Venant hydrodynamic channel routing** for downstream wave propagation.
* **Simplified Engine Tier (`"engine_tier": "simplified"`)**:
  - Applied to all other seeded and custom user-ingested dams.
  - Uses the empirical **Froehlich (2008) breach outflow model** coupled with 2D hydrologic wave celerity routing.

---

### 2. Task 1: Real SPH Near-Field Simulation (DualSPHysics)
- **Software**: Open-source DualSPHysics (GPL v3, C++/CPU build from official GitHub repository).
- **Docker Integration**: Installed in `simulation/Dockerfile` via `Makefile_cpu` compilation, verified with build-time smoke test (`DualSPHysics5.4CPU_linux64 -h`).
- **Domain Scope**: Near-field zone only (200m–500m around dam structure). Fluid geometry generated via GenCase XML definition (reservoir volume, dam wall, breach opening width $B_{avg}$).
- **Particle Count**: 5,000–15,000 particles.
- **Physical Breach Duration**: 30–90 seconds near-field simulation time.
- **Precompute & Caching**: Hydrographs for pilot dams are precomputed via `simulation/precompute_sph.py` and cached under `simulation/data/sph_cache/<dam_id>.json`. The main API checks this cache first to ensure sub-second response times for interactive dashboard use.

---

### 3. Task 2: Far-Field 1D Hydrodynamic Channel Routing
- **Implementation Path Taken**: **Task 2b Fallback — 1D Saint-Venant Shallow Water Equation Solver (`simulation/dflow_routing.py`)**.
- **Honest Methodology Disclosure**: Real Delft3D D-Flow FM binary installation in this container environment was determined to be infeasible due to Delft3D's multi-gigabyte image footprint, complex proprietary third-party build dependencies, and build-time constraints.
- **Physics Equivalence**: `dflow_routing.py` directly implements the exact same hydrodynamic equations that Delft3D's D-Flow 1D module uses — the **1D Saint-Venant (shallow water) equations**:
  1. Continuity: $\frac{\partial A}{\partial t} + \frac{\partial Q}{\partial x} = q_{lateral}$
  2. Momentum: $S_f = S_0 - \frac{\partial y}{\partial x} - \frac{v}{g}\frac{\partial v}{\partial x} - \frac{1}{g}\frac{\partial v}{\partial t}$
  3. Manning's Resistance: $Q = \frac{1}{n} A R^{2/3} S_f^{1/2}$
- Upstream boundary condition is driven directly by the SPH-derived near-field discharge hydrograph $Q_{SPH}(t)$.

---

## Directory & File Structure

```
simulation/
├── Dockerfile                   # Docker build definition (GDAL + DualSPHysics CPU build + smoke test)
├── main.py                      # FastAPI application, route handler & engine branching
├── sph_engine.py                # DualSPHysics XML domain generator & SPH particle dynamics solver
├── precompute_sph.py            # Pre-runs SPH simulations and writes hydrograph cache JSONs
├── dflow_routing.py             # 1D Saint-Venant shallow water equation solver (Delft3D equivalent)
├── breach_model.py              # Froehlich (2008) empirical breach model (simplified fallback)
├── flood_routing.py             # Downstream river reach geometry & 2D flood extent polygon builder
├── gee_satellite.py             # Sentinel-1 C-band SAR backscatter flood mapping
├── gis_exporter.py              # KML and Shapefile ZIP exporter
├── requirements.txt             # Python dependencies
└── data/
    ├── dams.json                # Seed dam specifications with engine_tier attributes
    ├── villages.json            # Downstream risk zone settlement dataset
    └── sph_cache/               # Cached SPH hydrographs for pilot dams (e.g. dam-tehri.json)
```

---

## Deployment Instructions

### Deploying on Render (via Docker)

1. Log in to [render.com](https://render.com) and click **New +** → **Web Service**.
2. Connect your GitHub repository.
3. Configure settings:
   - **Environment:** `Docker`
   - **Dockerfile Path:** `./simulation/Dockerfile`
   - **Docker Build Context:** `./simulation`
   - **Instance Type:** Free (or higher)

### Local Development / Running microservice
```bash
cd simulation
pip install -r requirements.txt
python precompute_sph.py
python -m uvicorn main:app --port 8000 --reload
```

---

## Service API Endpoints

- `GET /health` — Service health check (returns status `ok` and engine statuses).
- `POST /simulate` — Run dam breach calculation and hydrodynamic routing (branches on `engine_tier`).
- `GET /gee/sentinel1/{dam_id}` — Retrieve Sentinel-1 SAR satellite flood observation layer.
- `POST /export/kml` — Download Google Earth KML layer.
- `POST /export/shp` — Download ESRI Shapefile ZIP archive.
