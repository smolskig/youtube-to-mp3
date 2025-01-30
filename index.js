
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

   
    return fetch(urlMetadata, { method: 'GET'}).then((response) => {
        if(!response.ok) {
            throw new Error('Network response was not ok');
        }

        return response.json()
    })
    .then(data =>handleVideoData(data))
    .catch((error) => {
        console.error('Error:', error);
    });
});