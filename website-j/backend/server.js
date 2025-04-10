const express = require('express');
const { Pool } = require('pg');
const mqtt = require('mqtt');

const app = express();
const port = 3000;

// Set up the database connection using PostgreSQL (pg)
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'parking_lot_db',
  password: 'password',
  port: 5432,
});

// // Set up the MQTT client to connect to ChirpStack
// const client = mqtt.connect('mqtt://your-chirpstack-broker-url');

// client.on('connect', () => {
//   console.log('Connected to MQTT broker');
//   client.subscribe('your/topic', (err) => {
//     if (err) {
//       console.error('Subscription error:', err);
//     }
//   });
// });

// // When new data comes in from the MQTT topic, store it in the database
// client.on('message', (topic, message) => {
//   const parkingLotData = JSON.parse(message.toString());
//   const { Name, CurrentAmount, MaxCapacity, left, top } = parkingLotData;

//   // Insert or update the parking lot data in your PostgreSQL database
//   const query = `
//     INSERT INTO parking_lots (name, current_amount, max_capacity, left, top)
//     VALUES ($1, $2, $3, $4, $5)
//     ON CONFLICT (name) 
//     DO UPDATE SET current_amount = EXCLUDED.current_amount, max_capacity = EXCLUDED.max_capacity, left = EXCLUDED.left, top = EXCLUDED.top;
//   `;
//   pool.query(query, [Name, CurrentAmount, MaxCapacity, left, top])
//     .then(() => console.log('Data inserted/updated'))
//     .catch((err) => console.error('Error inserting data:', err));
// });

// API route to get parking lot data
app.get('/api/parking-lots', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM parking_lots ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
