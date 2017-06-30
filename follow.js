const Follower = require('./Follower');
const Gdax = require('gdax');
const config = require('./config');

const authedClient = new Gdax.AuthenticatedClient(
  config.gdax.key,
  config.gdax.secret,
  config.gdax.passphrase,
  config.gdax.url,
);

// Customize the pairs to listen for
const VICKI_PAIRS = ['ZECUSD', 'XMRBTC', 'ETHBTC', 'ETHUSD'];

// Set the fixed transaction size here or you can implement more logic in the
// callback functions below to dynamically determine the size
const TRADE_SIZE = 0.01;

const follower = new Follower(config, VICKI_PAIRS);

follower.onTweet('ETHUSD', 'long', function() {
  // Customize this function and perform actions using the GDAX client
  const publicClient = new Gdax.PublicClient('ETH-USD');
  publicClient.getProductOrderBook({ level: 2 }, (err, response, data) => {
    const {bids} = data;
    const price = bids[0][0];
    const params = {
      'price': price,
      'size': TRADE_SIZE,
      'product_id': 'ETH-USD',
    };
    authedClient.buy(params, (err, response, data) => {
      console.log('Sent buy order', data);
    });
  });
});

follower.onTweet('ETHUSD', 'short', function() {
  const publicClient = new Gdax.PublicClient('ETH-USD');
  publicClient.getProductOrderBook({ level: 2 }, (err, response, data) => {
    const {asks} = data;
    const price = asks[0][0];
    const params = {
      'price': price,
      'size': TRADE_SIZE,
      'product_id': 'ETH-USD',
    };
    authedClient.sell(params, (err, response, data) => {
      console.log('Sent sell order', data);
    });
  });
});

follower.onTweet('XMRBTC', 'short', function() {
  // You can listen on any of the pairs in VICKI_PAIRS and trade with other APIs
});

follower.startFollowing();
