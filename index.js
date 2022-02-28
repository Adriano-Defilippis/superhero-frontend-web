var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/web'));

app.get('/*', function(req, res) {
  res.sendFile(__dirname + '/web/index.html');
});

app.listen(app.get('port'), function(err) {
  if (err) {
    console.log(err);
    return;
  }
});
