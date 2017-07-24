var express = require('express');
var conf = require('configure');
var parser = require('body-parser');
var router = express.Router();


router.use(parser.json());

router.route('/_status')
    .get(function (req, res) {
        console.log(conf.roomba.desc + ' - status check');
        res.status(200).set('Content-Type', 'application/json').json({status: 'ok'});
    });

router.route('/')
    .post(function () {

    });

module.exports = router;