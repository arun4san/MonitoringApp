/* Required Modules */
var async = require('async');
var mqtt    = require('mqtt');
var util = require('./lib/helpers.js');
var config = require('./config.js').deviceMsgConfig;
/*Module Variables*/



   var handleRawData = function(topic , message) {


       var parsedStr = null;
       var jsonData = {};
       var data = message.toString();
       console.log("message....",message.toString())
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

                       //emitting into socket io client

                       io.to("livestreams").emit('clientMessage', dataObj)

                       dataObj.data = data
                       db.rawdata.save(dataObj, function (err, doc) {

                           var updateObj = {
                               deviceId: dataObj.deviceId
                           };
                           var setter = { $set: { ts: dataObj.ts, lat: dataObj.lat, long: dataObj.long, speed: dataObj.speed } }

                           db.livedata.update(updateObj, setter, true, function (err, post) {

                               console.log("parse data...", dataObj)
                           })

                       })

                   })

               }


           } else {
               console.log("not valid..")
           }


       } catch (err) {
           console.log("error occurred in parsing live data.. ", err)
       }
    };


module.exports =   {

    handleRawData : handleRawData
}