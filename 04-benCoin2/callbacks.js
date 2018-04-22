/*function typical(a, b, c) {
  let x = a + b;
  c(x);
};

typical(3, 2, function(nachos) {
  console.log(nachos);
});*/

let request = require('request');

function getPrice(cb) {
  request({
    url: 'https://blockchain.info/stats?format=json',
    json: true
  }, (err, res, body) => {
    let price = body.market_price_usd;
    let blocks = body.n_blocks_total;
    cb(price, blocks);
  });
}

function hello() {
  console.log('hello');
};

getPrice(function(icecream, blocks) {
  console.log(icecream);
  console.log(blocks);
  hello();
});



