# BreachSense Hydrodynamic Simulation Service

This microservice provides dataset-agnostic hydrodynamic dam breach simulation, flood wave routing, GIS exports (KML/Shapefile), and Google Earth Engine (GEE) Sentinel-1 SAR satellite observation layers.

## Tech Stack
- **Framework:** Python 3.11, FastAPI, Uvicorn
- **Geospatial & Hydrodynamics:** GeoPandas, GDAL 3.6.2, Shapely, Earth Engine API (`earthengine-api`)

---

## Deploying on Render (via Docker)

Because GDAL and GeoPandas require system-level C/C++ libraries (`libgdal-dev`, `libgeos-dev`, `libproj-dev`), this service **must be deployed using Docker** rather than Render's standard Python buildpack.

### Automated Setup (via `render.yaml` Blueprint)
If you connect the repository to Render using **Blueprints**, Render will automatically read `render.yaml` from the root of the repository and configure the service as a Docker Web Service.

### Manual Setup on Render
1. Log in to [render.com](https://render.com) and click **New +** → **Web Service**.
2. Connect your GitHub repository.
3. Configure the following settings:
   - **Name:** `breachsense-simulation`
   - **Environment:** `Docker`
   - **Dockerfile Path:** `./simulation/Dockerfile`
   - **Docker Build Context:** `./simulation`
   - **Instance Type:** Free (or higher)

---

## Environment Variables

Configure the following environment variables in Render's dashboard under **Environment Settings**:

| Variable Name | Required | Description |
|---|---|---|
| `PORT` | Auto (Render) | Port provided dynamically by Render at runtime for Uvicorn. |
| `GEE_SERVICE_ACCOUNT_JSON` | Optional | Raw JSON string of a Google Earth Engine service account key. Used to initialize Earth Engine API. If omitted, the service gracefully falls back to synthetic SAR backscatter water detection. |

> **Note on Secrets:** Do **NOT** commit service account key JSON files to git. Add `GEE_SERVICE_ACCOUNT_JSON` directly in Render's Environment Variables tab.

---

## Service API Endpoints

- `GET /health` — Service health check (returns status `ok`). Render uses this to verify deployment.
- `POST /simulate` — Run breach calculation and hydrodynamic flood wave routing for a given dam.
- `GET /gee/sentinel1/{dam_id}` — Retrieve Sentinel-1 SAR satellite flood extent observation layer.
- `POST /export/kml` — Generate and download Google Earth KML polygon overlay.
- `POST /export/shp` — Generate and download ESRI Shapefile / GeoJSON ZIP archive.

---

## Integration with Express Backend

In your Express backend environment variables (`.env`), configure:
```env
PYTHON_SIM_URL=https://breachsense-simulation.onrender.com
```
(Replace with your actual live Render deployment URL).
