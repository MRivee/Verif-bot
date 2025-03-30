const express = require('express');
const app = express();
const logs = [];

app.use(express.json());
app.use(express.static('public'));

// Endpoint pour recevoir les logs
app.post('/api/logs', (req, res) => {
  logs.push(req.body);
  res.status(200).send('OK');
});

// Endpoint pour récupérer les logs
app.get('/api/logs', (req, res) => {
  res.json(logs);
});

app.listen(3000, () => {
  console.log('Serveur web démarré sur port 3000');
});
