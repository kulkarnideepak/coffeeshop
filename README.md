# Web service to find nearest coffee shop from a given address

This service provides multiple APIs to manage coffee shops in an area and also provides and API which when given an address, finds nearest coffee shop by straight line distance.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Quick installation

Ensure that you have npm 2.7.0 or later installed on your computer. Code for coffee shop app can be downloaded from github. Once downloaded, use following command to download dependencies and getting the server ready to start.

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

Coffee shop service provides following endpoints

```js
Create a coffee shop POST coffeeshop/v1
Request
	Request Body
	A json payload as follows:
	{
		"id": "32",
		"name": "Philz Coffee",
		"address": "300 Folsom St",
		"latitude": "37.78867984",
		"longitude": "-122.3928865"
	}

Response
	200 OK if the coffee shop is created successfully. Also an id of the coffee shop just created.
	
