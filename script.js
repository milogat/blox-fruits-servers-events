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
   EVENTOS DEFINITIVOS
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
const VERSION = "4";

let filter = "all";

/*
  Identidad local temporal.

  Esto NO es todavía una cuenta real de Roblox.
  Cuando hagamos el sistema de cuentas, este identificador
  será sustituido por el ID real del usuario.
*/
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
   DATOS INICIALES
   ========================================================= */

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

/* =========================================================
   CARGAR / GUARDAR
   ========================================================= */

function loadEvents() {
  const savedVersion =
    localStorage.getItem(VERSION_KEY);

  /*
    Solo limpiamos la primera vez que instalamos esta versión.
    Así evitamos que los eventos antiguos de la versión anterior
    se mezclen con los nuevos.
  */

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
      "No se pudieron cargar los eventos guardados.",
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
   INFORMACIÓN DE EVENTO
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
   LIMPIEZA DE EVENTOS
   ========================================================= */

function cleanEvents() {
  const now = Date.now();

  let changed = false;

  events = events.filter(event => {

    /*
      Evento cancelado:
      desaparece de la lista.
    */

    if (event.cancelled) {
      changed = true;
      return false;
    }

    /*
      Si tiene fecha de expiración y ya terminó,
      desaparece.
    */

    if (
      event.expiresAt &&
      now >= event.expiresAt
    ) {
      changed = true;
      return false;
    }

    /*
      Si tiene una fecha futura de aparición,
      todavía se conserva en memoria pero no se muestra.
    */

    return true;
  });

  if (changed) {
    save();
  }
}

/* =========================================================
   ¿ESTÁ DISPONIBLE?
   ========================================================= */

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
   CREAR OPCIONES DE EVENTOS
   ========================================================= */

function populateEventChoices() {

  const container = $("#eventChoices");

  if (!container) {
    return;
  }

  /*
    Eliminamos las opciones antiguas del HTML.
    Así desaparece "Otro" y cualquier lista antigua.
  */

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
   MOSTRAR EVENTOS
   ========================================================= */

function render() {

  cleanEvents();

  const list = $("#eventsList");

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
          sum + Number(event.players || 0),
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

    const title =
      node.querySelector(".event-title");

    const host =
      node.querySelector(".event-host");

    const badge =
      node.querySelector(".badge");

    const players =
      node.querySelector(".players");

    const join =
      node.querySelector(".join");

    if (title) {
      title.textContent =
        `${event.icon} ${event.title} · ${event.sea}`;
    }

    if (host) {
      host.textContent =
        "Organizado por " +
        event.host;
    }

    if (badge) {
      badge.textContent =
        event.type === "private"
          ? "🔒 Servidor privado"
          : "🌐 Servidor público";
    }

    if (players) {
      players.textContent =
        `${event.players}/${event.capacity} jugadores`;
    }

    /*
      Agregamos descripción y tiempo sin depender
      de que el HTML antiguo tenga estos elementos.
    */

    const root =
      node.firstElementChild;

    if (root) {

      const extra =
        document.createElement("div");

      extra.className =
        "event-extra-info";

      if (event.description) {

        const description =
          document.createElement("div");

        description.className =
          "event-description";

        description.textContent =
          event.description;

        extra.appendChild(description);
      }

      if (event.expiresAt) {

        const time =
          document.createElement("div");

        time.className =
          "event-expiration";

        time.textContent =
          "⏳ " +
          formatRemaining(
            event.expiresAt
          );

        extra.appendChild(time);
      }

      if (
        event.startsAt &&
        event.startsAt > Date.now()
      ) {

        const starts =
          document.createElement("div");

        starts.className =
          "event-start";

        starts.textContent =
          "🕐 Aparece en " +
          formatRemaining(
            event.startsAt
          );

        extra.appendChild(starts);
      }

      root.appendChild(extra);

      /*
        Botón cancelar:
        solamente aparece para el creador.
      */

      if (
        event.ownerId === localUserId
      ) {

        const cancel =
          document.createElement("button");

        cancel.type = "button";

        cancel.className =
          "cancel-event";

        cancel.textContent =
          "❌ Cancelar evento";

        cancel.onclick = () => {

          const confirmed =
            confirm(
              "¿Seguro que quieres cancelar este evento?"
            );

          if (!confirmed) {
            return;
          }

          event.cancelled = true;

          save();
          render();
        };

        root.appendChild(cancel);
      }
    }

    if (join) {

      join.onclick = () => {

        if (
          Number(event.players) >=
          Number(event.capacity)
        ) {
          return;
        }

        event.players++;

        save();
        render();

        /*
          Si es privado y tiene enlace,
          abrimos el enlace.

          Para servidores públicos todavía mostramos
          un aviso porque GitHub Pages no puede crear
          un servidor de Roblox por sí mismo.
        */

        if (
          event.type === "private" &&
          event.link
        ) {

          window.location.href =
            event.link;

        } else {

          alert(
            "Este evento está publicado como servidor público. La conexión real con Roblox se añadirá cuando conectemos el sistema de servidores."
          );
        }
      };
    }

    list.appendChild(node);
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
   NAVEGACIÓN DE BOTONES
   ========================================================= */

if ($("#nextBtn")) {
  $("#nextBtn").onclick =
    () => show("app");
}

if ($("#eventsBtn")) {
  $("#eventsBtn").onclick =
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

/* =========================================================
   FILTROS
   ========================================================= */

$$(".filter").forEach(button => {

  button.onclick = () => {

    $$(".filter").forEach(item => {
      item.classList.remove("active");
    });

    button.classList.add("active");

    filter =
      button.dataset.type ||
      "all";

    render();
  };

});

/* =========================================================
   SERVIDOR PÚBLICO / PRIVADO
   ========================================================= */

$$(
  'input[name="serverType"]'
).forEach(radio => {

  radio.onchange = () => {

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
  };

});

/* =========================================================
   BUSCAR INFORMACIÓN DE CAMPOS OPCIONALES
   ========================================================= */

function getOptionalValue(
  selectors,
  fallback = ""
) {

  for (const selector of selectors) {

    const element =
      $(selector);

    if (element) {

      const value =
        element.value;

      if (
        value !== undefined &&
        value !== null
      ) {
        return value.trim
          ? value.trim()
          : value;
      }
    }
  }

  return fallback;
}

/* =========================================================
   CREAR EVENTO
   ========================================================= */

if ($("#publishBtn")) {

  $("#publishBtn").onclick =
    () => {

      const selectedInputs =
        $$(
          '#eventChoices input:checked'
        );

      const selected =
        selectedInputs.map(
          input => {

            const info =
              getEventByTitle(
                input.value
              );

            return info;
          }
        ).filter(Boolean);

      const serverType =
        $(
          'input[name="serverType"]:checked'
        );

      const type =
        serverType
          ? serverType.value
          : "public";

      const link =
        getOptionalValue([
          "#privateLink"
        ]);

      const description =
        getOptionalValue([
          "#eventDescription",
          "#description",
          "#serverDescription",
          "textarea[name='description']"
        ]);

      /*
        Capacidad.
        Si todavía no existe el campo,
        usamos 12.
      */

      const capacityRaw =
        getOptionalValue([
          "#capacity",
          "#serverCapacity",
          "input[name='capacity']"
        ], "12");

      let capacity =
        Number(capacityRaw);

      if (!Number.isFinite(capacity)) {
        capacity = 12;
      }

      capacity =
        Math.max(
          1,
          Math.min(12, capacity)
        );

      /*
        Tiempo para aparecer.
        Acepta minutos desde un campo futuro.
      */

      const delayRaw =
        getOptionalValue([
          "#startDelay",
          "#appearDelay",
          "input[name='startDelay']"
        ], "0");

      let delayMinutes =
        Number(delayRaw);

      if (
        !Number.isFinite(delayMinutes) ||
        delayMinutes < 0
      ) {
        delayMinutes = 0;
      }

      /*
        Duración.
        0 = sin límite.
      */

      const durationRaw =
        getOptionalValue([
          "#duration",
          "#eventDuration",
          "input[name='duration']"
        ], "0");

      let durationMinutes =
        Number(durationRaw);

      if (
        !Number.isFinite(durationMinutes) ||
        durationMinutes < 0
      ) {
        durationMinutes = 0;
      }

      if (!selected.length) {

        const message =
          $("#formMsg");

        if (message) {
          message.textContent =
            "Elige al menos un evento.";
        }

        return;
      }

      if (
        type === "private" &&
        !link
      ) {

        const message =
          $("#formMsg");

        if (message) {
          message.textContent =
            "Pega el link del servidor privado.";
        }

        return;
      }

      const now =
        Date.now();

      const startsAt =
        now +
        delayMinutes * 60 * 1000;

      const expiresAt =
        durationMinutes > 0
          ? startsAt +
            durationMinutes *
            60 *
            1000
          : null;

      selected.forEach(info => {

        events.unshift({

          id:
            "event-" +
            Date.now() +
            "-" +
            Math.random()
              .toString(36)
              .slice(2),

          eventId:
            info.id,

          title:
            info.title,

          sea:
            info.sea,

          icon:
            info.icon,

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
        });
      });

      save();

      const message =
        $("#formMsg");

      if (message) {
        message.textContent =
          delayMinutes > 0
            ? `¡Evento programado! Aparecerá en ${delayMinutes} minutos.`
            : "¡Evento publicado!";
      }

      setTimeout(() => {
        show("app");
      }, 700);
    };
}

/* =========================================================
   ACTUALIZACIÓN AUTOMÁTICA
   ========================================================= */

setInterval(() => {

  cleanEvents();

  if (
    screens.app &&
    screens.app.classList.contains("active")
  ) {
    render();
  }

}, 1000);

/* =========================================================
   INICIO
   ========================================================= */

populateEventChoices();
cleanEvents();
render();
