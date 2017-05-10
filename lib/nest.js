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
      nest.fetchStatus(function(data) {
        console.log(data);
        for (var deviceId in data.device) {
          if (data.device.hasOwnProperty(deviceId)) {
            var device = data.shared[deviceId];
          // here's the device and ID
          //nest.setTemperature(deviceId, nest.ftoc(70));
          }
        }
      });
    });
  }


}
module.exports = Nest;
