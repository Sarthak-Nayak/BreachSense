const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const DATA_DIR = path.join(__dirname, '..', '..', 'data');

const loadJson = (filename) => {
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Seed file ${filename} not found`);
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
};

// GET /api/dams - List all seed dams
router.get('/', (req, res) => {
  try {
    const dams = loadJson('dams.json');
    res.json({
      count: dams.length,
      dams: dams
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/dams/:id - Get detailed dam info + downstream settlements
router.get('/:id', (req, res) => {
  try {
    const dams = loadJson('dams.json');
    const villages = loadJson('villages.json');
    
    const dam = dams.find(d => d.id === req.params.id);
    if (!dam) {
      return res.status(404).json({ error: 'Dam not found' });
    }
    
    const damVillages = villages.filter(v => v.dam_id === dam.id);
    
    res.json({
      dam,
      downstream_villages: damVillages
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
