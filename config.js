module.exports = {
    port: 3000,
    host: 'localhost',
    uri:"mongodb://localhost:27017/",
    databaseName:"TECHNOGPS",
    config_ipBlockTime: 30 * 1000, // baraye 20 Secound ip block mishe va sms ersal nemikoneh !
    config_countSendSms : 1, // 1 = 3 yani age 1 bashe 3 bar sms mifresteh va badesh on ip va on shomararo  block mikoneh ta modate moayan --- 2 = 4 / 3 = 5
    config_expireSmsCode : 10 * 1000, // yani karbar forsat dareh ke ta 10s code ro bezaneh !

    config_guards:{
        "start-register-TO-register": 20 * 1000
    }
}