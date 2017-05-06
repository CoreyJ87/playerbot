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
    this.client.groups.getAll()
      .then(groups => {
        for (let group of groups) {
          console.log(`Group [${group.id}]: ${group.name}`);
          console.log(`  Type: ${group.type}`);
          console.log(`  Class: ${group.class}`);
          console.log('  Light Ids: ' + group.lightIds.join(', '));
          console.log('  State:');
          console.log(`    Any on:     ${group.anyOn}`);
          console.log(`    All on:     ${group.allOn}`);
          console.log('  Action:');
          console.log(`    On:         ${group.on}`);
          console.log(`    Brightness: ${group.brightness}`);
          console.log(`    Color mode: ${group.colorMode}`);
          console.log(`    Hue:        ${group.hue}`);
          console.log(`    Saturation: ${group.saturation}`);
          console.log(`    X/Y:        ${group.xy[0]}, ${group.xy[1]}`);
          console.log(`    Color Temp: ${group.colorTemp}`);
          console.log(`    Alert:      ${group.alert}`);
          console.log(`    Effect:     ${group.effect}`);

          if (group.modelId !== undefined) {
            console.log(`  Model Id: ${group.modelId}`);
            console.log(`  Unique Id: ${group.uniqueId}`);
            console.log('  Model:');
            console.log(`    Id:           ${group.model.id}`);
            console.log(`    Manufacturer: ${group.model.manufacturer}`);
            console.log(`    Name:         ${group.model.name}`);
            console.log(`    Type:         ${group.model.type}`);
          }

          console.log();
        }
      });
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
  handleButtons(msg, value) {}

}
module.exports = Hue;
