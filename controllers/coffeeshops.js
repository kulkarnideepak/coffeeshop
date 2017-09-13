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

exports.findAll = function(req, res) {
	console.log(map);
	res.send(map);
	res.end();
};

// -- Given an id, return details of coffee shop with matching id
exports.findById = function(req, res) {
	var id = req.params.id;
	console.log("Find a coffeeshop with id " + id);
	if(map.has(id)){
		var obj = map.get(id);
		console.log(obj);
		res.send(map.get(id));
		res.end();
	}else{
		console.log("Coffeeshop with id " + id + " not found");
		res.status(404).json({"error":"Coffee Shop with id " + id + " not Found"});
		res.end;
	}
};

// -- Create a new coffee shop
exports.add = function(req, res) {
	console.log("Creating coffeeshop");
	var obj = req.body;
	var id = Math.floor(Math.random()*1000000000).toString();
	while(map.has(id)){
		//-- ensure that we are not generating a duplicate id
		id = Math.floor(Math.random()*1000000000);
	}
	console.log("Generated new id " + id);
	obj.id = id;
	map.set(id, obj);
	console.log("New coffeeshop created");
	console.log(map.get(id));
	res.send(map.get(id));
	res.end();
};

// -- Update existing coffee shop
exports.update = function(req, res) {
	var id = req.params.id;
	console.log("Updating coffeeshop with id " + id);

	var address = req.query.address;
	var name = req.query.name;
	var latitude = req.query.latitude;
	var longitude = req.query.longitude;
	
	if(map.has(id)){
		var obj = map.get(id);
		console.log(obj);
		if(address != undefined){
			console.log("Old address: " + obj.address);
			obj.address = address;
			console.log("New address: " + obj.address);
		}
		if(name != undefined){
			console.log("Old name: " + obj.name);
			obj.name = name;
			console.log("New name: " + obj.name);
		}
		if(latitude != undefined){
			console.log("Old latitude: " + obj.latitude);
			obj.latitude = latitude;
			console.log("New latirude: " + obj.latitude);
		}
		if(longitude != undefined){
			console.log("Old longitude: " + obj.longitude);
			obj.longitude = longitude;
			console.log("New longitude: " + obj.longitude);
		}

		console.log("Coffeeshop updated");
		console.log(obj);
		map.set(id, obj);
		res.send(id);
		res.end();
		
	}else{
		console.log("Coffeeshop with id " + id + " not found");
		res.status(404).json({"error":"Coffee Shop with id " + id + " not Found"});
		res.end;
	}
};

// -- delete coffee shop by id
exports.delete = function(req, res) {
	var id = req.params.id;
	console.log("Deleting coffeeshop with id " + id);

	if(map.has(id)){
		map.delete(id);
		res.send(id);
		res.end();
	}else{
		console.log("Coffeeshop with id " + id + " not found");
		res.status(404).json({"error":"Coffee Shop with id " + id + " not Found"});
		res.end;
	}
};

exports.findNearest = function(req, res) {
	var address = req.query.address;
	console.log("Find nearest coffeeshop from [" + address + "]");
	googleMapsClient.geocode({
			  address: address
		}, function(err, response) {
		  if (!err) {
			  var lat = response.json.results[0].geometry.location.lat;
			  var lng = response.json.results[0].geometry.location.lng;
			  console.log("Latitude of provided address : " + lat);
			  console.log("Longitude of provided address : " + lng);
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
			  console.log("Id of the closest coffeeshop is : " + closestId);
			  var idDetails = map.get(closestId);
			  console.log("Closest coffeeshop is : " + idDetails);
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
