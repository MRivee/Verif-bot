const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages
  ]
});

// URL de votre site Netlify
const LOGS_ENDPOINT = "https://votre-site.netlify.app/api/logs";

client.on('ready', () => {
  sendLog("Bot prêt !");
});

client.on('messageCreate', async message => {
  if (message.content === '!ping') {
    sendLog(`Commande reçue de ${message.author.tag}`);
    await message.reply('Pong!');
  }
});

async function sendLog(message) {
  try {
    await axios.post(LOGS_ENDPOINT, {
      message,
      timestamp: new Date()
    });
  } catch (err) {
    console.error("Erreur d'envoi des logs:", err);
  }
}

client.login(process.env.DISCORD_TOKEN);
