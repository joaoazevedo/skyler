var express = require('express');
var conf = require('configure');

// Routes
var roomba = require('./routes/roomba');

/********************************************************/
/**** Skyler Roomba configuration and initialization ****/
/********************************************************/
var app = express();

process.on('uncaughtException', function (err) {
    console.log('app.uncaughtException()', 'err', true, true, null, err.stack || err.message)
});

app.disable('x-powered-by');
app.disable('etag');

app.use('/', roomba);

app.listen(conf.roomba.port, function(){
    console.log(conf.roomba.desc + ' is listening on port ' + conf.roomba.port);
});