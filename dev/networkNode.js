const express =require('express');
const app=express();
const bodyParser=require('body-parser');
const BlockChain=require('./blockchain');
const uuid=require('uuid/v1');
const port=process.argv[2];
const rp=require('request-promise');


const nodeAddress=uuid().split('-').join('');
const bitcoin=new BlockChain();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));

app.get('/blockchain',function(req,res){
    res.send(bitcoin);
});


app.post('/transaction',function(req,res){
    const newTranaction=req.body;
    const blockIndex= bitcoin.addTransactionToPendingTransaction(newTranaction);
    res.json({note: `Transaction will be added in block ${blockIndex}.`});
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

    
    const newBlock= bitcoin.createNewBlock(nonce,previousBlockHash,blockHash);

    const requestPromise=[];
    bitcoin.networkNode.forEach(networkNodeUrl=>{
        const requestOption={
            uri:networkNodeUrl+'/receive-new-block',
            method :'POST',
            body : {newBlock : newBlock},
            json: true
        };

        requestPromise.push(rp(requestOption));
    });

    Promise.all(requestPromise)
    .then(data=>{
        const requestOption={
            uri : bitcoin.currentNodeUrl+'/transaction/broadcast',
            method : 'POST',
            body :{
                amount:12.5,
                sender :"00",
                recipent : nodeAddress
            },
            json :true
        };
        return rp(requestOption);
    })


    res.json({note : "New Block mined and broadcast Successfully",
              block : newBlock

});
});



app.post('/receive-new-block',function(req,res){
    const newBlock=req.body.newBlock;
    const lastBlock=bitcoin.getLastBlock();
    const correctHash=lastBlock.hash===newBlock.previousBlockHash;
    const correctIndex=lastBlock['index']+1===newBlock['index'];
    if(correctHash && correctIndex){
        bitcoin.chain.push(newBlock);
        bitcoin.pendingTransctions=[];
        res.json({note : 'New Block recevied and accepted',
                   newBlock: newBlock    
                 });
    }else{
        res.json({note : 'New Block rejected',
                newBlock : newBlock
            });
    }

});

//register a node and broadcast the node to the entire network
app.post('/register-and-broadcast-node',function(req,res){
    const newNodeUrl=req.body.newNodeUrl;
    if(bitcoin.networkNode.indexOf(newNodeUrl)==-1) bitcoin.networkNode.push(newNodeUrl);

    const regNodePromises=[];
    bitcoin.networkNode.forEach(networkNodeUrl => {
        const requestOptions ={
            uri:networkNodeUrl+'/register-node',
            method : 'POST',
            body : {newNodeUrl : newNodeUrl},
            json : true
        };
    regNodePromises.push(rp(requestOptions));
    });
    Promise.all(regNodePromises).then(data => {
        const bulkRegisterOption={
            uri:newNodeUrl+'/register-node-bulk',
            method : 'POST',
            body : {allNetworkNodes : [...bitcoin.networkNode,bitcoin.currentNodeUrl]},
            json : true
        };
    return rp(bulkRegisterOption);
    })
    .then(data=>{
    res.json({note : 'New node register with network successfully'});
})
});


//register a node with the network
app.post('/register-node',function(req,res){
 const newNodeUrl=req.body.newNodeUrl;
    const nodeNotAlreadyPresent=bitcoin.networkNode.indexOf(newNodeUrl)==-1;
    const notCurrentNode=bitcoin.currentNodeUrl!==newNodeUrl;
    if(nodeNotAlreadyPresent && notCurrentNode)bitcoin.networkNode.push(newNodeUrl);
    res.json({note : 'New Node register successfully'});
});

//register multiple nodes at once
app.post('/register-node-bulk',function(req,res){
 const allNetworkNodes=req.body.allNetworkNodes;
    allNetworkNodes.forEach(networkNodeUrl=>{
        const nodeNotAlreadyPresent=bitcoin.networkNode.indexOf(networkNodeUrl)==-1;
        const notCurrentNode=bitcoin.currentNodeUrl!==networkNodeUrl;
        if(nodeNotAlreadyPresent && notCurrentNode) bitcoin.networkNode.push(networkNodeUrl);
    });
res.json({note: 'Bulk registration successful.'});
});

app.listen(port, function(){
    console.log(`listening on port ${port}`);
});


app.post('/transaction/broadcast',function(req,res){
    const newTranaction=bitcoin.createNewTransation(req.body.amount,req.body.sender,req.body.recipent);
    bitcoin.addTransactionToPendingTransaction(newTranaction);

    const requestPromise=[];
    bitcoin.networkNode.forEach(networkNodeUrl => {
        const requestOptions={
            uri : networkNodeUrl+'/transaction',
            method : 'POST',
            body: newTranaction,
            json: true
        };
    requestPromise.push(rp(requestOptions));
    });

    Promise.all(requestPromise)
    .then(data=>{
        res.json({note:'Transaction created and Broadcast Successfully.'})
    });
});

app.get('/consensus',function(req,res){
    const requestPromise=[]
    bitcoin.networkNode.forEach(networkNodeUrl=>{

    const requestOption={
        uri : networkNodeUrl + '/blockchain',
        method : 'GET',
        json : true
    };
    requestPromise.push(rp(requestOption));
    });
    Promise.all(requestPromise)
    .then(blockchains=>{
        const currentChainLength=bitcoin.chain.length;
        let maxchainLength=currentChainLength;
        let newLongestChain=null;
        let newPendingTransactions=null;
        blockchains.forEach(blockchain=>{
            if(blockchain.chain.length>maxchainLength){
                maxchainLength=blockchain.chain.length;
                newLongestChain=blockchain.chain;
                newPendingTransactions=blockchain.pendingTransctions;
            };
        });


        if(!newLongestChain || (newLongestChain && bitcoin.chainIsValid(newLongestChain))){
            res.json({note : 'current chain has not been replaced',
                        chain : bitcoin.chain
                        });
        }
        else{
            bitcoin.chain=newLongestChain;
            bitcoin.pendingTransctions=newPendingTransactions;
            res.json({note : 'current chain is repalced with longest chain in the network',
                        chain : bitcoin.chain
                    });
        }
    });
});

app.get('/block/:blockHash',function(req,res){  //in the next line we are getting the param value :/sdbsbvv
    const blockHash=req.params.blockHash;
    const correctBlock=bitcoin.getBlock(blockHash);
    res.json({block : correctBlock})

});

app.get('/transaction/:transactionId',function(req,res){
    const transactionId=req.params.transactionId;
    const transactionData=bitcoin.getTransaction(transactionId);
    res.json({
        transaction: transactionData.transaction,
        block : transactionData.block
    });
});

app.get('/address/:address',function(req,res){
    const address=req.params.address;
    const addressData=bitcoin.getAddressData(address);

    res.json({
        addressData: addressData
    });

});

app.get('/block-explorer',function(req,res){
    res.sendFile('./block-explorer/index.html',{ root:__dirname});
});