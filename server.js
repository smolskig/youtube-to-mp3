
import express from "express"

var app = express();

app.use(function(req, res, next) {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Expose-Headers", 'Content-Length');
	next();
});

app.get("/get-video-info", function(req, res) {
	fetch("https://www.youtube.com/watch?v=3blvYIPb2xk", { method: 'GET'}).then(res => res.text())
	.then(res => {
		return res;
	});
});

app.listen(process.env.PORT || 8082);
console.log("Server running on port 8082");