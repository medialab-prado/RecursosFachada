/*
*   Interaction module for MLP camera tracking 
*   use [log] parameter for logging
*/


var http = require('http');
var io = require('socket.io');
var express = require('express')
 , path = require('path'); 
var osc = require('node-osc');


var logging = false;

//Logging arguments 
process.argv.forEach(function (val, index, array) {
  console.log(index + ': ' + val);
  if (val == "log") {
    logging = true;
    console.log("logging mode... ")
  } 
});

/* 
  create our express server and prepare 
  to serve javascript files in ./public 
*/
var app = express();
var server = http.createServer(app);
server.listen(2525); 

var msgsArray=[]
var initTime=0;
app.configure(function(){
  app.use("/public", express.static(path.join(__dirname, 'public')));
  
}); 
    
/* 
* Connection 
*/
var oscServer = new osc.Server(3333, '0.0.0.0');
var websocket_server = io.listen(server, { log: false }); //.set('log level', 1); // reduce logging
var connectedUsers = new Array(); 

if (logging) {       
  process.on('SIGINT', function () {
    console.log('About to exit.');
    saveJsonToFile();
     process.exit();
  });
}

function updateServerInfo(socket) { 
	var clients = websocket_server.sockets.clients(); // all users from room clients('room') 
    console.log("@ Users connected " + clients.length); 
	
  	//update
    socket.broadcast.emit('users_connected', clients.length); 
} 

function saveJsonToFile(){
  var fs = require('fs');
  var outputFilename = 'output-tuio.txt';
  strToWrite=JSON.stringify(msgsArray)
  fs.writeFileSync(outputFilename, strToWrite);
}

/* 

*/
websocket_server.sockets.on('connection', function(socket) { 
	updateServerInfo(socket);
    console.log("** User " + socket.id + " connected "); 
	
    socket.on('message', function(message) { 
 	  	console.log("Message received from client" + message); 
    	socket.emit( "hola", "hola"); 
    }); 
    
    socket.on('updateServer', function(message) { 
 	  	console.log("Message received from client" + JSON.stringify(message));  
 	    socket.broadcast.emit('updateClient', message); 
    }); 
	
    socket.on('chat', function(message) { 
 		  console.log(message); 
    	socket.broadcast.emit('chat', message); 
    }); 
    
    socket.on('disconnect', function(){ 
		  updateServerInfo(socket);
    });  

}); 

msgnmr=1;
width=320
height=240

//This function is the handler for OSC messages
oscServer.on("message", function (msg, rinfo) {
  msgnmr+=1
  /*if(msgnmr%30!=0) // just print one each 10 msgs
    return*/
  diffTime=0;  
  if(initTime==0){
    initTime=new Date();            
  }
  else{
    now=new Date();
    diffTime=now-initTime 
  }
  
  //console.log(msg);
  var blobsJson=[]
  //blobsJson.push( {'time':diffTime }) //timestamp
  for (var i=2; i<msg.length; i+=1){
    var blob=msg[i];  
    if(blob[2]!=undefined){
      if(blob[1]=='set'){
        blobsJson.push({'x':Math.round(blob[3]*width) , 'y' :Math.round(blob[4]*height),'id':blob[2]} )    

      }
    }              
  }     

  if (logging) {       
    msgsArray.push(blobsJson)
    //console.log( blobsJson )
  }
  
  // socket.broadcast.emit('updateClient', msg); 
  websocket_server.sockets.emit("updateClient", {'blobs':blobsJson}); 
});