
import express from "express"
import ytdl from "ytdl-core";
import fs from "fs";

var app = express();

app.use(function(req, res, next) {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Expose-Headers", 'Content-Length');
	next();
});

app.get("/get-video-info", function(req, res) {
    const url = req.query.url;
    console.log(`Fetching video from: ${url}`);

    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Content-Disposition', 'attachment; filename="video.mp4"');
    const videoStream = ytdl(url, { filter: 'audioandvideo'});

    videoStream.pipe(res);

    videoStream.on('error', (err) => {
        console.error('Error streaming video:', err);
        res.status(500).send('Error streaming video');
    });
});

app.listen(process.env.PORT || 8082);
console.log("Server running on port 8082");