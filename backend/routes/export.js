const express = require('express');
const axios = require('axios');
const router = express.Router();

const PYTHON_SIM_URL = process.env.PYTHON_SIM_URL || 'http://localhost:8000';

// POST /api/export
// Body: { simulationData, format: 'kml' | 'shp' }
router.post('/', async (req, res) => {
  const { simulationData, format = 'kml' } = req.body;

  if (!simulationData) {
    return res.status(400).json({ error: 'simulationData is required for export' });
  }

  const endpoint = format === 'shp' ? '/export/shp' : '/export/kml';

  const targetUrl = process.env.PYTHON_SIM_URL || 'http://localhost:8000';

  try {
    const pyResponse = await axios.post(`${targetUrl}${endpoint}`, simulationData, {
      responseType: 'arraybuffer',
      timeout: 35000
    });

    const damName = (simulationData.dam_name || 'Dam').replace(/\s+/g, '_');
    
    if (format === 'shp') {
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', `attachment; filename="${damName}_shapefile.zip"`);
    } else {
      res.setHeader('Content-Type', 'application/vnd.google-earth.kml+xml');
      res.setHeader('Content-Disposition', `attachment; filename="${damName}_flood_extent.kml"`);
    }

    return res.send(pyResponse.data);
  } catch (pyErr) {
    console.warn(`[BreachSense Export Proxy] Python service export offline, generating client-side export fallback.`);
    const damName = (simulationData.dam_name || 'Dam').replace(/\s+/g, '_');
    
    if (format === 'kml') {
      // Build basic KML
      const timesteps = simulationData.geojson_timesteps || [];
      let kmlStr = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>BreachSense Flood Extent - ${simulationData.dam_name || 'Dam'}</name>`;
      
      timesteps.forEach(step => {
        const coords = step.geojson?.features?.[0]?.geometry?.coordinates?.[0] || [];
        if (coords.length > 0) {
          const coordStr = coords.map(c => `${c[0]},${c[1]},0`).join(' ');
          kmlStr += `
    <Placemark>
      <name>Flood Step +${step.timestep_min}m</name>
      <Polygon><outerBoundaryIs><LinearRing><coordinates>${coordStr}</coordinates></LinearRing></outerBoundaryIs></Polygon>
    </Placemark>`;
        }
      });
      kmlStr += `\n  </Document>\n</kml>`;

      res.setHeader('Content-Type', 'application/vnd.google-earth.kml+xml');
      res.setHeader('Content-Disposition', `attachment; filename="${damName}_flood_extent.kml"`);
      return res.send(kmlStr);
    } else {
      // Return GeoJSON text representation in JSON container if shp zip proxy offline
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="${damName}_flood_geojson.json"`);
      return res.send(JSON.stringify(simulationData, null, 2));
    }
  }
});

module.exports = router;
