// DOM Elements
const chatBox = document.getElementById('chat-box');
const sendButton = document.getElementById('send-button');
const userInput = document.getElementById('user-input');
const newChatButton = document.getElementById('new-chat');
const modeToggle = document.getElementById('mode-toggle');
const logsToggle = document.getElementById('logs-toggle');
const toggleIcon = document.getElementById('toggle-icon');
const logsList = document.getElementById('logs-list');

const MEMORY_KEY = 'ipc_chat_memory';
const MEMORY_TIMESTAMP = 'ipc_chat_timestamp';
const EXPIRATION_MS = 60 * 60 * 1000; // 1 hour

// Init
window.addEventListener('DOMContentLoaded', () => {
  loadChatFromMemory();

  // Initialize logs toggle behavior
  if (logsToggle && logsList && toggleIcon) {
    logsToggle.addEventListener('click', () => {
      if (logsList.style.display === 'none') {
        logsList.style.display = 'block';
        toggleIcon.textContent = '▼'; // Down arrow
      } else {
        logsList.style.display = 'none';
        toggleIcon.textContent = '▶'; // Right arrow
      }
    });
  }
});

// Send on click or Enter
sendButton.addEventListener('click', handleUserInput);
userInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') handleUserInput();
});

// Mode toggle
modeToggle.addEventListener('change', () => {
  const container = document.getElementById('chat-container');
  container.classList.toggle('dark-mode');
  container.classList.toggle('light-mode');
});

// New chat
newChatButton.addEventListener('click', () => {
  if (confirm("Start a new search? This will clear the current conversation.")) {
    clearChat();
    saveChatToMemory();
  }
});

// Handle Input
async function handleUserInput() {
  const query = userInput.value.trim();
  if (!query) return;

  addMessage("🧑‍🚀", query);
  userInput.value = '';
  showTypingIndicator();

  try {
    // Simulate delay
    const reply = await fakeAIResponse(query); // replace with real API if needed
    removeTypingIndicator();
    addMessage("🤖", reply);
  } catch (err) {
    removeTypingIndicator();
    addMessage("🤖", "⚠️ Oops! Something went wrong.");
    console.error(err);
  }

  saveChatToMemory();
}

// Add message to DOM
function addMessage(sender, text) {
  const msg = document.createElement('div');
  msg.className = 'message';
  msg.innerHTML = `<strong>${sender}</strong>: <span>${text}</span>`;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Typing indicator
function showTypingIndicator() {
  const typing = document.createElement('div');
  typing.className = 'message typing';
  typing.innerHTML = `<strong>🤖</strong>: <em>Typing...</em>`;
  chatBox.appendChild(typing);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function removeTypingIndicator() {
  const typingMsg = chatBox.querySelector('.message.typing');
  if (typingMsg) typingMsg.remove();
}

// Simulated AI reply (single definition)
async function fakeAIResponse(prompt) {
  return new Promise(resolve => {
    setTimeout(() => {
      const lower = prompt.toLowerCase().trim();

      const greetings = ["hi", "hello", "hey", "what's up", "yo"];
      const isGreeting = greetings.some(g => lower === g || lower.startsWith(g));
      const isQuestion = lower.endsWith("?");
      const wantsCode = lower.includes("code") ||
                        lower.includes("html") ||
                        lower.includes("css") ||
                        lower.includes("javascript") ||
                        lower.includes("write a function") ||
                        lower.includes("python") ||
                        (lower.includes("create") && lower.includes("script"));

      if (isGreeting) {
        return resolve("👋 Hey there! How can I assist you today?");
      }

      if (wantsCode) {
        return resolve(`Sure! Here's a simple JavaScript function:\n\n<pre><code>function greet(name) {
  return \`Hello, \${name}!\`;
}</code></pre>`);
      }

      if (isQuestion) {
        const replies = [
          "That's a great question!",
          `Here's what I found about "${prompt}".`,
          "Let me think... 🤔",
          "You're asking the right questions!",
          "Here's a quick summary...",
        ];
        return resolve(replies[Math.floor(Math.random() * replies.length)]);
      }

      const neutralReplies = [
        "I'm here and ready to help!",
        "Tell me what you need. 💡",
        "Just say the word — I'm listening.",
        "Let me know how I can assist you.",
      ];
      return resolve(neutralReplies[Math.floor(Math.random() * neutralReplies.length)]);
    }, 1000);
  });
}

// Memory & Logs

function saveChatToMemory() {
  localStorage.setItem(MEMORY_KEY, chatBox.innerHTML);
  localStorage.setItem(MEMORY_TIMESTAMP, Date.now().toString());
  updateNeuralLogsFromChat();
}

function loadChatFromMemory() {
  const saved = localStorage.getItem(MEMORY_KEY);
  const timestamp = localStorage.getItem(MEMORY_TIMESTAMP);

  if (saved && timestamp && Date.now() - parseInt(timestamp) < EXPIRATION_MS) {
    chatBox.innerHTML = saved;
    updateNeuralLogsFromChat();
  } else {
    clearChat();
  }
}

function clearChat() {
  chatBox.innerHTML = `
    <div class="welcome">
      <h2>👾 Welcome, User</h2>
      <p>This is <strong>Internet <span class="ipc">iPC</span></strong>. Ask anything — I’ll explore the web instantly.</p>
    </div>
  `;
  localStorage.removeItem(MEMORY_KEY);
  localStorage.removeItem(MEMORY_TIMESTAMP);
  logsList.innerHTML = '';
}

function updateNeuralLogsFromChat() {
  // Clear previous logs
  logsList.innerHTML = '';

  // Find all message divs
  const messages = chatBox.querySelectorAll('.message');
  messages.forEach(msg => {
    // Extract sender and text
    const strong = msg.querySelector('strong');
    const span = msg.querySelector('span');
    if (!strong || !span) return;

    // Skip typing indicators
    if (msg.classList.contains('typing')) return;

    const sender = strong.textContent;
    const text = span.textContent;

    // Create list item
    const li = document.createElement('li');
    li.textContent = `${sender}: ${text}`;
    logsList.appendChild(li);
  });
}
