'use strict'
const rp = require('request-promise');
const nest = require('unofficial-nest-api')

class Nest {
  constructor() {
    nest.login(process.env.NEST_USERNAME, process.env.NEST_PASSWORD, function(err, data) {
      if (err) {
        console.log(err.message);
        process.exit(1);
        return;
      }
    });
  }


  handleCurTemp(msg, text, parameter) {
    nest.fetchStatus(function(data) {
      for (var deviceId in data.device) {
        if (data.device.hasOwnProperty(deviceId)) {
          var device = data.shared[deviceId];
          msg.say("text: " + JSON.stringify(device));
        // here's the device and ID
        //nest.setTemperature(deviceId, nest.ftoc(70));
        }
      }
    });
  }

}
module.exports = Nest;
