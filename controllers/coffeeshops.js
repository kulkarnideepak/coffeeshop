var fs = require("fs");
const csv=require("csvtojson");
const dataFileName = "./locations.csv";

//-- Read Google API key as a command line argument and initialize GoogleMapsClient
var argv = require('minimist')(process.argv.slice(2));
console.log(argv['googleAPIKey']);
const googleAPIKey = argv['googleAPIKey'];

var googleMapsClient = require('@google/maps').createClient({
	  key: googleAPIKey
	});

//-- Store contents of existing coffeeshop details from a file into a Map
var map = new Map();
fs.readFile(dataFileName, 'utf8', function (err, data) {
	csv({noheader:true, headers: ['id', 'name', 'address', 'latitude', 'longitude']})
	.fromString(data)
	.on('json', (jsonObj)=>{
		map.set(jsonObj.id, jsonObj);
	})
	.on('done',()=>{
		console.log("Parsing done");
	})
});

// -- Get the list of all coffee shops
exports.findAll = function(req, res) {  
	res.send(map);
	res.end();
};

// -- Given an id, return details of coffee shop with matching id
exports.findById = function(req, res) {
	if(map.has(req.params.id)){
		res.send(map.get(req.params.id));
		res.end();
	}else{
		console.log("Record not found");
		res.status(404).json({"error":"Coffee Shop Not Found"});
		res.end;
	}
};

// -- Create a new coffee shop
exports.add = function(req, res) {
	console.log(req.body);

	var id = Math.floor(Math.random()*1000000000);
	while(map.has(id)){
		id = Math.floor(Math.random()*1000000000);
	}
	req.body.id = id;
	map.set(id, req.body);
	res.send(map.get(id));
	res.end();
};

// -- Update existing coffee shop
exports.update = function(req, res) {
	var id = req.params.id;
	var address = req.query.address;
	var name = req.query.name;
	var latitude = req.query.latitude;
	var longitude = req.query.longitude;
	
	console.log(name);
	console.log(address);
	
	if(map.has(id)){
		var obj = map.get(id);
		console.log(obj);
		if(address != undefined){
			obj.address = address;
		}
		if(name != undefined){
			obj.name = name;
		}
		if(latitude != undefined){
			obj.latitude = latitude;
		}
		if(longitude != undefined){
			obj.longitude = longitude;
		}
		console.log(obj);
		map.set(id, obj);
		res.send(req.params.id);
		res.end();
		
	}else{
		console.log("Record not found");
		res.status(404).json({"error":"Coffee Shop Not Found"});
		res.end;
	}
};

// -- delete coffee shop by id
exports.delete = function(req, res) {
	if(map.has(req.params.id)){
		map.delete(req.params.id);
		res.send(req.params.id);
		res.end();
	}else{
		console.log("Record not found");
		res.status(404).json({"error":"Coffee Shop Not Found"});
		res.end;
	}
};

exports.findNearest = function(req, res) {
	var address = req.query.address;
	console.log(address);
	googleMapsClient.geocode({
			  address: address
		}, function(err, response) {
		  if (!err) {
			  var lat = response.json.results[0].geometry.location.lat;
			  var lng = response.json.results[0].geometry.location.lng;
			  console.log(lat);
			  console.log(lng);
			  var closestDist = -1;
			  var closestId = 0;
			  for (var [key, value] of map) {
				  var ilat = value.latitude;
				  var ilng = value.longitude;
				  var dist = Math.sqrt(Math.pow(Math.abs(lat - ilat), 2) + Math.pow(Math.abs(lng - ilng), 2))*10;
				  
				  if(closestDist == -1){
					  closestDist = dist;
					  closestId = key;					  
				  }
				  
				  if(dist < closestDist){
					  closestDist = dist;
					  closestId = key;
				  }
			  }
			  var idDetails = map.get(closestId);
			  console.log(idDetails);
			  res.send(map.get(closestId));
			  res.end();
		  }else{
			  console.log("Error occured");
			  console.log(err.json.error_message);
			  res.status(500).json({"error":err.json.error_message});
			  res.end;
		  }
		});
};
