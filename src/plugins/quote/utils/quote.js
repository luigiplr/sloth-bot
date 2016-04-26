import _ from 'lodash';
import Promise from 'bluebird';
import moment from 'moment';
import uuid from 'node-uuid';
import slackTools from '../../../slack.js';
import { Quotes } from '../../../database';
var config = require('../../../../config.json');
import { getHistory, findUser } from '../../../slack.js'

module.exports = {
  quote(user, quotenum = 0) {
    return new Promise((resolve, reject) => {
      Quotes.findByQuotedUser(user).then(quotes => {
        console.log(quotes);
        if (quotenum === 'all') {
          var total = ['<' + user + '> Quotes (' + quotes.length + ') :'];
          quotes.forEach((quotenums, i) => {
            total.push(this.urlify('[' + i + '] (' + moment(quotenums.date).format("DD-MM-YYYY") + ') ' + quotenums.message));
          });
          return resolve(total);
        } else {
          let quoteindex = quotenum < 0 ? quotes.length + parseInt(quotenum) : parseInt(quotenum);
          if (quotes[quoteindex]) {
            let returnstuff = '<' + user + '> ' + quotes[quoteindex].message;
            return resolve(this.urlify(returnstuff));
          } else {
            if (quotes.length > 0)
              reject("I don't have quotes that far back for " + user);
            else
              reject('No quotes found for ' + user + ', grab a quote via `' + config.prefix + 'grab <username>`');
          }
        }
      }).catch(err => {
          reject(err);
      });
    });
  },
  grabQuote(grabee, channel, index = 0, grabber) {
    return new Promise((resolve, reject) => {
      Promise.join(getHistory(channel.id), findUser(grabee), (messages, user) => {
        let i = 0;
        if (grabber.id == user)
          index++;

        let uID = _(messages)
          .filter(message => {
            if (parseInt(index) == i)
              return message.user === user;
            else if (message.user === user)
              i++;
          })
          .map('text')
          .value()[0];

        if (!uID)
          return reject("Something went wrong");

        var dbQuote = new Quotes();
        dbQuote.quotedUser = grabee.toString().toLowerCase();
        dbQuote.message = uID.toString();
        dbQuote.grabUser = grabber.name;
        dbQuote.date = moment().utc().format();
        dbQuote.Persist().then(() => {
          resolve("Successfully grabed a quote for " + grabee);
        });
      }).catch(reject);
    });
  },
  urlify(text) {
    var urlRegex = /(<https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, url => {
      url = url.substr(1);
      return url.substring(0, url.length - 1) + '#' + this.generatechars();
    });
  },
  generatechars() {
    var length = 8,
      charset = "abcdefghijklnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
      retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
  }
};
