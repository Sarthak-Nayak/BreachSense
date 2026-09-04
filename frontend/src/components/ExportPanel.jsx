import React, { useState } from 'react';
import { Download, FileCode, Layers, CheckCircle2, Loader2 } from 'lucide-react';
import axios from 'axios';

export default function ExportPanel({ simulationData }) {
  const [downloadingFormat, setDownloadingFormat] = useState(null);

  if (!simulationData) return null;

  const handleExport = async (format) => {
    setDownloadingFormat(format);
    try {
      const damName = (simulationData.dam_name || 'Dam').replace(/\s+/g, '_');
      
      const response = await axios.post('/api/export', {
        simulationData,
        format
      }, {
        responseType: 'blob'
      });

      // Create browser blob download link
      const blob = new Blob([response.data], {
        type: format === 'shp' ? 'application/zip' : 'application/vnd.google-earth.kml+xml'
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        format === 'shp' ? `${damName}_flood_shapefile.zip` : `${damName}_flood_extent.kml`
      );
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export download failed:', err);
      alert('Failed to generate export file. Please check server logs.');
    } finally {
      setDownloadingFormat(null);
    }
  };

  return (
    <div className="bs-card" style={{ backgroundColor: '#F0F7FF', border: '1px solid #BFDBFE' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Download size={18} color="var(--accent-primary)" />
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: 'var(--accent-primary)' }}>
            GIS Data Layers Export
          </h3>
        </div>
        <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
          WGS 84 (EPSG:4326)
        </span>
      </div>

      <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
        Export current hydrodynamic flood extent timesteps for GIS software (QGIS, ArcGIS, Google Earth, & NDRF Disaster Mapping tools).
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.6rem' }}>
        <button
          onClick={() => handleExport('shp')}
          disabled={downloadingFormat !== null}
          className="btn-primary"
          style={{ justifyContent: 'center', fontSize: '0.8rem', padding: '0.55rem' }}
        >
          {downloadingFormat === 'shp' ? (
            <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
          ) : (
            <Layers size={16} />
          )}
          <span>Download .SHP (Zipped)</span>
        </button>

        <button
          onClick={() => handleExport('kml')}
          disabled={downloadingFormat !== null}
          className="btn-outline"
          style={{ justifyContent: 'center', fontSize: '0.8rem', padding: '0.55rem', color: 'var(--accent-primary)', borderColor: 'var(--accent-primary)' }}
        >
          {downloadingFormat === 'kml' ? (
            <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
          ) : (
            <FileCode size={16} />
          )}
          <span>Download .KML (Google Earth)</span>
        </button>
      </div>
    </div>
  );
}
