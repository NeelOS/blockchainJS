const sha256=require('sha256');

function Blockchain(){
    this.chain=[];
    this.pendingTransctions=[];

    this.createNewBlock(100,'0','0');
}

Blockchain.prototype.createNewBlock=function(nonce, previousBlockHash, hash){

    const newBlock={
      index: this.chain.length+1,
        timestamp: Date.now(),
        transactions: this.pendingTransctions,
        nonce : nonce,
        hash: hash,
        previousBlockHash: previousBlockHash
    };

    this.pendingTransctions=[];
    this.chain.push(newBlock);
    return newBlock;
}



Blockchain.prototype.getLastBlock=function(){
    return this.chain[this.chain.length-1];
}


Blockchain.prototype.createNewTransation = function(amount,sender,recipent){

    const newTransaction ={
      amount:amount,
          sender:sender,
        recipent:recipent

    };
    this.pendingTransctions.push(newTransaction);

    return this.getLastBlock()['index']+1;
}

Blockchain.prototype.hashBlock=function(prevousBlockHash,currentBlockData,nonce){
    const dataAsString= prevousBlockHash+nonce.toString()+ JSON.stringify(currentBlockData);
    const hash=sha256(dataAsString);
    return hash;
}


Blockchain.prototype.proofOfWork=function(prevousBlockHash,currentBlockData){
    //repeatedly hash block until it finds correct hash =>'0000OSBFHFDND'
    //uses current block data for hash but also the previous block hash
    //continuously change the nonce value until it finds correct hash
    //returns to us the nonce value that create correct hash

    let nonce=0;
    let hash=this.hashBlock(prevousBlockHash,currentBlockData,nonce);
    while(hash.substring(0,4)!=='0000'){
        nonce++;
        hash=this.hashBlock(prevousBlockHash,currentBlockData,nonce);
    }
    console.log(hash);
    return nonce;
}

module.exports=Blockchain;