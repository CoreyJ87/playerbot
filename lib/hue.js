'use strict'
const rp = require('request-promise');
const huejay = require('huejay')
const convert = require('color-convert');

class Hue {
  constructor() {
    this.client = new huejay.Client({
      host: process.env.HUE_HOST,
      port: 80,
      username: process.env.HUE_API_KEY,
      timeout: 15000,
    });
    this.selectedOptions = {};
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
  handleOptionButtons(msg, value) {
    this.selectedOptions.command = value;
    var sayObj = {
      "text": "Which group would you like to change?",
      "attachments": [
        {
          "text": "",

          "fallback": "Uhhh yeah...",
          "callback_id": "hue_group_callback",
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
          ],
          "delete_original": true,
        }
      ]
    }
    this.client.groups.getAll()
      .then(groups => {
        for (let group of groups) {
          sayObj.attachments[0].actions.push({
            name: "new",
            text: group.name,
            type: 'button',
            value: group.name + "|" + group.id,
          });
          console.log(`Group [${group.id}]: ${group.name}`)

        }
        msg.say(sayObj);
      });

  }
  handleGroupButtons(msg, value) {
    var parameters = value.split("|");
    this.selectedOptions.group = parameters[1];

    if (this.selectedOptions.command == "on" || this.selectedOptions.command == "off") {
      msg.say("Turning " + this.selectedOptions.command + " " + parameters[0]);
      this.runOnOff();
    } else if (this.selectedOptions.command == "set" || this.selectedOptions.command == "blink") {
      var sayObj = {
        "text": "Which group would you like to change?",
        "attachments": [
          {
            "text": "",

            "fallback": "Uhhh yeah...",
            "callback_id": "hue_group_callback",
            "actions": [
              {
                name: "new",
                text: "Cancel",
                type: 'button',
                value: "Cancel",
              }
            ],
            "delete_original": true,
          }
        ]
      }
    } else {
      msg.say("Okay then");
    }
  }
  runChange() {
    var color = convert.keyword.hsl(this.selectedOptions.color);
    client.groups.getById(this.selectedOptions.group)
      .then(group => {
        group.on = true
        group.hue = color[0];
        group.saturation = color[1];
        group.brightness = color[2];
        return client.groups.save(group);
      })
  }

  runOnOff() {
    client.groups.getById(this.selectedOptions.group)
      .then(group => {
        group.on = (this.selectedOptions.command == "on") ? true : false;
        return client.groups.save(group);
      })
      .then(group => {
        console.log(`Group [${this.selectedOptions.group}] was saved`);
      })
      .catch(error => {
        console.log(error.stack);
      });
  }
}
module.exports = Hue;
