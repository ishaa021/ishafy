const playlist = [
  { id: 1, title: "Summer Vibes", artist: "Chill Beats", duration: 180, src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", album: "Chill Collection" },
  { id: 2, title: "Night City", artist: "Electronic Dreams", duration: 210, src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", album: "Urban Nights" },
  { id: 3, title: "Acoustic Journey", artist: "Peaceful Mind", duration: 195, src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", album: "Acoustic Dreams" },
  { id: 4, title: "Digital Dreams", artist: "Future Bass", duration: 220, src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3", album: "Future Sounds" },
  { id: 5, title: "Midnight Jazz", artist: "Smooth Grooves", duration: 200, src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3", album: "Jazz Lounge" },
];

let currentIndex = 0;
let isPlaying = false;
let isMuted = false;
let repeat = false;
let shuffle = false;

const audio = document.getElementById('audio');
const titleEl = document.getElementById('title');
const artistEl = document.getElementById('artist');
const countEl = document.getElementById('count');
const playlistEl = document.getElementById('playlist');
const songListEl = document.getElementById('songList');
const playToggle = document.getElementById('playToggle');
const centerPlay = document.getElementById('centerPlay');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const progress = document.getElementById('progress');
const curTime = document.getElementById('curTime');
const durTime = document.getElementById('durTime');
const volume = document.getElementById('volume');
const muteBtn = document.getElementById('muteBtn');
const shuffleBtn = document.getElementById('shuffleBtn');
const repeatBtn = document.getElementById('repeatBtn');
const miniTitle = document.getElementById('miniTitle');
const miniArtist = document.getElementById('miniArtist');
const miniLike = document.getElementById('miniLike');
const menuBtn = document.getElementById('menuBtn');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const closeSidebar = document.getElementById('closeSidebar');

countEl.textContent = playlist.length;

function formatTime(t){
  if (isNaN(t)) return '0:00';
  const m = Math.floor(t/60);
  const s = Math.floor(t%60).toString().padStart(2,'0');
  return `${m}:${s}`;
}

function renderPlaylist(){
  playlistEl.innerHTML = '';
  playlist.forEach((s, idx) =>{
    const btn = document.createElement('button');
    btn.className = 'item' + (idx===currentIndex? ' active':'');
    btn.innerHTML = `<div style="font-weight:600">${s.title}</div><div class="muted" style="font-size:12px">${s.artist}</div>`;
    btn.addEventListener('click', ()=>{
      loadSong(idx); playAudio();
      if (window.innerWidth < 900){ closeMobileSidebar(); }
    });
    playlistEl.appendChild(btn);
  })
}

function renderSongList(){
  songListEl.innerHTML='';
  playlist.forEach((s, idx)=>{
    const row = document.createElement('div');
    row.className = 'song-row' + (idx===currentIndex? ' active':'');
    row.innerHTML = `
      <div style="text-align:center">${idx===currentIndex && isPlaying? '▮▮':'<span class=\"muted\">'+(idx+1)+'</span>'}</div>
      <div>
        <div style="font-weight:600">${s.title}</div>
        <div class="muted" style="font-size:12px">${s.artist}</div>
      </div>
      <div class="muted">${formatTime(s.duration)}</div>
    `;
    row.addEventListener('click', ()=>{ loadSong(idx); playAudio(); });
    songListEl.appendChild(row);
  })
}

function loadSong(index){
  currentIndex = index;
  audio.src = playlist[currentIndex].src;
  titleEl.textContent = playlist[currentIndex].title;
  artistEl.textContent = playlist[currentIndex].artist;
  miniTitle.textContent = playlist[currentIndex].title;
  miniArtist.textContent = playlist[currentIndex].artist;
  renderPlaylist();
  renderSongList();
}

function playAudio(){
  audio.play().catch(()=>{});
  isPlaying = true; updatePlayUI();
}
function pauseAudio(){
  audio.pause(); isPlaying = false; updatePlayUI();
}
function togglePlay(){ isPlaying? pauseAudio(): playAudio(); }

function updatePlayUI(){
  playToggle.textContent = isPlaying? '⏸' : '▶';
  centerPlay.textContent = isPlaying? '⏸' : '▶';
  renderSongList(); renderPlaylist();
}

function nextSong(){
  if (shuffle) {
    currentIndex = Math.floor(Math.random()*playlist.length);
  } else {
    currentIndex = (currentIndex+1)%playlist.length;
  }
  loadSong(currentIndex); playAudio();
}
function prevSong(){
  if (audio.currentTime>3){ audio.currentTime=0; }
  else{
    currentIndex = currentIndex===0? playlist.length-1: currentIndex-1;
    loadSong(currentIndex); playAudio();
  }
}

progress.addEventListener('input', ()=>{
  const pct = parseFloat(progress.value);
  if (!isNaN(audio.duration)){
    audio.currentTime = (pct/100)*audio.duration;
  }
});

volume.addEventListener('input', ()=>{
  audio.volume = parseFloat(volume.value)/100; isMuted=false; updateMuteUI();});

muteBtn.addEventListener('click', ()=>{ isMuted=!isMuted; updateMuteUI(); });
function updateMuteUI(){ if (isMuted){ audio.muted=true; muteBtn.textContent='🔈'; } else { audio.muted=false; muteBtn.textContent='🔊'; }}

shuffleBtn.addEventListener('click', ()=>{ shuffle=!shuffle; shuffleBtn.style.color = shuffle? '#06b6d4':''; });
repeatBtn.addEventListener('click', ()=>{ repeat=!repeat; repeatBtn.style.color = repeat? '#06b6d4':''; });

prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);
playToggle.addEventListener('click', togglePlay);
centerPlay.addEventListener('click', togglePlay);

// audio events
audio.addEventListener('timeupdate', ()=>{
  curTime.textContent = formatTime(audio.currentTime);
  if (!isNaN(audio.duration)){
    const pct = (audio.currentTime/audio.duration)*100; progress.value = pct; durTime.textContent = formatTime(audio.duration);
  }
});

audio.addEventListener('loadedmetadata', ()=>{ durTime.textContent = formatTime(audio.duration); });

audio.addEventListener('ended', ()=>{
  if (repeat){ audio.currentTime=0; playAudio(); }
  else nextSong();
});

// UI helpers
function openMobileSidebar(){ sidebar.classList.add('open'); overlay.classList.remove('hidden'); }
function closeMobileSidebar(){ sidebar.classList.remove('open'); overlay.classList.add('hidden'); }
menuBtn.addEventListener('click', openMobileSidebar);
closeSidebar && closeSidebar.addEventListener('click', closeMobileSidebar);
overlay.addEventListener('click', closeMobileSidebar);

// init
loadSong(0);
audio.volume = 0.7;
renderPlaylist();
renderSongList();

// keyboard space toggles play/pause for convenience
window.addEventListener('keydown', (e)=>{ if (e.code==='Space' && document.activeElement.tagName !== 'INPUT'){ e.preventDefault(); togglePlay(); } });

