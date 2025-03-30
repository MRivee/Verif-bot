async function fetchLogs() {
  try {
    const response = await fetch(`/api/logs?password=${encodeURIComponent('Admin2504')}`);
    const logs = await response.text();
    document.getElementById('logs').innerHTML = formatLogs(logs);
  } catch (error) {
    console.error('Erreur:', error);
  }
}

function formatLogs(rawLogs) {
  return rawLogs.split('\n')
    .filter(line => line.trim())
    .map(line => {
      const match = line.match(/^\[(.*?)\] (.*)$/);
      if (!match) return `<div class="log-line">${line}</div>`;
      
      const [_, timestamp, message] = match;
      const isError = message.includes('ERREUR:');
      
      return `
        <div class="log-line ${isError ? 'error' : ''}">
          <span class="timestamp">${new Date(timestamp).toLocaleString()}</span>
          <span class="message">${message}</span>
        </div>
      `;
    })
    .join('');
}

// Rafraîchir toutes les 2 secondes
setInterval(fetchLogs, 2000);
fetchLogs();

// Vérifier l'état du bot
async function checkBotStatus() {
  const statusElement = document.getElementById('bot-status');
  try {
    const response = await fetch('/api/status');
    statusElement.textContent = `Bot: ${(await response.json()).status}`;
    statusElement.className = 'online';
  } catch {
    statusElement.textContent = 'Bot: Hors ligne';
    statusElement.className = 'offline';
  }
}

setInterval(checkBotStatus, 5000);
checkBotStatus();
