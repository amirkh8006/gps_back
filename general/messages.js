/*

Informational responses (100 – 199)
Successful responses (200 – 299)
Redirection messages (300 – 399)
Client error responses (400 – 499)
Server error responses (500 – 599)

Return Message Sample !

*/
 // 
 MULTIPLE_RESULT_MSG = {
    status: 0,
    data:[],
    message:[], 
    exeption:[]
 }

RESULT_MSG = {
    status: 100,
    data:[],
    message:[], 
    exeption:[]
 }

 RESULT_MSG_Auth = {
    status: 0,
    data:[],
    message:[], 
    exeption:[]
 }

SUCCESS_INSERT = {
    status: 200,
    data:{},
    message:"اطلاعات با موفقیت ثبت شد", 
    exeption:null
},

SUCCESS_UPDATE = {
    status: 200,
    data:{},
    message:"اطلاعات با موفقیت ویرایش شد", 
    exeption:null
},

SUCCESS_FIND = { 
    status: 200,
    data:{},
    message:"اطلاعات با موفقیت یافت شد", 
    exeption:null
},

SUCCESS_NOTFOUND_RECORD = {
    status: 200,
    data:{},
    message:"اطلاعاتی یافت نشد", 
    exeption:null
},

SUCCESS_DELETE = {
    status: 200,
    data:{},
    message:"اطلاعات با موفقیت حذف شد", 
    exeption:null
},

UPDATE_CHANGE = {
    status: 100,
    data:{},
    message:"تغییراتی در اطلاعات ویرایشی صورت نگرفت", 
    exeption:null
},

UPDATE_NOTFOUND = {
    status: 100,
    data:{},
    message:"اطلاعاتی جهت ویرایش یافت نشد", 
    exeption:null
},

DELETE_NOTFOUND = {
    status: 100,
    data:{},
    message:"اطلاعاتی جهت حذف یافت نشد", 
    exeption:null
},


DUPLICATE_RECORD = {
    status: 100,
    data:{},
    message:"این اطلاعات قبلا ثبت شده است",
    exeption:null
},

ERROR = {
    status: 100,
    data:{},
    message:"خطایی رخ داده است لطفا مجددا تلاش نمایید",
    exeption:null
},


INVALID_FIELD = { 
    status: 100,
    data:{},
    message:"اعتبارسنجی فیلدها را بررسی نمایید",
    exeption:null
},

OBJECT_MODEL = {
    status: 500,
    data:{},
    message:null,
    exeption:"مدل مورد نظر از نوع آبجکت نیست"
},

ID_INVALID = {
    status: 500,
    data:{},
    message:null,
    exeption:"آیدی را در مدل بررسی نمایید"
},

INVALID_FILTER = {
    status: 500,
    data:{},
    message:null,
    exeption:"مقدار ورودی یا همان فیلتر از نوع آبجکت نمی باشد"
}


module.exports = {
    SUCCESS_INSERT,
     SUCCESS_UPDATE,  
     SUCCESS_DELETE,  
     UPDATE_CHANGE,
     UPDATE_NOTFOUND,
     DELETE_NOTFOUND,
     DUPLICATE_RECORD,
     ERROR,
     INVALID_FIELD,
     OBJECT_MODEL,
     ID_INVALID,
     INVALID_FILTER,
     SUCCESS_FIND,
     SUCCESS_NOTFOUND_RECORD,
     RESULT_MSG,
     RESULT_MSG_Auth,
     MULTIPLE_RESULT_MSG
}