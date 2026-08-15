const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];


/* =====================================================
   PANTALLAS
   ===================================================== */

const screens = {
  welcome: $("#welcome"),
  app: $("#app"),
  create: $("#create")
};


/* =====================================================
   EVENTOS
   ===================================================== */

const EVENT_TYPES = [
  ["ship-raid", "Incursión de barcos", "Sea 2 y 3", "🚢"],
  ["haunted-ship-raid", "Incursión de barcos embrujados", "Sea 3", "👻"],
  ["sea-beast", "Sea Beast", "Sea 2 y 3", "🐋"],
  ["rumbling-waters", "Aguas retumbantes", "Sea 2 y 3", "🌊"],
  ["terror-shark", "Terror Shark", "Sea 3", "🦈"],
  ["kitsune-island", "Isla Kitsune", "Sea 3", "🦊"],
  ["mirage-island", "Isla Espejismo", "Sea 3", "🏝️"],
  ["prehistoric-island", "Isla prehistórica", "Sea 3", "🦖"],
  ["leviathan", "Leviathan", "Sea 3", "🐋"],
  ["katakuri-v1", "Katakuri V1", "Sea 3", "🍰"],
  ["katakuri-v2", "Katakuri V2", "Sea 3", "🍰"],
  ["tyrant-of-the-skies", "Tyrant of the Skies", "Sea 3", "🗿"],
  ["rip-indra", "rip_indra", "Sea 3", "🏰"],
  ["cursed-captain", "Cursed Captain", "Sea 2", "👻"],
  ["low", "Low", "Sea 2", "🤖"],
  ["darkbeard", "Darkbeard", "Sea 2", "🌑"],
  ["greybeard", "Greybeard", "Sea 1", "⚓"],
  ["soul-reaper", "Soul Reaper", "Sea 3", "💀"]
].map(([id, title, sea, icon]) => ({
  id,
  title,
  sea,
  icon
}));


/* =====================================================
   STORAGE
   ===================================================== */

const STORAGE_KEY = "bfsEventsV5";

let events = [];

let filter = "all";
let searchText = "";

let localUserId =
  localStorage.getItem("bfsLocalUserId");

if (!localUserId) {

  localUserId =
    "local-" +
    Date.now() +
    "-" +
    Math.random()
      .toString(36)
      .slice(2);

  localStorage.setItem(
    "bfsLocalUserId",
    localUserId
  );
}


/* =====================================================
   EVENTOS DE EJEMPLO
   ===================================================== */

const defaultEvents = [
  {
    id: "demo-1",
    eventId: "ship-raid",
    title: "Incursión de barcos",
    sea: "Sea 2 y 3",
    icon: "🚢",
    host: "Jugador de ejemplo",
    ownerId: "demo",
    type: "private",
    players: 7,
    capacity: 12,
    link: "",
    description: "Buscando jugadores para el evento.",
    createdAt: Date.now(),
    startsAt: Date.now(),
    expiresAt: null,
    cancelled: false
  },
  {
    id: "demo-2",
    eventId: "leviathan",
    title: "Leviathan",
    sea: "Sea 3",
    icon: "🐋",
    host: "Jugador de ejemplo",
    ownerId: "demo",
    type: "public",
    players: 9,
    capacity: 12,
    link: "",
    description: "Buscando jugadores para Leviathan.",
    createdAt: Date.now(),
    startsAt: Date.now(),
    expiresAt: null,
    cancelled: false
  }
];


function loadEvents() {

  try {

    const saved =
      JSON.parse(
        localStorage.getItem(STORAGE_KEY)
      );

    if (Array.isArray(saved)) {
      return saved;
    }

  } catch (error) {

    console.warn(
      "Error cargando eventos:",
      error
    );

  }

  return [...defaultEvents];
}


events = loadEvents();


function saveEvents() {

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(events)
  );
}


/* =====================================================
   INFORMACIÓN
   ===================================================== */

function getEventInfo(id) {

  return EVENT_TYPES.find(
    event => event.id === id
  );
}


/* =====================================================
   NAVEGACIÓN
   ===================================================== */

function showScreen(name) {

  Object.values(screens).forEach(
    screen => {

      if (screen) {
        screen.classList.remove("active");
      }

    }
  );

  if (screens[name]) {
    screens[name].classList.add("active");
  }

  if (name === "app") {
    renderEvents();
  }
}


/* =====================================================
   BOTONES DE NAVEGACIÓN
   ===================================================== */

$("#nextBtn")?.addEventListener(
  "click",
  () => showScreen("app")
);

$("#createBtn")?.addEventListener(
  "click",
  () => showScreen("create")
);

$("#backBtn")?.addEventListener(
  "click",
  () => showScreen("app")
);

$("#eventsBtn")?.addEventListener(
  "click",
  () => renderEvents()
);


/* =====================================================
   LOGIN DEMO
   ===================================================== */

const loginModal = $("#loginModal");

$("#loginBtn")?.addEventListener(
  "click",
  () => {
    loginModal?.classList.remove("hidden");
  }
);

$("#creatorLoginBtn")?.addEventListener(
  "click",
  () => {
    loginModal?.classList.remove("hidden");
  }
);

$("#closeLogin")?.addEventListener(
  "click",
  () => {
    loginModal?.classList.add("hidden");
  }
);

$("#robloxLogin")?.addEventListener(
  "click",
  () => {

    alert(
      "La conexión real con Roblox se añadirá posteriormente."
    );

    loginModal?.classList.add("hidden");
  }
);


/* =====================================================
   EVENTOS DEL FORMULARIO
   ===================================================== */

function populateEventChoices() {

  const container =
    $("#eventChoices");

  if (!container) {
    return;
  }

  container.innerHTML = "";

  EVENT_TYPES.forEach(event => {

    const label =
      document.createElement("label");

    label.className =
      "event-choice";

    const input =
      document.createElement("input");

    input.type = "checkbox";

    input.name = "event";

    input.value = event.id;

    const text =
      document.createElement("span");

    text.textContent =
      `${event.icon} ${event.title} · ${event.sea}`;

    label.appendChild(input);
    label.appendChild(text);

    container.appendChild(label);
  });
}


/* =====================================================
   SERVIDOR PRIVADO
   ===================================================== */

$$(
  'input[name="serverType"]'
).forEach(radio => {

  radio.addEventListener(
    "change",
    () => {

      const privateBox =
        $("#privateBox");

      if (!privateBox) {
        return;
      }

      privateBox.classList.toggle(
        "hidden",
        radio.value !== "private" ||
        !radio.checked
      );
    }
  );

});


/* =====================================================
   CREAR EVENTO
   ===================================================== */

$("#publishBtn")?.addEventListener(
  "click",
  () => {

    const selected =
      $$(
        '#eventChoices input[type="checkbox"]:checked'
      );

    const message =
      $("#formMsg");

    if (!selected.length) {

      if (message) {
        message.textContent =
          "⚠️ Selecciona al menos un evento.";
      }

      return;
    }


    const type =
      $(
        'input[name="serverType"]:checked'
      )?.value || "public";


    const privateLink =
      $("#privateLink")?.value.trim() || "";


    if (
      type === "private" &&
      !privateLink
    ) {

      if (message) {
        message.textContent =
          "⚠️ Añade el enlace del servidor privado.";
      }

      return;
    }


    const description =
      $("#eventDescription")?.value.trim() || "";


    let capacity =
      Number(
        $("#capacity")?.value || 12
      );


    if (!Number.isFinite(capacity)) {
      capacity = 12;
    }


    capacity =
      Math.max(
        1,
        Math.min(12, capacity)
      );


    const delay =
      Number(
        $("#startDelay")?.value || 0
      );


    const duration =
      Number(
        $("#duration")?.value || 0
      );


    const now =
      Date.now();


    const startsAt =
      now +
      delay * 60 * 1000;


    const expiresAt =
      duration > 0
        ? startsAt +
          duration * 60 * 1000
        : null;


    /*
      IMPORTANTE:

      Si eliges 2 o 3 eventos,
      NO creamos 2 o 3 servidores.

      Creamos UN SOLO servidor/evento
      con varios eventos asociados.
    */

    const selectedInfo =
      selected
        .map(input =>
          getEventInfo(input.value)
        )
        .filter(Boolean);


    const primary =
      selectedInfo[0];


    const newEvent = {

      id:
        "event-" +
        Date.now() +
        "-" +
        Math.random()
          .toString(36)
          .slice(2),

      events:
        selectedInfo.map(event => ({
          id: event.id,
          title: event.title,
          sea: event.sea,
          icon: event.icon
        })),

      eventId:
        primary.id,

      title:
        primary.title,

      sea:
        primary.sea,

      icon:
        primary.icon,

      host:
        "Tú",

      ownerId:
        localUserId,

      type,

      players: 0,

      capacity,

      link:
        type === "private"
          ? privateLink
          : "",

      description,

      createdAt:
        now,

      startsAt,

      expiresAt,

      cancelled: false
    };


    events.unshift(newEvent);

    saveEvents();


    if (message) {

      message.textContent =
        delay > 0
          ? `✅ Evento programado. Aparecerá en ${delay} minutos.`
          : "✅ ¡Evento publicado!";

    }


    setTimeout(
      () => showScreen("app"),
      600
    );

  }
);


/* =====================================================
   LIMPIEZA
   ===================================================== */

function cleanEvents() {

  const now =
    Date.now();

  const before =
    events.length;


  events =
    events.filter(event => {

      if (event.cancelled) {
        return false;
      }

      if (
        event.expiresAt &&
        now >= event.expiresAt
      ) {
        return false;
      }

      return true;
    });


  if (
    before !== events.length
  ) {
    saveEvents();
  }
}


/* =====================================================
   BÚSQUEDA
   ===================================================== */

$("#eventSearch")?.addEventListener(
  "input",
  event => {

    searchText =
      event.target.value
        .trim()
        .toLowerCase();

    renderEvents();
  }
);


/* =====================================================
   FILTROS
   ===================================================== */

$$(".filter").forEach(button => {

  button.addEventListener(
    "click",
    () => {

      $$(".filter").forEach(
        item =>
          item.classList.remove("active")
      );

      button.classList.add("active");

      filter =
        button.dataset.type || "all";

      renderEvents();
    }
  );

});


/* =====================================================
   TIEMPO
   ===================================================== */

function formatRemaining(timestamp) {

  const difference =
    Math.max(
      0,
      timestamp - Date.now()
    );

  const seconds =
    Math.floor(
      difference / 1000
    );

  const minutes =
    Math.floor(
      seconds / 60
    );

  const hours =
    Math.floor(
      minutes / 60
    );


  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  }

  if (minutes > 0) {
    return `${minutes}m`;
  }

  return `${seconds}s`;
}


/* =====================================================
   EVENTOS VISIBLES
   ===================================================== */

function isVisible(event) {

  const now =
    Date.now();


  if (event.cancelled) {
    return false;
  }


  if (
    event.startsAt &&
    now < event.startsAt
  ) {
    return false;
  }


  if (
    event.expiresAt &&
    now >= event.expiresAt
  ) {
    return false;
  }


  if (
    filter !== "all" &&
    event.type !== filter
  ) {
    return false;
  }


  if (
    searchText
  ) {

    const text =
      [
        event.title,
        event.description,
        event.sea,
        ...(event.events || [])
          .map(item => item.title)
      ]
      .join(" ")
      .toLowerCase();


    if (
      !text.includes(searchText)
    ) {
      return false;
    }
  }


  return true;
}


/* =====================================================
   MOSTRAR VARIOS EVENTOS EN UNA TARJETA
   ===================================================== */

function renderEventTitle(event) {

  const list =
    event.events?.length
      ? event.events
      : [{
          title: event.title,
          icon: event.icon
        }];


  const first =
    list[0];


  /*
    Primer evento grande.
    Los demás aparecen debajo como emojis.
  */

  let html =
    `<strong>${first.icon} ${first.title}</strong>`;


  if (list.length > 1) {

    html +=
      `<div class="sub-event-icons">`;

    list.slice(1).forEach(
      item => {

        html +=
          `<span title="${item.title}">
             ${item.icon}
           </span>`;
      }
    );

    html +=
      `</div>`;
  }


  return html;
}


/* =====================================================
   RENDER
   ===================================================== */

function renderEvents() {

  cleanEvents();


  const list =
    $("#eventsList");

  if (!list) {
    return;
  }


  list.innerHTML = "";


  const visible =
    events.filter(isVisible);


  $("#eventCount").textContent =
    visible.length;


  const totalPlayers =
    visible.reduce(
      (sum, event) =>
        sum +
        Number(event.players || 0),
      0
    );


  $("#sitePlayers").textContent =
    Math.max(1, totalPlayers);


  $("#welcomePlayers").textContent =
    Math.max(1, totalPlayers);


  if (!visible.length) {

    list.innerHTML =
      `<div class="empty">
        No hay eventos disponibles.
       </div>`;

    return;
  }


  visible.forEach(event => {

    const template =
      $("#eventTemplate");

    if (!template) {
      return;
    }


    const node =
      template.content.cloneNode(true);


    const icon =
      node.querySelector(".event-icon");

    const title =
      node.querySelector(".event-title");

    const host =
      node.querySelector(".event-host");

    const badge =
      node.querySelector(".badge");

    const players =
      node.querySelector(".players");

    const description =
      node.querySelector(".event-description");

    const time =
      node.querySelector(".event-time");

    const join =
      node.querySelector(".join");


    if (icon) {
      icon.textContent =
        event.icon;
    }


    if (title) {
      title.innerHTML =
        renderEventTitle(event);
    }


    if (host) {

      host.textContent =
        `Organizado por ${event.host}`;
    }


    if (badge) {

      badge.textContent =
        event.type === "private"
          ? "🔒 Servidor privado"
          : "🌐 Servidor público";
    }


    if (players) {

      players.textContent =
        `${event.players}/${event.capacity}`;
    }


    if (description) {

      description.textContent =
        event.description ||
        "Sin descripción.";

      description.addEventListener(
        "click",
        () => {

          alert(
            event.description ||
            "Este evento no tiene descripción."
          );

        }
      );
    }


    if (time) {

      if (
        event.expiresAt
      ) {

        time.textContent =
          `⏳ ${formatRemaining(
            event.expiresAt
          )}`;

      } else {

        time.textContent =
          "♾️ Sin límite";
      }
    }


    if (
      event.ownerId === localUserId
    ) {

      const card =
        node.querySelector(
          ".event-card"
        );


      const cancel =
        document.createElement("button");


      cancel.className =
        "cancel-event";


      cancel.type =
        "button";


      cancel.textContent =
        "❌ Cancelar";


      cancel.addEventListener(
        "click",
        () => {

          if (
            confirm(
              "¿Cancelar este evento?"
            )
          ) {

            event.cancelled =
              true;

            saveEvents();

            renderEvents();
          }

        }
      );


      card.appendChild(cancel);
    }


    if (join) {

      join.addEventListener(
        "click",
        () => {

          if (
            event.players >=
            event.capacity
          ) {

            alert(
              "Este evento está lleno."
            );

            return;
          }


          event.players++;

          saveEvents();

          renderEvents();


          if (
            event.type === "private" &&
            event.link
          ) {

            window.location.href =
              event.link;

          } else {

            alert(
              "Evento seleccionado. La conexión automática con servidores públicos de Roblox se añadirá posteriormente."
            );

          }

        }
      );
    }


    list.appendChild(node);

  });

}


/* =====================================================
   ACTUALIZACIÓN
   ===================================================== */

setInterval(
  () => {

    cleanEvents();

    if (
      screens.app?.classList.contains(
        "active"
      )
    ) {

      renderEvents();

    }

  },
  1000
);


/* =====================================================
   INICIO
   ===================================================== */

populateEventChoices();

cleanEvents();

renderEvents();
