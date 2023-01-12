var net = require('net');
const server = net.createServer(); 
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const {TCP_SERVER} = require('./app/Socket');
const {port , host} = require('./config/config');



server.on('connection', TCP_SERVER);


server.listen(port, host, () => {
    console.log('Tcp Server Is Running On Port ' + 3001 + '.');
});
