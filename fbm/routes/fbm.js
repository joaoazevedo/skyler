var express = require('express');
var conf = require('configure');
var parser = require('body-parser');
var router = express.Router();


router.use(parser.json());

router.route('/_status')
    .get(function (req, res) {
        console.log(conf.fbm.desc + ' - status check');
        res.status(200).set('Content-Type', 'application/json').json({status: 'ok'});
    });

router.route('/')
    .get(function (req, res) {
        if (conf.fb.allow_verify === true) {
            if (req.query['hub.mode'] === 'subscribe' &&
                req.query['hub.verify_token'] === conf.fb.verify_token) {
                console.log(conf.fbm.desc + ' - Successful webhook validation');
                res.status(200).send(req.query['hub.challenge']);
            } else {
                console.error(conf.fbm.desc + ' - Failed webhook validation');
                res.sendStatus(403);
            }
        } else {
            console.error(conf.fbm.desc + ' - Webhook validation not enabled');
            res.sendStatus(500);
        }
    })

    .post(function (req, res) {
        var data = req.body;

        console.log('Req:');
        console.log(req.body);

        // Make sure this is a page subscription
        if (data.object === 'page') {

            // Iterate over each entry - there may be multiple if batched
            data.entry.forEach(function(entry) {

                console.log('Entry:');
                console.log(entry);

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