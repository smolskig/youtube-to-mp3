import './style.css'

document.querySelector('#app').innerHTML = `
  <div class="container">
      <h1>Youtube to MP3</h1>
      <form>
          <input type="text" name="url" placeholder="Enter Youtube URL">
          <button type="submit">Download</button>
      </form>
  </iframe>
  </div>
`


const form = document.querySelector('form');

const handleVideoData = (data) => {
    const videoTitle = document.createElement('h2')
    const videoThumbnail = document.createElement('img')
    
    videoTitle.textContent = data.title;
    videoThumbnail.src = data.thumbnail_url;

    document.body.appendChild(videoTitle);
    document.body.appendChild(videoThumbnail);
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const url = e.target[0].value;
    const urlMetadata = `https://www.youtube.com/oembed?url=` + url + `&format=json`;

    fetch(`http://localhost:8082/get-video-info?url=${url}`, { method: 'GET'}).then(res => console.log(res))
    
    // return fetch(urlMetadata, { method: 'GET'}).then((response) => {
    //     if(!response.ok) {
    //         throw new Error('Network response was not ok');
    //     }

    //     return response.json()
    // })
    // .then(data =>handleVideoData(data))
    // .catch((error) => {
    //     console.error('Error:', error);
    // });
});
