'use strict';

var express = require('express'),
    serveStatic = require('serve-static'),
    app = express();

var port = 8080,
    args = process.argv.slice(2);

if (args[0] === '-p' && args[1].match(/\d{4}/)) {
  port = args[1];
} else {
  console.log('Bad port. Using default port (8080).');
}

app.use(serveStatic(__dirname + '/public'));

app.get('*', function(req, res) {
  if (req.originalUrl !== '/') {
    res.redirect('/#' + req.originalUrl);
  }
});

app.listen(port, function() {
  console.log('Server launched. Port ' + port);
});
