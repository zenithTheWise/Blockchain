const request    = require('request');
const express    = require('express');
const app        = express();
const bodyParser = require('body-parser');
const bitcore    = require('bitcore-lib');

// User Body Parser
app.use(bodyParser.urlencoded({ extended: true }));

// Callback asynchronous javascript function to get bitCoin wallet
let brainWallet = (user, callback) => {
  let input = new Buffer(user);
  let hash  = bitcore.crypto.Hash.sha256(input);
  let bn    = bitcore.crypto.BN.fromBuffer(hash);
  let pk    = new bitcore.PrivateKey(bn).toWIF();
  let addy  = new bitcore.PrivateKey(bn).toAddress();

  callback(pk, addy);
};

app.set('view engine', 'ejs');

app.use(bodyParser.json());

function getPrice(callback) {
  request({
    url: 'https://api.coindesk.com/v1/bpi/currentprice.json',
    json: true
  }, (err, res, body) => {
    callback(body.bpi.USD.rate.replace(/,/g, ''));
  });
}

app.get('/', (req, res) => {
  getPrice(function(price) {
    res.render('index', {
      lastPrice: price
    });
  });
});

app.get('/brain', (req, res) => {
  getPrice(function(price) {
    res.render('brain', {
      lastPrice: price
    });
  });
});

app.get('/converter', (req, res) => {
  getPrice(function(price) {
    res.render('converter', {
      lastPrice: price
    });
  });
});

app.post('/wallet', (req, res) => {
  let user  = req.body.user;
  brainWallet(user, (priv, addr) => {
    res.status(200).send(`The Brain Wallet of: ${user} <br>Addy: ${addr}<br>Private Key: ${priv}`);
  });
});

app.listen(8080, () => console.log('listening on 8080'));
