var express = require('express');
var conf = require('configure');

// Routes
var fbm = require('./routes/fbm');

/********************************************************/
/**** Skyler FBM configuration and initialization *******/
/********************************************************/
var app = express();
var server = require('http').createServer(app);
app.set('port', conf.fbm.port);

process.on('uncaughtException', function (err) {
    console.log('app.uncaughtException()', 'err', true, true, null, err.stack || err.message)
});

app.disable('x-powered-by');
app.disable('etag');

app.use('/', fbm);

server.listen(app.get('port'), function(){
    console.log(conf.fbm.desc + ' is listening on port ' + conf.fbm.port);
});