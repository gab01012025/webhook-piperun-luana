const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Minimal App is Running!');
});

module.exports = app;
