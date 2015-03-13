var config = require('./config');
var mqtt    = require('mqtt');
var async = require('async');
var dataHandler  = require('./mqtt_subscriber.js');
var socketIOOperations = function(socket){
    console.log("Socket IO Connected ");

    socket.on('join', function(rName){
        console.log(rName);
        socket.join(rName);
    });

    socket.on('room', function(obj){
        console.log("ROOM ", obj);
        io.to(obj.roomName).emit(obj.topic, obj.message)
    });

    socket.on('leave', function(rName){
        console.log("Joint Request Details ", arguments);
    });

    socket.on('message', function(message){
        console.log("On Message", message)
    });

    socket.on('disconnect', function () {

        socket.emit('disconnected', socket.id);


    });
};

/* for Mosquitto broker currently using common online testing mosquitto broker.
 if you installed mosquitto broker in your server please use your server name and port as given below.*/

//var client  = mqtt.connect(config.mqtt.port,config.mqtt.host);

var client = mqtt.connect('mqtt://test.mosquitto.org');

    async.series({
        http:function(selfCB){
            var XPressIO = require('xpressio');
            var xpress = new XPressIO(config.http).start();
            var app = global.app = xpress.app;
            var io = global.io = xpress.io;
            io.on('connection', socketIOOperations)
            setTimeout(selfCB, 2000);
        },
        mongoDB : function(selfCB){
            var mongo = global.mongo = require('mongodb-wrapper')
            var db = global.db = mongo.db(config.database.url)
            var ObjectId = global.ObjectId = mongo.ObjectID

            db.collection('rawdata')
            db.collection('livedata')
            setTimeout(selfCB, 2000);

        }

    }, function(initStatus){
        console.log(global.mongo.ObjectID())
        require('./routes/http-routes')(global.app);

       // Mqtt Subscriber
        client.subscribe(config.mqtt.topic);

         client.on('message', function (topic, message) {

             dataHandler.handleRawData(topic, message)

         })

    })





