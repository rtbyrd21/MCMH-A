var express = require('express');
var app = express();
var path = require('path');

var cacheTime = 86400000*7; 

app.use("/scripts", express.static(__dirname + '/scripts'));
app.use("/styles", express.static(__dirname + '/styles'));
app.use("/images", express.static(__dirname + '/images', { maxAge: cacheTime }));
app.use("/partials", express.static(__dirname + '/partials'));


// viewed at http://localhost:8080
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});



app.listen(8080);