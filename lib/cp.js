'use strict'
const rp = require('request-promise');


class CouchPotatoApi {
  constructor() {
    this.auth = "Basic " + new Buffer(process.env.AUTH_USERNAME + ":" + process.env.AUTH_PASSWORD).toString("base64");
    this.CPApiKey = process.env.CP_API_KEY;
  }

  getList(cleanParameters) {
    var url = `https://0mfg.wtf/couchpotato/api/${this.CPApiKey}/search`;
    if (cleanParameters.length) {
      var options = {
        uri: url,
        form: {
          q: cleanParameters
        },
        headers: {
          "Authorization": this.auth,
          'User-Agent': 'Request-Promise'
        },
        json: true
      };
      return rp(options)
    } else {
      throw new Error('Failed to get search results')
    }
  }

  checkExists() {
    var url = `https://0mfg.wtf/couchpotato/api/${this.CPApiKey}/movie.list`;
    var options = {
      uri: url,
      headers: {
        "Authorization": this.auth,
        'User-Agent': 'Request-Promise'
      },
      json: true
    };
    return rp(options)
  }

  addMovie(IMDB_ID) {
    var url = `https://0mfg.wtf/couchpotato/api/${this.CPApiKey}/movie.add`
    var options = {
      uri: url,
      form: {
        identifier: IMDB_ID
      },
      headers: {
        "Authorization": this.auth,
        'User-Agent': 'Request-Promise'
      },
      json: true
    };
    return rp(options)

  }
  listMedia(movie_title) {
    var url = `https://0mfg.wtf/couchpotato/api/${this.CPApiKey}/media.list`
    var listOptions = {
      uri: url,
      form: {
        search: movie_title.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ''),
      },
      headers: {
        "Authorization": this.auth,
        'User-Agent': 'Request-Promise'
      },
      json: true
    };
    return rp(listOptions)
  }
  delMovie(imdb_id) {
    console.log(JSON.stringify(data));
    var url = `https://0mfg.wtf/couchpotato/api/${this.CPApiKey}/media.delete`
    var delOptions = {
      uri: url,
      form: {
        id: imdb_id
      },
      headers: {
        "Authorization": this.auth,
        'User-Agent': 'Request-Promise'
      },
      json: true
    };
    return rp(delOptions)
  }
}
module.exports = CouchPotatoApi;
