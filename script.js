const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

/* =========================================================
   PANTALLAS
   ========================================================= */

const screens = {
  welcome: $("#welcome"),
  app: $("#app"),
  create: $("#create")
};

/* =========================================================
   EVENTOS
   ========================================================= */

const EVENT_TYPES = [
  { id:"ship-raid", title:"Incursión de barcos", sea:"Sea 2 y 3", icon:"🚢" },
  { id:"haunted-ship-raid", title:"Incursión de barcos embrujados", sea:"Sea 3", icon:"👻" },
  { id:"sea-beast", title:"Sea Beast", sea:"Sea 2 y 3", icon:"🐋" },
  { id:"rumbling-waters", title:"Aguas retumbantes", sea:"Sea 2 y 3", icon:"🌊" },
  { id:"terror-shark", title:"Terror Shark", sea:"Sea 3", icon:"🦈" },
  { id:"kitsune-island", title:"Isla Kitsune", sea:"Sea 3", icon:"🦊" },
  { id:"mirage-island", title:"Isla Espejismo", sea:"Sea 3", icon:"🏝️" },
  { id:"prehistoric-island", title:"Isla prehistórica", sea:"Sea 3", icon:"🦖" },
  { id:"leviathan", title:"Leviathan", sea:"Sea 3", icon:"🐋" },
  { id:"katakuri-v1", title:"Katakuri V1", sea:"Sea 3", icon:"🍰" },
  { id:"katakuri-v2", title:"Katakuri V2", sea:"Sea 3", icon:"🍰" },
  { id:"tyrant-of-the-skies", title:"Tyrant of the Skies", sea:"Sea 3", icon:"🗿" },
  { id:"rip-indra", title:"rip_indra", sea:"Sea 3", icon:"🏰" },
  { id:"cursed-captain", title:"Cursed Captain", sea:"Sea 2", icon:"👻" },
  { id:"low", title:"Low", sea:"Sea 2", icon:"🤖" },
  { id:"darkbeard", title:"Darkbeard", sea:"Sea 2", icon:"🌑" },
  { id:"greybeard", title:"Greybeard", sea:"Sea 1", icon:"⚓" },
  { id:"soul-reaper", title:"Soul Reaper", sea:"Sea 3", icon:"💀" }
];

/* =========================================================
   CONFIGURACIÓN
   ========================================================= */

const STORAGE_KEY = "bfsEvents";
const VERSION_KEY = "bfsEventsVersion";
const VERSION = "5";

let filter = "all";

/* =========================================================
   IDENTIDAD LOCAL
   ========================================================= */

let localUserId = localStorage.getItem("bfsLocalUserId");

if (!localUserId) {
  localUserId =
    "local-" +
    Date.now() +
    "-" +
    Math.random().toString(36).slice(2);

  localStorage.setItem(
    "bfsLocalUserId",
    localUserId
  );
}

/* =========================================================
   EVENTOS DE EJEMPLO
   ========================================================= */

const defaultEvents = [
  {
    id: "demo-1",
    groupId: "demo-server-1",
    eventIds: ["ship-raid"],
    primaryEventId: "ship-raid",
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
    groupId: "demo-server-2",
    eventIds: ["leviathan"],
    primaryEventId: "leviathan",
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

/* =========================================================
   CARGAR / GUARDAR
   ========================================================= */

function loadEvents() {

  const savedVersion =
    localStorage.getItem(VERSION_KEY);

  if (savedVersion !== VERSION) {

    localStorage.setItem(
      VERSION_KEY,
      VERSION
    );

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(defaultEvents)
    );

    return [...defaultEvents];
  }

  try {

    const saved =
      JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "null"
      );

    if (Array.isArray(saved)) {
      return saved;
    }

  } catch (error) {

    console.warn(
      "No se pudieron cargar los eventos.",
      error
    );
  }

  return [...defaultEvents];
}

let events = loadEvents();

function save() {

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(events)
  );
}

/* =========================================================
   INFORMACIÓN
   ========================================================= */

function getEventInfo(eventId) {

  return EVENT_TYPES.find(
    event => event.id === eventId
  );
}

function getEventByTitle(title) {

  return EVENT_TYPES.find(
    event => event.title === title
  );
}

/* =========================================================
   EVENTOS VISIBLES
   ========================================================= */

function cleanEvents() {

  const now = Date.now();

  let changed = false;

  events = events.filter(event => {

    if (event.cancelled) {
      changed = true;
      return false;
    }

    if (
      event.expiresAt &&
      now >= event.expiresAt
    ) {
      changed = true;
      return false;
    }

    return true;
  });

  if (changed) {
    save();
  }
}

function isVisible(event) {

  const now = Date.now();

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
    Number(event.players) >=
    Number(event.capacity)
  ) {
    return false;
  }

  if (
    filter !== "all" &&
    event.type !== filter
  ) {
    return false;
  }

  return true;
}

/* =========================================================
   NAVEGACIÓN
   ========================================================= */

function show(name) {

  Object.values(screens).forEach(screen => {

    if (screen) {
      screen.classList.remove("active");
    }

  });

  if (screens[name]) {
    screens[name].classList.add("active");
  }

  if (name === "app") {
    render();
  }
}

/* =========================================================
   OPCIONES DE EVENTOS
   ========================================================= */

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
    input.value = event.title;
    input.dataset.eventId = event.id;

    const text =
      document.createElement("span");

    text.textContent =
      `${event.icon} ${event.title} · ${event.sea}`;

    label.appendChild(input);
    label.appendChild(text);

    container.appendChild(label);
  });
}

/* =========================================================
   TIEMPOS
   ========================================================= */

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
    return `${hours} h ${minutes % 60} min`;
  }

  if (minutes > 0) {
    return `${minutes} min`;
  }

  return `${seconds} s`;
}

/* =========================================================
   CREAR EVENTO ADICIONAL PEQUEÑO
   ========================================================= */

function createMiniEvent(info) {

  const mini =
    document.createElement("button");

  mini.type = "button";

  mini.className =
    "mini-event";

  mini.innerHTML = `
    <span class="mini-event-icon">
      ${info.icon}
    </span>

    <span class="mini-event-text">
      <strong>${info.title}</strong>
      <small>${info.sea}</small>
    </span>
  `;

  return mini;
}

/* =========================================================
   MOSTRAR EVENTOS
   ========================================================= */

function render() {

  cleanEvents();

  const list =
    $("#eventsList");

  if (!list) {
    return;
  }

  list.innerHTML = "";

  const visible =
    events.filter(isVisible);

  if ($("#eventCount")) {

    $("#eventCount").textContent =
      visible.length;
  }

  if ($("#sitePlayers")) {

    const total =
      visible.reduce(
        (sum, event) =>
          sum +
          Number(event.players || 0),
        0
      );

    $("#sitePlayers").textContent =
      Math.max(1, total);
  }

  if (!visible.length) {

    list.innerHTML =
      '<div class="empty">No hay eventos disponibles con este filtro.</div>';

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

    const root =
      node.firstElementChild;

    if (!root) {
      return;
    }

    root.classList.add(
      "server
