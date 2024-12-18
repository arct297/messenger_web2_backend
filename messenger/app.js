var http = require('http');
var url = require('url');

// custom module, example of using:
var dt = require('./dt');
console.log(`${dt.GetDateTime()}`)


http.createServer(function (req, res) {    
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.write(req.url);

    // How to get query params:
    // var q = url.parse(req.url, true).query;
    // var txt = q.year + " " + q.month;
    // res.write(txt);
    
    res.end();
}).listen(8080);