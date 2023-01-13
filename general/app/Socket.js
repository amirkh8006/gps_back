const {
    Create,
    SingleFind
} = require('../utils/generator');
const {
    login,
    SendSms_With_Kavehnegar,
    test123,
    userRegister,
    decode,
    encode
} = require('../utils/custom');
const {
    ObjectID
} = require('bson');
const config = require('../config/config');

module.exports = {

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

        console.log(`Socket ${socketId} has connected`);
        // SendSms_With_Kavehnegar(clientIp , '' , '');

        // userRegister(io_socket ,  )
        // console.log(`Header : ${io_socket.handshake}`);

        // ================== start-login ===================

        io_socket.on("start-login", data => {
            userRegister(data, clientIp, clientPort).then(dt => {
                io_socket.emit('start-login', dt);
            });
        });

        // ================== start-login ===================



        // ================== login ==================

        io_socket.on("login", _findData => {
            SingleFind(_findData, null).then(result => {

                let mobileNumber = _findData['fields']['mobileNumber'];
                let expiredLogin = new Date().getTime() + config.config_ExpiredLogin;
                jsonForDecode = {
                    mobileNumber: mobileNumber,
                    expiredLogin: expiredLogin,
                    uid: null
                };
                let token = decode(jsonForDecode);
                let obj = result;
                console.log(result);
                obj['token'] = token;

                io_socket.emit('login', obj);
            });
        });

        // ================== login ===================




        // ================== Public CREATE ==================

        io_socket.on("create", data => {
            Create(data, null).then(result => {
                io_socket.emit('create', result);
            });
        });

        // ================== Public CREATE ==================

        io_socket.on("find", _findData => {
            SingleFind(_findData, null).then(result => {
                // console.log('FIND' , result);
                io_socket.emit('find', result);
            });
        });


        // ================= AUTH =======================

        // io_socket.on("login", data => {

        //     let json_val = {
        //         id: '12fg458er',
        //         phoneNumber: '09351371050',
        //         expireDate: '2022-02-05'
        //     };
        //     console.log('DATA', data);
        //     login("Mohamamd", "123").then(dt => {
        //         console.log('LOGIN', dt);
        //         io_socket.emit('login', dt);
        //     });
        //     // let token = data.token;
        //     // console.log('DD' , data);

        // });

        // ================ AUTH ========================





        var interval;
        // send location to client
        io_socket.on("get-location", (data) => {
            

            interval = setInterval(async () => {
                let collectionFilter = {
                    collectionName: "location",
                    fields: {
                        uid: data.uid
                    }
                }

                let result = await SingleFind(collectionFilter, null);

                io_socket.emit(`send-location`, {
                    result: result
                });

                //     // 1. Find Online User UID (From data) (Get LocalStorage) 
                //     // 2. Find UID From Database Json Result Location
            }, config.send_location_inteval_ms);


        });

        io_socket.on('disconnect', () => {
            // TCP_SERVER_DATA = [];
            clearInterval(interval);
        });

    }
}