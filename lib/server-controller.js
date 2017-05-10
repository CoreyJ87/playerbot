'use strict'
const rp = require('request-promise');
var fs = require('fs');



class ServerController {
  constructor() {
    this.server = process.env.SERVER_HOSTNAME;
  }

  swapServers(msg, text, parameters) {
    if (parameters == "ts") {
      this.server = "ts.0mfg.wtf"
    } else {
      this.server = "0mfg.wtf";
    }
    msg.say("Swapped control to server:" + this.server);
  }
  handleCommand(msg, text, parameters) {
    var Client = require('ssh2').Client;

    var conn = new Client();
    conn.on('ready', function() {
      console.log('Client :: ready');
      conn.exec(parameters, function(err, stream) {
        if (err)
          throw err;
        stream.on('close', function(code, signal) {
          console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
          conn.end();
        }).on('data', function(data) {
          console.log('STDOUT: ' + data);
          msg.say("::" + data + "::")
        }).stderr.on('data', function(data) {
          console.log('STDERR: ' + data);
          msg.say("::Error::" + data + "::")
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
