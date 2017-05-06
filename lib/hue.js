'use strict'
const rp = require('request-promise');
const huejay = require('huejay')

class Hue {
  constructor() {}

  handleLights(msg, text, parameter) {
    var sayObj = {
      "text": "Lets work on those hues",
      "attachments": [
        {
          "text": "",
          "fallback": "Uhhh yeah...",
          "callback_id": "hue_callback",
          "actions": [{
            name: "new",
            text: "On",
            type: 'button',
            value: "On",
          }, {
            name: "new",
            text: "Off",
            type: 'button',
            value: "Off",
          },
            {
              name: "new",
              text: "Set",
              type: 'button',
              value: "Set",
            }, {
              name: "new",
              text: "Blink",
              type: 'button',
              value: "Blink",
            },
            {
              name: "new",
              text: "Cancel",
              type: 'button',
              value: "Cancel",
            }]
        }
      ]
    }
    msg.respond(msg.body.response_url, sayObj);
  }
  handleButtons(msg, value) {}

}
module.exports = Hue;
