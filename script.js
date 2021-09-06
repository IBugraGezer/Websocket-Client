var urlInput = document.getElementById("urlInput");
var messageInput = document.getElementById("messageInput");
var connectButton = document.getElementById("connectButton");
var sendButton = document.getElementById("sendButton");
var clearButton = document.getElementById("clearButton");
var messageContainer = document.getElementsByClassName("messageContainer")[0];

connectButton.onclick = (event) => {
  if (typeof window.ws !== "undefined" && window.ws.readyState == 1)
    window.ws.close();
  else {
    url = urlInput.value;
    createWs(url);
  }
};

createWs = (token) => {
  window.ws = new WebSocket(url);

  window.ws.onopen = (event) => {
    createMessage("infoMessage", "Connected");
    connectButton.innerText = "Disconnect";
    sendButton.disabled = false;
  };

  window.ws.onmessage = (event) => {
    createMessage("serverMessage", event.data);
  };

  window.ws.onclose = () => {
    connectButton.innerText = "Connect";
    sendButton.disabled = true;
    createMessage("infoMessage", "Connection Closed");
  };
};

sendButton.onclick = (event) => {
  if (!window.ws.readyState) return false;
  data = messageInput.value;
  window.ws.send(data);
  createMessage("clientMessage", data);
  setTimeout(
    () => (messageContainer.scrollTop = messageContainer.scrollHeight),
    100
  );
};

clearButton.onclick = (event) => {
  Array.from(messageContainer.children).forEach((message) => {
    hideMessageWithFadeAnimation(message);
  });
};

createMessage = (type, content) => {
  let element = document.createElement("div");
  element.className = type + " message";
  element.innerText = content;
  if (type != "infoMessage") element.innerHTML += "<hr class='divider'>";
  messageContainer.appendChild(element);
  showMessageWithFadeAnimation(element);
};

showMessageWithFadeAnimation = (element) => {
  for (opacity = 0; opacity < 1.1; opacity += 0.1) {
    setTimeout(function () {
      element.style.opacity = opacity;
    }, 100);
  }
};

hideMessageWithFadeAnimation = (element) => {
  setTimeout(() => element.remove(), 1000);
  for (opacity = 1.0; opacity > 0; opacity -= 0.1) {
    setTimeout(function () {
      element.style.opacity = opacity;
    }, 100);
  }
};
