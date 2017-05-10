'use strict'
const rp = require('request-promise');
var fs = require('fs');
var SSH = require('simple-ssh');



class ServerController {
  constructor() {
    var ssh = new SSH({
      host: process.env.SERVER_HOSTNAME,
      user: 'root',
      key: fs.readFileSync('/tmp/id_rsa').toString()
    });
    console.log(process.env.SSH_KEY);
  }

  handleCommand(msg, text, parameters) {
    ssh.exec(parameters, {
      out: function(stdout) {
        console.log(stdout);
        msg.say(stdout); //change
      }
    }).start();
  }

}
module.exports = ServerController;
