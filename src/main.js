import "./style.css";

document.querySelector("#app").innerHTML = `
  <div class="container">
      <h1>Youtube to MP3</h1>
      <form>
          <input type="text" name="url" placeholder="Enter Youtube URL">
          <button type="submit">Download</button>
      </form>
  </iframe>
  </div>
`;

const form = document.querySelector("form");

const handleVideoData = (data) => {
  const videoTitle = document.createElement("h2");
  const videoThumbnail = document.createElement("img");

  videoTitle.textContent = data.title;
  videoThumbnail.src = data.thumbnail_url;

  document.body.appendChild(videoTitle);
  document.body.appendChild(videoThumbnail);
};

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const url = e.target[0].value;
  const urlMetadata =
    `https://www.youtube.com/oembed?url=` + url + `&format=json`;

  const res = await fetch(`http://localhost:8082/get-video-info?url=${url}`, {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error("Network response was not ok");
  }

  let reader = res.body.getReader();
  let chunks = [];
  let done = false;

  while (!done) {
    const { value, done: readerDone } = await reader.read();
    chunks.push(value);
    done = readerDone;
  }

  const audioBlob = new Blob(chunks, { type: "audio/mpeg" });
  const audioUrl = URL.createObjectURL(audioBlob);
  const a = document.createElement("a");
  a.href = audioUrl;
  a.download = "video.mp3";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});
