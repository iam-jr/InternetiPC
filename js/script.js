async function handleInput() {
  const query = userInput.value.trim();
  if (!query) return;

  addMessage("🧑‍🚀", query);
  userInput.value = "";

  addMessage("🤖", `<em>typing...</em>`, true);

  try {
    const response = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: query }),
    });
    const data = await response.json();

    removeTypingIndicator();
    addMessage("🤖", data.reply);
  } catch (error) {
    removeTypingIndicator();
    addMessage("🤖", "Sorry, something went wrong.");
  }
}
