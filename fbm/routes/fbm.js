var express = require('express');
var conf = require('configure');
var parser = require('body-parser');
var router = express.Router();


router.use(parser.json());

router.route('/')
    .get(function (req, res) {
        if (req.query['hub.mode'] === 'subscribe' &&
            req.query['hub.verify_token'] === conf.fb.verify_token) {
            console.log(conf.fbm.desc + ' - Validating webhook');
            res.status(200).send(req.query['hub.challenge']);
        } else {
            console.error(conf.fbm.desc + ' - Failed validation. Make sure the validation tokens match.');
            res.sendStatus(403);
        }
    })

    .post(function (req, res) {
        var data = req.body;

        console.log('Req:' + req.body);

        // Make sure this is a page subscription
        if (data.object === 'page') {

            // Iterate over each entry - there may be multiple if batched
            data.entry.forEach(function(entry) {

                console.log('Entry:' + entry);

                var pageID = entry.id;
                var timeOfEvent = entry.time;

                // Iterate over each messaging event
                entry.messaging.forEach(function(event) {
                    if (event.message) {
                        receivedMessage(event);
                    } else {
                        console.log(conf.fbm.desc + ' - Webhook received unknown event: ', event);
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

module.exports = router;

function receivedMessage(event) {
    // Putting a stub for now, we'll expand it in the following steps
    console.log(conf.fbm.desc + ' - Message data: ', event.message);
}