import './style.css';

document.querySelector('#app').innerHTML = `
  <div class="container">
      <h1>Youtube to MP3</h1>
      <form>
          <input type="text" name="url" placeholder="Enter Youtube URL">
          <button type="submit">Search</button>
      </form>
      <div class="video-info"></div>
  </iframe>
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
  console.log(metadata);
  const videoTag = document.querySelector('.video-info');

  videoTag.innerHTML = `
    <h1>${metadata.title}</h1>
    <img src="${metadata.thumbnail_url}" alt="${metadata.title}">
    <button class="download-btn">Download</button>
  `;

  videoTag.querySelector('.download-btn').addEventListener('click', () => {
    downloadMusic(url, metadata);
  });
};

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const url = e.target[0].value;
  const metadata = await fetch(
    `http://localhost:8082/get-metadata?url=${url}`,
    {
      method: 'GET',
    }
  );

  if (!metadata.ok) {
    throw new Error('Network response was not ok');
  }

  handleVideoMetadata(url, await metadata.json());
});
