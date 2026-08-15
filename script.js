const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

const screens = {
  welcome: $("#welcome"),
  app: $("#app"),
  create: $("#create")
};

/* ================================
   LISTA DEFINITIVA DE EVENTOS
   ================================ */

const defaultEvents = [
  {
    id: 1,
    title: "🚢 Incursión de barcos",
    sea: "Sea 2 y 3",
    host: "Jugador de ejemplo",
    type: "private",
    players: 7,
    capacity: 12,
    link: "https://www.roblox.com/share?code=DEMO&type=Server"
  },
  {
    id: 2,
    title: "👻 Incursión de barcos embrujados",
    sea: "Sea 3",
    host: "Jugador de ejemplo",
    type: "public",
    players: 5,
    capacity: 12,
    link: ""
  },
  {
    id: 3,
    title: "🐋 Sea Beast",
    sea: "Sea 2 y 3",
    host: "Jugador de ejemplo",
    type: "public",
    players: 3,
    capacity: 12,
    link: ""
  },
  {
    id: 4,
    title: "🌊 Aguas retumbantes",
    sea: "Sea 2 y 3",
    host: "Jugador de ejemplo",
    type: "public",
    players: 4,
    capacity: 12,
    link: ""
  },
  {
    id: 5,
    title: "🦈 Terror Shark",
    sea: "Sea 3",
    host: "Jugador de ejemplo",
    type: "private",
    players: 8,
    capacity: 12,
    link: "https://www.roblox.com/share?code=DEMO2&type=Server"
  },
  {
    id: 6,
    title: "🦊 Isla Kitsune",
    sea: "Sea 3",
    host: "Jugador de ejemplo",
    type: "public",
    players: 2,
    capacity: 12,
    link: ""
  },
  {
    id: 7,
    title: "🏝️ Isla Espejismo",
    sea: "Sea 3",
    host: "Jugador de ejemplo",
    type: "public",
    players: 6,
    capacity: 12,
    link: ""
  },
  {
    id: 8,
    title: "🦖 Isla prehistórica",
    sea: "Sea 3",
    host: "Jugador de ejemplo",
    type: "public",
    players: 4,
    capacity: 12,
    link: ""
  },
  {
    id: 9,
    title: "🐋 Leviathan",
    sea: "Sea 3",
    host: "Jugador de ejemplo",
    type: "private",
    players: 9,
    capacity: 12,
    link: "https://www.roblox.com/share?code=DEMO3&type=Server"
  },

  /* JEFES ESPECIALES */

  {
    id: 10,
    title: "🍰 Katakuri V1",
    sea: "Sea 3",
    host: "Jugador de ejemplo",
    type: "public",
    players: 4,
    capacity: 12,
    link: ""
  },
  {
    id: 11,
    title: "🍰 Katakuri V2",
    sea: "Sea 3",
    host: "Jugador de ejemplo",
    type: "public",
    players: 3,
    capacity: 12,
    link: ""
  },
  {
    id: 12,
    title: "🗿 Tyrant of the Skies",
    sea: "Sea 3",
    host: "Jugador de ejemplo",
    type: "private",
    players: 5,
    capacity: 12,
    link: "https://www.roblox.com/share?code=DEMO4&type=Server"
  },
  {
    id: 13,
    title: "🏰 rip_indra",
    sea: "Sea 3",
    host: "Jugador de ejemplo",
    type: "private",
    players: 7,
    capacity: 12,
    link: "https://www.roblox.com/share?code=DEMO5&type=Server"
  },
  {
    id: 14,
    title: "👻 Cursed Captain",
    sea: "Sea 2",
    host: "Jugador de ejemplo",
    type: "public",
    players: 3,
    capacity: 12,
    link: ""
  },
  {
    id: 15,
    title: "🤖 Low",
    sea: "Sea 2",
    host: "Jugador de ejemplo",
    type: "public",
    players: 4,
    capacity: 12,
    link: ""
  },
  {
    id: 16,
    title: "🌑 Darkbeard",
    sea: "Sea 2",
    host: "Jugador de ejemplo",
    type: "private",
    players: 8,
    capacity: 12,
    link: "https://www.roblox.com/share?code=DEMO6&type=Server"
  },
  {
    id: 17,
    title: "⚓ Greybeard",
    sea: "Sea 1",
    host: "Jugador de ejemplo",
    type: "public",
    players: 5,
    capacity: 12,
    link: ""
  },
  {
    id: 18,
    title: "💀 Soul Reaper",
    sea: "Sea 3",
    host: "Jugador de ejemplo",
    type: "public",
    players: 2,
    capacity: 12,
    link: ""
  }
];

/* ================================
   REINICIAR LA LISTA ANTIGUA
   ================================ */

const DATA_VERSION = "bfs_events_v2";

let events;

if (localStorage.getItem("bfsEventsVersion") !== DATA_VERSION) {
  events = defaultEvents;
  localStorage.setItem("bfsEventsVersion", DATA_VERSION);
  localStorage.setItem("bfsEvents", JSON.stringify(events));
} else {
  events = JSON.parse(
    localStorage.getItem("bfsEvents") || "null"
  ) || defaultEvents;
}

let filter = "all";

/* ================================
   GUARDAR
   ================================ */

function save() {
  localStorage.setItem(
    "bfsEvents",
    JSON.stringify(events)
  );
}

/* ================================
   CAMBIAR DE PANTALLA
   ================================ */

function show(name) {
  Object.values(screens).forEach(x => {
    if (x) x.classList.remove("active");
  });

  if (screens[name]) {
    screens[name].classList.add("active");
  }

  if (name === "app") {
    render();
  }
}

/* ================================
   MOSTRAR EVENTOS
   ================================ */

function render() {
  const list = $("#eventsList");

  if (!list) return;

  list.innerHTML = "";

  const visible = events
    .filter(e =>
      filter === "all" ||
      e.type === filter
    )
    .filter(e =>
      e.players < e.capacity
    );

  if ($("#eventCount")) {
    $("#eventCount").textContent = events.length;
  }

  if ($("#sitePlayers")) {
    const totalPlayers = events.reduce(
      (a, e) => a + e.players,
      0
    );

    $("#sitePlayers").textContent =
      Math.max(1, totalPlayers + 1);
  }

  if (!visible.length) {
    list.innerHTML =
      '<div class="empty">No hay eventos disponibles con este filtro.</div>';

    return;
  }

  visible.forEach(e => {
    const node = $("#eventTemplate").content.cloneNode(true);

    const title = node.querySelector(".event-title");
    const host = node.querySelector(".event-host");
    const badge = node.querySelector(".badge");
    const players = node.querySelector(".players");
    const join = node.querySelector(".join");

    if (title) {
      title.textContent =
        `${e.title} · ${e.sea}`;
    }

    if (host) {
      host.textContent =
        "Organizado por " + e.host;
    }

    if (badge) {
      badge.textContent =
        e.type === "private"
          ? "🔒 Servidor privado"
          : "🌐 Servidor público";
    }

    if (players) {
      players.textContent =
        `${e.players}/${e.capacity} jugadores`;
    }

    if (join) {
      join.onclick = () => {
        if (e.players >= e.capacity) {
          return;
        }

        e.players++;

        save();
        render();

        /*
          Los enlaces de demostración son solamente
          ejemplos. Los servidores reales se conectarán
          cuando añadamos el sistema correspondiente.
        */

        if (e.type === "private" && e.link) {
          window.location.href = e.link;
        } else {
          alert(
            "Este evento es público. En la versión conectada a Roblox, aquí se abrirá el servidor correspondiente."
          );
        }
      };
    }

    list.appendChild(node);
  });
}

/* ================================
   NAVEGACIÓN
   ================================ */

if ($("#nextBtn")) {
  $("#nextBtn").onclick = () => show("app");
}

if ($("#eventsBtn")) {
  $("#eventsBtn").onclick = () => show("app");
}

if ($("#createBtn")) {
  $("#createBtn").onclick = () => show("create");
}

if ($("#backBtn")) {
  $("#backBtn").onclick = () => show("app");
}

/* ================================
   FILTROS
   ================================ */

$$(".filter").forEach(b => {
  b.onclick = () => {

    $$(".filter").forEach(x => {
      x.classList.remove("active");
    });

    b.classList.add("active");

    filter = b.dataset.type || "all";

    render();
  };
});

/* ================================
   TIPO DE SERVIDOR
   ================================ */

$$('input[name="serverType"]').forEach(r => {

  r.onchange = () => {

    const box = $("#privateBox");

    if (!box) return;

    box.classList.toggle(
      "hidden",
      r.value !== "private" || !r.checked
    );
  };

});

/* ================================
   PUBLICAR EVENTO
   ================================ */

if ($("#publishBtn")) {

  $("#publishBtn").onclick = () => {

    const selected =
      $$('#eventChoices input:checked')
      .map(x => x.value);

    const selectedType =
      $('input[name="serverType"]:checked');

    const type =
      selectedType
        ? selectedType.value
        : "public";

    const privateLink =
      $("#privateLink")
        ? $("#privateLink").value.trim()
        : "";

    if (!selected.length) {

      if ($("#formMsg")) {
        $("#formMsg").textContent =
          "Elige al menos un evento.";
      }

      return;
    }

    if (type === "private" && !privateLink) {

      if ($("#formMsg")) {
        $("#formMsg").textContent =
          "Pega el link del servidor privado.";
      }

      return;
    }

    selected.forEach(title => {

      /*
        Busca el Sea correspondiente al evento.
        Si es un evento nuevo que todavía no está
        en nuestra lista, se mostrará "Por definir".
      */

      const existing =
        defaultEvents.find(
          e => e.title.includes(title)
        );

      events.unshift({
        id: Date.now() + Math.random(),

        title: title,

        sea: existing
          ? existing.sea
          : "Por definir",

        host: "Tú",

        type: type,

        players: 0,

        capacity: 12,

        link:
          type === "private"
            ? privateLink
            : ""
      });

    });

    save();

    if ($("#formMsg")) {
      $("#formMsg").textContent =
        "¡Evento publicado!";
    }

    setTimeout(() => {
      show("app");
    }, 500);
  };

}

/* ================================
   INICIAR
   ================================ */

render();
