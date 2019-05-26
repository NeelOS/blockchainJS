const Blockchain= require('./blockchain');

const bitcoin=new Blockchain();
console.log(bitcoin);
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