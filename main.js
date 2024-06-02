import './style.css';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

document.querySelector('#app').innerHTML = `
  <div>
    <h1>Music Saver</h1>
    <form id="musicForm">
      <label for="author">Author Name:</label>
      <input type="text" id="author" name="author" required>
      <label for="lyrics">Song Lyrics:</label>
      <textarea id="lyrics" name="lyrics" rows="10" required></textarea>
      <button type="submit">Save Song</button>
    </form>
    <h2>Saved Songs</h2>
    <div id="musicList"></div>
  </div>
`;

async function loadMusic() {
  const { data, error } = await supabase
    .from('music')
    .select();
  if (error) {
    console.error('Error loading songs:', error);
  } else {
    const musicList = document.getElementById('musicList');
    musicList.innerHTML = '';
    data.forEach(music => {
      const musicItem = document.createElement('div');
      musicItem.className = 'music-item';
      musicItem.innerHTML = `<strong>${music.author}</strong><p>${music.lyrics}</p>`;
      musicList.appendChild(musicItem);
    });
  }
}

document.getElementById('musicForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const author = document.getElementById('author').value;
  const lyrics = document.getElementById('lyrics').value;

  const { data, error } = await supabase
    .from('music')
    .insert([{ author, lyrics }]);
  if (error) {
    console.error('Error saving song:', error);
  } else {
    document.getElementById('musicForm').reset();
    loadMusic();
  }
});

loadMusic();
