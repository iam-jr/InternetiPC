const sidebar = document.querySelector('.sidebar');
const toggleBtn = document.getElementById('sidebar-toggle');
const newChatBtn = document.getElementById('new-chat');
const modeToggle = document.getElementById('mode-toggle');
const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-button');

toggleBtn.addEventListener('click', () => {
  sidebar.classList.toggle('collapsed');
});

modeToggle.addEventListener('change', () => {
  document.body.classList.toggle('dark-mode', modeToggle.checked);
});

newChatBtn.addEventListener('click', () => {
  chatBox.innerHTML = '';
});

sendBtn.addEventListener('click', () => {
  const text = userInput.value.trim();
  if (!text) return;
  addMessage('user', text);
  userInput.value = '';
  setTimeout(() => addMessage('bot', `Echo: ${text}`), 500);
});

function addMessage(sender, message) {
  const div = document.createElement('div');
  div.className = `message ${sender}`;
  div.textContent = message;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}
