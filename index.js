var express = require('express')
var request = require('request')
var conf = require('configure')
var body = require('body-parser')
var app = express()

app.use(body.json())

// FB Messenger Webhook test
app.get('/webhook', function(req, res) {
  if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === config.fb.verify_token) {
    console.log("Validating webhook");
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403);          
  }  
});

// FB Messenger webhook
app.post('/webhook', function (req, res) {
  var data = req.body;

  console.log("***Data:\n"+data.object);

  // Make sure this is a page subscription
  if (data.object === 'page') {

    // Iterate over each entry - there may be multiple if batched
    data.entry.forEach(function(entry) {
      var pageID = entry.id;
      var timeOfEvent = entry.time;

      // Iterate over each messaging event
      entry.messaging.forEach(function(event) {
        if (event.message) {
          receivedMessage(event);
        } else {
          console.log("Webhook received unknown event: ", event);
        }
      });
    });

    // Assume all went well.
    //
    // You must send back a 200, within 20 seconds, to let us know
    // you've successfully received the callback. Otherwise, the request
    // will time out and we will keep trying to resend.
    res.sendStatus(200);
  }
});
  
function receivedMessage(event) {
  // Putting a stub for now, we'll expand it in the following steps
  console.log("Message data: ", event.message);
}

// 
app.get('/', function (req, res) {
  res.send('Hello World!!! How can I serve you?')
})

// Start listening on server port
app.listen(conf.server_port, function(){
    console.log('Butler is listening on port ' + conf.server_port);
});

