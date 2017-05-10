'use strict'
const rp = require('request-promise');
var fs = require('fs');



class ServerController {
  constructor() {
    this.server = process.env.SERVER_HOSTNAME;
  }

  swapServers(msg, text, parameters) {
    if (parameters == "ts") {
      this.server = process.env.THE_ONE
    } else {
      this.server = process.env.THE_OTHER;
    }
    msg.say("Swapped control to server:" + this.server);
  }

  handleCommand(msg, text, parameters) {
    var Client = require('ssh2').Client;
    msg.say("Sending command to: " + this.server);
    var conn = new Client();
    conn.on('ready', function() {
      conn.exec(parameters, function(err, stream) {
        if (err)
          throw err;
        stream.on('close', function(code, signal) {
          conn.end();
        }).on('data', function(data) {
          msg.say("```" + data + "```")
        }).stderr.on('data', function(data) {
          msg.say("```::Error::" + data + "::```")
        });
      });
    }).connect({
      host: this.server,
      port: 22,
      username: 'root',
      privateKey: require('fs').readFileSync('/tmp/id_rsa')
    });
  }

}
module.exports = ServerController;
