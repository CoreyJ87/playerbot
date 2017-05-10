'use strict'
const rp = require('request-promise');
var SSH = require('simple-ssh');

var ssh = new SSH({
  host: process.env.SERVER_HOSTNAME,
  user: 'root',
  key: '~/.ssh/id_rsa'
});

class ServerController {
  constructor() {
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
