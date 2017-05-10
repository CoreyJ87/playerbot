'use strict'
const rp = require('request-promise');
var fs = require('fs');
var SSH = require('simple-ssh');



class ServerController {
  constructor() {}

  handleCommand(msg, text, parameters) {
    var ssh = new SSH({
      host: process.env.SERVER_HOSTNAME,
      user: 'root',
      key: fs.readFileSync('/tmp/id_rsa').toString()
    });
    ssh.exec(parameters, {
      out: function(stdout) {
        console.log(stdout);
        msg.say("were here and stdout is: " + stdout); //change
      },
      err: function(stderr) {
        console.log(stderr); // this-does-not-exist: command not found
        msg.say(stderr);
      }

    }).start();
  }

}
module.exports = ServerController;
