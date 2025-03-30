const { Client, GatewayIntentBits } = require('discord.js');
const db = require('@replit/database');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers
  ]
});

const logs = [];

// Initialisation
client.on('ready', () => {
  addLog('Bot Discord connecté avec succès');
});

// Gestion des messages
client.on('messageCreate', async message => {
  if (message.content === '!verify') {
    await handleVerification(message);
  }
});

async function handleVerification(message) {
  addLog(`Début vérification pour ${message.author.tag}`);
  
  // Logique de vérification...
  try {
    await message.reply('Vérification en cours...');
    addLog(`Vérification envoyée à ${message.author.tag}`);
  } catch (error) {
    addLog(`ERREUR: ${error.message}`, true);
  }
}

function addLog(message, isError = false) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    message,
    type: isError ? 'error' : 'info'
  };
  logs.push(logEntry);
  console.log(logEntry); // Pour les logs Netlify
}

// Gestion des requêtes Netlify
exports.handler = async (event) => {
  const { action } = event.queryStringParameters || {};

  if (action === 'logs') {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/event-stream' },
      body: JSON.stringify(logs.slice(-10)) // Retourne les 10 derniers logs
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ status: 'active', logs: logs.length })
  };
};

// Connexion Discord (seulement en production)
if (process.env.NETLIFY) {
  client.login(process.env.DISCORD_TOKEN);
}
