const sections = {
  trending: ["Polar Drift", "Icebound", "Northern Light", "Blue Divide"],
  new: ["White Horizon", "Frostline", "Snowfall City", "Shiver"],
  continue: JSON.parse(localStorage.getItem("glacier_continue") || '["Arctic Signal"]'),
  top: ["Summit Echo", "Glacial Heart", "Avalanche Run", "Cold Meridian"],
  watchlist: JSON.parse(localStorage.getItem("glacier_watchlist") || '[]')
};

const imageFor = (title) => `https://picsum.photos/seed/${encodeURIComponent(title)}/640/360`;
const allTitles = Object.values(sections).flat();

function renderRow(id, title, items) {
  const row = document.getElementById(id);
  row.innerHTML = `<h2>${title}</h2><div class="cards"></div>`;
  const cards = row.querySelector('.cards');
  items.forEach(name => {
    const card = document.createElement('article');
    card.className = 'card glass';
    card.innerHTML = `<img src="${imageFor(name)}" alt="${name}"/><h3>${name}</h3><div class="meta"><span>Glacier Original</span><span>★ 4.${name.length%10}</span></div>`;
    card.onclick = () => playTitle(name);
    cards.appendChild(card);
  });
}

function playTitle(name) {
  document.getElementById('now-playing').textContent = `Playing: ${name}`;
  const cont = new Set(JSON.parse(localStorage.getItem('glacier_continue') || '[]'));
  cont.add(name);
  localStorage.setItem('glacier_continue', JSON.stringify([...cont]));
}

function addWatchlist(name) {
  const wl = new Set(JSON.parse(localStorage.getItem('glacier_watchlist') || '[]'));
  wl.add(name);
  localStorage.setItem('glacier_watchlist', JSON.stringify([...wl]));
  sections.watchlist = [...wl];
  renderAll();
}

function renderAll() {
  sections.continue = JSON.parse(localStorage.getItem('glacier_continue') || '["Arctic Signal"]');
  sections.watchlist = JSON.parse(localStorage.getItem('glacier_watchlist') || '[]');
  renderRow('trending', 'Trending', sections.trending);
  renderRow('new', 'New Releases', sections.new);
  renderRow('continue', 'Continue Watching', sections.continue);
  renderRow('top', 'Top Rated', sections.top);
  renderRow('watchlist', 'Watchlist', sections.watchlist.length ? sections.watchlist : ['Your watchlist is empty']);
}

renderAll();

document.querySelectorAll('[data-section]').forEach(btn => btn.onclick = () => {
  document.querySelectorAll('.nav-link').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById(btn.dataset.section).scrollIntoView({behavior:'smooth', block:'start'});
});

document.querySelector('[data-play]').onclick = (e) => playTitle(e.target.dataset.play);
document.querySelector('[data-watchlist]').onclick = (e) => addWatchlist(e.target.dataset.watchlist);

document.getElementById('search').addEventListener('input', (e) => {
  const q = e.target.value.trim().toLowerCase();
  const box = document.getElementById('suggestions');
  box.innerHTML = '';
  if (!q) return;
  allTitles.filter(t => t.toLowerCase().includes(q)).slice(0,5).forEach(title => {
    const b = document.createElement('button');
    b.textContent = title;
    b.onclick = () => { playTitle(title); box.innerHTML=''; e.target.value = title; };
    box.appendChild(b);
  });
});

function startSnowfall() {
  const canvas = document.getElementById('snowfall');
  const ctx = canvas.getContext('2d');
  const flakes = [];
  const flakeCount = 90;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function makeFlake() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2.2 + 0.8,
      vy: Math.random() * 0.8 + 0.25,
      vx: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.45 + 0.35
    };
  }

  function initFlakes() {
    flakes.length = 0;
    for (let i = 0; i < flakeCount; i += 1) flakes.push(makeFlake());
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    flakes.forEach(f => {
      f.y += f.vy;
      f.x += f.vx + Math.sin(f.y * 0.01) * 0.18;
      if (f.y > canvas.height + 4) {
        f.y = -4;
        f.x = Math.random() * canvas.width;
      }
      if (f.x > canvas.width + 8) f.x = -8;
      if (f.x < -8) f.x = canvas.width + 8;

      ctx.beginPath();
      ctx.fillStyle = `rgba(235, 246, 255, ${f.alpha})`;
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  resize();
  initFlakes();
  draw();
  window.addEventListener('resize', () => {
    resize();
    initFlakes();
  });
}

startSnowfall();
