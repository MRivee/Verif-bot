const { Client, Intents } = require("discord.js");

const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const LOG_CHANNEL_ID = "ID_DU_SALON_LOGS"; // Remplace par l'ID du salon de logs

bot.once("ready", () => {
    console.log(`Connecté en tant que ${bot.user.tag}`);
});

async function sendLogToDiscord(user, server, question, answer, correct, role) {
    const logChannel = await bot.channels.fetch(LOG_CHANNEL_ID);
    if (!logChannel) return console.error("Salon de logs introuvable.");

    const logMessage = `
📌 **Nouvelle Vérification**
👤 Utilisateur : ${user}
🛡️ Serveur : ${server}
❓ Question : ${question}
📝 Réponse : ${answer}
✅ Correct : ${correct ? "Oui" : "Non"}
🎭 Rôle attribué : ${role}
    `;
    
    logChannel.send(logMessage);
}

bot.on("messageCreate", async (message) => {
    if (message.content.startsWith("!verif")) {
        const question = "5+3";
        const correctAnswer = "8";
        const userAnswer = message.content.split(" ")[1]; 
        
        const isCorrect = userAnswer === correctAnswer;
        const roleGiven = isCorrect ? "Vérifié" : "Aucun";

        await sendLogToDiscord(message.author.username, message.guild.name, question, userAnswer, isCorrect, roleGiven);

        message.reply(isCorrect ? "✅ Vérification réussie !" : "❌ Mauvaise réponse !");
    }
});

bot.login("TON_TOKEN_DISCORD");
