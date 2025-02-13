
import express from "express"
import ytdl from "ytdl-core";
import cors from "cors";

var app = express();
app.use(cors())

app.get("/get-metadata", async function(req, res) {
    const url = req.query.url;
    const info = await ytdl.getInfo(url);
    const videoData = {
        title: info.videoDetails.title,
        thumbnail_url: info.videoDetails.thumbnails[0].url
    };

    res.json(videoData);
})

app.get("/get-audio", function(req, res) {
    const url = req.query.url;
    res.setHeader('Content-Type', 'audio/mpeg');
    const videoStream = ytdl(url, { filter: 'audioonly'});

    videoStream.pipe(res);

    videoStream.on('error', (err) => {
        console.error('Error streaming video:', err);
        res.status(500).send('Error streaming video');
    });
});

app.listen(process.env.PORT || 8082);
console.log("Server running on port 8082");