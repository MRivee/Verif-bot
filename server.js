const express = require('express');
const fs = require('fs');
const config = require('./config.json');
const app = express();

app.use(express.static('public'));
app.use(express.json());

// Protéger les endpoints avec un mot de passe
app.use((req, res, next) => {
  if (req.query.password !== config.server.password) {
    return res.status(403).send('Accès refusé');
  }
  next();
});

app.get('/api/logs', (req, res) => {
  try {
    const logs = fs.readFileSync('verification.log', 'utf-8');
    res.send(logs);
  } catch {
    res.send('Aucun log disponible');
  }
});

app.listen(config.server.port, () => {
  console.log(`Serveur web sur http://localhost:${config.server.port}`);
});
