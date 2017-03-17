var express = require('express');
var parser = require('body-parser');
var conf = require('configure');

// Routes
var fbm = require('./routes/fbm');

/********************************************************/
/**** Skyler FBM configuration and initialization *******/
/********************************************************/
var app = express();

process.on('uncaughtException', function (err) {
    console.log('app.uncaughtException()', 'err', true, true, null, err.stack || err.message)
});

app.disable('x-powered-by');
app.disable('etag');

app.use('/fbm', fbm);

app.listen(conf.fbm.port, function(){
    console.log(conf.fbm.desc + ' is listening on port ' + conf.fbm.port);
});