const fs = require('fs');
const csv = require('csv-parser');

let populationDataMap = new Map();

function loadPopulationData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream('./api/data/city_populations.csv')
      .pipe(csv())
      .on('data', (row) => {
        const city = row.city.trim();
        const state = row.state.trim();
        const key = `${city.toLowerCase()},${state.toLowerCase()}`;
        populationDataMap.set(key, parseInt(row.population.trim(), 10));
      })
      .on('end', () => {
        resolve(populationDataMap);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

async function savePopulationData(dataMap) {
  const dataLines = Array.from(dataMap).map(([key, value]) => {
    const [city, state] = key.split(',');
    return `${city},${state},${value}`;
  });

  await fs.promises.writeFile('src/data/population.csv', dataLines.join('\n'));

  // Update the in-memory map with the new data
  populationDataMap = dataMap;
}

module.exports = {
  loadPopulationData,
  savePopulationData,
};
