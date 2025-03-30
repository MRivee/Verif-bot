const startButton = document.getElementById('startButton');
const refreshButton = document.getElementById('refreshButton');
const botStatus = document.getElementById('botStatus');
const activityLogs = document.getElementById('activityLogs');
const botToken = document.getElementById('botToken');

// Charger les paramètres depuis le localStorage
if (localStorage.getItem('botToken')) {
  botToken.value = localStorage.getItem('botToken');
}

// Démarrer le bot
startButton.addEventListener('click', async () => {
  if (!botToken.value) {
    alert('Veuillez entrer un token de bot');
    return;
  }

  localStorage.setItem('botToken', botToken.value);
  
  try {
    const response = await fetch('/.netlify/functions/bot-control', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'start',
        token: botToken.value
      })
    });

    const data = await response.json();
    updateStatus(data.status);
    fetchLogs();
  } catch (error) {
    console.error('Erreur:', error);
  }
});

// Actualiser les logs
refreshButton.addEventListener('click', fetchLogs);

// Mettre à jour le statut
function updateStatus(status) {
  botStatus.textContent = `Statut: ${status === 'online' ? 'En ligne' : 'Erreur'}`;
  botStatus.className = `bot-status ${status}`;
}

// Récupérer les logs
async function fetchLogs() {
  try {
    const response = await fetch('/.netlify/functions/bot-control', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'status' })
    });

    const data = await response.json();
    updateStatus(data.status);
    displayLogs(data.logs);
  } catch (error) {
    console.error('Erreur:', error);
  }
}

// Afficher les logs
function displayLogs(logs) {
  activityLogs.innerHTML = logs.map(log => `
    <div class="log-entry ${log.type}">
      <span class="timestamp">[${new Date(log.timestamp).toLocaleString()}]</span>
      <span class="message">${log.message}</span>
    </div>
  `).join('');
}

// Actualiser automatiquement toutes les 5 secondes
setInterval(fetchLogs, 5000);
fetchLogs(); // Premier chargement
