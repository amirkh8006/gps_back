const {
    Create,
    SingleFind
} = require('./generator');
var Kavenegar = require('kavenegar');
var api = Kavenegar.KavenegarApi({apikey: '67704F2F46716770477463724E41756137746B645541512F6C4A312B6A354542'});
const uniqueRandomRange = require("unique-random-range");
const util = require('util');
const {
    config_ipBlockTime,
    config_countSendSms,
    config_expireSmsCode,
    config_guards,
    port,
    NESHAN_API_KEY
} = require('../config/config');
const axios = require('axios');
var msg = require('../messages');
// console.log("SINGLE_FIND",util.inspect(x, false, null, true))

var char = ["!", "@", "#", "$", "%", "_", "+", "&", "+", "-"],
    number = 97;

module.exports = {

    encode(r) {
        // console.log('DDDDDDDDDD');
        if (!(r && 0 < r.length)) return "";
        for (var e, t = "", a = Math.floor(26 * Math.random()), n = a, o = 0; o < r.length; o++) {
            e = r.charCodeAt(o), e += n;
            var h = Math.floor(e / 26),
                f = 1 < h ? h : "";
            f && Math.ceil(10 * Math.random()) % 2 == 0 && f < 9 && (f = char[f]), n = e % 26, t += String.fromCharCode(n + number) + f
        }
        return t.substr(0, Math.floor(t.length / 2)) + String.fromCharCode(a + number) + t.substr(Math.floor(t.length / 2))
    },

    decode(r) {

        var e, t = "",
            a = 0;
        if (!(r && 0 < r.length)) return "";
        var n = r.charCodeAt(Math.floor((r.length - 1) / 2)) - number;
        r = r.substr(0, Math.floor((r.length - 1) / 2)) + r.substr(Math.floor((r.length - 1) / 2) + 1) + r[Math.floor((r.length - 1) / 2)];
        for (var o = 0; o < r.length - 1; o++)
            if (e = r.charCodeAt(o), number - 1 < e && e < number + 27) {
                for (var h = a = 0; h < 100; h++) {
                    var f = r.charCodeAt(o + 1);
                    if (number - 1 < f && f < number + 27) {
                        0 === a && (a = 1);
                        break
                    }
                    if (o++, 47 < f && f < 58) a = parseInt(10 * a) + parseInt(String.fromCharCode(f));
                    else {
                        var l = char.indexOf(String.fromCharCode(f));
                        a = parseInt(10 * a) + parseInt(l)
                    }
                }
                var u = 26 * a + e - number;
                t += String.fromCharCode(u - n), n = u % 26
            }
        return t
    },

    async login(userName, password) {

        // let dateNow = new Date().getTime() + (timeToExpireToken_Sec * 60 * 1000);
        let Now = new Date().getTime();

        // console.log('ADD' , dateNow);
        console.log('NOW', Now);
        return dateNow;
    },

    async userRegister(data, clientIp, clientPort) {


        let jsonGuard = {};

        if (data['Auth'] != undefined) {
            // console.log('1');
            msg.RESULT_MSG_Auth["status"] = 0,
            msg.RESULT_MSG_Auth["data"] = [];
            msg.RESULT_MSG_Auth["message"] = [];
            msg.RESULT_MSG_Auth["exeption"] = [];

            let _filter_blockIp = {
                collectionName: "Auth",
                fields: {
                    ip: clientIp,
                    mobileNumber: data['Auth']['mobileNumber']
                }
            }

            let _find = await SingleFind(_filter_blockIp);

            if (_find['data'].length > 0) {

                let _data_db = _find['data'][0];
                let _ipBlockTime = _data_db['ipBlockTime'];

                if (_ipBlockTime == null) {

                    // IP FREE !

                    let _filter_MobileNumber = {
                        collectionName: "Auth",
                        fields: {
                            mobileNumber: data['Auth']['mobileNumber']
                        }
                    }

                    let _find_MobileNumber = await SingleFind(_filter_MobileNumber);
                    let _find_MobileNumber_data = _find_MobileNumber['data'][0];

                    if (_find_MobileNumber['data'].length > 0) {
                        // console.log('IF _1 ');
                        // User EXISTS AND UPDATE TABLE !
                        let _count_Mobile = _find_MobileNumber_data['count'];
                        let _id_Mobile = _find_MobileNumber_data['_id'];
                        let _updatedRow = _find_MobileNumber_data['updatedRow'];



                        data['Auth']['count'] = _count_Mobile + 1
                        data['Auth']['id'] = _id_Mobile;
                        data['Auth']['updatedRow'] = new Date().getTime() + config_ipBlockTime;

                        const p2e = s => s.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d));
                        let getTime = new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds() + ':' + new Date().getMilliseconds();
                        data['Auth']['shamsi_updatedRow'] = p2e(new Date().toLocaleDateString('fa-IR') + ' ' + getTime);

                        // check count login and Set ipBlockTime !
                        let currentTime = new Date().getTime();

                        if (currentTime >= _updatedRow) {
                            data['Auth']['ipBlockTime'] = null;
                            data['Auth']['count'] = 1;
                        } else if (_count_Mobile >= config_countSendSms) {
                            data['Auth']['ipBlockTime'] = new Date().getTime() + config_ipBlockTime;
                        }



                    } else {
                        // console.log('ELSE _1 ');
                        // New User AND INSERT TABLE !
                        data['Auth']['count'] = 1;
                        data['Auth']['ipBlockTime'] = null;
                        data['Auth']['updatedRow'] = new Date().getTime() + config_ipBlockTime;
                        const p2e = s => s.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d));
                        let getTime = new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds() + ':' + new Date().getMilliseconds();
                        data['Auth']['shamsi_updatedRow'] = p2e(new Date().toLocaleDateString('fa-IR') + ' ' + getTime);
                    }

                    data['Auth']['port'] = clientPort;
                    data['Auth']['ip'] = clientIp;

                    // let smsCode = await SendSms_With_Kavehnegar(data['Auth']['mobileNumber']);
                    let smsCode = 12345;
                    data['Auth']['smsCode'] = smsCode;
                    data['Auth']['expiredSmsCode'] = new Date().getTime() + config_expireSmsCode;

                    Create(data, null).then(result => {});
                    // ===================== Management Guard ======================

                    // let filter_guard = {
                    //     collectionName: "managementGuard",
                    //     fields: {
                    //         mobileNumber: data['Auth']['mobileNumber']
                    //     }
                    // }
                    // let _find_guard = await SingleFind(filter_guard);

                    // if (_find_guard['data'].length > 0) {
                    //     jsonGuard = {
                    //         managementGuard: {
                    //             id: _find_guard['data'][0]['_id'],
                    //             canActivate: true,
                    //             expireTime: new Date().getTime() + config_guards['start-login-TO-login']
                    //         }
                    //     }
                    // }
                    // Create(jsonGuard, null).then(result => {});

                    // ===================== Management Guard ======================

                    if (smsCode > 0) {
                        msg.RESULT_MSG_Auth["status"] = 200;
                        msg.RESULT_MSG_Auth["data"].push({
                            sendMessage: true
                        });
                        msg.RESULT_MSG_Auth["message"].push({
                            SUCCESS: 'پیام با موفقیت ارسال شد'
                        });
                        msg.RESULT_MSG_Auth["exeption"] = [];
                    } else {
                        msg.RESULT_MSG_Auth["status"] = 100;
                        msg.RESULT_MSG_Auth["data"].push({
                            sendMessage: false
                        });
                        msg.RESULT_MSG_Auth["message"].push({
                            SUCCESS: 'امکان ارسال پیام در این لحظه مقدور نمی باشد لطفا دقایقی بعد تلاش کنید'
                        });
                        msg.RESULT_MSG_Auth["exeption"] = [];
                    }

                    //  promise = new Promise((resolve , reject)=>{
                    //     resolve(msg.RESULT_MSG_Auth);
                    // }); 

                    console.log('SEND SMS 1 !');

                } else {

                    // IP BLOCKED !
                    let _data_db = _find['data'][0];
                    let currentTime = new Date().getTime();

                    if (currentTime > _data_db['ipBlockTime']) {
                        let obj = {};
                        obj['Auth'] = _data_db;
                        obj['Auth']['id'] = _data_db['_id'];
                        obj['Auth']['ipBlockTime'] = null;
                        obj['Auth']['count'] = 1;

                        // let smsCode = await SendSms_With_Kavehnegar(data['Auth']['mobileNumber']);
                        let smsCode = 12345;
                        obj['Auth']['smsCode'] = smsCode;
                        obj['Auth']['expiredSmsCode'] = new Date().getTime() + config_expireSmsCode;

                        // console.log("EXPIRE" ,  data['Auth']['expiredSmsCode'] );
                        // console.log("CUT" ,   new Date().getTime() );
                        // console.log("OBJ" , obj);

                        Create(obj, null).then(result => {});

                        // ================================= Management Guard =========================

                        // let filter_guard = {
                        //     collectionName: "managementGuard",
                        //     fields: {
                        //         mobileNumber: data['Auth']['mobileNumber']
                        //     }
                        // }
                        // let _find_guard = await SingleFind(filter_guard);

                        // if (_find_guard['data'].length > 0) {
                        //     jsonGuard = {
                        //         managementGuard: {
                        //             id: _find_guard['data'][0]['_id'],
                        //             canActivate: true,
                        //             expireTime: new Date().getTime() + config_guards['start-login-TO-login']
                        //         }
                        //     }
                        // }
                        // Create(jsonGuard, null).then(result => {});

                        //=============================================================================



                        if (smsCode > 0) {
                            msg.RESULT_MSG_Auth["status"] = 200;
                            msg.RESULT_MSG_Auth["data"].push({
                                sendMessage: true
                            });
                            msg.RESULT_MSG_Auth["message"].push({
                                SUCCESS: 'پیام با موفقیت ارسال شد'
                            });
                            msg.RESULT_MSG_Auth["exeption"] = [];
                        } else {
                            msg.RESULT_MSG_Auth["status"] = 100;
                            msg.RESULT_MSG_Auth["data"].push({
                                sendMessage: false
                            });
                            msg.RESULT_MSG_Auth["message"].push({
                                SUCCESS: 'امکان ارسال پیام در این لحظه مقدور نمی باشد لطفا دقایقی بعد تلاش کنید'
                            });
                            msg.RESULT_MSG_Auth["exeption"] = [];
                        }

                        // promise = new Promise((resolve , reject)=>{
                        //     resolve(msg.RESULT_MSG_Auth);
                        // }); 

                        console.log('SEND SMS 2 !');
                    } else {
                        console.log('IP BLOCKED !');


                        // ================================= Management Guard =========================

                        // let filter_guard = {
                        //     collectionName: "managementGuard",
                        //     fields: {
                        //         mobileNumber: data['Auth']['mobileNumber']
                        //     }
                        // }
                        // let _find_guard = await SingleFind(filter_guard);

                        // if (_find_guard['data'].length > 0) {
                        //     jsonGuard = {
                        //         managementGuard: {
                        //             id: _find_guard['data'][0]['_id'],
                        //             canActivate: false,
                        //             expireTime: new Date().getTime() + config_guards['start-login-TO-login']
                        //         }
                        //     }
                        // }
                        // Create(jsonGuard, null).then(result => {});

                        //=============================================================================



                        msg.RESULT_MSG_Auth["status"] = 100;
                        msg.RESULT_MSG_Auth["data"].push({
                            sendMessage: false
                        });
                        msg.RESULT_MSG_Auth["message"].push({
                            SUCCESS: 'امکان ارسال پیام در این لحظه مقدور نمی باشد لطفا دقایقی بعد تلاش کنید'
                        });
                        msg.RESULT_MSG_Auth["exeption"] = [];

                        // promise = new Promise((resolve , reject)=>{
                        //     resolve(msg.RESULT_MSG_Auth);
                        // }); 
                    }

                }

            } else {
                // No Insert Record In AUTH Collection !

                // New User
                data['Auth']['count'] = 0;
                data['Auth']['updatedRow'] = new Date().getTime() + config_ipBlockTime;
                const p2e = s => s.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d));
                let getTime = new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds() + ':' + new Date().getMilliseconds();
                data['Auth']['shamsi_updatedRow'] = p2e(new Date().toLocaleDateString('fa-IR') + ' ' + getTime);
                data['Auth']['ipBlockTime'] = null;

                data['Auth']['port'] = clientPort;
                data['Auth']['ip'] = clientIp;

                // let smsCode = await SendSms_With_Kavehnegar(data['Auth']['mobileNumber']);
                let smsCode = 12345;
                data['Auth']['smsCode'] = smsCode;
                data['Auth']['expiredSmsCode'] = new Date().getTime() + config_expireSmsCode;

                Create(data, null).then(result => {});

                // ============================ managementGuard ===========================
                // let filter_guard = {
                //     collectionName:"managementGuard",
                //     fields:{
                //         mobileNumber: data['Auth']['mobileNumber']
                //     }
                // }
                // let _find_guard = await SingleFind(filter_guard);

                // if (_find_guard['data'].length > 0) {
                //     console.log('PEYDA' , _find_guard['data'].length);
                //     // jsonGuard = {
                //     //     managementGuard:{
                //     //         id: null,
                //     //         mobileNumber:data['Auth']['mobileNumber'],
                //     //         ip: clientIp,
                //     //         port: clientPort,
                //     //         fromRoute:'/auth/start-register',
                //     //         toRoute:'/auth/register',
                //     //         canActivate: true,
                //     //         expireTime: new Date().getTime() + config_guards['start-register-TO-register'],
                //     //         redirectTo:'/auth/start-register',

                //     //     }
                //     //  }

                // }else{
                //     console.log('Tokh' , _find_guard['data'].length);

                // }





                //  Create(jsonGuard , null).then(result=>{});

                // ============================ managementGuard ===========================



                if (smsCode > 0) {
                    msg.RESULT_MSG_Auth["status"] = 200;
                    msg.RESULT_MSG_Auth["data"].push({
                        sendMessage: true
                    });
                    msg.RESULT_MSG_Auth["message"].push({
                        SUCCESS: 'پیام با موفقیت ارسال شد'
                    });
                    msg.RESULT_MSG_Auth["exeption"] = [];
                } else {
                    msg.RESULT_MSG_Auth["status"] = 100;
                    msg.RESULT_MSG_Auth["data"].push({
                        sendMessage: false
                    });
                    msg.RESULT_MSG_Auth["message"].push({
                        SUCCESS: 'امکان ارسال پیام در این لحظه مقدور نمی باشد لطفا دقایقی بعد تلاش کنید'
                    });
                    msg.RESULT_MSG_Auth["exeption"] = [];
                }



                // promise = new Promise((resolve , reject)=>{
                //     resolve(msg.RESULT_MSG_Auth);
                // }); 


                console.log('SEND SMS NEW USER !');
            }


        } // End If data['Auth']

        if (data['RegisteredUser'] != undefined) {

            msg.RESULT_MSG_Auth["status"] = 0,
                msg.RESULT_MSG_Auth["data"] = [];
            msg.RESULT_MSG_Auth["message"] = [];
            msg.RESULT_MSG_Auth["exeption"] = [];

            data['RegisteredUser']['port'] = clientPort;
            data['RegisteredUser']['ip'] = clientIp;

            let _filter = {
                collectionName: "RegisteredUser",
                fields: {
                    mobileNumber: data['RegisteredUser']['mobileNumber']
                }
            }
            // 2. find clientIp and set id and count for update
            SingleFind(_filter).then((result) => {

                let _findRegisteredUser = result['data'];

                if (_findRegisteredUser.length > 0) {
                    data['RegisteredUser']['id'] = _findRegisteredUser[0]['_id'];
                }
                Create(data, null).then(result => {});
            })


        }

        // console.log('MM' , msg.RESULT_MSG_Auth);
        // console.log('2');
        return await msg.RESULT_MSG_Auth;

    },

    async existsAccount(mobileNumber) {

        let _filter_account = {
            collectionName: "Account",
            fields: {
                mobileNumber: mobileNumber
            }
        }

        let _find = await SingleFind(_filter_account);

        if (_find['data'].length > 0) {
            // User Exists

            msg.RESULT_MSG_Auth["status"] = 200;
            msg.RESULT_MSG_Auth["data"] = _find['data'];
            msg.RESULT_MSG_Auth["message"].push({
                SUCCESS: 'اطلاعات کاربری فوق یافت شد'
            });
            msg.RESULT_MSG_Auth["exeption"] = [];

        } else {
            // User Not Exists

            msg.RESULT_MSG_Auth["status"] = 100;
            msg.RESULT_MSG_Auth["data"] = [];
            msg.RESULT_MSG_Auth["message"] = [{
                SUCCESS: 'کاربری با این مشخصات یافت نشد'
            }];
            msg.RESULT_MSG_Auth["exeption"] = [];
        }

        return msg.RESULT_MSG_Auth;

    },

    async SendSms_With_Body_Kavehnegar(mobileNumber, message) {

        try {

            var theUrl = "https://api.kavenegar.com/v1/" + "67704F2F46716770477463724E41756137746B645541512F6C4A312B6A354542";
            theUrl += "/verify/lookup.json?receptor=" + mobileNumber;
            theUrl += "&token=" + message + "&template=VerifyTokens";

            const request = axios.create({
                method: 'get',
                baseURL: theUrl,
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            await request.get().catch(err => {
                console.log("ERROR", err.response.data);

            });

        } catch (error) {

            console.log('ERROR', error);
        }

    },

    async SendSms_With_Body_Kavehnegar_ForDevice(mobileNumber, message) {
        let obj = {};
        try {

            var theUrl = "https://api.kavenegar.com/v1/" + "67704F2F46716770477463724E41756137746B645541512F6C4A312B6A354542";
            theUrl += "/verify/lookup.json?receptor=" + mobileNumber;
            theUrl += "&token=" + message + "&template=technogps";

            const request = axios.create({
                method: 'get',
                baseURL: theUrl,
                headers: {
                    'Content-Type': 'application/json'
                }
            })

           let re =  await request.get().catch(err => {
                console.log("ERROR", err.response.data);

            });
            
            obj['status'] = re['status'];
            obj['statusText'] = re['statusText'];
            
        } catch (error) {

            console.log('ERROR', error);
        }
        return obj;
    },



    // async managementGuard(data , clientIp , clientPort){

    // }

    async postRequestNeshan(data) {
        var theDirectionUrl = "https://api.neshan.org/v4/direction/no-traffic";
        var theReverseUrl = "https://api.neshan.org/v5/reverse";

        if (data.method === "direction&Reverse") {

            const requestDirection = axios.create({
                method: 'get',
                baseURL: theDirectionUrl,
                headers: {
                    'Content-Type': 'application/json',
                    'Api-Key': NESHAN_API_KEY
                },
                params: {
                    type: 'car',
                    origin: `${data.origin.latitude},${data.origin.longitude}`,
                    destination: `${data.destination.latitude},${data.destination.longitude}`
                }
            })

            let direction = await requestDirection.get().catch(err => {
                // console.log("NESHAN DIRECTION ERROR", err);
                return err
            });

            const requestReverseOrigin = axios.create({
                method: 'get',
                baseURL: theReverseUrl,
                headers: {
                    'Content-Type': 'application/json',
                    'Api-Key': NESHAN_API_KEY
                },
                params: {
                    lat: data.origin.latitude,
                    lng: data.origin.longitude
                }
            })

            let reverseOrigin = await requestReverseOrigin.get().catch(err => {
                // console.log("NESHAN REVERSE ORIGIN ERROR", err);
                return err
            });


            const requestReverseDestination = axios.create({
                method: 'get',
                baseURL: theReverseUrl,
                headers: {
                    'Content-Type': 'application/json',
                    'Api-Key': NESHAN_API_KEY
                },
                params: {
                    lat: data.destination.latitude,
                    lng: data.destination.longitude
                }
            })

            let reverseDestination = await requestReverseDestination.get().catch(err => {
                // console.log("NESHAN REVERSE DESTINATION ERROR", err);
                return err
            });



            let result = {
                direction: direction.data,
                reverseOrigin: reverseOrigin.data,
                reverseDestination: reverseDestination.data
            }


            return result
        } else if (data.method === "reverse") {
            const requestReverse = axios.create({
                method: 'get',
                baseURL: theReverseUrl,
                headers: {
                    'Content-Type': 'application/json',
                    'Api-Key': NESHAN_API_KEY
                },
                params: {
                    lat: data.location.latitude,
                    lng: data.location.longitude
                }
            })

            let reverse = await requestReverse.get().catch(err => {
                // console.log("NESHAN ONLY REVERSE ORIGIN ERROR", err);
                return err
            });

            let result = {
                reverse: reverse.data
            }


            return result
        }else if (data.method === "direction") {
            const requestDirection = axios.create({
                method: 'get',
                baseURL: theDirectionUrl,
                headers: {
                    'Content-Type': 'application/json',
                    'Api-Key': NESHAN_API_KEY
                },
                params: {
                    type: 'car',
                    origin: `${data.origin.latitude},${data.origin.longitude}`,
                    destination: `${data.destination.latitude},${data.destination.longitude}`
                }
            })

            let direction = await requestDirection.get().catch(err => {
                // console.log("NESHAN DIRECTION ERROR", err);
                return err
            });

            let result = {
                direction: direction.data
            }

            return result
        }
    },

    async sendSms(mobileNumber,message){

        // api.Send({
        //     message: "YELLOW NodeJs MOHAMMAD TEST 123 !",
        //     sender: "10002020700700",
        //     receptor: "09383102777"
        // });


        try{

         

            // console.log('Y' , y);
            // let payload = { receptor: '09351371050' , message: 'SALAM KHOBI !' };
            var abc = `https://api.kavenegar.com/v1/67704F2F46716770477463724E41756137746B645541512F6C4A312B6A354542/sms/send.json?receptor=${mobileNumber}&sender=10002020700700&message=${message}`

            // var url = "https://api.kavenegar.com/v1/" + "67704F2F46716770477463724E41756137746B645541512F6C4A312B6A354542" + `/sms/send.json/receptor=09351371050&sender=10002020700700&message=test123`;
    

            let res = await axios.get(abc);

            let data = res.data;
            return data;


            // const request = axios.create({
            //     method: 'post',
            //     baseURL: abc
            //     // headers: {
            //     //     'Content-Type': 'application/json'
            //     // }
            // })

            // await request.get().catch(err => {
            //     console.log("ERROR", err.response.data);

            // });
    
            // let res = await axios.post(url, payload);
        
            // let data = res.data;
            // console.log('SMS_RESULT',data);
        
        
        }catch(e){
            console.log('error',e);
        }
    }

}



async function SendSms_With_Kavehnegar(mobileNumber) {
    let randCode = 0;
    try {

        let rand = uniqueRandomRange(1032, 999999);
        let randomCode = rand();
        randCode = await randomCode;

        var theUrl = "https://api.kavenegar.com/v1/" + "67704F2F46716770477463724E41756137746B645541512F6C4A312B6A354542";
        theUrl += "/verify/lookup.json?receptor=" + mobileNumber;
        theUrl += "&token=" + randomCode + "&template=VerifyTokens";

        const request = axios.create({
            method: 'get',
            baseURL: theUrl,
            headers: {
                'Content-Type': 'application/json'
            }
        })

        await request.get().catch(err => {
            console.log("ERROR", err.response.data);
            randCode = 0;
        });

    } catch (error) {
        randCode = 0;
        console.log('ERROR', error);
    }
    return randCode;

}

