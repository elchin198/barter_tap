const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 4000;

// CORS tənzimləmələri
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://bartertap.az', 'https://www.bartertap.az', 'https://bartertap.onrender.com']
    : true,
  credentials: true
}));

// Health check endpoint
app.get('/healthz', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'barter-api' });
});


app.listen(PORT, () => {
  // Silent start in production mode
  if (process.env.NODE_ENV === 'development') {

  }
});

// Export for use in other files
export {
  app as healthcheckApp
};