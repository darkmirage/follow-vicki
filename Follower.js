const EventEmitter = require('events');
const Twitter = require('twitter');

const colors = require('colors/safe');

// Vicki's Twitter ID
const ID = '834940874643615744';

class Follower extends EventEmitter {
  constructor(config, pairs) {
    super();
    this.pairs = pairs;
    this.twitter = new Twitter(config.twitter);
  }

  onTweet(pair, direction, callback) {
    return this.on(`${pair}/${direction}`, callback);
  }

  startFollowing() {
    const params = { follow: ID };
    const stream = this.twitter.stream('statuses/filter', params);
    stream.on('data', tweet => {
      if (!tweet || tweet.user.id_str != ID) {
        return;
      }

      let direction = null;
      let text = tweet.text;
      if (text.includes('long')) {
        direction = 'long';
        text = colors.green(text);
      } else if (text.includes('short')) {
        direction = 'short';
        text = colors.red(text);
      }

      let pair;
      this.pairs.forEach(_pair => {
        if (tweet.text.includes(_pair)) {
          pair = _pair;
        }
      });

      if (!pair || !direction) {
        return;
      }

      this.emit(`${pair}/${direction}`);

      console.log(colors.gray(tweet.created_at));
      console.log(text);
      console.log('Currency pair: ' + colors.yellow(pair));
      console.log('');
    });
     
    stream.on('error', error => {
      console.error(error);
    });
  }
}

module.exports = Follower;
