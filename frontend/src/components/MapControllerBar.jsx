import React from 'react';
import { Plus, Minus, ArrowLeft, ArrowUp, ArrowDown, ArrowRight, Home } from 'lucide-react';

export default function MapControllerBar({ mapRef }) {
  const handleZoomIn = () => {
    if (mapRef?.current) {
      mapRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapRef?.current) {
      mapRef.current.zoomOut();
    }
  };

  const handlePan = (dx, dy) => {
    if (mapRef?.current) {
      mapRef.current.panBy([dx, dy]);
    }
  };

  const handleResetView = () => {
    if (mapRef?.current) {
      mapRef.current.setView([22.9734, 78.6569], 5);
    }
  };

  return (
    <div className="map-controller-bar">
      {/* Zoom Controls */}
      <div className="controller-group">
        <button onClick={handleZoomIn} title="Zoom in">
          <Plus size={18} />
        </button>
        <button onClick={handleZoomOut} title="Zoom out">
          <Minus size={18} />
        </button>
      </div>

      {/* Pan Directional Controls */}
      <div className="controller-group">
        <button onClick={() => handlePan(-100, 0)} title="Pan west">
          <ArrowLeft size={16} />
        </button>
        <button onClick={() => handlePan(0, -100)} title="Pan north">
          <ArrowUp size={16} />
        </button>
        <button onClick={() => handlePan(0, 100)} title="Pan south">
          <ArrowDown size={16} />
        </button>
        <button onClick={() => handlePan(100, 0)} title="Pan east">
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Reset View to All-India */}
      <button
        className="reset-view-btn"
        onClick={handleResetView}
        title="Reset to full India view"
      >
        <Home size={16} /> Reset view
      </button>
    </div>
  );
}
