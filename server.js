var port = 8090;
var express = require('express');
var app = express();
var path = require('path');
var mongojs = require('mongojs');
var db = mongojs('players',['players']);
var bodyParser = require('body-parser');

app.use(express.static(path.join(__dirname + "/public")));
app.use(bodyParser.json());

app.get('/login/:name/:pass', function(req,res) {
    let login = req.params.name;
    let password = req.params.pass;
    db.players.findOne({name: login, pass: password},function (err,docs) {
        res.json(docs);
    });
});

app.get('/login/:name', function(req,res) {
    let login = req.params.name;
    db.players.findOne({name: login},function (err,docs) {
        res.json(docs);
    });
});

app.get('/load/:playerId', function(req,res) {
    let id = req.params.playerId;
    db.players.findOne({_id: mongojs.ObjectId(id)},function (err,docs) {
        res.json(docs.state);
    });
});


app.post('/players', function (req, res) {
    db.players.insert(req.body, function (err, doc){
        res.json(doc);  
    });
});

app.get('/getScore', function(req,res){
    db.players.find({},{_id:0,name:1,score:1}, function(err,docs){
        res.json(docs);
    });
    
});

app.get('/playerScore/:playerId', function(req,res) {
    let id = req.params.playerId;
    db.players.findOne({_id: mongojs.ObjectId(id)},function (err,docs) {
        res.json(docs.score);
    });
});

app.put('/updateScore/:playerId', function(req,res) {
    let id = req.params.playerId;
    db.players.findAndModify({
        query: { _id: mongojs.ObjectId(id)},    
        update: { $set:{score: req.body}},   
        new: true },
        function (err, doc) {
            res.json(doc);
    });
});

app.put('/save/:playerId', function(req,res) {
    let id = req.params.playerId;
    db.players.findAndModify({
        query: { _id: mongojs.ObjectId(id)},    
        update: { $set: {state: req.body}},   
        new: true },
        function (err, doc) {
            res.json(doc);
    });
});

app.all('/*', function(req, res) {
    res.sendFile('index.html', { root: __dirname + '/public' });
});

app.listen(port);
console.log("tttServer is running at port: "+ port);