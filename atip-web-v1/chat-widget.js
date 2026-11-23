(() => {
  const panel = document.getElementById("atipChatPanel");
  const toggle = document.getElementById("atipChatToggle");
  const close = document.getElementById("atipChatClose");
  const form = document.getElementById("atipChatForm");
  const input = document.getElementById("atipChatInput");
  const send = document.getElementById("atipChatSend");
  const messages = document.getElementById("atipChatMessages");
  const launcherLabel = document.getElementById("atipChatLauncherLabel");
  const subtitle = document.getElementById("atipChatSubtitle");
  const privacy = document.getElementById("atipChatPrivacy");
  const inputLabel = document.getElementById("atipChatInputLabel");
  const history = [];
  let busy = false;
  let welcomeMessage = null;

  const copy = {
    es: {
      launcher: "Habla con AT.ip", title: "Asistente AT.ip", subtitle: "¿En qué podemos ayudarte?",
      close: "Cerrar chat", placeholder: "Cuéntanos qué necesitas…", inputLabel: "Escribe tu consulta", send: "Enviar",
      privacy: "Tus mensajes se procesan en MongoDB Atlas y Groq; no guardamos el historial.",
      greeting: "Hola. Puedo orientarte sobre las capacidades de AT.ip y ayudarte a identificar el área adecuada. ¿Qué reto quieres resolver?",
      thinking: "Estoy buscando información…", error: "No pude responder ahora. Inténtalo de nuevo en un momento.",
      sourceHeading: "Fuentes consultadas", sourceKind: {consulting:"Consultoría", "industrial-logistics":"Industrial & Logistics"}
    },
    en: {
      launcher: "Chat with AT.ip", title: "AT.ip Assistant", subtitle: "How can we help?",
      close: "Close chat", placeholder: "Tell us what you need…", inputLabel: "Write your question", send: "Send",
      privacy: "Your messages are processed by MongoDB Atlas and Groq; we do not store chat history.",
      greeting: "Hello. I can explain AT.ip’s capabilities and help identify the right business area. What challenge are you working on?",
      thinking: "Looking up information…", error: "I couldn’t answer right now. Please try again shortly.",
      sourceHeading: "Sources consulted", sourceKind: {consulting:"Consulting", "industrial-logistics":"Industrial & Logistics"}
    }
  };

  function language() {
    return document.documentElement.lang === "en" ? "en" : "es";
  }

  function updateLanguage() {
    const text = copy[language()];
    launcherLabel.textContent = text.launcher;
    document.getElementById("atipChatTitle").textContent = text.title;
    subtitle.textContent = text.subtitle;
    close.setAttribute("aria-label", text.close);
    input.placeholder = text.placeholder;
    inputLabel.textContent = text.inputLabel;
    send.textContent = text.send;
    privacy.textContent = text.privacy;
    if (!history.length) {
      if (welcomeMessage) welcomeMessage.textContent = text.greeting;
      else welcomeMessage = addMessage(text.greeting, "assistant", [], false);
    }
  }

  function addMessage(content, role, sources = [], save = true) {
    const bubble = document.createElement("div");
    bubble.className = `chat-message ${role}`;
    bubble.textContent = content;
    if (sources.length && role === "assistant") {
      const sourceList = document.createElement("div");
      sourceList.className = "chat-sources";
      const heading = document.createElement("strong");
      heading.textContent = copy[language()].sourceHeading;
      sourceList.appendChild(heading);
      sources.forEach((source, index) => {
        const label = document.createElement(source.url ? "a" : "span");
        label.textContent = `[${index + 1}] ${source.title} · ${copy[language()].sourceKind[source.ragId] || source.ragId}`;
        if (source.url && /^https:\/\//i.test(source.url)) {
          label.href = source.url;
          label.target = "_blank";
          label.rel = "noopener noreferrer";
        }
        sourceList.appendChild(label);
      });
      bubble.appendChild(sourceList);
    }
    messages.appendChild(bubble);
    messages.scrollTop = messages.scrollHeight;
    if (save) history.push({role, content});
    return bubble;
  }

  function setOpen(open) {
    panel.hidden = !open;
    toggle.setAttribute("aria-expanded", String(open));
    if (open) input.focus();
    else toggle.focus();
  }

  toggle.addEventListener("click", () => setOpen(panel.hidden));
  close.addEventListener("click", () => setOpen(false));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !panel.hidden) setOpen(false);
  });
  document.getElementById("languageToggle").addEventListener("click", updateLanguage);
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      form.requestSubmit();
    }
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const message = input.value.trim();
    if (!message || busy) return;
    input.value = "";
    addMessage(message, "user");
    const priorHistory = history.slice(0, -1).slice(-6);
    const typing = addMessage(copy[language()].thinking, "assistant typing", [], false);
    busy = true;
    send.disabled = true;
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({message, language: language(), history: priorHistory})
      });
      const result = await response.json();
      typing.remove();
      if (!response.ok) throw new Error(result.error || "request_failed");
      addMessage(result.answer, "assistant", Array.isArray(result.sources) ? result.sources : []);
    } catch (_) {
      typing.remove();
      addMessage(copy[language()].error, "assistant");
    } finally {
      busy = false;
      send.disabled = false;
      input.focus();
    }
  });

  updateLanguage();
})();
