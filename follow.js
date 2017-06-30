const Follower = require('./Follower');
const Gdax = require('gdax');
const config = require('./config');

const authedClient = new Gdax.AuthenticatedClient(
  config.gdax.key,
  config.gdax.secret,
  config.gdax.passphrase,
  config.gdax.url,
);

const VICKI_PAIRS = ['ZECUSD', 'XMRBTC', 'ETHBTC', 'ETHUSD'];
const MAX_USD = 1000;
const MAX_TRADE_SIZE = 10;

function cancelAllOrders(productID) {
  return new Promise((resolve, reject) => {
    authedClient.cancelAllOrders({product_id: productID}, (err, response, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
}

function getProductOrderBook(productID, level) {
  const publicClient = new Gdax.PublicClient(productID);
  return new Promise((resolve, reject) => {
    publicClient.getProductOrderBook({ level }, (err, response, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
}

function buy(productID, price, size) {
  const params = {
    'price': `${price}`,
    'size': `${size}`,
    'product_id': productID,
  }
  return new Promise((resolve, reject) => {
    authedClient.buy(params, (err, response, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
}

function sell(productID, price, size) {
  const params = {
    'price': `${price}`,
    'size': `${size}`,
    'product_id': productID,
  }
  return new Promise((resolve, reject) => {
    authedClient.sell(params, (err, response, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
}

function getPriceAtVolume(prices, targetVolume) {
  let i = 0;
  let volume = 0;
  for (i = 0; i < bids.length; i++) {
    const size = parseFloat(bids[i][1]);
    if (volume + size > targetVolume) {
      break;
    }
    volume += size;
  }
  return parseFloat(bids[i][0]);
}

function getSizeAtPrice(price) {
  return Math.min(MAX_TRADE_SIZE, MAX_USD / price);
}

const follower = new Follower(config, VICKI_PAIRS);

follower.onTweet('ETHUSD', 'long', function() {
  cancelAllOrders('ETH-USD').then(data => {
    return getProductOrderBook('ETH-USD', 2);
  }).then(data => {
    const {bids} = data;
    const price = getPriceAtVolume(bids, 10);
    const size = getSizeAtPrice(price);
    return buy('ETH-USD', price, size);
  }).then(data => {
    console.log(data);
  });
});

follower.onTweet('ETHUSD', 'short', function() {
  cancelAllOrders('ETH-USD').then(data => {
    return getProductOrderBook('ETH-USD', 2);
  }).then(data => {
    const {bids} = data;
    const price = getPriceAtVolume(bids, 10);
    const size = getSizeAtPrice(price);
    return buy('ETH-USD', price, size);
  }).then(data => {
    console.log(data);
  });
});

follower.startFollowing();
