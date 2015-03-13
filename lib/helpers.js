

var moment = require('moment');
var EM = {};
module.exports = EM;

EM.getDevice = function(deviceStr,cb)
{

    if(deviceStr && deviceStr.length > 2){

        cb(null,deviceStr.substr(1,deviceStr.length - 1));
    }else{
        console.log("device not defined in the data.")
        cb(null,"-");
    }

}


EM.parseDate = function(dateStr,cb)
{
        var date = null;
        if(dateStr){
            date = moment(dateStr, "hhmmssDDMMYY").format("YYYY-MM-DD hh:mm:ss");
            console.log(date);
            cb(null,date)
        }else{
            console.log("date not defined in the data.")
            cb(null,"-")
        }

}


//GPS:A;10;N31.240240;E121.581272;0;0;26;0.89;1.14,

EM.parseLatLong = function(latlongStr,field,cb){
    var latlongArray = null;
    var latlongObj = {}
    console.log("lat..",latlongStr)
    if(latlongStr){
        latlongArray = latlongStr.split(";");

        if(latlongArray.length > 4){

            latlongObj.lat = latlongArray[2].substr(1,latlongArray[2].length - 1);
            latlongObj.long = latlongArray[3].substr(1,latlongArray[3].length - 1);

        }
        cb(null,latlongObj[field])
    }else{

        latlongObj.lat = 0;
        latlongObj.long = 0;
        cb(null,latlongObj[field])
    }

}


// speed identifier 410D
EM.parseSpeed = function(speedStr,cb){

    var speedarray = speedStr.split("410D");

    console.log("Speed value has ",speedarray.length)
    if(speedarray && speedarray.length >1){

        var speed = speedarray[speedarray.length - 1].substr(0,2);

        cb(null,h2d(speed))
    }else{
        console.log("speed not found..")
        cb(null,0)
    }

}

function h2d(h){
    return parseInt(h,16);
}


