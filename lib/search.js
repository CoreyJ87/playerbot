'use strict'
const _ = require('lodash');
const CpApi = require('./cp');
const Slack = require('slack-node');

class Search {
  constructor() {}

  handleSearch(msg, text, parameter) {
    var sayObj = {
      "text": "*You searched for `" + parameter + "`*",
      "attachments": [
        {
          "text": "",
          "fallback": "Uhhh yeah...",
          "callback_id": "search_callback",
          "actions": []
        },
        {
          "text": "",
          "fallback": "Uhhh yeah...",
          "callback_id": "search_callback",
          "actions": [{
            name: "new",
            text: "Cancel",
            type: 'button',
            value: "Cancel",
          }]
        }
      ]
    }

    var cpapi = new CpApi;
    if (parameter != "") {
      cpapi.getList(parameter)
        .then(searchData => {
          console.log("back from search");
          cpapi.checkExists().then(movieData => {
            console.log("back from movie list grab");
            var returnString = "\n*Movies Results:*";
            var movies = movieData.movies;
            var search = searchData.movies;

            for (var i = 0, searchLen = search.length; i < searchLen; i++) {
              if (typeof (search[i].imdb) === 'undefined') {
                console.log('Kicked out:' + search[i].original_title + " for no imdb")
                continue;
              }

              var tmdb_id = search[i].imdb;
              var orig_title = search[i].original_title;
              var year = ((typeof (search[i].year) !== 'undefined') ? search[i].year : "");
              var img_url = ((typeof (search[i].images.poster) !== 'undefined' && typeof (search[i].images) !== 'undefined') ? search[i].images.poster[0] : "");
              var imdb_rating = ((typeof (search[i].rating) !== 'undefined' && typeof (search[i].rating.imdb) !== 'undefined') ? search[i].rating.imdb[0] : "No Rating");
              var plot = ((typeof (search[i].plot) !== 'undefined') ? search[i].plot : "No Plot available");
              var released = ((typeof (search[i].released) !== 'undefined') ? search[i].released : "No Release date available");


              for (var x = 0, movLen = movies.length; x < movLen; x++) {
                var attachmentNum = Math.trunc(5 / x);
                var match = false;
                if (_.isMatch(movies[x].info, {
                    'imdb': tmdb_id
                  })) {
                  sayObj.text += "\n`" + orig_title + "`is already in the download list. Click red button to remove";
                  sayObj.attachments[attachmentNum].actions.push({
                    name: "dupe",
                    text: orig_title,
                    type: 'button',
                    value: orig_title + "|" + tmdb_id + "|" + img_url + "|" + imdb_rating + "|" + plot + "|" + released,
                    style: "danger"
                  });
                  match = true;
                  break;
                }
              }
              if (!match) {
                sayObj.attachments[attachmentNum].actions.push({
                  name: "new",
                  text: orig_title,
                  type: 'button',
                  value: orig_title + "|" + tmdb_id + "|" + img_url + "|" + imdb_rating + "|" + plot + "|" + released,
                });
              }
            }
            //sayObj.attachments[attachmentNum].actions.push()
            msg.say(sayObj);
          })

        })
        .catch(function(err) {
          console.log("The request failed");
          console.log(err);
          msg.say("Error!!!!")
        });
    } else {
      msg.say("Syntax for search is: `@couchbot search MOVIETITLE`");
    }
  }

  handleButtons(msg, value) {
    var cpapi = new CpApi;
    var cleanParameters = value.split("|");
    var title = cleanParameters[0];
    var imdb_id = cleanParameters[1];
    var img_url = cleanParameters[2];
    var imdb_rating = cleanParameters[3];
    var plot = cleanParameters[4];
    var released = cleanParameters[5];
    var media_id = cleanParameters[6];
    var sayObj = {
      "text": ":white_check_mark: " + title + " has been " + ((msg.body.actions[0].name == "dupe") ? "deleted" : "added"),
      "color": "#000000",
      "attachments": [
        {
          "color": "#000000",
          "title": "Release Date:" + released,
          "author_name": "IMDB Rating:" + imdb_rating,
          "image_url": img_url,
        },
        {
          "title": "Plot",
          "text": plot
        }
      ],
      "delete_original": true,
      "color": "#000000"
    }

    if (value != "Cancel" && msg.body.actions[0].name != "dupe") { //Add Movies
      if (imdb_id == "tt0388795") {
        this.msgCorey("Someone tried to add brokeback. Go laugh");
        msg.respond(msg.body.response_url, {
          text: "Oh hell no motherfucker. I'm not downloading that gay shit. Nice try",
          "delete_original": true,
        });
      } else {

        cpapi.addMovie(imdb_id).then(addData => {
          console.log(JSON.stringify(addData));
          if (addData.success == true) {
            this.msgCorey(title + " was added to couchpotato!");
            this.msgPlexChannel(title + " was added to couchpotato!");
            msg.respond(msg.body.response_url, sayObj)
          } else {
            msg.respond(msg.body.response_url, {
              text: "An Error has occurred during processing. Please try again.",
              "delete_original": true,
            });
          }
        });
      }
    } else if (value != "Cancel" && msg.body.actions[0].name == "dupe") { //Remove movie
      cpapi.listMedia(title).then(mediaData => {
        if (mediaData.empty == true && mediaData.success == true) {
          msg.respond(msg.body.response_url, {
            text: "Unable to find movie by title. Corey has been notified to delete it.",
            "delete_original": true,
          })
          this.msgCorey(title + " needs to be deleted!!!");
        } else {
          cpapi.delMovie(mediaData.movies[0]._id).then(delData => {
            console.log(JSON.stringify(delData));
            if (delData.success == true) {
              this.msgCorey(title + " was deleted from couchpotato!!!");
              msg.respond(msg.body.response_url, sayObj)
            } else {
              msg.respond(msg.body.response_url, {
                text: "An Error has occurred during processing. Please try again.",
                "delete_original": true,
              });
            }
          });
        }
      })
    } else {
      msg.respond(msg.body.response_url, {
        text: "Okay so you don't want to add anything. I see",
        "delete_original": true,
        "response_type": "in_channel"
      });
    }
  }
  msgPlexChannel(msg) {
    var slack = new Slack();
    slack.setWebhook(process.env.WEBHOOK_URI);
    slack.webhook({
      channel: "#topic-plex",
      username: "slappbot",
      text: msg,
    }, function(err, response) {
      console.log(response);
    });
  }

  msgCorey(msg) {
    var slack = new Slack();
    slack.setWebhook(process.env.WEBHOOK_URI);
    slack.webhook({
      channel: "@synik4l",
      username: "slappbot",
      text: msg,
    }, function(err, response) {
      console.log(response);
    });

  }
}

module.exports = Search;
