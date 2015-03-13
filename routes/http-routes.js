/**
 * Created by fox on 11/3/15.
 */

var db = global.db;
var ObjectId = global.ObjectId;
var async = require('async');
var moment = require('moment');
var _ = require('underscore');
var util = require('../lib/helpers.js');
var config = require('../config.js').deviceMsgConfig;

module.exports = function(app) {

    app.get('/', function (req, res) {

        try {
                    res.render('index', {
                        title: 'Monitoring App'
                    });


        } catch (err) {
            console.log("error occurred in rendering function.. ", err)
        }

    });

    app.get('/getAll', function (req, res) {

        try {
            db.livedata.find({},{}).toArray( function (err, live) {

                console.log(live)

                if (live && live != "") {

                    var resJson = {
                        data : live
                    }

                    res.send(resJson);

                } else {
                    var liveData = {

                        deviceId: 'GS16',
                        lat: 23.3434,
                        long: 77.5634,
                        speed: 0
                    }
                    res.send(liveData);
                }

            })

        } catch (err) {
            console.log("error occurred in rendering function.. ", err)
        }

    });


    app.post('/data', function (req, res) {

        var parsedStr = null;
        var jsonData = {};
        console.log(".........................",req.body)
        var data = req.body.data;
        jsonData.data = data
        try {

            if (data && data[0] == "*" && data[data.length - 1] == "#") {

                console.log("its valid data...")
                parsedStr = data.split(",");

                if (parsedStr && parsedStr.length >= 10) {

                    async.series({

                        deviceId: function (selfcb) {

                            util.getDevice(parsedStr[config.deviceId], selfcb)
                        },
                        ts: function (selfcb) {
                            util.parseDate(parsedStr[config.ts], selfcb)
                        },
                        lat: function (selfcb) {
                            util.parseLatLong(parsedStr[config.latlong], "lat", selfcb)
                        },
                        long: function (selfcb) {
                            util.parseLatLong(parsedStr[config.latlong], "long", selfcb)
                        },
                        speed: function (selfcb) {
                            util.parseSpeed(parsedStr[config.speed], selfcb)
                        }


                    }, function (err, dataObj) {
                        io.to("livestreams").emit('clientMessage', dataObj)
                        dataObj.data = data

                        db.rawdata.save(dataObj, function (err, doc) {

                            var updateObj = {
                                deviceId: dataObj.deviceId
                            };
                            var setter = { $set: { ts: dataObj.ts, lat: dataObj.lat, long: dataObj.long, speed: dataObj.speed } }

                            db.livedata.update(updateObj, setter, true, function (err, post) {
                                res.sendStatus(200)

                            })

                        })

                    })

                }


            } else {
                res.send("data not valid..")
                console.log("not valid..")
            }


        } catch (err) {
            console.log("error occurred in parsing live data.. ", err)
        }

    });


}






