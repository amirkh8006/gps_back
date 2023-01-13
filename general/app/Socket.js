const {
    Create,
    SingleFind,
    MultipleFindArray
} = require('../utils/generator');
var util = require('util');

const {
    login,
    SendSms_With_Kavehnegar,
    test123,
    userRegister,
    decode , encode , existsAccount
} = require('../utils/custom');
const {
    ObjectID
} = require('bson');
const config = require('../config/config');
var isJSON = require('is-json');
var msg = require('../messages');
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

        console.log(`Socket ${io_socket.id} has connected`);
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

         io_socket.on("login", async _findData => {  
            //  console.log('F' , _findData);
             let filters = [];
             let _filter_account= {
                collectionName:"Account",
                fields:{
                    mobileNumber: _findData['fields']['mobileNumber']
                }
           }
           filters.push(_findData);
           filters.push(_filter_account);
        //    console.log('FILTERS' , filters);
        let find  = await MultipleFindArray(filters);
       
        
        // for (let i = 0; i < find['data'].length; i++) {
        //     const element = find['data'][i];
        //     console.log(util.inspect(element, false, null, true /* enable colors */));
            
        // }






             
                let mobileNumber = _findData['fields']['mobileNumber'];
                // console.log('RES' , result);
            
                
               
                if (mobileNumber != null) {

                    let expiredLogin = new Date().getTime() + config.config_ExpiredLogin;
                    let jsonForEncode = {mobileNumber:mobileNumber,expiredLogin:expiredLogin,uid:null};
                    let str_jsonEncode = JSON.stringify(jsonForEncode);
                    let token = encode(str_jsonEncode);
                    find['data'][0]['Auth'][0]['token'] = token;
                    // login_obj['token'] = token;
                }else{
                    find['data'][0]['Auth'][0]['token'] = null
                }
              

                // console.log(util.inspect(find, false, null, true /* enable colors */));

                // login_obj['data'][0]['account'] = user['data'];                

                // console.log('USER' , user);
                // obj['data'][0]['account'] = user;
                // console.log('OBJ_final',result);
                // console.log('object_final' , object_final);

                io_socket.emit('login' , find);
              
         

           
        

        });
   
        // ================== login ===================

        
         // ================== loggedIn User ==================

         io_socket.on("loggedIn", _findData => {
            let obj = {};
            let decode_Json = decode(_findData['fields']['token']);
            let isJson = isJSON(decode_Json);
           
            if (isJson == true) {
                let json = JSON.parse(decode_Json);
                let mobile = json['mobileNumber'];
                let expiredLogin = json['expiredLogin'];
                let currentTime = new Date().getTime();

                if (expiredLogin > currentTime) {

                    obj['mobileNumber'] = mobile;
                    obj['isLoggedIn'] = true;

                    msg.RESULT_MSG["status"] = 200;
                    msg.RESULT_MSG["data"] = [obj] ;
                    msg.RESULT_MSG["message"] = [{SUCCESS:'اطلاعات یافت شد'}];
                    msg.RESULT_MSG["exeption"] = [];

                   
                }else{
                    obj['mobileNumber'] = mobile;
                    obj['isLoggedIn'] = false;
    
                    msg.RESULT_MSG["status"] = 200;
                    msg.RESULT_MSG["data"] = [obj] ;
                    msg.RESULT_MSG["message"] = [{SUCCESS:'مدت اعتبار احراز هویت شما به پایان رسیده است لطفا مجددا وارد شوید'}];
                    msg.RESULT_MSG["exeption"] = [];
                }
                
            }else{
                    obj['mobileNumber'] = 0;
                    obj['isLoggedIn'] = false;
                    msg.RESULT_MSG["status"] = 100;
                    msg.RESULT_MSG["data"] = [obj] ;
                    msg.RESULT_MSG["message"] = [{SUCCESS:'توکن ارسال شده معتبر نیست'}];
                    msg.RESULT_MSG["exeption"] = [];
            }
            io_socket.emit('loggedIn' , msg.RESULT_MSG);

        });
   
        // ================== loggedIn User ===================

        


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

        // io_socket.on("test123", data => {
        //     // console.log('d');

        //     setInterval(() => {
        //         // 1. Find Online User UID (From data) (Get LocalStorage) 
        //         // 2. Find UID From Database Json Result Location
        //         io_socket.emit('test123', "YA HAGH !");
        //     }, 1000);


        // });




        let interval;
        // send location to client
        io_socket.on("get-location", data => {


            console.log("SEND LOCATION DATA", data);
            // io_socket.use(()=>{
            //     console.log('ABC123');
            // });

            // Create(data, null).then((dt) => {
            //     io_socket.emit('location', dt);
            // }).catch((e) => {
            //     console.log('LOG', e);
            // })

            interval = setInterval(() => {
                // 1. Find Online User UID (From data) (Get LocalStorage) 
                // 2. Find UID From Database Json Result Location
                io_socket.emit('location', "YA HAGH !");
            }, config.send_location_inteval_ms);


        });

        io_socket.on('disconnect', () => {
            // TCP_SERVER_DATA = [];
            clearInterval(interval);
        });

    }
}