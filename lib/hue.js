'use strict'
const rp = require('request-promise');
const huejay = require('huejay')

class Hue {
  constructor() {
    this.client = new huejay.Client({
      host: 'synik4lc.asuscomm.com',
      port: 80, // Optional
      username: process.env.HUE_API_KEY, // Optional
      timeout: 15000, // Optional, timeout in milliseconds (15000 is the default)
    });
  }

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
    msg.say(sayObj);
  }
  handleButtons(msg, value) {
    var sayObj = {
      "text": "Which group would you like to change?",
      "attachments": [
        {
          "text": "",
          "fallback": "Uhhh yeah...",
          "callback_id": "hue_callback",
          "actions": [
            {
              name: "new",
              text: "Cancel",
              type: 'button',
              value: "Cancel",
            }, {
              name: "new",
              text: "All",
              type: 'button',
              value: "All",
            }
          ]
        }
      ]
    }
    this.client.groups.getAll()
      .then(groups => {
        for (let group of groups) {
          sayObj.attachments[0].actions.push({
            "name": "new",
            "text": group.name,
            "type": 'button',
            "value": group.id,
            "style": "danger",
          });
          console.log(`Group [${group.id}]: ${group.name}`)
        }
      });
    msg.say(sayObj);
  }

}
module.exports = Hue;
