//-- Initialize express 
var express = require("express");
var app = express();
app.configure(function(){
app.use(express.bodyParser());
});

//-- URL Route speficiation
require('./routes')(app);

//-- Start the service
app.listen(8080);
console.log("Coffee shop service started on port 8080");
console.log("========================================")