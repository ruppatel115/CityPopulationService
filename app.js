const express = require('express');
const bodyParser = require('body-parser');
const populationRoutes = require('./api/routes/populationRoutes');
const { loadPopulationData } = require('./api/controllers/populationController');

const app = express();
const PORT = 5555;

app.use(bodyParser.text());

// Load population data on startup
loadPopulationData().then((data) => {
  app.set('populationData', data);

  // Define your routes
  app.use('/api/population', populationRoutes);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
