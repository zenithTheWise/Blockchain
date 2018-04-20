const sha256 = require('crypto-js/sha256');

class Block {

  // Construct a Block piece with index, time, data, and prevHash
  constructor(index, time, data, prevHash = '') {
    this.index    = index;
    this.time     = time;
    this.data     = data;
    this.prevHash = prevHash;
    this.hash     = '';
  }

  // Calculate it's hash
  calculateHash() {
    const combinedHash = sha256(this.index + this.prevHash + this.time + JSON.stringify(this.data));
    return combinedHash.toString();
  }
}

class Blockchain {

  // Construct a Blockchain array with Genesis Block as first item
  constructor() {
    this.chain = [new Block(0, '01/01/2018', 'Genesis', '0')];
  }

  // Peek at last block
  peek() {
    return this.chain[this.chain.length - 1];
  }

  // Add onto the blockchain
  push(newBlock) {
    newBlock.prevHash = this.getLatestBlock().hash;
    newBlock.hash     = newBlock.calculateHash();
    this.chain.push(newBlock);
  }

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
benCoin.addBlock(new Block(1, '04/20/2018', { amount : 4 }));
benCoin.addBlock(new Block(2, '04/21/2018', { amount : 5 }));

// Print block chain and test its validity
console.log(JSON.stringify(benCoin, null, 2));
console.log('Is blockchain valid ? ' + benCoin.isChainValid());

// Tampering with the block
benCoin.chain[1].data = { amount : 100 };
benCoin.chain[1].hash = benCoin.chain[1].calculateHash();

// Test validity of block
console.log('Is blockchain valid ? ' + benCoin.isChainValid());



