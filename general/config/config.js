module.exports = {
    port: 9454,
    // uri:"mongodb://localhost:27017/",
    // databaseName:"TECHNOGPS",
    uri:"mongodb://technoGP:5iW1Mjs69Gr@193.151.145.36:27017/",
    databaseName:"technogp_tracker",
    config_ipBlockTime: 30 * 1000, // baraye 20 Secound ip block mishe va sms ersal nemikoneh !
    config_countSendSms : 1, // 1 = 3 yani age 1 bashe 3 bar sms mifresteh va badesh on ip va on shomararo  block mikoneh ta modate moayan --- 2 = 4 / 3 = 5
    config_expireSmsCode : 120 * 1000, // yani karbar forsat dareh ke ta 120s code ro bezaneh !
    config_ExpiredLogin : 9999999999999999 * 1000, // 120 secound bad expire mishe va logout mishe !
    config_ExpiredAccount: 60 * 1000, // accountesh gheyreh faal mishe !
    config_ExpiredTimeCosnstPassword: 60 * 1000, // 60 s forsat dareh ta ramzeh sabet ro bezaneh !

    config_guards:{
        "start-login-TO-login": 20 * 1000
    },
    send_location_inteval_ms: 1000,
    send_location_detail_inteval_ms: 5000,
    NESHAN_API_KEY: "service.ce9181bf37bf4cb68de342a376a8ab06",
    cors_server:{ origins: 'http://technogps.ir:80'},
    cors_local:{ origins: 'http://localhost:4200'}
}