const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Fetch the data from the backend API
axios.get('http://localhost:3000/api/parking-lots')
  .then(response => {
    const parkingLotsData = response.data;
    
    // Define the path where you want to save the data
    const outputPath = path.join(__dirname, 'hugo', 'parking-lot-monitor','data', 'items.json');
    
    // Write the data to items.json
    fs.writeFileSync(outputPath, JSON.stringify(parkingLotsData, null, 2), 'utf-8');
    
    console.log('Data has been saved to items.json');
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });
