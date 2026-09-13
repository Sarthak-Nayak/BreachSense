require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const damsRouter = require('./routes/dams');
const simulateRouter = require('./routes/simulate');
const exportRouter = require('./routes/export');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// API Routes
app.use('/api/dams', damsRouter);
app.use('/api/simulate', simulateRouter);
app.use('/api/export', exportRouter);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'BreachSense Express Orchestration Server',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`[BreachSense Backend] Server running on http://localhost:${PORT}`);
});
