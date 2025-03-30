const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const config = require('./config.json');
const fs = require('fs');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent
  ]
});

const activeVerifications = new Map();

client.on('ready', () => {
  console.log(`Connecté en tant que ${client.user.tag}`);
  logToFile('Bot démarré');
});

client.on('messageCreate', async message => {
  if (message.channel.id !== config.discord.verificationChannel) return;

  if (message.content === '!verify') {
    startVerification(message);
  } else if (activeVerifications.has(message.author.id)) {
    checkVerification(message);
  }
});

function startVerification(message) {
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  const answer = num1 + num2;

  activeVerifications.set(message.author.id, { answer });

  const embed = new EmbedBuilder()
    .setColor(0x5865F2)
    .setTitle('Vérification Requise')
    .setDescription(`Résolvez : **${num1} + ${num2} = ?**`)
    .setFooter({ text: 'Vous avez 2 minutes pour répondre' });

  message.reply({ embeds: [embed] });
  logToFile(`Nouvelle vérification pour ${message.author.tag}: ${num1} + ${num2}`);
}

async function checkVerification(message) {
  const verification = activeVerifications.get(message.author.id);
  const userAnswer = parseInt(message.content);

  if (userAnswer === verification.answer) {
    try {
      await message.member.roles.add(config.discord.verifiedRole);
      message.reply('✅ Vérification réussie !');
      logToFile(`Vérification réussie pour ${message.author.tag}, rôle attribué`);
      
      // Log dans le salon dédié
      const logsChannel = await client.channels.fetch(config.discord.logsChannel);
      logsChannel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(0x57F287)
            .setTitle('Nouvelle vérification')
            .setDescription(`${message.author.tag} a été vérifié`)
            .addFields(
              { name: 'ID', value: message.author.id, inline: true },
              { name: 'Calcul', value: `${verification.answer}`, inline: true }
            )
        ]
      });
    } catch (error) {
      logToFile(`ERREUR: ${error.message}`, true);
    }
    activeVerifications.delete(message.author.id);
  } else {
    message.reply('❌ Réponse incorrecte. Essayez !verify pour recommencer.');
    logToFile(`Mauvaise réponse de ${message.author.tag}`);
  }
}

function logToFile(message, isError = false) {
  const logEntry = `[${new Date().toISOString()}] ${isError ? 'ERREUR: ' : ''}${message}\n`;
  fs.appendFileSync('verification.log', logEntry);
}

client.login(config.discord.token);
