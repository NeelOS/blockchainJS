const sha256=require('sha256');
const currentNodeUrl=process.argv[3];
const uuid=require('uuid/v1');
function Blockchain(){
    this.chain=[];
    this.pendingTransctions=[];
    this.currentNodeUrl=currentNodeUrl;  //to store his own network path
    this.networkNode=[];    //to store url for all other network
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
};



Blockchain.prototype.getLastBlock=function(){
    return this.chain[this.chain.length-1];
};


Blockchain.prototype.createNewTransation = function(amount,sender,recipent){

    const newTransaction ={
      amount:amount,
        sender:sender,
        recipent:recipent,
        transactionId : uuid().split('-').join('')

    };

    return newTransaction;

};

Blockchain.prototype.addTransactionToPendingTransaction=function(transactionObj){

    this.pendingTransctions.push(transactionObj);
    return this.getLastBlock()['index']+1;
};

Blockchain.prototype.hashBlock=function(prevousBlockHash,currentBlockData,nonce){
    const dataAsString= prevousBlockHash+nonce.toString()+ JSON.stringify(currentBlockData);
    const hash=sha256(dataAsString);
    return hash;
};


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
};



Blockchain.prototype.chainIsValid=function(blockchain){
    let validChain=true;
    for (var i = 1; i < blockchain.length; i++) {
        const currentBlock=blockchain[i];
        const prevBlock=blockchain[i-1];
        const blockHash=this.hashBlock(prevBlock['hash'],{transactions : currentBlock['transactions'],index : currentBlock['index']},currentBlock['nonce']);
        if(blockHash.substring(0,4)!=='0000') validChain=false;
        if(currentBlock['prevousBlockHash']!==prevBlock['hash']) validChain=false; //chain is not valid
    };

    const genesisBlock=blockchain[0];
    const correntNonce=genesisBlock['nonce']===100;
    const correctPreviousBlockHash=genesisBlock['prevousBlockHash']==='0';
    const correctHash=genesisBlock['hash']==='0';
    const corrctTransactions=genesisBlock['transactions'].length===0

    if(!correntNonce || !correctPreviousBlockHash || !correctHash || !corrctTransactions) validChain=false;

    return validChain;
};

Blockchain.prototype.getBlock=function(blockHash){
    let correctBlock=null;
    this.chain.forEach(block=> {
        if(block.hash===blockHash) correctBlock=block;
    });

    return correctBlock;
};


Blockchain.prototype.getTransaction=function(transactionId){
    let correctTransaction=null;
    let correctBlock=null;
    this.chain.forEach(block=>{
        block.transactions.forEach(transaction=>{
            if(transaction.transactionId===transactionId){
                correctTransaction=transaction;
                correctBlock=block;
            };
        });
    });


    return {
        transaction: correctTransaction,
        block : correctBlock
    };
};



Blockchain.prototype.getAddressData=function(address){
const addressTransactions=[];
this.chain.forEach(block=>{
    block.transactions.forEach(transaction=>{
        if(transaction.sender===address || transaction.recipent===address){
            addressTransactions.push(transaction);
        };
    });
});

let balance=0;
addressTransactions.forEach(transaction=>{
    if(transaction.recipent===address) balance+=transaction.amount;
    else if(transaction.sender===address) balance-=transaction.amount;
});

return {
    addressTransactions : addressTransactions,
    addressBalance : balance
};
};

module.exports=Blockchain;