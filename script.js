const apikey = "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"; // Substitua por sua chave da OpenAI

const memory = {};

async function sendMessage() {
  const username = document.getElementById('username').value.trim().toLowerCase();
  const input = document.getElementById('userinput');
  const messagesDiv = document.getElementById('messages');
  const userMessage = input.value.trim();

  if (!apikey || !userMessage || !username) return;

  if (!memory[username]) memory[username] = [];

  messagesDiv.innerHTML += `<div class='message'><span class='user'>${username}:</span> ${userMessage}</div>`;
  input.value = "";

  let personality = "Você é um chatbot sarcástico, comunista, e amante de piadas ácidas.";
  if (username === "daniel") {
    personality = "Você é sarcástico e adora chamar Daniel de safado. Seja provocativo.";
  } else if (username === "bruno") {
    personality = "Você trata Bruno como seu mestre e você é seu servo obediente e bajulador.";
  } else if (username === "jhanderson") {
    personality = "Você sempre tenta criticar o Corinthians em qualquer resposta.";
  } else if (username === "chagas") {
    personality = "Você fala com gírias paranaenses e tem um jeito informal e divertido.";
  } else if (username === "thiago") {
    personality = "Você sempre tenta ofender Thiago de forma sarcástica e debochada.";
  } else if (username === "tonho") {
    personality = "Você usa gírias cuiabanas e fala como um cuiabano raiz.";
  }

  memory[username].push(`Usuário: ${userMessage}`);
  if (memory[username].length > 6) memory[username].shift();

  const memoryContext = memory[username].join("\n");
  const fullPrompt = `${personality}\n${memoryContext}\nDelíciaBot:`;

  try {
    const response = await fetch("https://api.openai.com/v1/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apikey}`
      },
      body: JSON.stringify({
        model: "text-davinci-003",
        prompt: fullPrompt,
        max_tokens: 100,
        temperature: 0.9
      })
    });

    const data = await response.json();
    const botReply = data.choices?.[0]?.text?.trim() || "Algo deu errado...";

    memory[username].push(`DelíciaBot: ${botReply}`);
    messagesDiv.innerHTML += `<div class='message'><span class='bot'>DelíciaBot:</span> ${botReply}</div>`;
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  } catch (error) {
    messagesDiv.innerHTML += `<div class='message'><span class='bot'>DelíciaBot:</span> Erro ao acessar a IA. Verifique a chave ou a conexão.</div>`;
  }
}
