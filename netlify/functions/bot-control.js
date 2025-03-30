const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers
  ]
});

let botStatus = 'offline';
const verificationLogs = [];

// Démarrer le bot
const startBot = async (token) => {
  try {
    await client.login(token);
    botStatus = 'online';
    logActivity('Bot démarré avec succès');
    return true;
  } catch (error) {
    logActivity(`ERREUR: ${error.message}`, true);
    return false;
  }
};

// Logger les activités
const logActivity = (message, isError = false) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    message,
    type: isError ? 'error' : 'info'
  };
  verificationLogs.unshift(logEntry); // Ajouter au début
  console.log(logEntry);
};

// Gestion des requêtes
exports.handler = async (event) => {
  const { action, token } = JSON.parse(event.body || '{}');

  switch (action) {
    case 'start':
      const success = await startBot(token);
      return {
        statusCode: 200,
        body: JSON.stringify({ status: success ? 'online' : 'error' })
      };

    case 'status':
      return {
        statusCode: 200,
        body: JSON.stringify({ 
          status: botStatus,
          logs: verificationLogs.slice(0, 50) // 50 derniers logs
        })
      };

    default:
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Action non reconnue' })
      };
  }
};

// Événements Discord
client.on('ready', () => {
  logActivity(`Connecté en tant que ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.content === '!verify') {
    logActivity(`Nouvelle demande de vérification de ${message.author.tag}`);
    // Ajoutez ici votre logique de vérification
  }
});
