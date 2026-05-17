require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');
const db = require('./models'); // Imports index.js which sets up relations

const app = express();

// Routes Imports
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

// Middlewares
app.use(cors());
app.use(express.json()); // Parses incoming JSON requests

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Test Route
app.get('/', (req, res) => {
  res.send('Task Manager API is running...');
});

// Server Initialization
const PORT = process.env.PORT || 5000;

// Connect to Database and Sync Models
connectDB();
db.sequelize.sync({ alter: true }) // alter: true updates tables to match models without dropping them completely
  .then(() => {
    console.log('Database synced successfully.');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log('Failed to sync database:', err);
  });
