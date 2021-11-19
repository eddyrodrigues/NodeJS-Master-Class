var express = require('express');
var app = express();

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function(req, res) {
  res.send('<html>hello world - 2');
});


//app.get()
app.get('/api/v1/', function(request, response){
  response.status(403).send("Cannot find that");
  //response.send("Status " + request.statusCode + " " + request.json + "</br>" + response.json + " "  );
  //response.sendStatus(400);
  //response.statusCode = 400;
})



app.listen(33000);