const express = require('express');
const app = express();

// Exemple de tableau de logs (cela pourrait venir d'une base de données ou d'un stockage plus persistant)
let logs = [
    {
        utilisateur: 'User123',
        serveur: 'ServeurXYZ',
        question: '5 + 3',
        reponse: '8',
        correct: true,
        role: 'Vérifié',
        timestamp: new Date().toLocaleString()
    },
    {
        utilisateur: 'User456',
        serveur: 'ServeurABC',
        question: '7 - 2',
        reponse: '5',
        correct: false,
        role: 'Aucun',
        timestamp: new Date().toLocaleString()
    }
];

// Servir les fichiers statiques (pour ton frontend)
app.use(express.static('public'));

// Endpoint pour récupérer les logs
app.get('/logs', (req, res) => {
    res.json(logs);
});

// Démarrer le serveur sur le port 3000
app.listen(3000, () => {
    console.log('Serveur démarré sur http://localhost:3000');
});
