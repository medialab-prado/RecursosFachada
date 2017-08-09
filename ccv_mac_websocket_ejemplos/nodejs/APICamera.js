/*
Emulador de mensajes tuio por websocket
Iniciar con:
var con= new websocketEmulator();con.init();

Después
fcallback=function(blobs){console.log(blobs) //whatever}

fcallback hace lo que sea con los datos y recibe como parámetro los blobs detectados
con.usersMovements(fcallback)

Cada 500 msg "llega un nuevo msg" es tarea del cliente leerlo


*/



function websocketReader() {
  this.currentMsg = 0;
  this.initTime = 0;
  this.msgArray = [];
  this.msgArrayClean = [];
  this.timer = null
  // this.video=mvideo
  this.connected = false
  //console.log("mvideo")
  //console.log(mvideo)
  currentMsg = {}
  this.init = function() {
    this.socket = new io.connect('http://127.0.0.1:2525') //connect to localhost presently
    this.connected = true;
    console.log("empezando")
    this.socket.on('updateClient', function(message) {
      currentMsg = message
      //this.socket.disconnect()
    });
  }


  this.pause = function() {

  }
  this.stop = function() {
    this.socket.disconnect()

  }

  // this.addInfoCallback(cb) { 
  // 	this.infoCb = cb;
  // }

  this.connect = function() {
    if (this.connected == true) { //si ya estamos conectados
    } else { //sino es hora de iniciar      
      this.init()
    }

    // if (!this.infoCb) {
    // } else {
    // 	this.infoCb();
    // }
    this.connected = true;

  }
  correctionY = 192 / 320;
  correctionX = 157 / 240;

  this.getBlobs = function(callbackFunct) {
    //console.log(currentMsg)  
    if (typeof currentMsg.blobs != "undefined") {
      //console.log(currentMsg)
      currB = currentMsg.blobs
      var modB = new Array();
      for (var i = 0; i < currB.length; i += 1) {
        modB[i] = {}
        modB[i].id = currB[i].id
        modB[i].x = Math.round(currB[i].x * correctionX);
        modB[i].y = Math.round(currB[i].y * correctionY);
      }
      callbackFunct(modB)
    } else {
      callbackFunct([])
    }

  };

}