const Blockchain= require('./blockchain');

const bitcoin=new Blockchain();
//console.log(bitcoin);
//bitcoin.createNewBlock(12345,'ABCDEHFSG1','DFGDFGFDGFD');
//bitcoin.createNewBlock(23467,'ABCDGHFSG1','SDGDGDGFDGDG');
//bitcoin.createNewBlock(46432,'ABCDGDGSG1','DGDFDFGFDG');
//bitcoin.createNewBlock(86546,'DGFDGFDHG','GDFHFDFDFD');

/*bitcoin.createNewTransation(100,'INDSDGSDFDB','PREBFDHSBD');
bitcoin.createNewBlock(23467,'ABCDGHFSG1','SDGDGDGFDGDG');
bitcoin.createNewTransation(50,'INDSDGSDFDB','PREBFDHSBD');
bitcoin.createNewTransation(5000,'INDSDGSDFDB','PREBFDHSBD');
bitcoin.createNewTransation(200,'INDSDGSDFDB','PREBFDHSBD');
bitcoin.createNewBlock(46432,'ABCDGDGSG1','DGDFDFGFDG'); */

/*const prevousBlockHash='SDGSDBSFDDHBDBFDHRRT4353';
const cuurentBlockData=[
    {
        amount :100,
        sender : 'FHFRT43TY43',
        recipent: '4643TEWGNV'
    },
    {
        amount :654,
        sender : 'RTHBFGUHFD',
        recipent: 'SDGFDBFDHHD353'
    },
    {
        amount :876,
        sender : 'GEWT43T',
        recipent: 'T43TREHREUERH'
    }
];
var nonce;

console.log(bitcoin.proofOfWork(prevousBlockHash,cuurentBlockData));
nonce=bitcoin.proofOfWork(prevousBlockHash,cuurentBlockData);
console.log(bitcoin.hashBlock(prevousBlockHash,cuurentBlockData,nonce));*/
//console.log(bitcoin.hashBlock(prevousBlockHash,cuurentBlockData,nonce));
//console.log(bitcoin.chain[2]);


const bc1={
"chain": [
{
"index": 1,
"timestamp": 1559471360709,
"transactions": [],
"nonce": 100,
"hash": "0",
"previousBlockHash": "0"
},
{
"index": 2,
"timestamp": 1559471369509,
"transactions": [],
"nonce": 16441,
"hash": "00009b2ef664890dbcd795344f8145bac1710db47cea457183f41c9ca24c3285",
"previousBlockHash": "0"
},
{
"index": 3,
"timestamp": 1559471392226,
"transactions": [
{
"amount": 12.5,
"sender": "00",
"recipent": "486d5310852111e9bfbc4dc7ddc1e345",
"transactionId": "4db73ca0852111e9bfbc4dc7ddc1e345"
},
{
"amount": 54,
"sender": "SGDSBFDHHREGWET543 ",
"recipent": "FDBFDBBFDFDGDGDSVDFWFAS",
"transactionId": "51345570852111e9bfbc4dc7ddc1e345"
},
{
"amount": 23,
"sender": "SGDSBFDHHREGWET543 ",
"recipent": "FDBFDBBFDFDGDGDSVDFWFAS",
"transactionId": "54bae420852111e9bfbc4dc7ddc1e345"
},
{
"amount": 76,
"sender": "SGDSBFDHHREGWET543 ",
"recipent": "FDBFDBBFDFDGDGDSVDFWFAS",
"transactionId": "56887830852111e9bfbc4dc7ddc1e345"
},
{
"amount": 87,
"sender": "SGDSBFDHHREGWET543 ",
"recipent": "FDBFDBBFDFDGDGDSVDFWFAS",
"transactionId": "58d26830852111e9bfbc4dc7ddc1e345"
}
],
"nonce": 35701,
"hash": "0000eb64c3c33071bd51b6d6b4af0ec2786a3f4db21ded278dc1d302d4fbf66c",
"previousBlockHash": "00009b2ef664890dbcd795344f8145bac1710db47cea457183f41c9ca24c3285"
}
],
"pendingTransctions": [
{
"amount": 12.5,
"sender": "00",
"recipent": "486d5310852111e9bfbc4dc7ddc1e345",
"transactionId": "5b37f680852111e9bfbc4dc7ddc1e345"
}
],
"currentNodeUrl": "http://localhost:3001",
"networkNode": []
};

console.log(bitcoin.chainIsValid(bc1.chain));

