# Web service to find nearest coffee shop from a given address

This service provides multiple APIs to manage coffee shops in an area and also provides and API which when given an address, finds nearest coffee shop by straight line distance.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Quick installation

Ensure that you have npm 6.11.0 or later installed on your computer. Code for coffee shop app can be downloaded from github. Once downloaded, use following command to download dependencies and getting the server ready to start.

```
npm install
```

After the dependencies are installed, start the server using following command. Please note that in order to be able to successfully invoke Google Maps APIs, you will need to [obtain a Google API Key](https://developers.google.com/maps/documentation/geocoding/start#get-a-key) for Maps 

```
node server.js --googleAPIKey YOUR-API-KEY
```

Once server is started the REST API endpoints will be available at following URL 

```
http://localhost:8080
```

### Coffee shop service provides following endpoints

#### Create
Accepts name, address, latitude, and longitude, adds a new coffee shop to the data set, and returns the id of the new coffee shop.

```js
Create a coffee shop 
POST coffeeshops/v1
Request
	Request Body
	json payload as follows:
	{
		"id": "32",
		"name": "Philz Coffee",
		"address": "300 Folsom St",
		"latitude": "37.78867984",
		"longitude": "-122.3928865"
	}

Response
	200 OK if the coffee shop is created successfully. Also an id of the coffee shop just created.
```

#### Read
Accepts an id and returns the id, name, address, latitude, and longitude of the coffee shop with that id, or an appropriate error if it is not found.

```js
Find a coffee shop by Id
GET coffeeshops/v1/:id
Request
	Request Path Param 
	id : id of a coffee shop being requested
	
Response
	200 OK if the coffee shop is created successfully. Also an json of the coffee shop.
	json response as follows:
	{
		"id": "32",
		"name": "Philz Coffee",
		"address": "300 Folsom St",
		"latitude": "37.78867984",
		"longitude": "-122.3928865"
	}
	
	404 Not Found: If the coffee shop with given id is not found
```

#### Update
Accepts an id and new values for the name, address, latitude, or longitude fields, updates the coffee shop with that id, or returns an appropriate error if it is not found.
```js
Update a coffee shop
PUT coffeeshops/v1/:id
Request
	Request Path Param
	id : id of a coffee shop being deleted
	
	Request Query Param 
	name: New name for the coffee shop
	address: New address of the coffee shop
	latitude: New latitude coordinate for the coffee shop
	longitude: New longitude coordinate for the coffee shop
	
Response
	200 OK if the coffee shop is updated successfully. Also json object with newly updated information.
	json response as follows:
	{
		"id": "32",
		"name": "Philz Coffee",
		"address": "300 Folsom St",
		"latitude": "37.78867984",
		"longitude": "-122.3928865"
	}
	
	404 Not Found: If the coffee shop with given id is not found
```

#### Delete
Accepts an id and deletes the coffee shop with that id, or returns an error if it is not found
```js
Delete a coffee shop 
DELETE coffeeshops/v1/:id
Request
	Request Path Param 
	id : id of a coffee shop being deleted
	
Response
	200 OK if the coffee shop is deleted successfully. Also an id of the coffee shop just deleted.
	json response as follows:
	{
		"id": "32"
	}
	
	404 Not Found: If the coffee shop with given id is not found
```

#### Find nearest
Accepts an address and returns the closest coffee shop by straight line distance.
For example, based upon the initial data set, if the user passes in an address of "535 Mission St., San Francisco, CA", the correct response from your server should be Red Door Coffee (id: 16). Another example, using the address "252 Guerrero St, San Francisco, CA 94103, USA", would return Four Barrel Coffee.

```js
Find a nearest coffee shop 
GET coffeeshops/v1/findNearest
Request
	Request Query Param 
	address : Address of the location from where we want to find nearest coffee shop
	
Response
	200 OK. Also a json object of the nearest coffee shop
	json response as follows:
	{
		"id": "32",
		"name": "Philz Coffee",
		"address": "300 Folsom St",
		"latitude": "37.78867984",
		"longitude": "-122.3928865"
	}
	
	500 Internal Error: For any other error
```
