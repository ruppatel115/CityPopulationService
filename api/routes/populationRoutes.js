const express = require('express');
const router = express.Router();
const { loadPopulationData, savePopulationData } = require('../controllers/populationController');

// GET route to retrieve population data
router.get('/state/:state/city/:city', async (req, res) => {
  const state = req.params.state.toLowerCase();
  const city = req.params.city.toLowerCase();
  const key = `${city},${state}`;

  const populationDataMap = req.app.get('populationData');

  if (populationDataMap.has(key)) {
    const population = populationDataMap.get(key);
    res.status(200).json({ population });
  } else {
    res.status(400).json({ error: 'Data not found for the specified state and city.' });
  }
});

// PUT route to update or create population data
router.put('/state/:state/city/:city', async (req, res) => {
  const { state, city } = req.params;
  const key = `${city},${state}`;
  const newPopulation = parseInt(req.body);

  if (isNaN(newPopulation)) {
    return res.status(400).json({ error: 'Invalid population data.' });
  }

  const populationDataMap = await loadPopulationData();

  populationDataMap.set(key, newPopulation);
  await savePopulationData(populationDataMap);

  res.status(201).send();
});

module.exports = router;
