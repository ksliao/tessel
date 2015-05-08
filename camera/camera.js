var tessel = require('tessel');
var camera = require('camera-vc0706').use(tessel.port['A']);

var notificationLED = tessel.led[3]; // Set up an LED to notify when we're taking a picture
// Wait for the camera module to say it's ready
camera.on('ready', function() {
  notificationLED.high();
  // Take the picture
  var counter = 0;
  var intervalId = setInterval(function () {

    camera.takePicture(function (err, image){
      if (err) {
        console.log('error taking image', err);
      } else {
        notificationLED.low();
        var name = 'picture-' + Math.floor(Date.now()*1000) + '.jpg';
        console.log('saving' + name);
        process.sendfile(name,image);
        counter++;
        console.log('counter = ', counter);
        if (counter === 1) {
          camera.disable();
          clearInterval(intervalId);
          console.log('cleared!!!!!')
        }
      }
    });

  }, 100);


});

camera.on('error', function(err) {
  console.error(err);
});