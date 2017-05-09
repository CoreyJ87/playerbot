'use strict'
const rp = require('request-promise');
const node_ssh = require('node-ssh')
var ssh = new node_ssh()

class ServerController {
  constructor() {
    ssh.connect({
      host: process.env.SITE_URL,
      username: 'root',
      privateKey: process.env.SSH_KEY
    })
  }

  handleCommand(msg, text, parameters) {
    console.log(parameters)
    msg.say(parameters);

  /*
  ssh.execCommand('hh_client --json', {
    cwd: '/'
  }).then(function(result) {
    console.log('STDOUT: ' + result.stdout)
    console.log('STDERR: ' + result.stderr)
  })*/
  }

}
module.exports = ServerController;
