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
