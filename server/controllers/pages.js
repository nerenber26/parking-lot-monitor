import * as db from '../utils/connectDB.js';
const { Client } = require('pg');


export const getHomePage = async(req, res) => {
    const GREEN = '&#x1F7E9';
    const YELLOW = '&#x1F7E8';
    const RED = '&#x1F7E7';
    const BLACK = '&#x1F7E6';

    const results = (await db.runQuery(`
        SELECT pl.name, pl.total_spaces, COUNT(ps.id) FILTER(WHERE ps.occupied = false) AS available_spaces
        FROM ParkingLots pl
        LEFT JOIN ParkingSpaces ps ON pl.id = ps.lot_id
        GROUP BY pl.id
        ORDER BY pl.name
    `)).rows.map(row => ({
        name: row.name,
        available_spaces: parseInt(row.available_spaces, 10),
        total_spaces: parseInt(row.total_spaces, 10),
        icon: row.available_spaces / row.total_spaces > 0.50 ? GREEN :
              row.available_spaces / row.total_spaces > 0.25 ? YELLOW :
              row.available_spaces / row.total_spaces > 0 ? RED :
              BLACK,
    }));

    res.status(200).render('home', { results });
};

export const getMapPage = async(req, res) => {
    res.status(200).render('map');
}

export const getQueryPage = async(req, res) => {
    const results = (await db.runQuery(`
        SELECT pl.name, pl.total_spaces, COUNT(ps.id) FILTER(WHERE ps.occupied = false) AS available_spaces
        FROM ParkingLots pl
        LEFT JOIN ParkingSpaces ps ON pl.id = ps.lot_id
        GROUP BY pl.id
        ORDER BY pl.name
    `)).rows.map(row => ({
        name: row.name,
        available_spaces: parseInt(row.available_spaces, 10),
        total_spaces: parseInt(row.total_spaces, 10),
        icon: row.available_spaces / row.total_spaces > 0.50 ? GREEN :
              row.available_spaces / row.total_spaces > 0.25 ? YELLOW :
              row.available_spaces / row.total_spaces > 0 ? RED :
              BLACK,
    }));


    // Format data for Chart.js
    const chartData = {
        labels: data.map(row => row.timestamp),
        datasets: [{
            label: 'Capacity',
            data: data.map(row => row.capacity),
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)'
        }]
    };


    res.status(200).render('query', { chartData });
}