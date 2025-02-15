import './style.css';

document.querySelector('#app').innerHTML = `
<div class="root">
  <div class="container">
      <h1>Youtube to MP3</h1>
      <h3>Enter a Youtube URL to download the audio</h3>
      <form>
          <input type="text" name="url" placeholder="Enter Youtube URL">
          <button class="btn loading" type="submit">
            Search
          </button>
      </form>
      <div class="video-info"></div>
  </div>
</div>
`;

const form = document.querySelector('form');

const downloadMusic = async (url, metadata) => {
  const res = await fetch(`http://localhost:8082/get-audio?url=${url}`, {
    method: 'GET',
  });

  if (!res.ok) {
    throw new Error('Network response was not ok');
  }

  let reader = res.body.getReader();
  let chunks = [];
  let done = false;

  while (!done) {
    const { value, done: readerDone } = await reader.read();
    chunks.push(value);
    done = readerDone;
  }

  const audioBlob = new Blob(chunks, { type: 'audio/mpeg' });
  const audioUrl = URL.createObjectURL(audioBlob);
  const a = document.createElement('a');
  a.href = audioUrl;
  a.download = `${metadata.title}.mp3`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const handleVideoMetadata = (url, metadata) => {
  const videoTag = document.querySelector('.video-info');

  videoTag.innerHTML = `
      <div class="skeleton">
        <div class="skeleton-title"></div>
        <div class="skeleton-thumbnail"></div>
      </div>
  `;

  videoTag.innerHTML = `
    <h1>${metadata.title}</h1>
    <div class="video-thumbnail">
      <img src="${metadata.thumbnail_url}" alt="${metadata.title}">
    </div>
    <button class="btn download-btn">Download</button>
  `;

  videoTag.querySelector('.download-btn').addEventListener('click', () => {
    downloadMusic(url, metadata);
  });
};

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const url = e.target[0].value;
  const urlMetadata =
    `https://www.youtube.com/oembed?url=` + url + `&format=json`;

  fetch(urlMetadata, { method: 'GET' })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => handleVideoMetadata(url, data));
});
