 function login() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    // Simple validation or mock login (replace with real auth later)
    if (username && password) {
      // Redirect to chatbot page
      window.location.href = "chat.html";
    } else {
      alert("Please enter username and password.");
    }
  }

// Send message to Lex via API Gateway
async function sendMessage() {
  const input = document.getElementById("user-input");
  const text = input.value.trim();

  if (!text) return;

  addMessage("user", text);
  input.value = "";
  input.style.height = "2.5rem";

  try {
    const response = await fetch("https://8l7jesk2la.execute-api.us-east-1.amazonaws.com/thub", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text })
    });

    const data = await response.json();
    const reply = data.response || "Sorry, I didn't understand that.";
    addMessage("bot", reply);
  } catch (error) {
    console.error("Error talking to Lex:", error);
    addMessage("bot", "Something went wrong. Please try again.");
  }
}

// Add message to chat box
function addMessage(sender, text) {
  const chat = document.getElementById("chat-history");
  const msg = document.createElement("div");
  msg.classList.add("message", sender);

  if (sender === "bot") {
    msg.innerHTML = `<strong>🤖</strong> ${text}`;
  } else {
    msg.textContent = ` ${text} 👤`;
  }

  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;
}


// Auto expand textarea
const inputArea = document.getElementById("user-input");
inputArea.addEventListener("input", function () {
  this.style.height = "auto";
  this.style.height = (this.scrollHeight) + "px";
});

// Send on Enter key (without Shift)
inputArea.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

// Speech Recognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'en-US';
recognition.interimResults = false;

function startListening() {
  recognition.start();
}

recognition.onresult = function (event) {
  const transcript = event.results[0][0].transcript;
  const input = document.getElementById("user-input");
  input.value = transcript;
  sendMessage();
};

recognition.onerror = function (event) {
  alert("Voice error: " + event.error);
};
