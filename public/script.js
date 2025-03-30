// public/script.js

// Configuration
const CONFIG = {
  VERIFICATION_CHANNEL_ID: '1355871337348075624',
  ADMIN_CHANNEL_ID: '1355872034969620603'
};

// Éléments DOM
const messagesContainer = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');

// Simuler un utilisateur connecté (à remplacer par une vraie authentification)
const currentUser = {
  id: 'user_' + Math.random().toString(36).substr(2, 9),
  username: 'Utilisateur',
  avatar: 'https://cdn.discordapp.com/embed/avatars/0.png',
  role: 'member'
};

// État de l'application
let verificationState = {
  step: 0,
  expectedAnswer: null
};

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
  loadPreviousMessages();
  setupEventListeners();
  simulateSystemMessage('Système de vérification initialisé. Tapez !verify pour commencer.');
});

function setupEventListeners() {
  sendButton.addEventListener('click', sendMessage);
  messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });
}

async function sendMessage() {
  const content = messageInput.value.trim();
  if (!content) return;

  // Créer le message
  const message = {
    id: Date.now().toString(),
    author: currentUser,
    content,
    timestamp: new Date()
  };

  // Afficher le message
  displayMessage(message);
  messageInput.value = '';

  // Traiter les commandes
  if (content.startsWith('!')) {
    await handleCommand(content);
  }
}

function displayMessage(message) {
  const messageElement = document.createElement('div');
  messageElement.className = 'message';
  messageElement.innerHTML = `
    <div class="message-header">
      <img src="${message.author.avatar}" alt="${message.author.username}" class="avatar">
      <span class="username">${message.author.username}</span>
      <span class="timestamp">${message.timestamp.toLocaleTimeString()}</span>
    </div>
    <div class="message-content">${message.content}</div>
  `;
  messagesContainer.appendChild(messageElement);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function simulateSystemMessage(content) {
  const message = {
    id: 'sys_' + Date.now().toString(),
    author: {
      id: 'system',
      username: 'Système',
      avatar: 'https://cdn.discordapp.com/embed/avatars/1.png',
      role: 'system'
    },
    content,
    timestamp: new Date()
  };
  displayMessage(message);
}

async function handleCommand(command) {
  switch (command.toLowerCase()) {
    case '!verify':
      startVerificationProcess();
      break;
    case '!help':
      showHelp();
      break;
    default:
      if (verificationState.step === 1 && !isNaN(parseInt(command))) {
        checkVerificationAnswer(parseInt(command));
      } else {
        simulateSystemMessage(`Commande inconnue: ${command}. Tapez !help pour l'aide.`);
      }
  }
}

function startVerificationProcess() {
  // Générer un calcul aléatoire
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  verificationState = {
    step: 1,
    expectedAnswer: num1 + num2
  };

  simulateSystemMessage(`**Vérification en cours**\n\nRésolvez ce calcul: ${num1} + ${num2} = ?`);
}

function checkVerificationAnswer(answer) {
  if (answer === verificationState.expectedAnswer) {
    verificationState.step = 2;
    simulateSystemMessage('✅ Réponse correcte!');
    showOAuthButton();
  } else {
    simulateSystemMessage('❌ Réponse incorrecte. Veuillez réessayer.');
  }
}

function showOAuthButton() {
  // Créer un bouton d'autorisation
  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'oauth-button-container';
  buttonContainer.innerHTML = `
    <p>Finalisez la vérification en autorisant l'accès à votre compte Discord:</p>
    <a href="/.netlify/functions/verify?action=auth&user=${currentUser.id}" class="oauth-button">
      Autoriser la vérification
    </a>
  `;
  
  const messageElement = document.createElement('div');
  messageElement.className = 'system-message';
  messageElement.appendChild(buttonContainer);
  messagesContainer.appendChild(messageElement);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function showHelp() {
  const helpMessage = `
    **Commandes disponibles:**
    - !verify : Commencer le processus de vérification
    - !help : Afficher ce message d'aide
    
    **Processus de vérification:**
    1. Tapez !verify
    2. Répondez au calcul
    3. Autorisez la vérification via le bouton OAuth2
  `;
  simulateSystemMessage(helpMessage);
}

async function loadPreviousMessages() {
  try {
    // Charger les messages depuis le serveur (optionnel)
    const response = await fetch('/.netlify/functions/verify?action=getMessages');
    const messages = await response.json();
    
    messages.forEach(msg => {
      displayMessage({
        ...msg,
        timestamp: new Date(msg.timestamp)
      });
    });
  } catch (error) {
    console.error('Erreur de chargement des messages:', error);
  }
}

// Communication avec les fonctions serverless
async function verifyUser() {
  try {
    const response = await fetch('/.netlify/functions/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: currentUser.id,
        action: 'verify'
      })
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Erreur de vérification:', error);
    return { success: false, error: error.message };
  }
}
