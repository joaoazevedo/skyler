var express = require('express');
var request = require('request');
var conf = require('configure');
var parser = require('body-parser');
var mongo = require('mongodb').MongoClient;

/********************************************************/
/****** Skyler configuration and initialization *********/
/********************************************************/

var app = express();
var fork = require('child_process').fork;
var child = [];
var db;

process.on('uncaughtException', function(err) {
    console.log('app.uncaughtException()', 'err', true, true, null, err.stack || err.message);
});

process.on('SIGTERM', function () {
    console.log('killing', child.length, 'child processes');
    child.forEach(function(process) {
        process.kill();
    });
});

app.use(parser.json());
app.disable('x-powered-by');
app.disable('etag');

//mongo.connect('mongodb://' + conf.mongo.user + ':' + conf.mongo.pwd + '@'+
//    conf.mongo.server + ':' + conf.mongo.port + '/' + conf.mongo.db, function(err, database) {
//    if (err) return console.log(err);
//    db = database;

    // Start server listening
    app.listen(conf.core.port, function(){
        console.log(conf.core.desc + ' is listening on port ' + conf.core.port);
    });
//});


/********************************************************/
/************** Facebook Messenger API ******************/
/********************************************************/
child.push(fork('./fbm/app.js'));


app.post('/user', function(req, res) {
    if (!req.body) return res.sendStatus(400);
    else {
        console.log('POST user:');
        console.log(req.body);
        res.sendStatus(200);
    }
});

app.get('*', function(req, res) {
    console.log(req.path);
    res.status(404);
    res.send('404 - Not Found');
});
