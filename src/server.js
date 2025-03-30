const express = require("express");
const app = express();

let logs = []; // Stockage temporaire des logs

// Servir le fichier index.html
app.use(express.static('public'));

// Route pour récupérer les logs
app.get("/logs", (req, res) => {
    res.json(logs);
});

// Fonction pour ajouter un log
function addLog(user, server, question, answer, correct, role) {
    const log = {
        utilisateur: user,
        serveur: server,
        question,
        reponse: answer,
        correct,
        role,
        timestamp: new Date().toLocaleString(),
    };
    logs.push(log);
}

// Exemple de log
addLog("User123", "ServeurXYZ", "5+3", "8", true, "Vérifié");

app.listen(3000, () => {
    console.log("Serveur démarré sur http://localhost:3000");
});
