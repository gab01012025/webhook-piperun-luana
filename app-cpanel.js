const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Minimal App is Running!');
});

// Passenger vai conectar automaticamente aqui
if (typeof(PhusionPassenger) !== 'undefined') {
    PhusionPassenger.configure({ autoInstall: false });
}

module.exports = app;
