var urlInput = document.getElementById("urlInput");
var messageInput = document.getElementById("messageInput");
var connectButton = document.getElementById("connectButton");
var sendButton = document.getElementById("sendButton");
var clearButton = document.getElementById("clearButton");
var messageContainer = document.getElementsByClassName("messageContainer")[0];

const messageTypes = {
  SERVER_MESSAGE: "serverMessage",
  INFO_MESSAGE: "infoMessage",
  CLIENT_MESSAGE: "clientMessage"
}

connectButton.onclick = (event) => {
  if (typeof window.ws !== "undefined" && window.ws.readyState == 1)
    window.ws.close();
  else {
    url = urlInput.value;
    createWs(url);
  }
};

createWs = (url) => {
  window.ws = new WebSocket(url);

  window.ws.onopen = (event) => {
    createMessage(messageTypes.INFO_MESSAGE, "Connected");
    connectButton.innerText = "Disconnect";
    sendButton.disabled = false;
  };

  window.ws.onmessage = (event) => {
    createMessage(messageTypes.SERVER_MESSAGE, event.data);
  };

  window.ws.onclose = () => {
    connectButton.innerText = "Connect";
    sendButton.disabled = true;
    createMessage(messageTypes.INFO_MESSAGE, "Connection Closed");
  };
};

sendButton.onclick = (event) => {
  if (!window.ws.readyState) return false;
  data = messageInput.value;
  window.ws.send(data);
  createMessage(messageTypes.CLIENT_MESSAGE, "<b>You: </b>" + data);
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
  element.innerHTML = content;
  if (type != messageTypes.INFO_MESSAGE) element.innerHTML += "<hr class='divider'>";
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
