# BreachSense — Dam Break & Flood Simulation Dashboard

**BreachSense** is an interactive, full-stack dam-break inundation modeling and early-warning web application built for Indian hydro-infrastructure. Developed for **Smart India Hackathon (Problem Statement 161: Dam Break Inundation Modelling Using Hydrodynamic Modelling of any River)**.

---

## Key Features

1. **All-India Interactive Dam Selector Map**: Built with React Leaflet displaying 20+ seeded major dams across India with vector CircleMarkers (Red for active pilots, Blue for seeded dams).
2. **Dataset-Agnostic Hydrodynamic Engine**:
   - **Froehlich (2008) Empirical Equations**: Peak discharge ($Q_p$), breach formation time ($t_f$), and average breach width ($B_{avg}$).
   - **Configurable Failure Modes**: Overtopping, Piping failure, or Structural failure.
   - **Ingest Custom Datasets**: Support for custom DEM GeoTIFF files, River Centerline GeoJSONs, and Dam Parameters.
3. **Google Earth Engine (GEE) Satellite Flood Observation**: Near real-time Sentinel-1 C-Band SAR backscatter satellite flood detection overlay (cyan/teal `#06B6D4`) side-by-side with simulated flood extent.
4. **Loss & Damage Assessment**: Computes affected population, critical infrastructure count (hospitals, schools, bridges, power plants), and estimated economic loss (in ₹ Crores).
5. **Downstream Risk Zones & Arrival Times**: Computes flood wave travel times and peak water depths for downstream towns/villages with 3-column stats grid.
6. **Early Warning & Emergency Dispatch**: Mock siren triggers and SMS alert message payloads for disaster management authorities (NDRF/SDRF/CWC).
7. **Recharts Discharge Hydrograph**: Visualizes $Q(t)$ discharge curve over time.
8. **GIS Data Export**: One-click export of flood extent layers as ESRI Shapefiles (`.shp.zip`) and Google Earth KML files (`.kml`).
9. **Strict Light Mode UI**: Hardcoded high-contrast light theme (`#F7F8FA` background, `#1A1A1A` text, `#1D6FD9` blue accent, `#DC2626` danger alerts, white cards with soft shadows).

---

## Deployment Guide

### Option 1: One-Command Docker Deployment (Recommended)

You can run the full 3-tier application using **Docker Compose**:

```bash
# Clone the repository and navigate to root directory
cd BreachSense

# Build and start all services (Python API, Express Backend, Nginx Frontend)
docker compose up --build -d
```

- **Frontend Application**: `http://localhost:5173`
- **Express Backend API**: `http://localhost:5000`
- **Python FastAPI Engine**: `http://localhost:8000/docs`

---

### Option 2: Cloud Deployment (Render.com + Vercel / Netlify)

For cloud hosting during hackathon demos, deploy the backend microservices first, then point the frontend:

#### Step 1: Deploy Python Simulation Engine (Render / Railway)
1. Push repo to GitHub.
2. On [Render.com](https://render.com), click **New +** -> **Web Service**.
3. Connect your repository, set Root Directory to `simulation`.
4. Build Command: `pip install -r requirements.txt`
5. Start Command: `python -m uvicorn main:app --host 0.0.0.0 --port 8000`

#### Step 2: Deploy Express Backend (Render / Railway)
1. On [Render.com](https://render.com), click **New +** -> **Web Service**.
2. Connect your repository, set Root Directory to `backend`.
3. Set Environment Variable: `PYTHON_SIM_URL = https://your-python-service.onrender.com`
4. Build Command: `npm install`
5. Start Command: `node server.js`

#### Step 3: Deploy React Frontend (Vercel / Netlify)
1. On [Vercel](https://vercel.com), click **Add New Project**.
2. Set Root Directory to `frontend`.
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Add rewrites in `vercel.json` to proxy `/api/*` requests to your Express Render URL:
   ```json
   {
     "rewrites": [
       { "source": "/api/:path*", "destination": "https://your-express-backend.onrender.com/api/:path*" }
     ]
   }
   ```

---

## Local Setup Instructions

### Prerequisites
- **Node.js**: v18 or higher (`node -v`)
- **Python**: v3.9 or higher (`python --version`)

### Run Locally (Without Docker)

Launch all 3 services using `start.bat` on Windows or manually:

1. **Python Simulation Service (Port 8000)**:
   ```bash
   cd simulation
   pip install -r requirements.txt
   python -m uvicorn main:app --port 8000 --reload
   ```

2. **Express Backend Service (Port 5000)**:
   ```bash
   cd backend
   npm install
   npm run dev
   ```

3. **React Frontend (Port 5173)**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

Open **`http://localhost:5173`** in your web browser.

---

## API Endpoints Summary

- **GET `/api/dams`**: List all seeded Indian dams.
- **GET `/api/dams/:id`**: Get dam specifications and downstream settlements.
- **POST `/api/simulate`**: Trigger breach simulation & Loss & Damage. Body: `{ damId, breachType, breachSize, waterLevelPct }`.
- **POST `/api/export`**: Download GIS data (`.shp` or `.kml`).
