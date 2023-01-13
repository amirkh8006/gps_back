const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const {SOCKET_SERVER} = require('./app/Socket');
const {port} = require('./config/config');



// io.use((socket, next) => {
//     console.log('(default) middleware running...');
//     next();
//  }).on('connection', socket => {
//    console.log('(default) client connected');
//  });
 
//  // Following works, but client does not receive 'connect' or 'connection':
//  io.of(/.*/).use((socket, next) => {
//     console.log('(location) middleware running...');
//     next();
//  }).on('connection', socket => {
//    console.log('(admin) client connected');
//  });

// const myGlobalMiddleware = (socket, next) => {
//     console.log("TEST!!!");
//     next();
//   }

//   io.of("/").use(myGlobalMiddleware);

//   io.of("/", (namespace) => {
//     namespace.use(myGlobalMiddleware);
//   });

// io.of('/').use((socket, handler) => {

//     namespace.use(myGlobalMiddleware);
// });



// io.on("connection", socket => {
//     // ...
//     console.log('CONNNNNN');
//     socket.on("findqq", docId => {
//         console.log('D' , docId);
//         socket.emit("findqq" , "DDDDDD");
//     //   socket.emit("findqq", "docId");
//     });
  
//     // ...
//   });

io.on("connection", SOCKET_SERVER);


// io.of('location').use((socket, next) => {
//     console.log('middleware running...');
//     next();
//  })

// const myGlobalMiddleware = (socket, next) => {
//     console.log('LOCATION ACTION !');
//     next();
//   }

//   io.of("location").use(myGlobalMiddleware);

// io.use((socket, next) => {
//     console.log('ABC');
//     next();
// });

// io.use((socket, next) => {
//     let handshake = socket.handshake;
//     console.log('HA' , handshake);
//   });


http.listen(port, () => {
    console.log(`Listening On Port ${port}`);
});