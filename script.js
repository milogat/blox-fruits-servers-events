const screens = {
  welcome: document.querySelector('#welcome'),
  events: document.querySelector('#eventsScreen'),
  create: document.querySelector('#createScreen')
};

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

let filter = 'all';

let events = [
  {
    id: 1,
    title: 'Kata V2',
    host: 'Rip_Akatsuki',
    type: 'private',
    players: 8,
    cap: 12,
    link: 'https://www.roblox.com/share?code=DEMO1&type=Server'
  },
  {
    id: 2,
    title: 'Leviathan',
    host: 'SeaKing',
    type: 'private',
    players: 10,
    cap: 12,
    link: 'https://www.roblox.com/share?code=DEMO2&type=Server'
  },
  {
    id: 3,
    title: 'Mirage Island',
    host: 'MiragePro',
    type: 'public',
    players: 6,
    cap: 10
  },
  {
    id: 4,
    title: 'Sea Events',
    host: 'OceanHunter',
    type: 'public',
    players: 3,
    cap: 12
  },
  {
    id: 5,
    title: 'Factory Raid',
    host: 'FactoryMain',
    type: 'private',
    players: 11,
    cap: 12,
    link: 'https://www.roblox.com/share?code=DEMO3&type=Server'
  }
];

const icons = {
  'Kata V2': '🟣',
  'Leviathan': '🐋',
  'Mirage Island': '🟢',
  'Sea Events': '🌊',
  'Race V4': '🔴',
  'Factory Raid': '🏭',
  'Otro': '➕'
};

function show(screenName) {
  Object.values(screens).forEach(screen => {
    screen.classList.remove('active');
  });

  screens[screenName].classList.add('active');

  if (screenName === 'events') {
    render();
  }
}

function render() {
  const searchText = $('#search').value.toLowerCase();
  const list = $('#eventList');

  list.innerHTML = '';

  const availableEvents = events
    .filter(event => event.players < event.cap)
    .filter(event => filter === 'all' || event.type === filter)
    .filter(event => event.title.toLowerCase().includes(searchText));

  if (!availableEvents.length) {
    list.innerHTML =
      '<div class="empty">No hay eventos disponibles.</div>';
    return;
  }

  availableEvents.forEach(event => {
    const card = document.createElement('article');

    card.className = 'event';

    card.innerHTML = `
      <div class="event-left">
        <div class="icon">
          ${icons[event.title] || '⚔️'}
        </div>

        <div>
          <h3>${event.title}</h3>

          <div class="meta">
            Organizado por ${event.host}
          </div>

          <span class="badge">
            ${event.type === 'private' ? '🔒 Privado' : '🌐 Público'}
            · 🟢 Activo
          </span>
        </div>
      </div>

      <div class="event-right">
        <span class="players">
          ${event.players}/${event.cap} jugadores
        </span>

        <button class="join">
          UNIRSE
        </button>
      </div>
    `;

    card.querySelector('.join').onclick = () => join(event);

    list.appendChild(card);
  });
}

function join(event) {
  if (event.players >= event.cap) {
    return;
  }

  event.players++;

  render();

  if (event.type === 'private' && event.link) {
    window.location.href = event.link;
  } else {
    alert(
      'En la versión conectada, este botón abrirá el servidor público correspondiente en Roblox.'
    );
  }
}

$('#nextBtn').onclick = () => show('events');

$('#homeBtn').onclick = () => show('events');

$('#createBtn').onclick = () => show('create');

$('#backBtn').onclick = () => show('events');

$$('.filter').forEach(button => {
  button.onclick = () => {
    $$('.filter').forEach(
      item => item.classList.remove('active')
    );

    button.classList.add('active');

    filter = button.dataset.filter;

    render();
  };
});

$('#search').oninput = render;

$$('input[name="type"]').forEach(radio => {
  radio.onchange = () => {
    $$('.server-option').forEach(
      option => option.classList.remove('selected')
    );

    radio.parentElement.classList.add('selected');

    $('#privateFields').classList.toggle(
      'hidden',
      radio.value !== 'private'
    );
  };
});

$('#publishBtn').onclick = () => {
  const selected = $$('#choices input:checked')
    .map(input => input.value);

  const type =
    $('input[name="type"]:checked').value;

  const link =
    $('#serverLink').value.trim();

  const capacity = Math.max(
    1,
    Math.min(
      12,
      Number($('#capacity').value) || 12
    )
  );

  if (!selected.length) {
    $('#message').textContent =
      'Elige al menos un evento.';
    return;
  }

  if (type === 'private' && !link) {
    $('#message').textContent =
      'Pega el enlace del servidor privado.';
    return;
  }

  selected.forEach(title => {
    events.unshift({
      id: Date.now() + Math.random(),
      title: title,
      host: 'Tú',
      type: type,
      players: 0,
      cap: capacity,
      link: type === 'private' ? link : ''
    });
  });

  $('#message').textContent =
    '¡Evento publicado correctamente!';

  setTimeout(() => {
    show('events');
    $('#message').textContent = '';
  }, 600);
};

render();
