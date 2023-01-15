module.exports = {
    port: 3000,
    uri:"mongodb://localhost:27017/",
    databaseName:"TECHNOGPS",
    config_ipBlockTime: 30 * 1000, // baraye 20 Secound ip block mishe va sms ersal nemikoneh !
    config_countSendSms : 1, // 1 = 3 yani age 1 bashe 3 bar sms mifresteh va badesh on ip va on shomararo  block mikoneh ta modate moayan --- 2 = 4 / 3 = 5
    config_expireSmsCode : 120 * 1000, // yani karbar forsat dareh ke ta 120s code ro bezaneh !
    config_ExpiredLogin : 9999999999999999 * 1000, // 120 secound bad expire mishe va logout mishe !
    config_ExpiredAccount: 60 * 1000, // accountesh gheyreh faal mishe !
    config_ExpiredTimeCosnstPassword: 60 * 1000, // 60 s forsat dareh ta ramzeh sabet ro bezaneh !

    config_guards:{
        "start-login-TO-login": 20 * 1000
    },
    send_location_inteval_ms: 1000
}