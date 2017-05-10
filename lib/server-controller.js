'use strict'
const rp = require('request-promise');
var fs = require('fs');



class ServerController {
  constructor() {}

  handleCommand(msg, text, parameters) {
    var Client = require('ssh2').Client;

    var conn = new Client();
    conn.on('ready', function() {
      console.log('Client :: ready');
      conn.shell(function(err, stream) {
        if (err)
          throw err;
        stream.on('close', function() {
          console.log('Stream :: close');
          conn.end();
        }).on('data', function(data) {
          console.log('STDOUT: ' + data);
          msg.say("::" + data + "::")
        }).stderr.on('data', function(data) {
          console.log('STDERR: ' + data);
          msg.say("::Err::" + data + "::")
        });
        stream.end(parameters);
      });
    }).connect({
      host: process.env.SERVER_HOSTNAME,
      port: 22,
      username: 'root',
      privateKey: require('fs').readFileSync('/tmp/id_rsa')
    });


  }

}
module.exports = ServerController;
