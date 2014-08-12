/**
 * Welcome to HuePebble
 *
 * Created By: Shervin Shaikh
 * Sends a message to MeshBlu (formerly SkyNet) to turn off Philips Hue lights from anywhere in the world!
 * There needs to be a client on the LAN of where the lights are on to listen for the incoming messages.
 * 
 * This code is from the app.js source file on a CloudPebble project.
 * Just create a new Pebble.js project and replace app.js with the code below, then build & run.
 */

var UI = require('ui');

localStorage.hue = 65000; // uint16w 0-65535. 0 & 65535 are red, 25500 is green, and 46920 is blue
localStorage.sat = 255;   // uint8 0-255.     255 is the most saturated (colored) and 0 is the least saturated (white).
localStorage.bri = 200;   // uint8 0-255.     0 is no light and 255 is the maximum amount of light.
localStorage.on = false; // bool.            On =true, Off=false

localStorage.mURL = 'http://skynet.im/messages';
localStorage.devices = 'adcf9640-f71a-11e3-a289-c9c410d2a47e';

var main = new UI.Menu({
  sections: [{
    items: [{
      title: 'On',
      icon: 'images/menu_icon.png'
    }, {
      title: 'Hue',
      subtitle: 'Set the Color'
    }, {
      title: 'Saturation',
      subtitle: 'How much color'
    }, {
      title: 'Brightness',
      subtitle: 'How much light'
    }]
  }]
});

main.show();

function messageSkynet() {
  var req = new XMLHttpRequest();
  req.open('POST', localStorage.mURL);
  req.setRequestHeader('skynet_auth_uuid','adcf9640-f71a-11e3-a289-c9c410d2a47e');
  req.setRequestHeader('skynet_auth_token', '0c4liaas7dum78pviw7ovh5pvc4k7qfr');

  req.onreadystatechange = function (event) {
    var xhr = event.target;
    console.log(event);
    console.log(xhr.responseText);
    console.log(xhr.status);
  };
  
  req.send('{"devices": "' + localStorage.devices + '", "payload": {"dat":{"hue":' + localStorage.hue + ', "on":' + localStorage.on   + ', "sat":' + localStorage.sat + ', "bri":' + localStorage.bri + '} ,"typ": "hue", "to": "all"}}');
  console.log(req.status);
}

main.on('select', function(e) {
  console.log('Selected item: ' + e.section + ' ' + e.item);
  console.log(JSON.stringify(e));
  switch(e.item){
    case 0:
      if(main.state.sections[e.section].items[0].title === "On"){
        console.log("Turn On!");
        main.item(e.section, e.item, {title: 'Off'});
        localStorage.on = true;

        messageSkynet();
      } else if (main.state.sections[e.section].items[0].title === "Off"){
        console.log("Turn Off!");       
        main.item(e.section, e.item, {title: 'On'});
        localStorage.on = false;

        messageSkynet();
      }
      break;
    case 1:
      var hueCard = new UI.Card();
      hueCard.title('Hue');
      hueCard.subtitle('Set the Color');
      hueCard.body(localStorage.hue);
      hueCard.show();

      hueCard.on('click', 'up', function(e) {
        if(parseInt(localStorage.hue)+5000 <= 65280){
          localStorage.hue = parseInt(localStorage.hue) + 5000;
          hueCard.body(localStorage.hue);

          messageSkynet();
          console.log("increase hue");
        }
      });

      hueCard.on('click', 'down', function(e) {
        if(parseInt(localStorage.hue)-5000 >= 0){
          localStorage.hue = parseInt(localStorage.hue) - 5000;
          hueCard.body(localStorage.hue);

          messageSkynet();
          console.log("decrease hue");
        }
      });
      break;
    case 2:
      var satCard = new UI.Card();
      satCard.title('Saturation');
      satCard.subtitle('Amount of Color');
      satCard.body(localStorage.sat);
      satCard.show();

      satCard.on('click', 'up', function(e) {
        if(parseInt(localStorage.sat)+31 <= 255){
          localStorage.sat = parseInt(localStorage.sat) + 30;
          satCard.body(localStorage.sat);

          messageSkynet();
          console.log("increase sat");
        }
      });

      satCard.on('click', 'down', function(e) {
        if(parseInt(localStorage.sat)-31 >= 0){
          localStorage.sat = parseInt(localStorage.sat) - 30;
          satCard.body(localStorage.sat);

          messageSkynet();
          console.log("decrease sat");
        }
      });
      break;
    case 3:
      var briCard = new UI.Card();
      briCard.title('Brightness');
      briCard.subtitle('Lumens!');
      briCard.body(localStorage.bri);
      briCard.show();

      briCard.on('click', 'up', function(e) {
        if(parseInt(localStorage.bri)+30 <= 255){
          localStorage.bri = parseInt(localStorage.bri) + 30;
          briCard.body(localStorage.bri);

          messageSkynet();
          console.log("increase bri");
        }
      });

      briCard.on('click', 'down', function(e) {
        if(parseInt(localStorage.bri)-30 >= 0){
          localStorage.bri = parseInt(localStorage.bri) - 30;
          briCard.body(localStorage.bri);

          messageSkynet();
          console.log("decrease bri");
        }
      });
      break;
  }
});