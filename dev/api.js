const express =require('express');
const app=express();
const bodyParser=require('body-parser');
const BlockChain=require('./blockchain');
const uuid=require('uuid/v1');


const nodeAddress=uuid().split('-').join('');
const bitcoin=new BlockChain();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));

app.get('/blockchain',function(req,res){
    res.send(bitcoin);
});


app.post('/transaction',function(req,res){
    const blockIndex=bitcoin.createNewTransation(req.body.amount,req.body.sender,req.body.recipent);
    res.json({note : `Transaction will be added in block ${blockIndex}.`});
});

app.get('/mine',function(req,res){
    const lastBlock=bitcoin.getLastBlock();
    const previousBlockHash=lastBlock['hash'];
    const currentBlockData={
        transaction: bitcoin.pendingTransctions,
        index : lastBlock['index'] +1
    };
    const nonce=bitcoin.proofOfWork(previousBlockHash,currentBlockData);
    const blockHash=bitcoin.hashBlock(previousBlockHash,currentBlockData,nonce);

    bitcoin.createNewTransation(12.5,"00",nodeAddress);
    const newBlock= bitcoin.createNewBlock(nonce,previousBlockHash,blockHash);
    res.json({note : "New Block created Successfully",
              block : newBlock

});
});



app.listen(3000, function(){
    console.log('listening on port 3000');
});
