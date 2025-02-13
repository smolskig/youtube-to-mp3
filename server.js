
import express from "express"
import ytdl from "ytdl-core";
import cors from "cors";

var app = express();
app.use(cors())

app.get("/get-video-info", function(req, res) {
    const url = req.query.url;
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Disposition', 'attachment; filename="video.mp3"');
    const videoStream = ytdl(url, { filter: 'audioonly'});

    videoStream.pipe(res);

    videoStream.on('error', (err) => {
        console.error('Error streaming video:', err);
        res.status(500).send('Error streaming video');
    });
});

app.listen(process.env.PORT || 8082);
console.log("Server running on port 8082");