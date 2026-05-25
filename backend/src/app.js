const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const nutritionRoutes  = require('./routes/nutrition');
const recipeRoutes     = require('./routes/recipes');
const mealplanRoutes   = require('./routes/mealplan');
const authRoutes       = require('./routes/auth');
const savedPlanRoutes  = require('./routes/savedPlans');
const logsRoutes       = require('./routes/logs');
const foodRoutes       = require('./routes/food');

const app = express();

// Parse JSON request bodies
app.use(express.json());

const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL,
].filter(Boolean);
app.use(cors({ origin: allowedOrigins }));

// Interactive API docs — visit http://localhost:3001/api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check — useful to verify the server is up
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Feature routes
app.use('/api/nutrition',    nutritionRoutes);
app.use('/api/recipes',      recipeRoutes);
app.use('/api/mealplan',     mealplanRoutes);
app.use('/api/auth',         authRoutes);
app.use('/api/saved-plans',  savedPlanRoutes);
app.use('/api/logs',         logsRoutes);
app.use('/api/food',         foodRoutes);

// 404 handler — catches any unmatched routes
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler — last middleware, receives errors forwarded via next(err)
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

module.exports = app;
