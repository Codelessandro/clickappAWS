var express = require('express');
var app = express();
var referrerPolicy = require('referrer-policy')
var bodyParser = require('body-parser')
const snsPublish = require('aws-sns-publish');

app.use(referrerPolicy({ policy: 'unsafe-url' }))
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

let requests = []


app.post('/screenshot', function(req, res) {
	snsPublish('Hello World', {arn: 'arn:aws:sns:us-east-2:154100690340:screenshot'}).then(messageId => {
    		console.log(messageId);
	});
	requests.push({"name" : req.body.name, "email" : req.body.email, "title" : req.body.title, "message" : req.body.message})
	res.send(JSON.stringify({ url: "http://personal.psu.edu/xqz5228/jpg.jpg" }));
})


app.get('/url', function(req,res) {
	res.setHeader('Content-Type', 'application/json');
	res.send(JSON.stringify({ requests: requests}));
})

let port = 3000;
app.listen(port, function(){
	console.log("server running")
});

