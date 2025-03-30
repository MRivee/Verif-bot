const { Client, IntentsBitField } = require('discord.js');
const axios = require('axios');
const db = require('@replit/database');

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildMembers
  ]
});

const logs = [];

client.on('ready', () => {
  logs.push({
    timestamp: new Date(),
    message: 'Bot Discord connecté'
  });
});

client.on('messageCreate', async message => {
  if (message.content === '!verify') {
    logs.push({
      timestamp: new Date(),
      message: `Nouvelle demande de vérification de ${message.author.tag}`
    });
    
    // Logique de vérification...
  }
});

exports.handler = async (event, context) => {
  const { action } = event.queryStringParameters || {};
  
  if (action === 'logs') {
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      },
      body: JSON.stringify(logs[logs.length - 1])
    };
  }
  
  if (action === 'getLogs') {
    return {
      statusCode: 200,
      body: JSON.stringify(logs)
    };
  }
  
  return {
    statusCode: 200,
    body: JSON.stringify({ status: 'running' })
  };
};

// Ne pas oublier de connecter le client
client.login(process.env.DISCORD_TOKEN);
