const uniqueRandomRange = require("unique-random-range");
const first_word_token = '/*Antidisestablishmentarianism*/#/$Otorhinolaryngologist$/'
const last_word_token = '/*Supercalifragilisticexpialidocious*/#/$Heterogeneous$/'
const Encodr = require('encodr');
// import Encodr from "encodr"
var base64 = require('base-64');



const {
    Create,
    Create_V1,
    SingleFind,
    MultipleFindArray,
    SingleFindLocationHistory
} = require('../utils/generator');
var util = require('util');

const {
    login,
    SendSms_With_Kavehnegar,
    test123,
    userRegister,
    decode , encode , SendSms_With_Body_Kavehnegar,
    postRequestNeshan
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

        console.log(`Socket ${socketId} has connected`);
        // SendSms_With_Kavehnegar(clientIp , '' , '');

        // userRegister(io_socket ,  )
        // console.log(`Header : ${io_socket.handshake}`);



        io_socket.on("sendSms_Kavehnegar", async data => {

            let rand = uniqueRandomRange(1032, 999999);
            let randomCode = rand();
            let randCode =  await randomCode;
            let _filter = {
                collectionName:"Auth",
                fields:{
                    mobileNumber: data['mobileNumber']
                }
            }
        
            let _find = await SingleFind(_filter);
            let _find_User = _find['data'][0];
           
            if (_find['data'].length > 0) {

                let update_Auth = {
                    Auth:{
                        id: _find_User['_id'],
                        smsCode: randCode,
                        expiredSmsCode: new Date().getTime() + config.config_expireSmsCode
                    }
                }
                Create(update_Auth , null);
            }
            // SendSms_With_Body_Kavehnegar(data['mobileNumber'] , randCode); // zamane publish in khat az comment darbiad

        });




        // ================== start-login ===================

        io_socket.on("start-login", async data => {
            userRegister(data, clientIp, clientPort).then(dt => {
                io_socket.emit('start-login', dt);
            });
        });

        // ================== start-login ===================



        io_socket.on("login", async _findData => {  
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
                    // console.log('TTT' , await newToken(mobileNumber));
                    // let expiredLogin = new Date().getTime() + config.config_ExpiredLogin;
                    // let jsonForEncode = {mobileNumber:mobileNumber,expiredLogin:expiredLogin,uid:null};
                    // let str_jsonEncode = JSON.stringify(jsonForEncode);
                    // let token = encode(str_jsonEncode);
                    find['data'][0]['Auth'][0]['token'] = await newToken(mobileNumber);
                    // login_obj['token'] = token;
                }else{
                    find['data'][0]['Auth'][0]['token'] = null
                }
              

                // console.log(util.inspect(find, false, null, true /* enable colors */));

                // login_obj['data'][0]['account'] = user['data'];                

                // console.log('USER' , user);
                // obj['data'][0]['account'] = user;
                // console.log('OBJ_final',result);
                // console.log('object_final' , find);

                io_socket.emit('login' , find);
              
         

           
        

        });


        // ================== login ===================

        
         // ================== Guard Management ==================

         io_socket.on("G-loggedIn", async _findData => {
            let obj = {};
            let decode_Json = await decodeToken(_findData['fields']['token']);
            let isJson = isJSON(decode_Json);
           
            if (isJson == true) {
                let json = JSON.parse(decode_Json);
                let mobile = _findData['fields']['mobileNumber'] // json['mobileNumber'];
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
            io_socket.emit('G-loggedIn' , msg.RESULT_MSG);

         });

        io_socket.on("G-create-account", async _findData => {
            let obj = {};
            let decode_Json = await decodeToken(_findData['fields']['token']);
            let isJson = isJSON(decode_Json);
           
            if (isJson == true) {

                let json = JSON.parse(decode_Json);
                // let mobile = json['mobileNumber'];
                let _filter_account= {
                    collectionName:"Account",
                    fields:{
                        mobileNumber: _findData['fields']['mobileNumber']
                    }
               }
                let find_account = await  SingleFind(_filter_account);

                if (find_account['data'].length > 0) {

                    let _data_db = find_account['data'];
                    msg.RESULT_MSG["status"] = 200;
                    msg.RESULT_MSG["data"] = _data_db ;
                    msg.RESULT_MSG["message"] = [{SUCCESS:'اطلاعات با موفقیت یافت شد'}];
                    msg.RESULT_MSG["exeption"] = [];

                }
                else{
                    msg.RESULT_MSG["status"] = 200;
                    msg.RESULT_MSG["data"] = [] ;
                    msg.RESULT_MSG["message"] = [{SUCCESS:'اطلاعاتی یافت نشد'}];
                    msg.RESULT_MSG["exeption"] = [];
                }
            }
            else{

                    msg.RESULT_MSG["status"] = 100;
                    msg.RESULT_MSG["data"] = [obj] ;
                    msg.RESULT_MSG["message"] = [{SUCCESS:'توکن ارسال شده معتبر نیست'}];
                    msg.RESULT_MSG["exeption"] = [];
            }
            io_socket.emit('G-create-account' , msg.RESULT_MSG);

        });

   
        // ================== Guard Management ===================

        
        // ================== Create Account ==================


        io_socket.on("token-info", async _findData => {
            let obj = {};
            let decode_Json = await decodeToken(_findData['fields']['token']);
            let isJson = isJSON(decode_Json);
           
            if (isJson == true) {

                let json = JSON.parse(decode_Json);
               

                let id = json['obj'];

                let _filter_auth= {
                    collectionName:"Auth",
                    fields:{
                        _id: new ObjectID(id)
                    }
               }
                let find_auth = await SingleFind(_filter_auth);
                if (find_auth['data'].length > 0) {

                    let _data_db = find_auth['data'];
                    let mobileNumber = _data_db[0]['mobileNumber'];

                    let _filter_account= {
                        collectionName:"Account",
                        fields:{
                            mobileNumber: mobileNumber
                        }
                   }

                    let find_Account = await SingleFind(_filter_account);
                //    console.log(find_Account['data']);
                    msg.RESULT_MSG["status"] = 200;
                    msg.RESULT_MSG["data"] = find_Account['data'];
                    msg.RESULT_MSG["message"] = [{SUCCESS:'اطلاعات با موفقیت یافت شد'}];
                    msg.RESULT_MSG["exeption"] = [];

                }
                else{
                    msg.RESULT_MSG["status"] = 200;
                    msg.RESULT_MSG["data"] = [] ;
                    msg.RESULT_MSG["message"] = [{SUCCESS:'اطلاعاتی یافت نشد'}];
                    msg.RESULT_MSG["exeption"] = [];
                }
            }
            else{

                    msg.RESULT_MSG["status"] = 100;
                    msg.RESULT_MSG["data"] = [obj] ;
                    msg.RESULT_MSG["message"] = [{SUCCESS:'توکن ارسال شده معتبر نیست'}];
                    msg.RESULT_MSG["exeption"] = [];
            }
            // console.log(msg.RESULT_MSG);
            io_socket.emit('token-info' , msg.RESULT_MSG);

        });



        io_socket.on("create-Account", async data => {
           
            if(data['Account']['id'] == null){
                data['Account']['expiredAccount'] = new Date().getTime() + config.config_ExpiredAccount;
            }else{
                data['Account']['expiredTimeconstpassword'] = new Date().getTime() + config.config_ExpiredTimeCosnstPassword
            }
            
            let result =  await  Create(data, null);
            let tk = await newToken(data['Account']['mobileNumber']);

            result['data'][0]['token'] = tk;
            io_socket.emit('create-Account', result);
        });

        // ================== Create Account ==================




        // ================== Public CREATE ==================

        io_socket.on("create", data => {
            Create(data, null).then(result => {
                io_socket.emit('create', result);
            });
        });

        io_socket.on("create_v1", data => {
            Create_V1(data, null).then(result => {
                io_socket.emit('create_v1', result);
            });
        });

        // ================== Public CREATE ==================

        io_socket.on("find", _findData => {
            SingleFind(_findData, null).then(result => {
                io_socket.emit('find', result);
            });
        });


        io_socket.on("multiple-find", _findData => {
            MultipleFindArray(_findData, null).then(result => {
                io_socket.emit('multiple-find', result);
            });
        });


        // ================= AUTH =======================


        // ================= AUTH =======================

        io_socket.on("find-location-history", _findData => {
            SingleFindLocationHistory(_findData, null).then(result => {
                // console.log('FIND' , result);
                io_socket.emit('find-location-history', result);
            });
        });

        // ================= AUTH =======================

        // ================= GET DIRECTION =======================

        io_socket.on("post-neshan", data => {
            postRequestNeshan(data).then(result => {
                // console.log('FIND' , result);
                io_socket.emit('post-neshan', result);
            });
        });

        // ================= GET DIRECTION =======================


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

        var intervalGetLocationDetail;
        // send location to client
        io_socket.on("get-location-detail", async (data) => {

            let result = await SingleFindLocationHistory(data, null);

            io_socket.emit(`get-location-detail`,result);
            

            intervalGetLocationDetail = setInterval(async () => {

                let result = await SingleFindLocationHistory(data, null);

                io_socket.emit(`get-location-detail`, result);

                //     // 1. Find Online User UID (From data) (Get LocalStorage) 
                //     // 2. Find UID From Database Json Result Location
            }, config.send_location_detail_inteval_ms);


        });



        var intervalGetLocation;
        // send location to client
        io_socket.on("get-location", (data) => {
            

            intervalGetLocation = setInterval(async () => {
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
            clearInterval(intervalGetLocation);
            clearInterval(intervalGetLocationDetail);
        });

    }


}

async function newToken5(mobileNumber){

    let _filter_Auth = {
        collectionName:"Auth",
        fields:{
            mobileNumber: mobileNumber
        }
   }

   let findUser = await SingleFind(_filter_Auth);

    let expiredLogin = new Date().getTime() + config.config_ExpiredLogin;
    let jsonForEncode = {obj:findUser['data'][0]['_id'],expiredLogin:expiredLogin,uid:null};
    let str_jsonEncode = JSON.stringify(jsonForEncode);
    let encode_1 = encode(str_jsonEncode);

    // const MSGPACK = new Encodr("msgpack")

    // let data = encode_1

    // data = MSGPACK.encode(data)
    // data = MSGPACK.decode(data)
    // let token = MSGPACK.encode(data)
    return encode_1;

    // let expiredLogin = new Date().getTime() + config.config_ExpiredLogin;
    // let jsonForEncode = {obj:findUser['data'][0]['_id'],expiredLogin:expiredLogin,uid:null};
    // let str_jsonEncode = JSON.stringify(jsonForEncode);

    // let token = encode(str_jsonEncode);
    // return  token;

    // let expiredLogin = new Date().getTime() + config.config_ExpiredLogin;
    // let jsonForEncode = {mobileNumber:mobileNumber,expiredLogin:expiredLogin,uid:null};
    // let str_jsonEncode = JSON.stringify(jsonForEncode);
    // let token = encode(str_jsonEncode);
    // return  token;
}

 async function newToken2(mobileNumber , type){
    let result = 0;
    let _filter_Auth = {
        collectionName:"Auth",
        fields:{
            mobileNumber: mobileNumber
        }
   }

   let findUser = await SingleFind(_filter_Auth);

    let expiredLogin = new Date().getTime() + config.config_ExpiredLogin;
    let jsonForEncode = {obj:findUser['data'][0]['_id'],expiredLogin:expiredLogin,uid:null};
    let str_jsonEncode = JSON.stringify(jsonForEncode);

    let encode_1 = encode(str_jsonEncode);

    const MSGPACK = new Encodr("msgpack")

    let data = encode_1

    data = MSGPACK.encode(data)
    data = MSGPACK.decode(data);
    let _encodeToken = MSGPACK.encode(data);
    
    let _decodeToken = decodeToken(_encodeToken);
    // console.log( typeof(MSGPACK.encode(data)))

    // console.log('enc' , _encodeToken);
    // console.log('dec' , dec);

   if (type == 1) {
       // return token encode
       result = await _encodeToken;
   }else if(type == 2){
       result =  await _decodeToken;
   }

   return await result;
    // console.log('token',token);

    // let dec = decode(token);
    // console.log('decode' , dec);
    // return  token;
}

function decodeToken2(token){
    const MSGPACK = new Encodr("msgpack");
    // let decode_msgpack = MSGPACK.decode(token);
    let decode_final = decode(decode_msgpack);
    // console.log('dec' , deco);
    return decode_final;
    // console.log('DEC' , decode_final);
}

async function newToken(mobileNumber){

    let _filter_Auth = {
        collectionName:"Auth",
        fields:{
            mobileNumber: mobileNumber
        }
   }

   let findUser = await SingleFind(_filter_Auth);

    let expiredLogin = new Date().getTime() + config.config_ExpiredLogin;
    let jsonForEncode = {obj:findUser['data'][0]['_id'],expiredLogin:expiredLogin,uid:null};
    let str_jsonEncode = JSON.stringify(jsonForEncode);

    // console.log('JSON' , jsonForEncode);

    var encodedData_base64 = await base64.encode(str_jsonEncode);
    var encodeData_en_de = await encode(encodedData_base64);
    return encodeData_en_de;
}

async function decodeToken(token) {
    var decodeData_en_de = await decode(token);
    var decodedData_base64 = await base64.decode(decodeData_en_de);
    return decodedData_base64;
}
