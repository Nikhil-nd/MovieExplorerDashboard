// Backend integration configuration
const API_BASE = "/api"; // Use relative path for same-origin requests
const ENDPOINTS = {
  allMovies: API_BASE + "/searchAllMovies",
  filter: API_BASE + "/filter",
  types: API_BASE + "/searchMovieType"
};

// Local state (movies & genres) - movies fetched from backend; fallback seed if offline
let movies = [];
let genres = ["All"]; // will be extended from backend types
let activeGenre = "All";
let watchLater = new Set();
let backendAvailable = true;

// Poster fallback logic
const GENRE_COLORS = {
  'Action':'dc3545',
  'Drama':'6c757d',
  'Comedy':'ffc107',
  'Sci-Fi':'0dcaf0',
  'Unknown':'343a40'
};

function resolvePoster(m){
  if (m.poster && m.poster.trim()) return m.poster;
  const title = (m.title || m.name || 'Movie').slice(0,18);
  const genre = (m.genre || m.Type || 'Unknown');
  const color = GENRE_COLORS[genre] || '6610f2';
  // placehold.co format: widthxheight/bg/textColor?text=...
  return `https://placehold.co/300x450/${color}/ffffff?text=${encodeURIComponent(title)}`;
}

const els = {};

function cacheEls(){
  els.genreBar = document.getElementById('genreBar');
  els.moviesGrid = document.getElementById('moviesGrid');
  els.moviesMeta = document.getElementById('moviesMeta');
  els.searchForm = document.getElementById('searchForm');
  els.searchInput = document.getElementById('searchInput');
  els.searchResultsSection = document.getElementById('searchResultsSection');
  els.searchResultsGrid = document.getElementById('searchResultsGrid');
  els.clearSearch = document.getElementById('clearSearch');
  els.watchLaterCount = document.getElementById('watchLaterCount');
  els.watchLaterList = document.getElementById('watchLaterList');
  els.yearSpan = document.getElementById('yearSpan');
  if (els.yearSpan) els.yearSpan.textContent = new Date().getFullYear();
}

function renderGenres(){
  if(!els.genreBar) return;
  els.genreBar.innerHTML = genres.map(g => `
    <input type="radio" class="btn-check" name="genre" id="genre-${g}" ${g===activeGenre?'checked':''} autocomplete="off">
    <label for="genre-${g}" class="btn btn-sm ${g===activeGenre?'btn-primary':'btn-outline-secondary'} rounded-pill px-3">${g}</label>
  `).join('');
  els.genreBar.querySelectorAll('input').forEach(inp => {
    inp.addEventListener('change', () => {
      activeGenre = inp.id.replace('genre-','');
      updateMovies();
    });
  });
}

function cardTemplate(m){
  // Backend movies don't currently store year, rating, poster; derive placeholders
  const id = m._id || m.id; // support both local seed & backend
  const title = m.title || m.name || 'Untitled';
  const genre = m.Type || m.genre || 'Unknown';
  const year = m.year || '—';
  const rating = m.rating || '—';
  const poster = resolvePoster(m);
  const bookmarked = watchLater.has(id);
  return `<div class="col-6 col-md-4 col-lg-3">
    <div class="card bg-dark border-0 rounded-4 h-100 overflow-hidden shadow-sm movie-card" data-id="${id}">
      <div class="position-relative">
  <img src="${poster}" alt="${title} poster" class="w-100" style="aspect-ratio:3/4;object-fit:cover;" loading="lazy" onerror="this.onerror=null;this.src='https://placehold.co/300x450/444/ffffff?text=No+Image';">
        <button class="btn btn-sm btn-dark position-absolute top-0 end-0 m-2 watch-btn" aria-label="${bookmarked?'Remove from':'Add to'} Watch Later">
          <i class="bi ${bookmarked?'bi-bookmark-fill text-warning':'bi-bookmark'}"></i>
        </button>
      </div>
      <div class="card-body small">
        <h6 class="card-title mb-1 text-truncate">${title}</h6>
        <div class="d-flex justify-content-between align-items-center">
          <span class="text-secondary">${year}</span>
          <span class="text-warning d-flex align-items-center gap-1"><i class="bi bi-star-fill"></i>${rating}</span>
        </div>
        <div class="text-secondary small mt-1">${genre}</div>
      </div>
    </div>
  </div>`;
}

function filterList(base){
  const q = els.searchInput.value.trim().toLowerCase();
  return base.filter(m => {
    const genreVal = m.genre || m.Type;
    const titleVal = (m.title || m.name || '').toLowerCase();
    const gOk = activeGenre === 'All' || genreVal === activeGenre;
    const qOk = !q || titleVal.includes(q) || (genreVal && genreVal.toLowerCase().includes(q));
    return gOk && qOk;
  });
}

function updateMovies(){
  const list = filterList(movies);
  els.moviesGrid.innerHTML = list.map(cardTemplate).join('') || `<div class="text-secondary fst-italic">No matches.</div>`;
  els.moviesMeta.textContent = list.length + ' shown';
  bindCardButtons(els.moviesGrid);
}

function bindCardButtons(scope){
  scope.querySelectorAll('.watch-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const rawId = btn.closest('.movie-card').dataset.id;
      toggleWatchLater(rawId);
    });
  });
}

function toggleWatchLater(id){
  if (watchLater.has(id)) watchLater.delete(id); else watchLater.add(id);
  updateMovies();
  renderWatchLater();
  persistWatchLater();
}

function persistWatchLater(){
  try { localStorage.setItem('watchLaterIds', JSON.stringify([...watchLater])); } catch {}
}

function loadWatchLater(){
  try {
    const raw = JSON.parse(localStorage.getItem('watchLaterIds')||'[]');
    watchLater = new Set(raw);
  } catch { watchLater = new Set(); }
}

function renderWatchLater(){
  const list = [...watchLater]
    .map(id => movies.find(m=> (m._id||m.id)==id))
    .filter(Boolean);
  if (!list.length){
    els.watchLaterList.innerHTML = '<p class="text-secondary m-0">No movies saved yet.</p>';
  } else {
    els.watchLaterList.innerHTML = list.map(m => `<div class="wl-item d-flex align-items-center gap-2">
  <img src="${resolvePoster(m)}" alt="${m.title || m.name}" style="width:40px;height:56px;object-fit:cover;" class="rounded" onerror="this.onerror=null;this.src='https://placehold.co/80x112/444/ffffff?text=No';">
        <div class="flex-grow-1">
          <div class="fw-semibold small mb-1">${m.title || m.name}</div>
          <div class="text-secondary small">${m.year || '—'} · ${(m.genre || m.Type || 'Unknown')}</div>
        </div>
        <button class="btn btn-sm btn-outline-light remove-wl" data-id="${m._id||m.id}"><i class="bi bi-x"></i></button>
    </div>`).join('');
    els.watchLaterList.querySelectorAll('.remove-wl').forEach(b=>{
      b.addEventListener('click',()=>{ toggleWatchLater(b.dataset.id); });
    });
  }
  updateWatchLaterBadge();
}

function updateWatchLaterBadge(){
  const c = watchLater.size;
  els.watchLaterCount.textContent = c;
  els.watchLaterCount.classList.toggle('d-none', c===0);
}

async function handleSearch(e){
  e.preventDefault();
  const q = els.searchInput.value.trim();
  if (!q){
    els.searchResultsSection.classList.add('d-none');
    updateMovies();
    return;
  }
  // If backend available, use server filter; else local filter fallback
  if (backendAvailable){
    try {
      els.searchResultsGrid.innerHTML = '<div class="text-secondary">Searching...</div>';
      console.log('Searching for:', q);
      const res = await fetch(ENDPOINTS.filter, {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ filterKey: q })
      });
      if(!res.ok) throw new Error('Server responded '+res.status);
      const data = await res.json();
      console.log('Search results:', data);
      const list = data.data || [];
      console.log('Found', list.length, 'movies matching', q);
      
      if (list.length === 0) {
        els.searchResultsGrid.innerHTML = `<div class="col-12 text-secondary fst-italic">
          No results found for "${q}".
        </div>`;
      } else {
        els.searchResultsGrid.innerHTML = list.map(cardTemplate).join('');
      }
      
      bindCardButtons(els.searchResultsGrid);
      els.searchResultsSection.classList.remove('d-none');
      return;
    } catch (err){
      console.warn('Backend search failed, falling back', err);
      els.searchResultsGrid.innerHTML = `<div class="col-12 text-warning">
        Search error: ${err.message}. Using local search instead.
      </div>`;
      backendAvailable = false; // degrade gracefully
    }
  }
  const resLocal = movies.filter(m => {
    const titleVal = (m.title || m.name || '').toLowerCase();
    const genreVal = (m.genre || m.Type || '').toLowerCase();
    return titleVal.includes(q.toLowerCase()) || genreVal.includes(q.toLowerCase());
  });
  els.searchResultsGrid.innerHTML = resLocal.map(cardTemplate).join('') || '<div class="text-secondary fst-italic">No results.</div>';
  bindCardButtons(els.searchResultsGrid);
  els.searchResultsSection.classList.remove('d-none');
  updateMovies();
}

function clearSearch(){
  els.searchInput.value='';
  els.searchResultsSection.classList.add('d-none');
  updateMovies();
}

async function fetchMovies(){
  try {
    if(els.moviesGrid) els.moviesGrid.innerHTML = '<div class="col-12 text-secondary">Loading movies...</div>';
    console.log('Fetching movies from', ENDPOINTS.allMovies);
    const res = await fetch(ENDPOINTS.allMovies, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'}
    });
    if(!res.ok) throw new Error('Movies fetch failed with status ' + res.status);
    const data = await res.json();
    console.log('Movies response:', data);
    if(data && data.data) {
      movies = (data.data || []).map(m => ({...m}));
      console.log('Loaded', movies.length, 'movies');
    } else {
      throw new Error('Invalid response format');
    }
  } catch (err){
    backendAvailable = false;
    console.warn('Falling back to seed movies (offline):', err);
    if(els.moviesGrid) els.moviesGrid.innerHTML = 
      `<div class="col-12 text-warning small">
        Backend unavailable: ${err.message}. Using fallback data.
        <button onclick="window.location.reload()" class="btn btn-sm btn-outline-warning ms-2">
          <i class="bi bi-arrow-clockwise"></i> Retry
        </button>
      </div>`;
    // Provide minimal seed dataset for offline usage
    movies = [
      { id:1, title:"Inception", year:2010, rating:8.8, genre:"Action" },
      { id:2, title:"Interstellar", year:2014, rating:8.6, genre:"Drama" },
      { id:3, title:"The Dark Knight", year:2008, rating:9.0, genre:"Action" },
      { id:4, title:"Dune", year:2021, rating:8.1, genre:"Sci-Fi" }
    ];
  }
}

async function fetchGenres(){
  try {
    const res = await fetch(ENDPOINTS.types, {method:'POST'});
    if(!res.ok) throw new Error('Types fetch failed '+res.status);
    const data = await res.json();
    const serverTypes = (data.data || []).map(t => t.name).filter(Boolean);
    genres = ['All', ...new Set(serverTypes)];
  } catch (err){
    console.warn('Falling back to default genres', err);
    if(genres.length === 1) genres.push('Action','Drama','Comedy','Sci-Fi');
  }
}

async function loadInitialData(){
  await Promise.all([fetchMovies(), fetchGenres()]);
  renderGenres();
  updateMovies();
  renderWatchLater();
}

function init(){
  cacheEls();
  loadWatchLater();
  // Load data then bind events
  loadInitialData();
  if (els.searchForm) els.searchForm.addEventListener('submit', handleSearch);
  if (els.searchInput) els.searchInput.addEventListener('input', e => { if(!e.target.value) clearSearch(); });
  if (els.clearSearch) els.clearSearch.addEventListener('click', clearSearch);
}

document.addEventListener('DOMContentLoaded', init);
