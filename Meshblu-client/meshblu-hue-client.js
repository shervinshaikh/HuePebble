var skynet = require('skynet');
var request = require('request');

// http://[BRIDGE_IP_ADDRESS_HERE]/api/[DEV_USERNAME_HERE]/lights/
var bridgeURI = 'http://10.1.169.87/api/shervinshaikh/lights/';  // Must find IP address of Hue Bridge & create dev username

var conn = skynet.createConnection({
  "uuid": "adcf9640-f71a-11e3-a289-c9c410d2a47e",
  "token": "0c4liaas7dum78pviw7ovh5pvc4k7qfr",
  "protocol": "websocket"
});

conn.on('ready', function(data){
  console.log('Ready, listening for messages...');

  conn.on('message', function(message){
    // console.log(message);

    if(message.payload.typ === 'hue'){
      if(message.payload.dat.on === "true") message.payload.dat.on = true;
      if(message.payload.dat.on === "false") message.payload.dat.on = false;
    
      console.log(JSON.stringify(message.payload.dat));
      if(message.payload.to === "all"){
        for(var i=1; i<=3; i++){
          reqChangeLights(bridgeURI + i + '/state', message.payload.dat);
        }
      } else if(message.payload.to !== null){
        reqChangeLights(bridgeURI + message.payload.to +'/state', message.payload.dat);
      } else {
        reqChangeLights(bridgeURI + '1/state', message.payload.dat);
      }
    }
  });

  conn.status(function (data) {
    console.log(data);
  });

});
