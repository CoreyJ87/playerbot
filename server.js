'use strict'
const fs = require('fs');
const express = require('express')
const Slapp = require('slapp')
var AWS = require('aws-sdk')
const ConvoStore = require('slapp-convo-beepboop')
const Context = require('slapp-context-beepboop')
const Search = require('./lib/search')
const Hue = require('./lib/hue')
const ServerController = require('./lib/server-controller')
const hue = new Hue;
const sc = new ServerController;

var slapp = Slapp({
  // Beep Boop sets the SLACK_VERIFY_TOKEN env var
  verify_token: process.env.SLACK_VERIFY_TOKEN,
  convo_store: ConvoStore(),
  context: Context()
})


slapp.message('^search (.*)', ['mention', 'direct_message'], (msg, text, parameter) => {
  var search = new Search;
  search.handleSearch(msg, text, parameter);
})

slapp.message('lights', ['mention', 'direct_message'], (msg, text) => {
  if (msg.body.event.user == process.env.COREY_USERID) {
    hue.handleLights(msg, text);
  } else {
    msg.say("You are not Corey. So...no")
  }
})


slapp.message('^command (.*)', ['mention', 'direct_message'], (msg, text, parameters) => {
  if (msg.body.event.user == process.env.COREY_USERID) {
    sc.handleCommand(msg, text, parameters);
  } else {
    msg.say("You are not Corey. So...no")
  }
})



slapp.action('search_callback', (msg, value) => {
  var search = new Search;
  search.handleButtons(msg, value);
})
slapp.action('hue_callback', (msg, value) => {
  hue.handleOptionButtons(msg, value);
})
slapp.action('hue_group_callback', (msg, value) => {
  hue.handleGroupButtons(msg, value);
})


slapp.message('help', ['mention', 'direct_message'], (msg) => {
  msg.say("To search for a movie use: `@couchbot search MOVIENAME`\n");
})

// Catch-all for any other responses not handled above
slapp.message('.*', ['direct_mention', 'direct_message'], (msg) => {
  // respond only 40% of the time
  if (Math.random() < 0.4) {
    msg.say([':wave:', ':pray:', ':raised_hands:'])
  }
});



var server = slapp.attachToExpress(express())
var port = process.env.PORT || 3000
server.listen(port, (err) => {
  if (err) {
    return console.error(err)
  } else {
    AWS.config.update(
      {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: 'us-east-1'
      }
    );
    var s3 = new AWS.S3();
    var params = {
      Bucket: 'com-aloompa-configuration',
      Key: 'id_rsa'
    };
    var file = require('fs').createWriteStream('/tmp/id_rsa');
    s3.getObject(params, function(err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else console.log(data); // successful response
    });
    var fileStream = s3.getObject(params).createReadStream();
    fileStream.pipe(file);
  }
  console.log(`Listening on port ${port}`)
})
