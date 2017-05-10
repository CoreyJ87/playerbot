'use strict'
const fs = require('fs');
const express = require('express')
const Slapp = require('slapp')
const AWS = require('aws-sdk')
const ConvoStore = require('slapp-convo-beepboop')
const Context = require('slapp-context-beepboop')
const Search = require('./lib/search')
const Hue = require('./lib/hue')
const ServerController = require('./lib/server-controller')
const Nest = require('./lib/nest')
const hue = new Hue;
const sc = new ServerController;
const nest = new Nest
var slapp = Slapp({
  // Beep Boop sets the SLACK_VERIFY_TOKEN env var
  verify_token: process.env.SLACK_VERIFY_TOKEN,
  convo_store: ConvoStore(),
  context: Context()
})

/*
Messages
*/

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

slapp.message('^nest (.*)', ['mention', 'direct_message'], (msg, text, parameter) => {
  nest.handleCurTemp(msg, text, parameter);
})

slapp.message('^command (.*)', ['mention', 'direct_message'], (msg, text, parameters) => {
  if (msg.body.event.user == process.env.COREY_USERID) {
    sc.handleCommand(msg, text, parameters);
  } else {
    msg.say("You are not Corey. So...no")
  }
})

slapp.message('^context (.*)', ['mention', 'direct_message'], (msg, text, parameters) => {
  if (msg.body.event.user == process.env.COREY_USERID) {
    sc.swapServers(msg, text, parameters);
  } else {
    msg.say("You are not Corey. So...no")
  }
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

/*
Actions
*/

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


/*
Server
*/
var server = slapp.attachToExpress(express())
var port = process.env.PORT || 3000
server.listen(port, (err) => {
  if (err) {
    return console.error(err)
  } else {
    getAWSKey();
  }
  console.log(`Listening on port ${port}`)
});


function getAWSKey() {
  AWS.config.update(
    {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: 'us-east-1'
    }
  );
  var s3 = new AWS.S3();
  var params = {
    Bucket: process.env.AWS_BUCKET,
    Key: process.env.KEY_PATH
  };
  var file = require('fs').createWriteStream('/tmp/id_rsa');
  var fileStream = s3.getObject(params).createReadStream();
  fileStream.pipe(file);
}
