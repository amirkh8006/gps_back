const {Create, SingleFind} = require('./generator');
const {login  , SendSms_With_Kavehnegar, test123 , userRegister} = require('./custom');
const { ObjectID } = require('bson');

module.exports = {
        
    TCP_SERVER(tcp_socket){



        sockets = [];
        // tcp_socket.setEncoding('UTF-8');
        tcp_socket.on('data', function(data) {
                
                // 1. Read data And Save To  Database .
                // console.log('DATA_FUN' , data.toString());
                // 2. send to Client json MC60

                let str = data.toString('utf8');

                if (/^[\],:{}\s]*$/.test(str.replace(/\\["\\\/bfnrtu]/g, '@').
                replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
                replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
                
                  //the json is ok
                  let json = JSON.parse(str);
                  console.log('JSON OK' , json);
                
                }else{

                 //the json is not ok
                 console.log('JSON NOT OK');

                }

                // let json = JSON.parse(str);
                // console.log('AAA' , json);

                // console.log( "String = %s", str );
                // let obj = JSON.parse( str.substring(0, str.length-1) );
                // console.log('DDD' , obj);
              
                // let str2 = JSON.stringify(obj, null, 4); // Reverse conversion
                // console.log("Obj = %s", str2);           // and output to inspect

                tcp_socket.write("SEND");
                tcp_socket.end();
               
            });
    
            tcp_socket.on('close', function() {

                sockets.splice(sockets.indexOf(tcp_socket), 1);
                // console.info('Sockets connected: ' + sockets.length);
               
            });

            sockets.push(tcp_socket);
    },

    SOCKET_SERVER(io_socket) {


        // login('' , '' , 'abc' , 60);
        // io_socket.use((packet, next) => {
        //     console.log('ABC123' , packet);
        //     // next();
        //     return next(new Error("ERROR MSG"));
        // });

        // io_socket.use((packet, next) => {
        //     console.log('321' , packet[0]);
        //     // return next(new Error("ERROR MSG"));
        // });

        var socketId = io_socket.id;
        var clientIp = io_socket.request.connection.remoteAddress;
        var clientPort = io_socket.request.connection.remotePort;

        console.log(`Socket ${io_socket.id} has connected`);
        // SendSms_With_Kavehnegar(clientIp , '' , '');
        
        // userRegister(io_socket ,  )
        // console.log(`Header : ${io_socket.handshake}`);

        // ================== REGISTER ==================

        io_socket.on("register", data => {  
         userRegister(data ,clientIp , clientPort).then(dt=>{
                io_socket.emit('register' ,dt);
            });
        });

        // ================== REGISTER ===================

        

        // ================== Public CREATE ==================

        io_socket.on("create", data => {     
            Create(data , null).then(result=>{
                io_socket.emit('create' , result);
            });
        });
        
        // ================== Public CREATE ==================

        io_socket.on("find", _findData => {
            SingleFind(_findData , null).then(result=>{
                // console.log('FIND' , result);
                io_socket.emit('find' , result);
            });
        });


        // ================= AUTH =======================

        io_socket.on("login", data => {

            let  json_val = {id:'12fg458er' , phoneNumber:'09351371050' , expireDate: '2022-02-05'};
            console.log('DATA' , data);
            login("Mohamamd" , "123").then(dt=>{
                console.log('LOGIN' , dt);
                io_socket.emit('login' , dt);
            });
            // let token = data.token;
            // console.log('DD' , data);
            
        });

        // ================ AUTH ========================





        let interval;
        // send location to client
        io_socket.on("location", data => {

            // io_socket.use(()=>{
            //     console.log('ABC123');
            // });

            Create(data , null).then((dt)=>{
                io_socket.emit('location' , dt);
            }).catch((e)=>{
                console.log('LOG' , e);
            })

        //    interval =  setInterval(() => {
        //         // 1. Find Online User UID (From data) (Get LocalStorage) 
        //         // 2. Find UID From Database Json Result Location
        //         io_socket.emit('location' , "YA HAGH !");
        //     }, 1000);
    
    
        });
    
        io_socket.on('disconnect', () => {
            // TCP_SERVER_DATA = [];
            clearInterval(interval);
        });
    
    }
}