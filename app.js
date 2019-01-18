var express = require('express');
var bodyParser = require('body-parser');
var firebase = require('firebase');

var app = express();

var config = {
  apiKey: "AIzaSyBJAhwBEiZyDYVjByBQPWun1fV1QM3TEsE",
  authDomain: "webhook-apm.firebaseapp.com",
  databaseURL: "https://webhook-apm.firebaseio.com",
  projectId: "webhook-apm",
  storageBucket: "webhook-apm.appspot.com",
  messagingSenderId: "15525308833"
};
firebase.initializeApp(config);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function (req, res) {
  
  console.log("HTTP Get Request");
	var webhookRef = firebase.database().ref("/webhookAPM");

	//Attach an asynchronous callback to read the data
	webhookRef.on("value", 
			  function(snapshot) {
					res.json(snapshot.val());
					webhookRef.off("value");
					}, 
			  function (errorObject) {
					console.log("The read failed: " + errorObject.code);
					res.send("The read failed: " + errorObject.code);
			 })
});

app.post("/webhook-apm", function(req,res,next){
  console.log("incoming webhook at "+ new Date());

  var body = req.body;
  body.date = new Date();

  if(body && body.resource && body.resource.payment_id)
    firebase.database().ref('/webhookAPM').child(body.resource.payment_id).set(body);
  console.log("stored ")

})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // render the error page
  res.status(err.status || 500);
  res.json({error : err});
});

app.listen(process.env.PORT || 3555, function(){
  console.log("Server started at port 3555");
})