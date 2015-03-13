/**
 * Created by aruns on 11/3/15.
 */


var config = {
    http: {
        port : 4000,
        viewPath : __dirname + '/views', //Template Engine
        publicPath :__dirname + '/public', //Public Folder (Javascript, CSS)
        sessionStore : true,
        socketIO : true
    },
    database : {
        service : 'MONGODB',
        url : 'mongodb://0.0.0.0:12345/data_log'
    },

    /*device message fields position*/
    deviceMsgConfig : {
        deviceId : 0,
        ts : 2,
        latlong : 5,
        speed : 9
    },
    /*mqtt config*/
    mqtt: {
        service: 'mosquitto',
        host: '0.0.0.0',
        port: 1883,
        topic : 'GPSDeviceData'
    }
};


module.exports = config;