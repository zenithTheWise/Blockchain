const sha256 = require('crypto-js/sha256');

class Transaction {
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress;
    this.toAddress   = toAddress;
    this.amount      = amount;
  }
}

class Block {

  // Construct a Block piece with index, time, data, prevHash, and nonce
  constructor(time, transactions, prevHash = '') {
    this.prevHash     = prevHash;
    this.time         = time;
    this.transactions = transactions;
    this.hash         = this.calculateHash();
    this.nonce        = 0;
  }

  // Calculate it's hash
  calculateHash() {
    const combinedHash = sha256(this.index + this.prevHash + this.time + JSON.stringify(this.data) + this.nonce);
    return combinedHash.toString();
  }

  // mineBlock w/ difficulty param
  mineBlock(difficulty) {

    // While the beginning substrings of difficulty length is 0s
    while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {

      // Increment the nonce, this is the factor the continously changes the hash, because other properties inside our hash should be immutable
      this.nonce++;

      // Calculate the hash
      this.hash = this.calculateHash();
    }

    console.log('Block mined: ' + this.hash);
  }
}

class Blockchain {

  // Construct a Blockchain array with Genesis Block as first item, and difficulty of mining the blockchain
  constructor() {
    this.chain               = [new Block('01/01/2018', 'Genesis', '0')];
    this.difficulty          = 2;
    this.pendingTransactions = [];
    this.miningReward        = 100;
  }

  // Peek at last block
  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  minePendingTransactions(miningRewardAddress) {
    let block = new Block(Date.now(), this.pendingTransactions);
    block.mineBlock(this.difficulty);

    console.log('Block successfully mined!');
    this.chain.push(block);

    this.pendingTransactions = [
      new Transaction(null, miningRewardAddress, this.miningReward)
    ];
  }

  createTransaction(transaction) {
    this.pendingTransactions.push(transaction);
  }

  getBalanceOfAddress(address) {
    let balance = 0;
    for (const block of this.chain) {
      for (const trans of block.transactions) {
        if (trans.fromAddress === address) {
          balance -= trans.amount;
        }

        if (trans.toAddress === address) {
          balance += trans.amount;
        }
      }
    }

    return balance;
  }
  /*// Add onto the blockchain (When you add, you have to 'mine' for the block so it delays the time for having each new block added)
  addBlock(newBlock) {
    newBlock.prevHash = this.getLatestBlock().hash;
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
  }*/

  // Determine if block chain has been tampered with
  isChainValid() {

    // Loop through the block chain
    for (let i = 1; i < this.chain.length; i++) {
      const current = this.chain[i];
      const prev    = this.chain[i - 1];

      // If (currentHash !== current.CalculateHash || current's previous hash !== previous hash), return false
      if (current.hash !== current.calculateHash() ||
          current.prevHash !== prev.hash) return false;
    }

    // Return true if chain has not been tampered with
    return true;
  }
}

/* --------- Test Cases ---------- */

// Create new BlockChain
let benCoin = new Blockchain();

benCoin.createTransaction(new Transaction('address1', 'address2', 100));
benCoin.createTransaction(new Transaction('address2', 'address1', 50));

console.log('\nStarting the miner...');
benCoin.minePendingTransactions('ben-address');

console.log(`\nBalance of Ben's wallet is ${benCoin.getBalanceOfAddress('ben-address')}`);

console.log('\nStarting the miner...');
benCoin.minePendingTransactions('ben-address');

console.log(`\nBalance of Ben's wallet is ${benCoin.getBalanceOfAddress('ben-address')}`);
//console.log('Mining block 1..');
//benCoin.addBlock(new Block(1, '04/20/2018', { amount : 4 }));

//console.log('Mining block 2..');
//benCoin.addBlock(new Block(2, '04/21/2018', { amount : 5 }));

/*// Print block chain and test its validity
console.log(JSON.stringify(benCoin, null, 2));
console.log('Is blockchain valid ? ' + benCoin.isChainValid());

// Tampering with the block
benCoin.chain[1].data = { amount : 100 };
benCoin.chain[1].hash = benCoin.chain[1].calculateHash();

// Test validity of block
console.log('Is blockchain valid ? ' + benCoin.isChainValid());
*/
