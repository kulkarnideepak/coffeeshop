var express = require("express");
var app = express();
app.configure(function(){
app.use(express.bodyParser());
});
require('./routes')(app);
app.listen(8080);
console.log("Listening on port 8080");
