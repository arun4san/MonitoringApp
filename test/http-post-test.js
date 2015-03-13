/**
 * Created by aruns on 12/3/15.
 */


var querystring = require('querystring');
var http = require('http');


function postData(codestring, url,port,path) {

    // Build the post string from an object
    var post_data = querystring.stringify({
        'compilation_level' : 'ADVANCED_OPTIMIZATIONS',
        'output_format': 'json',
        'output_info': 'compiled_code',
        'warning_level' : 'QUIET',
        'data' : codestring
    });

    // An object of options to indicate where to post to
    var post_options = {
        host: url,
        port: port,
        path: path,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': post_data.length
        }
    };

    // Set up the request
    var post_req = http.request(post_options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log('Response: ' + chunk);
        });
    });

    // post the data
    post_req.write(post_data);
    post_req.end();

}

var testData = "*GS16,351535054835996,092409221014,,SYS:G79;V0.65;V1.0.2,GPS:A;10;N13.0822507;E77.8812042;0;0;26;0.89;1.14,COT:539183,ADC:13.90;3.83,DTT:123000;;;;4100F00;1,OBD:04410C0B4604410C0B3403410D0003410D0004411002DA03410B3903410F6E03412F9E0341044D0341044E04413110A50441310F7E03415101044121000004412100000341463F034111240341110D#"

var url = "0.0.0.0"
var port = 4000
var path = "/data"


// for testing http protocol post data
postData(testData,url,port,path)