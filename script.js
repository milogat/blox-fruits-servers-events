const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];


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

  {
    id: "ship-raid",
    title: "Incursión de barcos",
    sea: "Sea 2 y 3",
    icon: "🚢"
  },

  {
    id: "haunted-ship-raid",
    title: "Incursión de barcos embrujados",
    sea: "Sea 3",
    icon: "👻"
  },

  {
    id: "sea-beast",
    title: "Sea Beast",
    sea: "Sea 2 y 3",
    icon: "🐋"
  },

  {
    id: "rumbling-waters",
    title: "Aguas retumbantes",
    sea: "Sea 2 y 3",
    icon: "🌊"
  },

  {
    id: "terror-shark",
    title: "Terror Shark",
    sea: "Sea 3",
    icon: "🦈"
  },

  {
    id: "kitsune-island",
    title: "Isla Kitsune",
    sea: "Sea 3",
    icon: "🦊"
  },

  {
    id: "mirage-island",
    title: "Isla Espejismo",
    sea: "Sea 3",
    icon: "🏝️"
  },

  {
    id: "prehistoric-island",
    title: "Isla prehistórica",
    sea: "Sea 3",
    icon: "🦖"
  },

  {
    id: "leviathan",
    title: "Leviathan",
    sea: "Sea 3",
    icon: "🐋"
  },

  {
    id: "katakuri-v1",
    title: "Katakuri V1",
    sea: "Sea 3",
    icon: "🍰"
  },

  {
    id: "katakuri-v2",
    title: "Katakuri V2",
    sea: "Sea 3",
    icon: "🍰"
  },

  {
    id: "tyrant-of-the-skies",
    title: "Tyrant of the Skies",
    sea: "Sea 3",
    icon: "🗿"
  },

  {
    id: "rip-indra",
    title: "rip_indra",
    sea: "Sea 3",
    icon: "🏰"
  },

  {
    id: "cursed-captain",
    title: "Cursed Captain",
    sea: "Sea 2",
    icon: "👻"
  },

  {
    id: "low",
    title: "Low",
    sea: "Sea 2",
    icon: "🤖"
  },

  {
    id: "darkbeard",
    title: "Darkbeard",
    sea: "Sea 2",
    icon: "🌑"
  },

  {
    id: "greybeard",
    title: "Greybeard",
    sea: "Sea 1",
    icon: "⚓"
  },

  {
    id: "soul-reaper",
    title: "Soul Reaper",
    sea: "Sea 3",
    icon: "💀"
  }

];


/* =========================================================
   CONFIGURACIÓN
   ========================================================= */

const STORAGE_KEY = "bfsEvents";
const VERSION_KEY = "bfsEventsVersion";

const VERSION = "5";

let filter = "all";
let searchText = "";


/* =========================================================
   IDENTIDAD LOCAL
   ========================================================= */

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


/* =========================================================
   EVENTOS DEMO
   ========================================================= */

const defaultEvents = [

  {
    id: "server-demo-1",

    events: [
      {
        eventId: "ship-raid",
        title: "Incursión de barcos",
        sea: "Sea 2 y 3",
        icon: "🚢"
      },
      {
        eventId: "sea-beast",
        title: "Sea Beast",
        sea: "Sea 2 y 3",
        icon: "🐋"
      },
      {
        eventId: "rumbling-waters",
        title: "Aguas retumbantes",
        sea: "Sea 2 y 3",
        icon: "🌊"
      }
    ],

    host: "Jugador de ejemplo",

    ownerId: "demo",

    type: "public",

    players: 7,

    capacity: 12,

    link: "",

    description:
      "Buscando jugadores para realizar varios eventos.",

    createdAt: Date.now(),

    startsAt: Date.now(),

    expiresAt: null,

    cancelled: false

  },

  {
    id: "server-demo-2",

    events: [
      {
        eventId: "leviathan",
        title: "Leviathan",
        sea: "Sea 3",
        icon: "🐋"
      }
    ],

    host: "Jugador de ejemplo",

    ownerId: "demo",

    type: "private",

    players: 9,

    capacity: 12,

    link: "",

    description:
      "Buscando jugadores para Leviathan.",

    createdAt: Date.now(),

    startsAt: Date.now(),

    expiresAt: null,

    cancelled: false

  }

];


/* =========================================================
   CARGAR
   ========================================================= */

function loadEvents() {

  const version =
    localStorage.getItem(VERSION_KEY);

  if (version !== VERSION) {

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
      "Error cargando eventos:",
      error
    );

  }

  return [...defaultEvents];
}


let servers = loadEvents();


/* =========================================================
   GUARDAR
   ========================================================= */

function save() {

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(servers)
  );

}


/* =========================================================
   INFORMACIÓN
   ========================================================= */

function getEventInfo(id) {

  return EVENT_TYPES.find(
    event => event.id === id
  );

}


/* =========================================================
   LIMPIAR
   ========================================================= */

function cleanEvents() {

  const now = Date.now();

  const before =
    servers.length;

  servers =
    servers.filter(server => {

      if (server.cancelled) {
        return false;
      }

      if (
        server.expiresAt &&
        now >= server.expiresAt
      ) {
        return false;
      }

      return true;

    });

  if (
    before !== servers.length
  ) {
    save();
  }

}


/* =========================================================
   DISPONIBILIDAD
   ========================================================= */

function isVisible(server) {

  const now = Date.now();

  if (server.cancelled) {
    return false;
  }

  if (
    server.startsAt &&
    now < server.startsAt
  ) {
    return false;
  }

  if (
    server.expiresAt &&
    now >= server.expiresAt
  ) {
    return false;
  }

  if (
    Number(server.players) >=
    Number(server.capacity)
  ) {
    return false;
  }

  if (
    filter !== "all" &&
    server.type !== filter
  ) {
    return false;
  }

  if (searchText) {

    const search =
      searchText.toLowerCase();

    const found =
      server.events.some(event =>
        event.title
          .toLowerCase()
          .includes(search)
      );

    if (!found) {
      return false;
    }
  }

  return true;
}


/* =========================================================
   NAVEGACIÓN
   ========================================================= */

function show(name) {

  Object.values(screens)
    .forEach(screen => {

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
   OPCIONES
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

    input.value = event.id;

    input.dataset.eventId =
      event.id;

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
   TIEMPO
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

    return (
      `${hours} h ` +
      `${minutes % 60} min`
    );

  }

  if (minutes > 0) {
    return `${minutes} min`;
  }

  return `${seconds} s`;
}


/* =========================================================
   CREAR TARJETA
   ========================================================= */

function createServerCard(server) {

  const card =
    document.createElement("article");

  card.className =
    "event-card";


  /* EVENTO PRINCIPAL */

  const mainEvent =
    server.events[0];


  const icon =
    document.createElement("div");

  icon.className =
    "event-icon";

  icon.textContent =
    mainEvent.icon;


  const information =
    document.createElement("div");

  information.className =
    "event-information";


  const title =
    document.createElement("h3");

  title.className =
    "event-title";

  title.textContent =
    mainEvent.title;


  const host =
    document.createElement("p");

  host.className =
    "event-host";

  host.textContent =
    "Organizado por " +
    server.host;


  const badge =
    document.createElement("span");

  badge.className =
    "badge";

  badge.textContent =
    server.type === "private"
      ? "🔒 Servidor privado"
      : "🌐 Servidor público";


  information.appendChild(title);

  information.appendChild(host);

  information.appendChild(badge);


  /* PARTE DERECHA */

  const side =
    document.createElement("div");

  side.className =
    "event-side";


  const players =
    document.createElement("span");

  players.className =
    "players";

  players.textContent =
    `${server.players}/${server.capacity}`;


  const join =
    document.createElement("button");

  join.className =
    "join";

  join.type =
    "button";

  join.textContent =
    "UNIRSE";


  join.onclick = () => {

    if (
      Number(server.players) >=
      Number(server.capacity)
    ) {
      return;
    }

    server.players++;

    save();

    render();

    if (
      server.type === "private" &&
      server.link
    ) {

      window.location.href =
        server.link;

      return;
    }

    alert(
      "Este servidor público todavía es una simulación. La conexión real con Roblox se añadirá después."
    );

  };


  side.appendChild(players);

  side.appendChild(join);


  /* AÑADIR */

  card.appendChild(icon);

  card.appendChild(information);

  card.appendChild(side);


  /* =====================================================
     OTROS EVENTOS
     ===================================================== */

  if (server.events.length > 1) {

    const extras =
      document.createElement("div");

    extras.className =
      "extra-events";


    const label =
      document.createElement("span");

    label.className =
      "extra-events-label";

    label.textContent =
      "También:";


    extras.appendChild(label);


    server.events
      .slice(1)
      .forEach(event => {

        const item =
          document.createElement("span");

        item.className =
          "extra-event";

        item.title =
          event.title;

        item.textContent =
          `${event.icon} ${event.title}`;

        extras.appendChild(item);

      });


    card.appendChild(extras);

  }


  /* =====================================================
     DESCRIPCIÓN
     ===================================================== */

  if (server.description) {

    const description =
      document.createElement("div");

    description.className =
      "event-extra-info";


    const text =
      document.createElement("div");

    text.className =
      "event-description";

    text.textContent =
      server.description;


    description.appendChild(text);


    if (server.expiresAt) {

      const expiration =
        document.createElement("div");

      expiration.className =
        "event-expiration";

      expiration.textContent =
        "⏳ " +
        formatRemaining(
          server.expiresAt
        );

      description.appendChild(
        expiration
      );

    }


    card.appendChild(
      description
    );

  }


  /* =====================================================
     CANCELAR
     ===================================================== */

  if (
    server.ownerId ===
    localUserId
  ) {

    const cancel =
      document.createElement("button");

    cancel.className =
      "cancel-event";

    cancel.type =
      "button";

    cancel.textContent =
      "❌ Cancelar evento";


    cancel.onclick = () => {

      if (
        !confirm(
          "¿Seguro que quieres cancelar este evento?"
        )
      ) {
        return;
      }

      server.cancelled =
        true;

      save();

      render();

    };


    card.appendChild(
      cancel
    );

  }


  return card;
}


/* =========================================================
   RENDERIZAR
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
    servers.filter(
      isVisible
    );


  if ($("#eventCount")) {

    $("#eventCount").textContent =
      visible.length;

  }


  const totalPlayers =
    visible.reduce(
      (total, server) =>
        total +
        Number(server.players || 0),
      0
    );


  if ($("#sitePlayers")) {

    $("#sitePlayers").textContent =
      Math.max(
        1,
        totalPlayers
      );

  }


  if ($("#welcomePlayers")) {

    $("#welcomePlayers").textContent =
      Math.max(
        1,
        totalPlayers
      );

  }


  if (!visible.length) {

    list.innerHTML =
      `
      <div class="empty">
        No hay eventos disponibles
        con este filtro.
      </div>
      `;

    return;
  }


  visible.forEach(server => {

    list.appendChild(
      createServerCard(server)
    );

  });

}


/* =========================================================
   BOTONES DE NAVEGACIÓN
   ========================================================= */

if ($("#nextBtn")) {

  $("#nextBtn").onclick =
    () => show("app");

}


if ($("#createBtn")) {

  $("#createBtn").onclick =
    () => show("create");

}


if ($("#backBtn")) {

  $("#backBtn").onclick =
    () => show("app");

}


if ($("#eventsBtn")) {

  $("#eventsBtn").onclick =
    () => render();

}


/* =========================================================
   FILTROS
   ========================================================= */

$$(".filter").forEach(button => {

  button.onclick = () => {

    $$(".filter")
      .forEach(item =>
        item.classList.remove("active")
      );

    button.classList.add("active");

    filter =
      button.dataset.type ||
      "all";

    render();

  };

});


/* =========================================================
   BUSCADOR
   ========================================================= */

if ($("#eventSearch")) {

  $("#eventSearch").addEventListener(
    "input",
    event => {

      searchText =
        event.target.value
          .trim();

      render();

    }
  );

}


/* =========================================================
   SERVIDOR PRIVADO
   ========================================================= */

$$(
  'input[name="serverType"]'
).forEach(radio => {

  radio.onchange = () => {

    const box =
      $("#privateBox");

    if (!box) {
      return;
    }

    box.classList.toggle(
      "hidden",
      !(
        radio.checked &&
        radio.value === "private"
      )
    );

  };

});


/* =========================================================
   CREAR EVENTO
   ========================================================= */

if ($("#publishBtn")) {

  $("#publishBtn").onclick =
    () => {

      const selected =
        $$(
          '#eventChoices input:checked'
        )
        .map(input =>
          getEventInfo(
            input.dataset.eventId
          )
        )
        .filter(Boolean);


      const message =
        $("#formMsg");


      if (!selected.length) {

        if (message) {

          message.textContent =
            "Elige al menos un evento.";

        }

        return;
      }


      const serverRadio =
        $(
          'input[name="serverType"]:checked'
        );


      const type =
        serverRadio
          ? serverRadio.value
          : "public";


      const link =
        $("#privateLink")
          ? $("#privateLink")
            .value
            .trim()
          : "";


      if (
        type === "private" &&
        !link
      ) {

        if (message) {

          message.textContent =
            "Pega el enlace del servidor privado.";

        }

        return;
      }


      let capacity =
        Number(
          $("#capacity")
            ? $("#capacity").value
            : 12
        );


      if (
        !Number.isFinite(capacity)
      ) {
        capacity = 12;
      }


      capacity =
        Math.max(
          1,
          Math.min(
            12,
            capacity
          )
        );


      const description =
        $("#eventDescription")
          ? $("#eventDescription")
            .value
            .trim()
          : "";


      const delay =
        Number(
          $("#startDelay")
            ? $("#startDelay").value
            : 0
        );


      const duration =
        Number(
          $("#duration")
            ? $("#duration").value
            : 0
        );


      const now =
        Date.now();


      const startsAt =
        now +
        delay *
        60 *
        1000;


      const expiresAt =
        duration > 0
          ? startsAt +
            duration *
            60 *
            1000
          : null;


      /*
        IMPORTANTE:

        Creamos UN SOLO servidor aunque
        el usuario seleccione 2, 3 o más eventos.

        Esto evita la duplicación.
      */

      const server = {

        id:
          "server-" +
          Date.now() +
          "-" +
          Math.random()
            .toString(36)
            .slice(2),

        events:
          selected.map(event => ({
            eventId: event.id,
            title: event.title,
            sea: event.sea,
            icon: event.icon
          })),

        host:
          "Tú",

        ownerId:
          localUserId,

        type:
          type,

        players:
          0,

        capacity:
          capacity,

        link:
          type === "private"
            ? link
            : "",

        description:
          description,

        createdAt:
          now,

        startsAt:
          startsAt,

        expiresAt:
          expiresAt,

        cancelled:
          false

      };


      servers.unshift(
        server
      );


      save();


      if (message) {

        message.textContent =
          delay > 0
            ? `¡Evento programado! Aparecerá en ${delay} minutos.`
            : "¡Evento publicado!";

      }


      /*
        Limpiamos los checkboxes
        para la próxima creación.
      */

      $$(
        '#eventChoices input'
      ).forEach(input => {
        input.checked = false;
      });


      setTimeout(() => {

        show("app");

      }, 700);

    };

}


/* =========================================================
   MODAL DE LOGIN
 
