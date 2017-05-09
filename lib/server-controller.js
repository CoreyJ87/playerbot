'use strict'
const rp = require('request-promise');
const node_ssh = require('node-ssh')
var ssh = new node_ssh()

class ServerController {
  constructor() {
    ssh.connect({
      host: process.env.SERVER_HOSTNAME,
      username: 'root',
      privateKey: process.env.SSH_KEY.toString()
    })
  }

  handleCommand(msg, text, parameters) {
    ssh.execCommand(parameters, {
      cwd: '/'
    }).then(function(result) {
      msg.say('STDOUT: ' + result.stdout);
      console.log('STDOUT: ' + result.stdout)
      console.log('STDERR: ' + result.stderr)
    })
  }

}
module.exports = ServerController;
