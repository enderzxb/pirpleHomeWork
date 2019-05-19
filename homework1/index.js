/*
* Primary file for the API
*/

// Dependencies
const http = require('http');
const url = require('url');
const stringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');
const fs = require('fs');

//Instantiate the HTTP server
let httpServer = http.createServer(function(req, res){
  unifiedServer(req, res);
});

//Start the HTTP server
httpServer.listen(config.httpPort, function(){
  console.log(`Server up and listenig on port ${config.httpPort}`);
});

//All the server logic for both http and https Server
let unifiedServer = function(req, res){
  //Get url and parse it
    let parseUrl = url.parse(req.url, true);

  //get path
    let path = parseUrl.pathname;
    let trimedPath = path.replace(/^\/+|\/+$/g,'');

  //Get query string as an object
    let queryStringObject = parseUrl.query;

  // Get http method
    let method = req.method.toLowerCase();

  //Get headers as an object
  let headers = req.headers;

  //Get payload, if any
  let decoder = new stringDecoder('utf-8');
  let buffer = '';
  req.on('data', function(data){
    buffer += decoder.write(data);
  });
  req.on('end', function(){
    buffer += decoder.end();

    //choose the handler the request should go to. if on is not found, use the not found handler
    let chosenHandler = typeof(router[trimedPath]) !== 'undefined' ? router[trimedPath] : handlers.notFound;

    //Construct data object to send to the handler
    let data = {
       'trimedPath' : trimedPath,
       'queryStringObject' : queryStringObject,
       'method' : method,
       'headers' : headers,
       'payload' : buffer
    };

    //Route the request to the handler specified in the router
    chosenHandler(data, function(statusCode, payload){
      //Use the status code from handler or default to 200
      statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

      //payload from handler or empty object
      payload = typeof(payload) == 'object' ? payload : {};

      //Convert payload to string
      let payloadString = JSON.stringify(payload);

      //Return response
        res.setHeader('Content-Type', 'aplication/json');
        res.writeHead(statusCode);
        res.end(payloadString);

      //log request
      console.log(`Returning this response: ${statusCode} ${payloadString}`);
    });
  });
};

//Define handlers
let handlers = {};

handlers.notFound = function(data, callback){
  callback(404);
};

handlers.ping = function(data, callback){
  //callback http status code, and a payload object
  callback(200)
};

handlers.hello = function(data, callback){
  //callback http status code, and a payload object
  callback(200, {'msg' : 'Welcome, this is homework #1, hope it\'s ok'})
};

//Define a request router
let router ={
  'ping' : handlers.ping,
  'hello': handlers.hello
}
