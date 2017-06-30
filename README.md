# follow-vicki

Execute trades on GDAX based on Vicki's tweets. You need API keys from Twitter and GDAX.

Instructions:
1. Checkout the repo
2. `npm install`
3. Make a copy of `config.sample.js` and save it as `config.js`
4. Obtain API keys from [GDAX](https://www.gdax.com/settings/api) and from [Twitter](https://apps.twitter.com/) and fill in `config.js`
5. Edit `follow.js` to customize the trading logic. By default, it will buy 0.01 ETH when Vicki goes long on ETHUSD at the highest bid or sell 0.01 ETH when Vicki goes long on ETHUSD at the lowest ask.
6. `npm start` to start the bot

The bot will print out Vicki's tweets when they arrive and execute any callback function registered on the (currency pair, direction) tuple.
