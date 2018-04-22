const lotion = require('lotion');

// Creating the lotion app with initialState options
let app = lotion({
  initialState: {
    count: 0
  }
});

// Middleware MUST be deterministic
// This is the smart contract
app.use((state, tx) => {
  if (state.count === tx.nonce) state.count++;
});


app.listen(3000).then(genesis => {
  console.log('App listening on port 3000.');
  console.log(genesis);
});
