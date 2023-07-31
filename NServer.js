'use strict';

const { PeerRPCServer }  = require('grenache-nodejs-http')
const Link = require('grenache-nodejs-link')

const PORT = 20000;
const ANUNCEMENT = "ns";

let names = [];


console.log("***************************");
console.log("       NAMESEREVER")
console.info("BASE PORT: "+PORT);
console.log("***************************");

for(let i=2,sz=process.argv.length;i<sz;i++){
    const name = process.argv[i];
    names.push(name);
    console.log("Register name: "+name);
}

console.log("Create Link");
const link = new Link({
    grape: 'http://127.0.0.1:30001'
});
link.start();

console.log("Init peer");
const peer = new PeerRPCServer(link, {
    timeout: 300000
});
peer.init();

const serviceName = peer.transport('server');
serviceName.listen(PORT);
console.log("Created NS at port "+serviceName.port);


setInterval(function () {
    link.announce(ANUNCEMENT, serviceName.port, {});
}, 1000)


serviceName.on('request', (rid, key, payload, handler) => {
    console.log("Received at nNS: "+JSON.stringify(payload));
    handler.reply(null, { result: 'OK',names });
});


