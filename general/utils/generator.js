const {
    MongoClient
} = require("mongodb");
var ObjectID = require("mongodb").ObjectID
const Validator = require("fastest-validator");
const {
    databaseName,
    uri
} = require('../config/config');
const client = new MongoClient(uri);
const db = client.db(databaseName);
var msg = require('../messages');
var util = require('util');
// const Redis = require("ioredis");
// const redis = new Redis();

module.exports = {

    async Create(model, validateFields) {

        // const session = client.startSession();

        msg.RESULT_MSG["status"] = 0,
            msg.RESULT_MSG["data"] = [];
        msg.RESULT_MSG["message"] = [];
        msg.RESULT_MSG["exeption"] = [];

        /*
        How To Run Function : 
    
            let _model2 = {
                tst:{
                    id:null,
                    duplicateFields:['Name'],
                    Name:"qq" ,
                    family:"AHMADI" ,
                    lat:"96.0000000",
                    Address:[ {Title:"@@@@@44" , Street:"$$$$$4"} , {Title:"@@@@fff@deddd" , Street:"$$rrrr$$$r"}  ]
                },
                location:{id:null,Lat:"2ss00sqfff44ee" , Lgt:"4044fsffqrr"},
                loc:{id:null,abc:"222ddd22"}
    }
    
    
    var schema = {
    
        tst:{
                Name: {
                    type: "string", // ----> By Default Required !
                    empty: false,
                    trim: true
                    // min: 3, max: 255
                },
                family:{
                    type: "string",
                    // optional: true ---> Not Required !
                },
                lat:{
                    type: "string",
                    // type: "equal", field: "password"
                    // trim: true, lowercase: true
                    // uppercase: true
                    // type: "email" 
                    // type: "number", positive: true, integer: true
                },
                Address:{
                    type: "array"
                }
        },
    
        location:{
            Lat:{
                type: "string"
                
            },
            Lgt:{
                type: "string"
            }
        },
    
        loc:{
            abc:{
                type: "string"
            }
        }    
    
    };
    
    // Create(_model2 , schema).then(x=>{
    //     console.log('T' , x);
    // });
    
        */

        let Msg = [];
        if (model === null || model === undefined || typeof (model) === 'string' || typeof (model) === 'number' || typeof (model) === 'boolean' || Object.keys(model).length === 0) {
            Msg.push({
                Message: "The model empty OR Invalid Type!",
                status: 'ErrorModel'
            });
            return Msg;
        }

        let modelIsAllObject = true;
        let modelNameInObject = "";

        let keysModel = Object.keys(model);

        for (let c = 0; c < keysModel.length; c++) {

            let tableName = keysModel[c];
            let tableFields = model[tableName];
            if (tableFields === null || Object.keys(tableFields).length == 0 || typeof (tableFields) === 'string' || typeof (tableFields) === 'number' || typeof (tableFields) === 'boolean') {
                modelIsAllObject = false;
                modelNameInObject = tableName;
            }
        }

        for (let i = 0; i < keysModel.length; i++) {
            // console.log('III' , i);
            let tableName = keysModel[i];
            let tableFields = model[tableName];
            let findIdKey = 'id' in tableFields;
            let findIdValue = tableFields['id'];

            const p2e = s => s.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d));
            let getTime = new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds() + ':' + new Date().getMilliseconds();
            tableFields['createdAt'] = new Date();
            tableFields['updatedAt'] = new Date();
            tableFields['shamsi_createAt'] = p2e(new Date().toLocaleDateString('fa-IR') + ' ' + getTime);



            // console.log('TN' , tableName);
            // console.log('TF' , tableFields);

            if (validateFields != null && validateFields != undefined && typeof (validateFields) != 'string' && typeof (validateFields) != 'number' && typeof (validateFields) != 'boolean' && Object.keys(validateFields).length > 0 && findIdKey === true && ObjectID.isValid(findIdValue) === true) {
                // UpdateOne With Validation !
                console.log('Update With Validation');

                //delete tableFields['id'];
                const resValidate = await checkValidator(validateFields[tableName], model[tableName]);
                // console.log('RRR' , resValidate);
                if (resValidate === true) {

                    if (modelIsAllObject === true) {

                        let id = tableFields['id'];
                        delete tableFields['id'];
                        let collectionName = await db.collection(tableName);
                        let updateModel = await collectionName.updateOne({
                            _id: ObjectID(id)
                        }, {
                            '$set': tableFields
                        }, {
                            upsert: false
                        });
                        if (updateModel.acknowledged == true && updateModel.modifiedCount == 1) {

                            msg.RESULT_MSG["status"] = 200;
                            msg.RESULT_MSG["data"].push({
                                Message: `The record in the ${tableName} collection was edited`
                            });
                            msg.RESULT_MSG["message"].push({
                                SUCCESS: "اطلاعات با موفقیت ویرایش شد"
                            });
                            msg.RESULT_MSG["exeption"] = [];

                            // msg.SUCCESS_UPDATE["data"] = {Message:`The record in the ${tableName} collection was edited`};
                            // return msg.SUCCESS_UPDATE;

                            // Msg.push({Message:`The record in the ${tableName} collection was edited`, status: 'Update'});
                        } else if (updateModel.acknowledged == true && updateModel.matchedCount == 1) {

                            msg.RESULT_MSG["status"] = 200;
                            msg.RESULT_MSG["data"].push({
                                Message: `There is no change to edit in ${tableName} Collection!`
                            });
                            msg.RESULT_MSG["message"].push({
                                SUCCESS: "تغییراتی در اطلاعات ویرایشی صورت نگرفت"
                            });
                            msg.RESULT_MSG["exeption"] = [];

                            // msg.UPDATE_CHANGE["data"] = {Message:`There is no change to edit in ${tableName} Collection!`};
                            // return msg.UPDATE_CHANGE;

                            // Msg.push({Message:`There is no change to edit in ${tableName} Collection!`, status: 'NotChange'});
                        } else {
                            msg.RESULT_MSG["status"] = 200;
                            msg.RESULT_MSG["data"].push({
                                Message: `Not Found Record in the ${tableName} collection For Edit!`
                            });
                            msg.RESULT_MSG["message"].push({
                                SUCCESS: "اطلاعاتی جهت ویرایش یافت نشد"
                            });
                            msg.RESULT_MSG["exeption"] = [];

                            // msg.UPDATE_NOTFOUND["data"] = {Message:`Not Found Record in the ${tableName} collection For Edit!`};
                            // return msg.UPDATE_NOTFOUND;

                            // Msg.push({Message:`Not Found Record in the ${tableName} collection For Edit!`, status: 'NotFound'});
                        }

                    } else {
                        msg.RESULT_MSG["status"] = 500;
                        msg.RESULT_MSG["data"].push({
                            Message: `Object ${modelNameInObject} In Model Invalid !`
                        });
                        msg.RESULT_MSG["message"] = [];
                        msg.RESULT_MSG["exeption"].push({
                            ERROR: "مدل مورد نظر از نوع آبجکت نیست"
                        });

                        // msg.OBJECT_MODEL["data"] = {Message:`Object ${modelNameInObject} In Model Invalid !`};
                        // return msg.OBJECT_MODEL;

                        // Msg.push({Message:`Object ${modelNameInObject} In Model Invalid !`, status: 'InvalidObject'});
                        // return Msg;
                    }

                } else {
                    resValidate.forEach(element => {
                        /*
                            { 
                            status: 100,
                            data:{},
                            message:"اعتبارسنجی فیلدها را بررسی نمایید",
                            exeption:null
                        }
                        */
                        msg.RESULT_MSG["status"] = 100;
                        msg.RESULT_MSG["data"].push({
                            Message: `in ${tableName} Collection ${element.message}`
                        });
                        msg.RESULT_MSG["message"] = [{
                            FAIL: "اعتبارسنجی فیلدها را بررسی نمایید"
                        }];
                        msg.RESULT_MSG["exeption"] = [];

                        // msg.INVALID_FIELD["data"] = {Message:`in ${tableName} Collection ${element.message}`};

                        // Msg.push({Message:`in ${tableName} Collection ${element.message}`, status: 'InvalidField'});
                    });
                    // return msg.INVALID_FIELD;
                }




            } else if (findIdKey === true && ObjectID.isValid(findIdValue) === true) {
                // UpdateOne Without Validation !
                console.log('Update Without Validation');

                if (modelIsAllObject === true) {

                    let id = tableFields['id'];
                    delete tableFields['id'];
                    let collectionName = await db.collection(tableName);
                    let updateModel = await collectionName.updateOne({
                        _id: ObjectID(id)
                    }, {
                        '$set': tableFields
                    }, {
                        upsert: false
                    });
                    if (updateModel.acknowledged == true && updateModel.modifiedCount == 1) {
                        /*
                            {
                            status: 200,
                            data:{},
                            message:"اطلاعات با موفقیت ویرایش شد", 
                            exeption:null
                        }
                            
                            */

                        let obj = {};
                        obj[tableName] = model[tableName];

                        msg.RESULT_MSG["status"] = 200;
                        // msg.RESULT_MSG["data"].push({Message:`Registration was done in the ${tableName} collection` , _id: insertToTable.insertedId});
                        msg.RESULT_MSG["data"].push(obj);
                        msg.RESULT_MSG["message"].push({
                            SUCCESS: "اطلاعات با موفقیت ویرایش شد"
                        });
                        msg.RESULT_MSG["exeption"] = [];

                        // msg.RESULT_MSG["status"] = 200;
                        // msg.RESULT_MSG["data"].push({Message:`The record in the ${tableName} collection was edited`});
                        // msg.RESULT_MSG["message"].push({SUCCESS:"اطلاعات با موفقیت ویرایش شد"});
                        // msg.RESULT_MSG["exeption"] = [];

                        // msg.SUCCESS_UPDATE["data"] = {Message:`The record in the ${tableName} collection was edited`};
                        // return msg.SUCCESS_UPDATE;

                        // Msg.push({Message:`The record in the ${tableName} collection was edited`, status: 'Update'});
                    } else if (updateModel.acknowledged == true && updateModel.matchedCount == 1) {

                        /*
                            {
                            status: 100,
                            data:{},
                            message:"تغییراتی در اطلاعات ویرایشی صورت نگرفت", 
                            exeption:null
                        }
                        */
                        let obj = {};
                        obj[tableName] = model[tableName];

                        msg.RESULT_MSG["status"] = 200;
                        // msg.RESULT_MSG["data"].push({Message:`Registration was done in the ${tableName} collection` , _id: insertToTable.insertedId});
                        msg.RESULT_MSG["data"].push(obj);
                        msg.RESULT_MSG["message"].push({
                            SUCCESS: "تغییراتی در اطلاعات ویرایشی صورت نگرفت"
                        });
                        msg.RESULT_MSG["exeption"] = [];

                        // msg.RESULT_MSG["status"] = 200;
                        // msg.RESULT_MSG["data"].push({Message:`There is no change to edit in ${tableName} Collection!`});
                        // msg.RESULT_MSG["message"].push({SUCCESS:"تغییراتی در اطلاعات ویرایشی صورت نگرفت"});
                        // msg.RESULT_MSG["exeption"] = [];


                        // msg.UPDATE_CHANGE["data"] = {Message:`There is no change to edit in ${tableName} Collection!`};
                        // return msg.UPDATE_CHANGE;

                        // Msg.push({Message:`There is no change to edit in ${tableName} Collection!`, status: 'NotChange'});
                    } else {
                        /*
                            {
                                status: 100,
                                data:{},
                                message:"اطلاعاتی جهت ویرایش یافت نشد", 
                                exeption:null
                            }
                        
                        */
                        let obj = {};
                        obj[tableName] = model[tableName];

                        msg.RESULT_MSG["status"] = 200;
                        // msg.RESULT_MSG["data"].push({Message:`Registration was done in the ${tableName} collection` , _id: insertToTable.insertedId});
                        msg.RESULT_MSG["data"].push(obj);
                        msg.RESULT_MSG["message"].push({
                            SUCCESS: "اطلاعاتی جهت ویرایش یافت نشد"
                        });
                        msg.RESULT_MSG["exeption"] = [];


                        // msg.RESULT_MSG["status"] = 200;
                        // msg.RESULT_MSG["data"].push({Message:`Not Found Record in the ${tableName} collection For Edit!`});
                        // msg.RESULT_MSG["message"].push({SUCCESS:"اطلاعاتی جهت ویرایش یافت نشد"});
                        // msg.RESULT_MSG["exeption"] = [];

                        // msg.UPDATE_NOTFOUND["data"] = {Message:`Not Found Record in the ${tableName} collection For Edit!`};
                        // return msg.UPDATE_NOTFOUND;

                        // Msg.push({Message:`Not Found Record in the ${tableName} collection For Edit!`, status: 'NotFound'});
                    }

                } else {
                    /*
                     {
                         status: 500,
                         data:{},
                         message:null,
                         exeption:"مدل مورد نظر از نوع آبجکت نیست"
                    }
                     */

                    msg.RESULT_MSG["status"] = 500;
                    msg.RESULT_MSG["data"].push({
                        Message: `Object ${modelNameInObject} In Model Invalid !`
                    });
                    msg.RESULT_MSG["message"] = [];
                    msg.RESULT_MSG["exeption"].push({
                        ERROR: "مدل مورد نظر از نوع آبجکت نیست"
                    });

                    // msg.OBJECT_MODEL["data"] = {Message:`Object ${modelNameInObject} In Model Invalid !`};
                    // return msg.OBJECT_MODEL;

                    // Msg.push({Message:`Object ${modelNameInObject} In Model Invalid !`, status: 'InvalidObject'});
                    // return Msg;
                }

            } else if (validateFields != null && validateFields != undefined && typeof (validateFields) != 'string' && typeof (validateFields) != 'number' && typeof (validateFields) != 'boolean' && Object.keys(validateFields).length > 0 && findIdValue === null && findIdKey === true) {
                // InsertOne With Validation !
                console.log('INSERT With Validation');

                delete tableFields['id'];
                const resValidate = await checkValidator(validateFields[tableName], model[tableName]);

                if (resValidate === true) {

                    if (modelIsAllObject === true) {
                        delete tableFields['id'];
                        let duplicateFields = tableFields['duplicateFields'];

                        let collectionName = await db.collection(tableName);

                        if (duplicateFields) {
                            let duplicateFilter = {};
                            for (let f = 0; f < duplicateFields.length; f++) {
                                duplicateFilter[duplicateFields[f]] = tableFields[duplicateFields[f]];
                            }
                            if (duplicateFilter) {
                                let _findObject = await collectionName.find(duplicateFilter).toArray();


                                if (Object.keys(_findObject).length == 0) {
                                    // console.log('INSERT_DUP');
                                    delete tableFields['duplicateFields'];
                                    const insertToTable = await collectionName.insertOne(tableFields); //
                                    if ((insertToTable.acknowledged == true) && (insertToTable.insertedId != null || insertToTable.insertedId != undefined)) {

                                        msg.RESULT_MSG["status"] = 200;
                                        msg.RESULT_MSG["data"].push({
                                            Message: `Registration was done in the ${tableName} collection`
                                        });
                                        msg.RESULT_MSG["message"].push({
                                            SUCCESS: "اطلاعات با موفقیت ثبت شد"
                                        });
                                        msg.RESULT_MSG["exeption"] = [];

                                        // msg.SUCCESS_INSERT["data"] = {Message:`Registration was done in the ${tableName} collection`};
                                        // return msg.SUCCESS_INSERT;
                                        // Msg.push({Message:`Registration was done in the ${tableName} collection`, status: 'Insert'});
                                    } else {
                                        msg.RESULT_MSG["status"] = 100,
                                            msg.RESULT_MSG["data"].push({
                                                Message: "An error has occurred"
                                            });
                                        msg.RESULT_MSG["message"].push({
                                            FAIL: "خطایی رخ داده است لطفا مجددا تلاش نمایید"
                                        });
                                        msg.RESULT_MSG["exeption"] = [];

                                        // msg.ERROR["data"] = {Message:"An error has occurred"};
                                        // return msg.ERROR;
                                    }
                                } else {

                                    msg.RESULT_MSG["status"] = 100,
                                        msg.RESULT_MSG["data"].push({
                                            Message: `Duplicate Record (${duplicateFields}) in ${tableName} collection `
                                        });
                                    msg.RESULT_MSG["message"].push({
                                        FAIL: "این اطلاعات قبلا ثبت شده است"
                                    });
                                    msg.RESULT_MSG["exeption"] = [];

                                    // msg.DUPLICATE_RECORD["data"] = {Message:`Duplicate Record (${duplicateFields}) in ${tableName} collection `}
                                    // return msg.DUPLICATE_RECORD;

                                    // Msg.push({Message:`Duplicate Record (${duplicateFields}) in ${tableName} collection `, status: 'Duplicate'});
                                }
                            }

                        } else {

                            const insertToTable = await collectionName.insertOne(tableFields); //
                            if ((insertToTable.acknowledged == true) && (insertToTable.insertedId != null || insertToTable.insertedId != undefined)) {

                                msg.RESULT_MSG["status"] = 200;
                                msg.RESULT_MSG["data"].push({
                                    Message: `Registration was done in the ${tableName} collection`
                                });
                                msg.RESULT_MSG["message"].push({
                                    SUCCESS: "اطلاعات با موفقیت ثبت شد"
                                });
                                msg.RESULT_MSG["exeption"] = [];

                                // msg.SUCCESS_INSERT["data"] = {Message:`Registration was done in the ${tableName} collection`};
                                // return msg.SUCCESS_INSERT;
                                // Msg.push({Message:`Registration was done in the ${tableName} collection`, status: 'Insert'});
                            } else {

                                msg.RESULT_MSG["status"] = 100,
                                    msg.RESULT_MSG["data"].push({
                                        Message: "An error has occurred"
                                    });
                                msg.RESULT_MSG["message"].push({
                                    FAIL: "خطایی رخ داده است لطفا مجددا تلاش نمایید"
                                });
                                msg.RESULT_MSG["exeption"] = [];

                                // msg.ERROR["data"] = {Message:"An error has occurred"};
                                // return msg.ERROR;

                                // Msg.push({Message:"An error has occurred", status: 'Occurred'});
                            }
                        }




                    } else {
                        /*
                            {
                                status: 500,
                                data:{},
                                message:null,
                                exeption:"مدل مورد نظر از نوع آبجکت نیست"
                            },
                        */
                        msg.RESULT_MSG["status"] = 500,
                            msg.RESULT_MSG["data"].push({
                                Message: `Object ${modelNameInObject} In Model Invalid !`
                            });
                        msg.RESULT_MSG["message"] = [];
                        msg.RESULT_MSG["exeption"].push({
                            ERROR: "مدل مورد نظر از نوع آبجکت نیست"
                        });

                        // msg.OBJECT_MODEL["data"] = {Message:`Object ${modelNameInObject} In Model Invalid !`};
                        // return msg.OBJECT_MODEL;

                        // Msg.push({Message:`Object ${modelNameInObject} In Model Invalid !`, status: 'InvalidObject'});
                        // return Msg;
                    }

                } else {
                    resValidate.forEach(element => {
                        /*
                            { 
                                status: 100,
                                data:{},
                                message:"اعتبارسنجی فیلدها را بررسی نمایید",
                                exeption:null
                            },
                        
                        
                        */

                        msg.RESULT_MSG["status"] = 100,
                            msg.RESULT_MSG["data"].push({
                                Message: `in ${tableName} Collection ${element.message}`
                            });
                        msg.RESULT_MSG["message"].push({
                            FAIL: "اعتبارسنجی فیلدها را بررسی نمایید"
                        });
                        msg.RESULT_MSG["exeption"] = [];

                        // msg.INVALID_FIELD["data"] = {Message:`in ${tableName} Collection ${element.message}`};

                        // Msg.push({Message:`in ${tableName} Collection ${element.message}`, status: 'InvalidField'});
                    });
                    // return msg.INVALID_FIELD;
                }

            } else if (validateFields === null && findIdKey === true && findIdValue === null) {
                // InsertOne Without Validation !
                console.log('INSERT Without Validation');



                if (modelIsAllObject === true) {
                    delete tableFields['id'];
                    let duplicateFields = tableFields['duplicateFields'];
                    let collectionName = await db.collection(tableName);
                    // console.log('TTTFFF' , tableFields);
                    if (duplicateFields) {

                        let duplicateFilter = {};
                        for (let f = 0; f < duplicateFields.length; f++) {
                            duplicateFilter[duplicateFields[f]] = tableFields[duplicateFields[f]];
                        }
                        if (duplicateFilter) {
                            let _findObject = await collectionName.find(duplicateFilter).toArray();
                            if (Object.keys(_findObject).length == 0) {
                                delete tableFields['duplicateFields'];
                                const insertToTable = await collectionName.insertOne(tableFields); //
                                if ((insertToTable.acknowledged == true) && (insertToTable.insertedId != null || insertToTable.insertedId != undefined)) {

                                    /*
                                    
                                    SUCCESS_INSERT = {
                                    status: 200,
                                    data:{},
                                    message:"اطلاعات با موفقیت ثبت شد", 
                                    exeption:null
                                },
                                    
                                    */

                                    let obj = {};
                                    obj[tableName] = model[tableName];
                                    obj[tableName]['id'] = insertToTable.insertedId;
                                    delete obj[tableName]['_id'];
                                    // console.log(obj);
                                    // console.log('TN' , {tableName:model[tableName]});
                                    // console.log('M' , model[tableName]);
                                    // let aa = tableName[tableFields];
                                    //console.log('AAA' , aa);

                                    msg.RESULT_MSG["status"] = 200;
                                    // msg.RESULT_MSG["data"].push({Message:`Registration was done in the ${tableName} collection` , _id: insertToTable.insertedId});
                                    msg.RESULT_MSG["data"].push(obj);
                                    msg.RESULT_MSG["message"].push({
                                        SUCCESS: "اطلاعات با موفقیت ثبت شد"
                                    });
                                    msg.RESULT_MSG["exeption"] = [];

                                    // msg.SUCCESS_INSERT["data"] = {Message:`Registration was done in the ${tableName} collection`};
                                    // return msg.SUCCESS_INSERT;
                                    // Msg.push({Message:`Registration was done in the ${tableName} collection`, status: 'Insert'});
                                } else {
                                    /*
                                    ERROR = {
                                        status: 100,
                                        data:{},
                                        message:"خطایی رخ داده است لطفا مجددا تلاش نمایید",
                                        exeption:null
                                    },
                                    */
                                    //console.log('MODEL' , model[i]);
                                    msg.RESULT_MSG["status"] = 100,
                                        msg.RESULT_MSG["data"].push({
                                            Message: "An error has occurred"
                                        });
                                    msg.RESULT_MSG["message"].push({
                                        FAIL: "خطایی رخ داده است لطفا مجددا تلاش نمایید"
                                    });
                                    msg.RESULT_MSG["exeption"] = [];

                                    // msg.ERROR["data"] = {Message:"An error has occurred"};
                                    // return msg.ERROR;

                                    // Msg.push({Message:"An error has occurred", status: 'Occurred'});
                                }

                            } else {

                                // console.log('MODEL' , model[i]);
                                msg.RESULT_MSG["status"] = 100,
                                    msg.RESULT_MSG["data"].push({
                                        Message: `Duplicate Record (${duplicateFields}) in ${tableName} collection `
                                    });
                                msg.RESULT_MSG["message"].push({
                                    FAIL: "این اطلاعات قبلا ثبت شده است"
                                });
                                msg.RESULT_MSG["exeption"] = [];

                                // msg.DUPLICATE_RECORD["data"] = {Message:`Duplicate Record (${duplicateFields}) in ${tableName} collection `}
                                // return msg.DUPLICATE_RECORD;
                                // Msg.push({Message:`Duplicate Record (${duplicateFields}) in ${tableName} collection `, status: 'Duplicate'});
                            }
                        }


                    } else {

                        // console.log('NOT');
                        const insertToTable = await collectionName.insertOne(tableFields); //
                        if ((insertToTable.acknowledged == true) && (insertToTable.insertedId != null || insertToTable.insertedId != undefined)) {


                            let obj = {};
                            obj[tableName] = model[tableName];
                            obj[tableName]['id'] = insertToTable.insertedId;
                            delete obj[tableName]['_id'];
                            // console.log(obj);
                            // console.log('TN' , {tableName:model[tableName]});
                            // console.log('M' , model[tableName]);
                            // let aa = tableName[tableFields];
                            //console.log('AAA' , aa);

                            msg.RESULT_MSG["status"] = 200;
                            // msg.RESULT_MSG["data"].push({Message:`Registration was done in the ${tableName} collection` , _id: insertToTable.insertedId});
                            msg.RESULT_MSG["data"].push(obj);
                            msg.RESULT_MSG["message"].push({
                                SUCCESS: "اطلاعات با موفقیت ثبت شد"
                            });
                            msg.RESULT_MSG["exeption"] = [];

                            // console.log('OBJ' , obj);
                            // msg.SUCCESS_INSERT["data"] = {Message:`Registration was done in the ${tableName} collection`};
                            // return msg.SUCCESS_INSERT;

                            // Msg.push({Message:`Registration was done in the ${tableName} collection`, status: 'Insert'});
                        } else {

                            msg.RESULT_MSG["status"] = 100,
                                msg.RESULT_MSG["data"].push({
                                    Message: "An error has occurred"
                                });
                            msg.RESULT_MSG["message"].push({
                                FAIL: "خطایی رخ داده است لطفا مجددا تلاش نمایید"
                            });
                            msg.RESULT_MSG["exeption"] = [];

                            // msg.ERROR["data"] = {Message:"An error has occurred"};
                            // return msg.ERROR;

                            // Msg.push({Message:"An error has occurred", status: 'Occurred'});
                        }
                    }


                } else {

                    /*
                      {
                        status: 500,
                        data:{},
                        message:null,
                        exeption:"مدل مورد نظر از نوع آبجکت نیست"
                    },
                      
                      
                     */

                    msg.RESULT_MSG["status"] = 500,
                        msg.RESULT_MSG["data"].push({
                            Message: `Object ${modelNameInObject} In Model Invalid !`
                        });
                    msg.RESULT_MSG["message"] = [];
                    msg.RESULT_MSG["exeption"].push({
                        ERROR: "مدل مورد نظر از نوع آبجکت نیست"
                    });

                    // msg.OBJECT_MODEL["data"] = {Message:`Object ${modelNameInObject} In Model Invalid !`};
                    // return msg.OBJECT_MODEL;

                    // Msg.push({Message:`Object ${modelNameInObject} In Model Invalid !`, status: 'InvalidObject'});
                    // return Msg;
                }
            } else {

                /*
                     {
                        status: 500,
                        data:{},
                        message:null,
                        exeption:"آیدی را در مدل بررسی نمایید"
                    }
                
                
                */

                msg.RESULT_MSG["status"] = 500,
                    msg.RESULT_MSG["data"].push({
                        Message: `Idkey Invalid !`
                    });
                msg.RESULT_MSG["message"] = [];
                msg.RESULT_MSG["exeption"].push({
                    ERROR: "آیدی را در مدل بررسی نمایید"
                });


                // msg.ID_INVALID["data"] = {Message:`Idkey Invalid !`};
                // return msg.ID_INVALID;

                // console.log('Idkey Invalid !');
                // Msg.push({Message:`Idkey Invalid !`, status: 'InvalidIdKey'});
            }

        } // End For 

        return msg.RESULT_MSG;

        //return Msg;

    },

    async checkValidator(schema, inputObject) {
        const v = new Validator();
        const check = v.compile(schema);
        const resValidator = check(inputObject);
        return resValidator;
    },

    async MultipleFind(filter) {

        /* 
            How To Run Function : 
    
            let __filter = {
             collectionName:"tst",
             aggregateArray:[
                {
                    $lookup: {
                    from: "loc",
                    localField: "Name",
                    foreignField: "abc",
                    as: "locccc"
                    }
                },
                { 
                    $project :{
                        _id:0 ,
                        Name : 1 ,
                        family:1 , 
                        locccc:{
                            abc:1,
                            _id:1
                        }
                    } 
                },
                // {
                //     $match: {
                //       "locccc.abc": "ali",
                //       "family":"AHMADI"
                //     //   balance: {
                //     //     $gt: 0
                //     //   }
                //     }
                // },
                {$skip: 0},
                {$limit: 100},
                {$sort: {_id: -1}}
        ]
    }
    
    multipleFind(__filter).then((result)=>{
        console.log("MULTIPLE_FIND",util.inspect(result, false, null, true))
    });
    
        */

        if (typeof (filter) == "object") {

            let collectionName = filter['collectionName'];
            let aggregateArray = filter['aggregateArray'];

            let collectionTitle = await db.collection(collectionName);
            return collectionTitle.aggregate(aggregateArray).toArray();
        } else {
            /*
                {
                    status: 500,
                    data:{},
                    message:null,
                    exeption:"مقدار ورودی یا همان فیلتر از نوع آبجکت نمی باشد"
                }
            
            */
            msg.RESULT_MSG["status"] = 500;
            msg.RESULT_MSG["data"].push({
                Message: 'filter Invalid'
            });
            msg.RESULT_MSG["message"] = [];
            msg.RESULT_MSG["exeption"].push("مقدار ورودی یا همان فیلتر از نوع آبجکت نمی باشد");


            // msg.INVALID_FILTER["data"] = {Message:'filter Invalid'};
            // return msg.INVALID_FILTER;

            //  Msg.push({Message:'filter Invalid' , status: 'InvalidFilter'});
            //  return Msg;
        }
        return msg.RESULT_MSG;

    },

    async SingleFind(filter) {

        /*
            How To Run Function : 
        
            let _filter = {
            collectionName:"tst",
            fields:{
                Name:"ali"
            }
        }
        
        singleFind(_filter).then((x)=>{
            console.log("SINGLE_FIND",util.inspect(x, false, null, true))
        })
        
        */


        if (typeof (filter) == "object") {

            let collectionName = filter['collectionName'];
            let collectionTitle = await db.collection(collectionName);
            let fields = filter['fields'];
            var dt = await collectionTitle.find(fields).toArray();
            // console.log('dt' , dt);
            // let obj = {};
            // obj[collectionName] = dt;
            /*
                { 
                    status: 200,
                    data:{},
                    message:"اطلاعات با موفقیت یافت شد", 
                    exeption:null
                }
            
            */
            msg.RESULT_MSG["status"] = 200;
            msg.RESULT_MSG["data"] = dt;
            msg.RESULT_MSG["message"] = ["اطلاعات با موفقیت یافت شد"];
            msg.RESULT_MSG["exeption"] = [];

            // msg.SUCCESS_FIND["data"] = dt;
            // return dt;
            // return msg.SUCCESS_FIND;
        } else {
            /*
                 {
                    status: 500,
                    data:{},
                    message:null,
                    exeption:"مقدار ورودی یا همان فیلتر از نوع آبجکت نمی باشد"
                }
            */

            msg.RESULT_MSG["status"] = 500;
            msg.RESULT_MSG["data"].push({
                Message: 'filter Invalid'
            });
            msg.RESULT_MSG["message"] = [];
            msg.RESULT_MSG["exeption"] = ["مقدار ورودی یا همان فیلتر از نوع آبجکت نمی باشد"];

            // msg.INVALID_FILTER["data"] = {Message:'filter Invalid'};
            // return msg.INVALID_FILTER;

            //  Msg.push({Message:'filter Invalid' , status: 'InvalidFilter'});
            //  return Msg;
        }
        return msg.RESULT_MSG;

    },

    async SingleFind_V2(filter) {

        /*
            How To Run Function : 
        
            let _filter = {
            collectionName:"tst",
            fields:{
                Name:"ali"
            }
        }
        
        singleFind(_filter).then((x)=>{
            console.log("SINGLE_FIND",util.inspect(x, false, null, true))
        })
        
        */


        if (typeof (filter) == "object") {
            let collectionName = filter['collectionName'];
            let collectionTitle = await db.collection(collectionName);
            let fields = filter['fields'];
            var dt = await collectionTitle.find(fields).toArray();
            // console.log('dt' , dt);
            // let obj = {};
            // obj[collectionName] = dt;
            /*
                { 
                    status: 200,
                    data:{},
                    message:"اطلاعات با موفقیت یافت شد", 
                    exeption:null
                }
            
            */
            msg.RESULT_MSG["status"] = 200;
            msg.RESULT_MSG["data"] = dt;
            msg.RESULT_MSG["message"] = ["اطلاعات با موفقیت یافت شد"];
            msg.RESULT_MSG["exeption"] = [];

            // msg.SUCCESS_FIND["data"] = dt;
            // return dt;
            // return msg.SUCCESS_FIND;
        } else {
            /*
                 {
                    status: 500,
                    data:{},
                    message:null,
                    exeption:"مقدار ورودی یا همان فیلتر از نوع آبجکت نمی باشد"
                }
            */

            msg.RESULT_MSG["status"] = 500;
            msg.RESULT_MSG["data"].push({
                Message: 'filter Invalid'
            });
            msg.RESULT_MSG["message"] = [];
            msg.RESULT_MSG["exeption"] = ["مقدار ورودی یا همان فیلتر از نوع آبجکت نمی باشد"];

            // msg.INVALID_FILTER["data"] = {Message:'filter Invalid'};
            // return msg.INVALID_FILTER;

            //  Msg.push({Message:'filter Invalid' , status: 'InvalidFilter'});
            //  return Msg;
        }
        return msg.RESULT_MSG;

    },

    async MultipleFindArray(filters) {

        /*
            let filters = [
    {
            collectionName:"Auth",
            fields:{
                mobileNumber:"09351371050"
            }
    },
    {
        collectionName:"account",
        fields:{
            Name:"123"
        }
}
];
        
        */
        if (typeof (filters) == "object") {

            let obj_final = [];
            for (let i = 0; i < filters.length; i++) {
                const item = filters[i];
                let collectionName = item['collectionName'];
                let collectionTitle = await db.collection(collectionName);
                let fields = item['fields'];
                var dt = await collectionTitle.find(fields).toArray();
                let item_obj = {
                    [collectionName]: dt
                }
                obj_final.push(item_obj);
            }

            msg.MULTIPLE_RESULT_MSG["status"] = 200;
            msg.MULTIPLE_RESULT_MSG["data"] = obj_final;
            msg.MULTIPLE_RESULT_MSG["message"] = ["اطلاعات با موفقیت یافت شد"];
            msg.MULTIPLE_RESULT_MSG["exeption"] = [];

        } else {
            /*
                 {
                    status: 500,
                    data:{},
                    message:null,
                    exeption:"مقدار ورودی یا همان فیلتر از نوع آبجکت نمی باشد"
                }
            */

            msg.MULTIPLE_RESULT_MSG["status"] = 500;
            msg.MULTIPLE_RESULT_MSG["data"].push({
                Message: 'filter Invalid'
            });
            msg.MULTIPLE_RESULT_MSG["message"] = [];
            msg.MULTIPLE_RESULT_MSG["exeption"] = ["مقدار ورودی یا همان فیلتر از نوع آبجکت نمی باشد"];

            // msg.INVALID_FILTER["data"] = {Message:'filter Invalid'};
            // return msg.INVALID_FILTER;

            //  Msg.push({Message:'filter Invalid' , status: 'InvalidFilter'});
            //  return Msg;
        }
        return msg.MULTIPLE_RESULT_MSG;
    },

    async deleteRecord(deleteObject) {

        /*
            How To Run Function : 
    
            let __deleteObject = {
                collectionName:'tst',
                _id:'637661940fc0aa1f8c2a8cf9'
            }
    
            deleteRecord(__deleteObject).then(x=>{
                console.log('T' , x);
            });
        */

        if (typeof (deleteObject) == "object") {
            let collectionName = deleteObject['collectionName'];
            let collectionTitle = await db.collection(collectionName);

            if (deleteObject['_id']) {
                let _deleted = await collectionTitle.deleteOne({
                    _id: ObjectId(deleteObject['_id'])
                });
                if (_deleted.acknowledged === true && _deleted.deletedCount === 1) {


                    /*
                    {
                        status: 200,
                        data:{},
                        message:"اطلاعات با موفقیت حذف شد", 
                        exeption:null
                    }
                    */
                    msg.RESULT_MSG["status"] = 200;
                    msg.RESULT_MSG["data"].push({
                        Message: "The record was successfully deleted!"
                    });
                    msg.RESULT_MSG["message"] = ["اطلاعات با موفقیت حذف شد"];
                    msg.RESULT_MSG["exeption"] = [];


                    // msg.SUCCESS_DELETE["data"] = {Message:"The record was successfully deleted!"};
                    // return msg.SUCCESS_DELETE;

                    // Msg.push({Message:"The record was successfully deleted!", status: 'DeleteRecord'});

                } else {
                    /*
                        {
                            status: 100,
                            data:{},
                            message:"اطلاعاتی جهت حذف یافت نشد", 
                            exeption:null
                        }
                    */
                    msg.RESULT_MSG["status"] = 100;
                    msg.RESULT_MSG["data"].push({
                        Message: "No record found to delete !"
                    });
                    msg.RESULT_MSG["message"] = ["اطلاعاتی جهت حذف یافت نشد"];
                    msg.RESULT_MSG["exeption"] = [];



                    // msg.DELETE_NOTFOUND["data"] = {Message:"No record found to delete !"};
                    // return msg.DELETE_NOTFOUND;

                    // Msg.push({Message:"No record found to delete !", status: 'NoRecord'});
                }
            } else {

                /*
                    {
                    status: 500,
                    data:{},
                    message:null,
                    exeption:"آیدی را در مدل بررسی نمایید"
                }
                                */

                msg.RESULT_MSG["status"] = 500;
                msg.RESULT_MSG["data"].push({
                    Message: `Idkey Invalid !`
                });
                msg.RESULT_MSG["message"] = ["آیدی را در مدل بررسی نمایید"];
                msg.RESULT_MSG["exeption"] = [];

                // msg.ID_INVALID["data"] = {Message:`Idkey Invalid !`};
                // return msg.ID_INVALID;
                // Msg.push({Message:"_id not Found !", status: 'NotFound'});
            }
        }
        return msg.RESULT_MSG;
    },

    async addToExternalFields(tableName, fieldsObject) {
        let result = result.data;
        result.forEach(element => {
            if (element[tableName] != undefined) {

                element['Auth']['port'] = clientPort;
                element['Auth']['ip'] = clientIp;

                Create(element, null).then(update => {
                    console.log('UPDATE', update);
                });
            }

        });
    },

    async userRegister(data, clientIp, clientPort) {

        msg.RESULT_MSG_Auth["status"] = 0,
            msg.RESULT_MSG_Auth["data"] = [];
        msg.RESULT_MSG_Auth["message"] = [];
        msg.RESULT_MSG_Auth["exeption"] = [];
        let jsonGuard = {};

        if (data['Auth'] != undefined) {



            let _filter_blockIp = {
                collectionName: "Auth",
                fields: {
                    ip: clientIp,
                    mobileNumber: data['Auth']['mobileNumber']
                }
            }

            let _find = await SingleFind_New(_filter_blockIp);

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

                    let _find_MobileNumber = await SingleFind_New(_filter_MobileNumber);
                    let _find_MobileNumber_data = _find_MobileNumber['data'][0];

                    if (_find_MobileNumber['data'].length > 0) {
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
                    let smsCode = 1;
                    data['Auth']['smsCode'] = 'smsCode';
                    data['Auth']['expiredSmsCode'] = new Date().getTime() + config_expireSmsCode;

                    Create_New(data, null).then(result => {});
                    // ===================== Management Guard ======================

                    let filter_guard = {
                        collectionName: "managementGuard",
                        fields: {
                            mobileNumber: data['Auth']['mobileNumber']
                        }
                    }
                    let _find_guard = await SingleFind_New(filter_guard);

                    if (_find_guard['data'].length > 0) {
                        jsonGuard = {
                            managementGuard: {
                                id: _find_guard['data'][0]['_id'],
                                canActivate: true,
                                expireTime: new Date().getTime() + config_guards['start-register-TO-register']
                            }
                        }
                    }
                    Create_New(jsonGuard, null).then(result => {});

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
                        let smsCode = 1;
                        data['Auth']['smsCode'] = 'smsCode';
                        data['Auth']['expiredSmsCode'] = new Date().getTime() + config_expireSmsCode;

                        Create_New(obj, null).then(result => {});

                        // ================================= Management Guard =========================

                        let filter_guard = {
                            collectionName: "managementGuard",
                            fields: {
                                mobileNumber: data['Auth']['mobileNumber']
                            }
                        }
                        let _find_guard = await SingleFind_New(filter_guard);

                        if (_find_guard['data'].length > 0) {
                            jsonGuard = {
                                managementGuard: {
                                    id: _find_guard['data'][0]['_id'],
                                    canActivate: true,
                                    expireTime: new Date().getTime() + config_guards['start-register-TO-register']
                                }
                            }
                        }
                        Create_New(jsonGuard, null).then(result => {});

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

                        let filter_guard = {
                            collectionName: "managementGuard",
                            fields: {
                                mobileNumber: data['Auth']['mobileNumber']
                            }
                        }
                        let _find_guard = await SingleFind_New(filter_guard);

                        if (_find_guard['data'].length > 0) {
                            jsonGuard = {
                                managementGuard: {
                                    id: _find_guard['data'][0]['_id'],
                                    canActivate: false,
                                    expireTime: new Date().getTime() + config_guards['start-register-TO-register']
                                }
                            }
                        }
                        Create_New(jsonGuard, null).then(result => {});

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
                data['Auth']['updateRow'] = new Date().getTime() + config_ipBlockTime;
                const p2e = s => s.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d));
                let getTime = new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds() + ':' + new Date().getMilliseconds();
                data['Auth']['shamsi_updatedRow'] = p2e(new Date().toLocaleDateString('fa-IR') + ' ' + getTime);
                data['Auth']['ipBlockTime'] = null;

                data['Auth']['port'] = clientPort;
                data['Auth']['ip'] = clientIp;

                // let smsCode = await SendSms_With_Kavehnegar(data['Auth']['mobileNumber']);
                let smsCode = 1;
                data['Auth']['smsCode'] = 'smsCode';
                data['Auth']['expiredSmsCode'] = new Date().getTime() + config_expireSmsCode;

                Create_New(data, null).then(result => {});

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

            data['RegisteredUser']['port'] = clientPort;
            data['RegisteredUser']['ip'] = clientIp;

            let _filter = {
                collectionName: "RegisteredUser",
                fields: {
                    mobileNumber: data['RegisteredUser']['mobileNumber']
                }
            }
            // 2. find clientIp and set id and count for update
            SingleFind_New(_filter).then((result) => {

                let _findRegisteredUser = result['data'];

                if (_findRegisteredUser.length > 0) {
                    data['RegisteredUser']['id'] = _findRegisteredUser[0]['_id'];
                }
                Create_New(data, null).then(result => {});
            })


        }

        console.log('MM', msg.RESULT_MSG_Auth);
        return msg.RESULT_MSG_Auth;

    },

    async Create_V1(model , validateFields) {
        
        // const session = client.startSession();
       
        msg.RESULT_MSG["status"] = 0,
        msg.RESULT_MSG["data"] = [];
        msg.RESULT_MSG["message"] = [];
        msg.RESULT_MSG["exeption"] = [];
    
        let Msg = [];
        if (model === null || model === undefined || typeof(model) === 'string' || typeof(model) === 'number' || typeof(model) === 'boolean' || Object.keys(model).length === 0) {
            Msg.push({Message:"The model empty OR Invalid Type!", status: 'ErrorModel'});
            return Msg;
        }
    
    
        let modelIsAllObject = true;
        let modelNameInObject = "";
    
        let keysModel = Object.keys(model);
    
        for (let c = 0; c < keysModel.length; c++) {
            
            let tableName = keysModel[c];
            let tableFields = model[tableName];
            if (tableFields === null || Object.keys(tableFields).length == 0 || typeof(tableFields) === 'string' ||typeof(tableFields) === 'number' || typeof(tableFields) === 'boolean') {
                modelIsAllObject = false;
                modelNameInObject = tableName;
            }
        }
    
        for (let i = 0; i < keysModel.length; i++) {
            // console.log('III' , i);
            let tableName = keysModel[i];
            let tableFields = model[tableName];
            let findIdKey = 'id' in tableFields;
            let findIdValue = tableFields['id'];
            
            const p2e = s => s.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d));
            let getTime = new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds() + ':' + new Date().getMilliseconds();      
            tableFields['createdAt'] = new Date();
            tableFields['updatedAt'] = new Date();
            tableFields['shamsi_createAt'] = p2e(new Date().toLocaleDateString('fa-IR') + ' ' + getTime);
    
            if (validateFields === null && findIdKey === true && findIdValue === null) {
                // InsertOne Without Validation !
                console.log('INSERT Without Validation');
    
              
    
                if (modelIsAllObject === true) {
                    delete tableFields['id'];
                    let duplicateFields = tableFields['duplicateFields'];
                    let collectionName = await db.collection(tableName);
                    // console.log('TTTFFF' , tableFields);
                    if (duplicateFields) {
    
                        let duplicateFilter = {};
                        for (let f = 0; f < duplicateFields.length; f++) {
                            duplicateFilter[duplicateFields[f]] = tableFields[duplicateFields[f]];
                        }
                        if (duplicateFilter) {
                            let _findObject = await collectionName.find(duplicateFilter).toArray();
                            if (Object.keys(_findObject).length == 0) {
                                delete tableFields['duplicateFields'];
                                const insertToTable = await collectionName.insertOne(tableFields);//
                                if((insertToTable.acknowledged == true) && (insertToTable.insertedId != null || insertToTable.insertedId != undefined)){
                                    
                                    /*
                                    
                                    SUCCESS_INSERT = {
                                    status: 200,
                                    data:{},
                                    message:"اطلاعات با موفقیت ثبت شد", 
                                    exeption:null
                                },
                                    
                                    */
    
                                let obj ={};
                                obj[tableName] = model[tableName];   
                                obj[tableName]['id'] = insertToTable.insertedId;
                                delete  obj[tableName]['_id'];
                                // console.log(obj);
                                // console.log('TN' , {tableName:model[tableName]});
                                // console.log('M' , model[tableName]);
                                // let aa = tableName[tableFields];
                                //console.log('AAA' , aa);
    
                                msg.RESULT_MSG["status"] = 200;
                                // msg.RESULT_MSG["data"].push({Message:`Registration was done in the ${tableName} collection` , _id: insertToTable.insertedId});
                                msg.RESULT_MSG["data"].push(obj);
                                msg.RESULT_MSG["message"].push({SUCCESS:"اطلاعات با موفقیت ثبت شد"});
                                msg.RESULT_MSG["exeption"] = [];
    
                                    // msg.SUCCESS_INSERT["data"] = {Message:`Registration was done in the ${tableName} collection`};
                                    // return msg.SUCCESS_INSERT;
                                    // Msg.push({Message:`Registration was done in the ${tableName} collection`, status: 'Insert'});
                                }else{
                                    /*
                                    ERROR = {
                                        status: 100,
                                        data:{},
                                        message:"خطایی رخ داده است لطفا مجددا تلاش نمایید",
                                        exeption:null
                                    },
                                    */
                                    //console.log('MODEL' , model[i]);
                                    msg.RESULT_MSG["status"] = 100,
                                    msg.RESULT_MSG["data"].push({Message:"An error has occurred"});
                                    msg.RESULT_MSG["message"].push({FAIL:"خطایی رخ داده است لطفا مجددا تلاش نمایید"});
                                    msg.RESULT_MSG["exeption"] = [];
    
                                    // msg.ERROR["data"] = {Message:"An error has occurred"};
                                    // return msg.ERROR;
                                    
                                    // Msg.push({Message:"An error has occurred", status: 'Occurred'});
                                }
    
                            }else{
    
                                // console.log('MODEL' , model[i]);
                                msg.RESULT_MSG["status"] = 100,
                                msg.RESULT_MSG["data"].push({Message:`Duplicate Record (${duplicateFields}) in ${tableName} collection `});
                                msg.RESULT_MSG["message"].push({FAIL:"این اطلاعات قبلا ثبت شده است"});
                                msg.RESULT_MSG["exeption"] = [];
    
                                // msg.DUPLICATE_RECORD["data"] = {Message:`Duplicate Record (${duplicateFields}) in ${tableName} collection `}
                                // return msg.DUPLICATE_RECORD;
                                // Msg.push({Message:`Duplicate Record (${duplicateFields}) in ${tableName} collection `, status: 'Duplicate'});
                            }
                        }
                       
    
                    }else{
                       
                        console.log('tableFields_V1' , tableFields);
                        const insertToTable = await collectionName.insertOne(tableFields);//
                        if((insertToTable.acknowledged == true) && (insertToTable.insertedId != null || insertToTable.insertedId != undefined)){
    
                           
                            let obj ={};
                            obj[tableName] = model[tableName];   
                            obj[tableName]['id'] = insertToTable.insertedId;
                            delete  obj[tableName]['_id'];
                            // console.log(obj);
                            // console.log('TN' , {tableName:model[tableName]});
                            // console.log('M' , model[tableName]);
                            // let aa = tableName[tableFields];
                            //console.log('AAA' , aa);
    
                            msg.RESULT_MSG["status"] = 200;
                            // msg.RESULT_MSG["data"].push({Message:`Registration was done in the ${tableName} collection` , _id: insertToTable.insertedId});
                            msg.RESULT_MSG["data"].push(obj);
                            msg.RESULT_MSG["message"].push({SUCCESS:"اطلاعات با موفقیت ثبت شد"});
                            msg.RESULT_MSG["exeption"] = [];
    
                            // console.log('OBJ' , obj);
                            // msg.SUCCESS_INSERT["data"] = {Message:`Registration was done in the ${tableName} collection`};
                            // return msg.SUCCESS_INSERT;
    
                            // Msg.push({Message:`Registration was done in the ${tableName} collection`, status: 'Insert'});
                        }else{
    
                            msg.RESULT_MSG["status"] = 100,
                            msg.RESULT_MSG["data"].push({Message:"An error has occurred"});
                            msg.RESULT_MSG["message"].push({FAIL:"خطایی رخ داده است لطفا مجددا تلاش نمایید"});
                            msg.RESULT_MSG["exeption"] = [];
    
                            // msg.ERROR["data"] = {Message:"An error has occurred"};
                            // return msg.ERROR;
    
                            // Msg.push({Message:"An error has occurred", status: 'Occurred'});
                        }
                    }
                    
    
                }else{
    
                    /*
                      {
                        status: 500,
                        data:{},
                        message:null,
                        exeption:"مدل مورد نظر از نوع آبجکت نیست"
                    },
                      
                      
                     */
    
                    msg.RESULT_MSG["status"] = 500,
                    msg.RESULT_MSG["data"].push({Message:`Object ${modelNameInObject} In Model Invalid !`});
                    msg.RESULT_MSG["message"] = [];
                    msg.RESULT_MSG["exeption"].push({ERROR:"مدل مورد نظر از نوع آبجکت نیست"});
    
                    // msg.OBJECT_MODEL["data"] = {Message:`Object ${modelNameInObject} In Model Invalid !`};
                    // return msg.OBJECT_MODEL;
    
                    // Msg.push({Message:`Object ${modelNameInObject} In Model Invalid !`, status: 'InvalidObject'});
                    // return Msg;
                }
            }
            else{
    
                /*
                     {
                        status: 500,
                        data:{},
                        message:null,
                        exeption:"آیدی را در مدل بررسی نمایید"
                    }
                
                
                */
    
                    msg.RESULT_MSG["status"] = 500,
                    msg.RESULT_MSG["data"].push({Message:`Idkey Invalid !`});
                    msg.RESULT_MSG["message"] = [];
                    msg.RESULT_MSG["exeption"].push({ERROR:"آیدی را در مدل بررسی نمایید"});
    
    
                // msg.ID_INVALID["data"] = {Message:`Idkey Invalid !`};
                // return msg.ID_INVALID;
    
                // console.log('Idkey Invalid !');
                // Msg.push({Message:`Idkey Invalid !`, status: 'InvalidIdKey'});
            }
    
            
        } // End For 
        
        return msg.RESULT_MSG;
    
        //return Msg;
    
    },
    
    

    // async setRedis(key , value){
    //     redis.set(key , value);
    // },

    // async getRedis(key){
    //    return redis.get(key);
    // }

    async SingleFindLocationHistory(filter) {

        /*
            How To Run Function : 
        
            let _filter = {
            collectionName:"tst",
            startDate: "ISO DATE",
            endDate: "ISO DATE",
            limit: LIMIT OF FIND
        }
        
        singleFind(_filter).then((x)=>{
            console.log("SINGLE_FIND",util.inspect(x, false, null, true))
        })
        
        */


        if (typeof (filter) == "object") {

            let collectionName = filter['collectionName'];
            let collectionTitle = await db.collection(collectionName);
            let startDate = filter['startDate'];
            let endDate = filter['endDate'];
            let limit = filter['limit'];
            let uuid = filter['uuid'];
            var dt = await collectionTitle.find({
                createdAt: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                },
                uid: uuid
            }).limit(Number(limit)).toArray();
            // let obj = {};
            // obj[collectionName] = dt;
            /*
                { 
                    status: 200,
                    data:{},
                    message:"اطلاعات با موفقیت یافت شد", 
                    exeption:null
                }
            
            */
            msg.RESULT_MSG["status"] = 200;
            msg.RESULT_MSG["data"] = dt;
            msg.RESULT_MSG["message"] = ["اطلاعات با موفقیت یافت شد"];
            msg.RESULT_MSG["exeption"] = [];

            // msg.SUCCESS_FIND["data"] = dt;
            // return dt;
            // return msg.SUCCESS_FIND;
        } else {
            /*
                 {
                    status: 500,
                    data:{},
                    message:null,
                    exeption:"مقدار ورودی یا همان فیلتر از نوع آبجکت نمی باشد"
                }
            */

            msg.RESULT_MSG["status"] = 500;
            msg.RESULT_MSG["data"].push({
                Message: 'filter Invalid'
            });
            msg.RESULT_MSG["message"] = [];
            msg.RESULT_MSG["exeption"] = ["مقدار ورودی یا همان فیلتر از نوع آبجکت نمی باشد"];

            // msg.INVALID_FILTER["data"] = {Message:'filter Invalid'};
            // return msg.INVALID_FILTER;

            //  Msg.push({Message:'filter Invalid' , status: 'InvalidFilter'});
            //  return Msg;
        }
        return msg.RESULT_MSG;

    },
    async SingleFindRequests(filter) {

        /*
            How To Run Function : 
        
            let _filter = {
            collectionName:"tst",
            uid: UID OF USER
        }
        
        singleFind(_filter).then((x)=>{
            console.log("SINGLE_FIND",util.inspect(x, false, null, true))
        })
        
        */


        if (typeof (filter) == "object") {

            let collectionName = filter['collectionName'];
            let collectionTitle = await db.collection(collectionName);
            let uuid = filter['uid'];
            var dt = await collectionTitle.find({
                uid: uuid
            }).sort({createdAt: -1}).toArray();
            // let obj = {};
            // obj[collectionName] = dt;
            /*
                { 
                    status: 200,
                    data:{},
                    message:"اطلاعات با موفقیت یافت شد", 
                    exeption:null
                }
            
            */
            msg.RESULT_MSG["status"] = 200;
            msg.RESULT_MSG["data"] = dt;
            msg.RESULT_MSG["message"] = ["اطلاعات با موفقیت یافت شد"];
            msg.RESULT_MSG["exeption"] = [];

            // msg.SUCCESS_FIND["data"] = dt;
            // return dt;
            // return msg.SUCCESS_FIND;
        } else {
            /*
                 {
                    status: 500,
                    data:{},
                    message:null,
                    exeption:"مقدار ورودی یا همان فیلتر از نوع آبجکت نمی باشد"
                }
            */

            msg.RESULT_MSG["status"] = 500;
            msg.RESULT_MSG["data"].push({
                Message: 'filter Invalid'
            });
            msg.RESULT_MSG["message"] = [];
            msg.RESULT_MSG["exeption"] = ["مقدار ورودی یا همان فیلتر از نوع آبجکت نمی باشد"];

            // msg.INVALID_FILTER["data"] = {Message:'filter Invalid'};
            // return msg.INVALID_FILTER;

            //  Msg.push({Message:'filter Invalid' , status: 'InvalidFilter'});
            //  return Msg;
        }
        return msg.RESULT_MSG;

    }

}

async function Create_New(model, validateFields) {

    // const session = client.startSession();

    msg.RESULT_MSG["status"] = 0,
        msg.RESULT_MSG["data"] = [];
    msg.RESULT_MSG["message"] = [];
    msg.RESULT_MSG["exeption"] = [];

    /*
    How To Run Function : 

        let _model2 = {
            tst:{
                id:null,
                duplicateFields:['Name'],
                Name:"qq" ,
                family:"AHMADI" ,
                lat:"96.0000000",
                Address:[ {Title:"@@@@@44" , Street:"$$$$$4"} , {Title:"@@@@fff@deddd" , Street:"$$rrrr$$$r"}  ]
            },
            location:{id:null,Lat:"2ss00sqfff44ee" , Lgt:"4044fsffqrr"},
            loc:{id:null,abc:"222ddd22"}
}


var schema = {

    tst:{
            Name: {
                type: "string", // ----> By Default Required !
                empty: false,
                trim: true
                // min: 3, max: 255
            },
            family:{
                type: "string",
                // optional: true ---> Not Required !
            },
            lat:{
                type: "string",
                // type: "equal", field: "password"
                // trim: true, lowercase: true
                // uppercase: true
                // type: "email" 
                // type: "number", positive: true, integer: true
            },
            Address:{
                type: "array"
            }
    },

    location:{
        Lat:{
            type: "string"
            
        },
        Lgt:{
            type: "string"
        }
    },

    loc:{
        abc:{
            type: "string"
        }
    }    

};

// Create(_model2 , schema).then(x=>{
//     console.log('T' , x);
// });

    */

    let Msg = [];
    if (model === null || model === undefined || typeof (model) === 'string' || typeof (model) === 'number' || typeof (model) === 'boolean' || Object.keys(model).length === 0) {
        Msg.push({
            Message: "The model empty OR Invalid Type!",
            status: 'ErrorModel'
        });
        return Msg;
    }


    let modelIsAllObject = true;
    let modelNameInObject = "";

    let keysModel = Object.keys(model);

    for (let c = 0; c < keysModel.length; c++) {

        let tableName = keysModel[c];
        let tableFields = model[tableName];
        if (tableFields === null || Object.keys(tableFields).length == 0 || typeof (tableFields) === 'string' || typeof (tableFields) === 'number' || typeof (tableFields) === 'boolean') {
            modelIsAllObject = false;
            modelNameInObject = tableName;
        }
    }

    for (let i = 0; i < keysModel.length; i++) {
        // console.log('III' , i);
        let tableName = keysModel[i];
        let tableFields = model[tableName];
        let findIdKey = 'id' in tableFields;
        let findIdValue = tableFields['id'];

        const p2e = s => s.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d));
        let getTime = new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds() + ':' + new Date().getMilliseconds();
        tableFields['createdAt'] = new Date();
        tableFields['updatedAt'] = new Date();
        tableFields['shamsi_createAt'] = p2e(new Date().toLocaleDateString('fa-IR') + ' ' + getTime);



        // console.log('TN' , tableName);
        // console.log('TF' , tableFields);

        if (validateFields != null && validateFields != undefined && typeof (validateFields) != 'string' && typeof (validateFields) != 'number' && typeof (validateFields) != 'boolean' && Object.keys(validateFields).length > 0 && findIdKey === true && ObjectID.isValid(findIdValue) === true) {
            // UpdateOne With Validation !
            console.log('Update With Validation');

            //delete tableFields['id'];
            const resValidate = await checkValidator(validateFields[tableName], model[tableName]);
            // console.log('RRR' , resValidate);
            if (resValidate === true) {

                if (modelIsAllObject === true) {

                    let id = tableFields['id'];
                    delete tableFields['id'];
                    let collectionName = await db.collection(tableName);
                    let updateModel = await collectionName.updateOne({
                        _id: ObjectID(id)
                    }, {
                        '$set': tableFields
                    }, {
                        upsert: false
                    });
                    if (updateModel.acknowledged == true && updateModel.modifiedCount == 1) {

                        msg.RESULT_MSG["status"] = 200;
                        msg.RESULT_MSG["data"].push({
                            Message: `The record in the ${tableName} collection was edited`
                        });
                        msg.RESULT_MSG["message"].push({
                            SUCCESS: "اطلاعات با موفقیت ویرایش شد"
                        });
                        msg.RESULT_MSG["exeption"] = [];

                        // msg.SUCCESS_UPDATE["data"] = {Message:`The record in the ${tableName} collection was edited`};
                        // return msg.SUCCESS_UPDATE;

                        // Msg.push({Message:`The record in the ${tableName} collection was edited`, status: 'Update'});
                    } else if (updateModel.acknowledged == true && updateModel.matchedCount == 1) {

                        msg.RESULT_MSG["status"] = 200;
                        msg.RESULT_MSG["data"].push({
                            Message: `There is no change to edit in ${tableName} Collection!`
                        });
                        msg.RESULT_MSG["message"].push({
                            SUCCESS: "تغییراتی در اطلاعات ویرایشی صورت نگرفت"
                        });
                        msg.RESULT_MSG["exeption"] = [];

                        // msg.UPDATE_CHANGE["data"] = {Message:`There is no change to edit in ${tableName} Collection!`};
                        // return msg.UPDATE_CHANGE;

                        // Msg.push({Message:`There is no change to edit in ${tableName} Collection!`, status: 'NotChange'});
                    } else {
                        msg.RESULT_MSG["status"] = 200;
                        msg.RESULT_MSG["data"].push({
                            Message: `Not Found Record in the ${tableName} collection For Edit!`
                        });
                        msg.RESULT_MSG["message"].push({
                            SUCCESS: "اطلاعاتی جهت ویرایش یافت نشد"
                        });
                        msg.RESULT_MSG["exeption"] = [];

                        // msg.UPDATE_NOTFOUND["data"] = {Message:`Not Found Record in the ${tableName} collection For Edit!`};
                        // return msg.UPDATE_NOTFOUND;

                        // Msg.push({Message:`Not Found Record in the ${tableName} collection For Edit!`, status: 'NotFound'});
                    }

                } else {
                    msg.RESULT_MSG["status"] = 500;
                    msg.RESULT_MSG["data"].push({
                        Message: `Object ${modelNameInObject} In Model Invalid !`
                    });
                    msg.RESULT_MSG["message"] = [];
                    msg.RESULT_MSG["exeption"].push({
                        ERROR: "مدل مورد نظر از نوع آبجکت نیست"
                    });

                    // msg.OBJECT_MODEL["data"] = {Message:`Object ${modelNameInObject} In Model Invalid !`};
                    // return msg.OBJECT_MODEL;

                    // Msg.push({Message:`Object ${modelNameInObject} In Model Invalid !`, status: 'InvalidObject'});
                    // return Msg;
                }

            } else {
                resValidate.forEach(element => {
                    /*
                        { 
                        status: 100,
                        data:{},
                        message:"اعتبارسنجی فیلدها را بررسی نمایید",
                        exeption:null
                    }
                    */
                    msg.RESULT_MSG["status"] = 100;
                    msg.RESULT_MSG["data"].push({
                        Message: `in ${tableName} Collection ${element.message}`
                    });
                    msg.RESULT_MSG["message"] = [{
                        FAIL: "اعتبارسنجی فیلدها را بررسی نمایید"
                    }];
                    msg.RESULT_MSG["exeption"] = [];

                    // msg.INVALID_FIELD["data"] = {Message:`in ${tableName} Collection ${element.message}`};

                    // Msg.push({Message:`in ${tableName} Collection ${element.message}`, status: 'InvalidField'});
                });
                // return msg.INVALID_FIELD;
            }




        } else if (findIdKey === true && ObjectID.isValid(findIdValue) === true) {
            // UpdateOne Without Validation !
            // console.log('Update Without Validation');

            if (modelIsAllObject === true) {

                let id = tableFields['id'];
                delete tableFields['id'];
                let collectionName = await db.collection(tableName);
                let updateModel = await collectionName.updateOne({
                    _id: ObjectID(id)
                }, {
                    '$set': tableFields
                }, {
                    upsert: false
                });
                if (updateModel.acknowledged == true && updateModel.modifiedCount == 1) {
                    /*
                        {
                        status: 200,
                        data:{},
                        message:"اطلاعات با موفقیت ویرایش شد", 
                        exeption:null
                    }
                        
                        */

                    let obj = {};
                    obj[tableName] = model[tableName];

                    msg.RESULT_MSG["status"] = 200;
                    // msg.RESULT_MSG["data"].push({Message:`Registration was done in the ${tableName} collection` , _id: insertToTable.insertedId});
                    msg.RESULT_MSG["data"].push(obj);
                    msg.RESULT_MSG["message"].push({
                        SUCCESS: "اطلاعات با موفقیت ویرایش شد"
                    });
                    msg.RESULT_MSG["exeption"] = [];

                    // msg.RESULT_MSG["status"] = 200;
                    // msg.RESULT_MSG["data"].push({Message:`The record in the ${tableName} collection was edited`});
                    // msg.RESULT_MSG["message"].push({SUCCESS:"اطلاعات با موفقیت ویرایش شد"});
                    // msg.RESULT_MSG["exeption"] = [];

                    // msg.SUCCESS_UPDATE["data"] = {Message:`The record in the ${tableName} collection was edited`};
                    // return msg.SUCCESS_UPDATE;

                    // Msg.push({Message:`The record in the ${tableName} collection was edited`, status: 'Update'});
                } else if (updateModel.acknowledged == true && updateModel.matchedCount == 1) {

                    /*
                        {
                        status: 100,
                        data:{},
                        message:"تغییراتی در اطلاعات ویرایشی صورت نگرفت", 
                        exeption:null
                    }
                    */
                    let obj = {};
                    obj[tableName] = model[tableName];

                    msg.RESULT_MSG["status"] = 200;
                    // msg.RESULT_MSG["data"].push({Message:`Registration was done in the ${tableName} collection` , _id: insertToTable.insertedId});
                    msg.RESULT_MSG["data"].push(obj);
                    msg.RESULT_MSG["message"].push({
                        SUCCESS: "تغییراتی در اطلاعات ویرایشی صورت نگرفت"
                    });
                    msg.RESULT_MSG["exeption"] = [];

                    // msg.RESULT_MSG["status"] = 200;
                    // msg.RESULT_MSG["data"].push({Message:`There is no change to edit in ${tableName} Collection!`});
                    // msg.RESULT_MSG["message"].push({SUCCESS:"تغییراتی در اطلاعات ویرایشی صورت نگرفت"});
                    // msg.RESULT_MSG["exeption"] = [];


                    // msg.UPDATE_CHANGE["data"] = {Message:`There is no change to edit in ${tableName} Collection!`};
                    // return msg.UPDATE_CHANGE;

                    // Msg.push({Message:`There is no change to edit in ${tableName} Collection!`, status: 'NotChange'});
                } else {
                    /*
                        {
                            status: 100,
                            data:{},
                            message:"اطلاعاتی جهت ویرایش یافت نشد", 
                            exeption:null
                        }
                    
                    */
                    let obj = {};
                    obj[tableName] = model[tableName];

                    msg.RESULT_MSG["status"] = 200;
                    // msg.RESULT_MSG["data"].push({Message:`Registration was done in the ${tableName} collection` , _id: insertToTable.insertedId});
                    msg.RESULT_MSG["data"].push(obj);
                    msg.RESULT_MSG["message"].push({
                        SUCCESS: "اطلاعاتی جهت ویرایش یافت نشد"
                    });
                    msg.RESULT_MSG["exeption"] = [];


                    // msg.RESULT_MSG["status"] = 200;
                    // msg.RESULT_MSG["data"].push({Message:`Not Found Record in the ${tableName} collection For Edit!`});
                    // msg.RESULT_MSG["message"].push({SUCCESS:"اطلاعاتی جهت ویرایش یافت نشد"});
                    // msg.RESULT_MSG["exeption"] = [];

                    // msg.UPDATE_NOTFOUND["data"] = {Message:`Not Found Record in the ${tableName} collection For Edit!`};
                    // return msg.UPDATE_NOTFOUND;

                    // Msg.push({Message:`Not Found Record in the ${tableName} collection For Edit!`, status: 'NotFound'});
                }

            } else {
                /*
                 {
                     status: 500,
                     data:{},
                     message:null,
                     exeption:"مدل مورد نظر از نوع آبجکت نیست"
                }
                 */

                msg.RESULT_MSG["status"] = 500;
                msg.RESULT_MSG["data"].push({
                    Message: `Object ${modelNameInObject} In Model Invalid !`
                });
                msg.RESULT_MSG["message"] = [];
                msg.RESULT_MSG["exeption"].push({
                    ERROR: "مدل مورد نظر از نوع آبجکت نیست"
                });

                // msg.OBJECT_MODEL["data"] = {Message:`Object ${modelNameInObject} In Model Invalid !`};
                // return msg.OBJECT_MODEL;

                // Msg.push({Message:`Object ${modelNameInObject} In Model Invalid !`, status: 'InvalidObject'});
                // return Msg;
            }

        } else if (validateFields != null && validateFields != undefined && typeof (validateFields) != 'string' && typeof (validateFields) != 'number' && typeof (validateFields) != 'boolean' && Object.keys(validateFields).length > 0 && findIdValue === null && findIdKey === true) {
            // InsertOne With Validation !
            console.log('INSERT With Validation');

            delete tableFields['id'];
            const resValidate = await checkValidator(validateFields[tableName], model[tableName]);

            if (resValidate === true) {

                if (modelIsAllObject === true) {
                    delete tableFields['id'];
                    let duplicateFields = tableFields['duplicateFields'];

                    let collectionName = await db.collection(tableName);

                    if (duplicateFields) {
                        let duplicateFilter = {};
                        for (let f = 0; f < duplicateFields.length; f++) {
                            duplicateFilter[duplicateFields[f]] = tableFields[duplicateFields[f]];
                        }
                        if (duplicateFilter) {
                            let _findObject = await collectionName.find(duplicateFilter).toArray();


                            if (Object.keys(_findObject).length == 0) {
                                // console.log('INSERT_DUP');
                                delete tableFields['duplicateFields'];
                                const insertToTable = await collectionName.insertOne(tableFields); //
                                if ((insertToTable.acknowledged == true) && (insertToTable.insertedId != null || insertToTable.insertedId != undefined)) {

                                    msg.RESULT_MSG["status"] = 200;
                                    msg.RESULT_MSG["data"].push({
                                        Message: `Registration was done in the ${tableName} collection`
                                    });
                                    msg.RESULT_MSG["message"].push({
                                        SUCCESS: "اطلاعات با موفقیت ثبت شد"
                                    });
                                    msg.RESULT_MSG["exeption"] = [];

                                    // msg.SUCCESS_INSERT["data"] = {Message:`Registration was done in the ${tableName} collection`};
                                    // return msg.SUCCESS_INSERT;
                                    // Msg.push({Message:`Registration was done in the ${tableName} collection`, status: 'Insert'});
                                } else {
                                    msg.RESULT_MSG["status"] = 100,
                                        msg.RESULT_MSG["data"].push({
                                            Message: "An error has occurred"
                                        });
                                    msg.RESULT_MSG["message"].push({
                                        FAIL: "خطایی رخ داده است لطفا مجددا تلاش نمایید"
                                    });
                                    msg.RESULT_MSG["exeption"] = [];

                                    // msg.ERROR["data"] = {Message:"An error has occurred"};
                                    // return msg.ERROR;
                                }
                            } else {

                                msg.RESULT_MSG["status"] = 100,
                                    msg.RESULT_MSG["data"].push({
                                        Message: `Duplicate Record (${duplicateFields}) in ${tableName} collection `
                                    });
                                msg.RESULT_MSG["message"].push({
                                    FAIL: "این اطلاعات قبلا ثبت شده است"
                                });
                                msg.RESULT_MSG["exeption"] = [];

                                // msg.DUPLICATE_RECORD["data"] = {Message:`Duplicate Record (${duplicateFields}) in ${tableName} collection `}
                                // return msg.DUPLICATE_RECORD;

                                // Msg.push({Message:`Duplicate Record (${duplicateFields}) in ${tableName} collection `, status: 'Duplicate'});
                            }
                        }

                    } else {

                        const insertToTable = await collectionName.insertOne(tableFields); //
                        if ((insertToTable.acknowledged == true) && (insertToTable.insertedId != null || insertToTable.insertedId != undefined)) {

                            msg.RESULT_MSG["status"] = 200;
                            msg.RESULT_MSG["data"].push({
                                Message: `Registration was done in the ${tableName} collection`
                            });
                            msg.RESULT_MSG["message"].push({
                                SUCCESS: "اطلاعات با موفقیت ثبت شد"
                            });
                            msg.RESULT_MSG["exeption"] = [];

                            // msg.SUCCESS_INSERT["data"] = {Message:`Registration was done in the ${tableName} collection`};
                            // return msg.SUCCESS_INSERT;
                            // Msg.push({Message:`Registration was done in the ${tableName} collection`, status: 'Insert'});
                        } else {

                            msg.RESULT_MSG["status"] = 100,
                                msg.RESULT_MSG["data"].push({
                                    Message: "An error has occurred"
                                });
                            msg.RESULT_MSG["message"].push({
                                FAIL: "خطایی رخ داده است لطفا مجددا تلاش نمایید"
                            });
                            msg.RESULT_MSG["exeption"] = [];

                            // msg.ERROR["data"] = {Message:"An error has occurred"};
                            // return msg.ERROR;

                            // Msg.push({Message:"An error has occurred", status: 'Occurred'});
                        }
                    }




                } else {
                    /*
                        {
                            status: 500,
                            data:{},
                            message:null,
                            exeption:"مدل مورد نظر از نوع آبجکت نیست"
                        },
                    */
                    msg.RESULT_MSG["status"] = 500,
                        msg.RESULT_MSG["data"].push({
                            Message: `Object ${modelNameInObject} In Model Invalid !`
                        });
                    msg.RESULT_MSG["message"] = [];
                    msg.RESULT_MSG["exeption"].push({
                        ERROR: "مدل مورد نظر از نوع آبجکت نیست"
                    });

                    // msg.OBJECT_MODEL["data"] = {Message:`Object ${modelNameInObject} In Model Invalid !`};
                    // return msg.OBJECT_MODEL;

                    // Msg.push({Message:`Object ${modelNameInObject} In Model Invalid !`, status: 'InvalidObject'});
                    // return Msg;
                }

            } else {
                resValidate.forEach(element => {
                    /*
                        { 
                            status: 100,
                            data:{},
                            message:"اعتبارسنجی فیلدها را بررسی نمایید",
                            exeption:null
                        },
                    
                    
                    */

                    msg.RESULT_MSG["status"] = 100,
                        msg.RESULT_MSG["data"].push({
                            Message: `in ${tableName} Collection ${element.message}`
                        });
                    msg.RESULT_MSG["message"].push({
                        FAIL: "اعتبارسنجی فیلدها را بررسی نمایید"
                    });
                    msg.RESULT_MSG["exeption"] = [];

                    // msg.INVALID_FIELD["data"] = {Message:`in ${tableName} Collection ${element.message}`};

                    // Msg.push({Message:`in ${tableName} Collection ${element.message}`, status: 'InvalidField'});
                });
                // return msg.INVALID_FIELD;
            }

        } else if (validateFields === null && findIdKey === true && findIdValue === null) {
            // InsertOne Without Validation !
            console.log('INSERT Without Validation');



            if (modelIsAllObject === true) {
                delete tableFields['id'];
                let duplicateFields = tableFields['duplicateFields'];
                let collectionName = await db.collection(tableName);
                // console.log('TTTFFF' , tableFields);
                if (duplicateFields) {

                    let duplicateFilter = {};
                    for (let f = 0; f < duplicateFields.length; f++) {
                        duplicateFilter[duplicateFields[f]] = tableFields[duplicateFields[f]];
                    }
                    if (duplicateFilter) {
                        let _findObject = await collectionName.find(duplicateFilter).toArray();
                        if (Object.keys(_findObject).length == 0) {
                            delete tableFields['duplicateFields'];
                            const insertToTable = await collectionName.insertOne(tableFields); //
                            if ((insertToTable.acknowledged == true) && (insertToTable.insertedId != null || insertToTable.insertedId != undefined)) {

                                /*
                                
                                SUCCESS_INSERT = {
                                status: 200,
                                data:{},
                                message:"اطلاعات با موفقیت ثبت شد", 
                                exeption:null
                            },
                                
                                */

                                let obj = {};
                                obj[tableName] = model[tableName];
                                obj[tableName]['id'] = insertToTable.insertedId;
                                delete obj[tableName]['_id'];
                                // console.log(obj);
                                // console.log('TN' , {tableName:model[tableName]});
                                // console.log('M' , model[tableName]);
                                // let aa = tableName[tableFields];
                                //console.log('AAA' , aa);

                                msg.RESULT_MSG["status"] = 200;
                                // msg.RESULT_MSG["data"].push({Message:`Registration was done in the ${tableName} collection` , _id: insertToTable.insertedId});
                                msg.RESULT_MSG["data"].push(obj);
                                msg.RESULT_MSG["message"].push({
                                    SUCCESS: "اطلاعات با موفقیت ثبت شد"
                                });
                                msg.RESULT_MSG["exeption"] = [];

                                // msg.SUCCESS_INSERT["data"] = {Message:`Registration was done in the ${tableName} collection`};
                                // return msg.SUCCESS_INSERT;
                                // Msg.push({Message:`Registration was done in the ${tableName} collection`, status: 'Insert'});
                            } else {
                                /*
                                ERROR = {
                                    status: 100,
                                    data:{},
                                    message:"خطایی رخ داده است لطفا مجددا تلاش نمایید",
                                    exeption:null
                                },
                                */
                                //console.log('MODEL' , model[i]);
                                msg.RESULT_MSG["status"] = 100,
                                    msg.RESULT_MSG["data"].push({
                                        Message: "An error has occurred"
                                    });
                                msg.RESULT_MSG["message"].push({
                                    FAIL: "خطایی رخ داده است لطفا مجددا تلاش نمایید"
                                });
                                msg.RESULT_MSG["exeption"] = [];

                                // msg.ERROR["data"] = {Message:"An error has occurred"};
                                // return msg.ERROR;

                                // Msg.push({Message:"An error has occurred", status: 'Occurred'});
                            }

                        } else {

                            // console.log('MODEL' , model[i]);
                            msg.RESULT_MSG["status"] = 100,
                                msg.RESULT_MSG["data"].push({
                                    Message: `Duplicate Record (${duplicateFields}) in ${tableName} collection `
                                });
                            msg.RESULT_MSG["message"].push({
                                FAIL: "این اطلاعات قبلا ثبت شده است"
                            });
                            msg.RESULT_MSG["exeption"] = [];

                            // msg.DUPLICATE_RECORD["data"] = {Message:`Duplicate Record (${duplicateFields}) in ${tableName} collection `}
                            // return msg.DUPLICATE_RECORD;
                            // Msg.push({Message:`Duplicate Record (${duplicateFields}) in ${tableName} collection `, status: 'Duplicate'});
                        }
                    }


                } else {

                    // console.log('NOT');
                    const insertToTable = await collectionName.insertOne(tableFields); //
                    if ((insertToTable.acknowledged == true) && (insertToTable.insertedId != null || insertToTable.insertedId != undefined)) {


                        let obj = {};
                        obj[tableName] = model[tableName];
                        obj[tableName]['id'] = insertToTable.insertedId;
                        delete obj[tableName]['_id'];
                        // console.log(obj);
                        // console.log('TN' , {tableName:model[tableName]});
                        // console.log('M' , model[tableName]);
                        // let aa = tableName[tableFields];
                        //console.log('AAA' , aa);

                        msg.RESULT_MSG["status"] = 200;
                        // msg.RESULT_MSG["data"].push({Message:`Registration was done in the ${tableName} collection` , _id: insertToTable.insertedId});
                        msg.RESULT_MSG["data"].push(obj);
                        msg.RESULT_MSG["message"].push({
                            SUCCESS: "اطلاعات با موفقیت ثبت شد"
                        });
                        msg.RESULT_MSG["exeption"] = [];

                        // console.log('OBJ' , obj);
                        // msg.SUCCESS_INSERT["data"] = {Message:`Registration was done in the ${tableName} collection`};
                        // return msg.SUCCESS_INSERT;

                        // Msg.push({Message:`Registration was done in the ${tableName} collection`, status: 'Insert'});
                    } else {

                        msg.RESULT_MSG["status"] = 100,
                            msg.RESULT_MSG["data"].push({
                                Message: "An error has occurred"
                            });
                        msg.RESULT_MSG["message"].push({
                            FAIL: "خطایی رخ داده است لطفا مجددا تلاش نمایید"
                        });
                        msg.RESULT_MSG["exeption"] = [];

                        // msg.ERROR["data"] = {Message:"An error has occurred"};
                        // return msg.ERROR;

                        // Msg.push({Message:"An error has occurred", status: 'Occurred'});
                    }
                }


            } else {

                /*
                  {
                    status: 500,
                    data:{},
                    message:null,
                    exeption:"مدل مورد نظر از نوع آبجکت نیست"
                },
                  
                  
                 */

                msg.RESULT_MSG["status"] = 500,
                    msg.RESULT_MSG["data"].push({
                        Message: `Object ${modelNameInObject} In Model Invalid !`
                    });
                msg.RESULT_MSG["message"] = [];
                msg.RESULT_MSG["exeption"].push({
                    ERROR: "مدل مورد نظر از نوع آبجکت نیست"
                });

                // msg.OBJECT_MODEL["data"] = {Message:`Object ${modelNameInObject} In Model Invalid !`};
                // return msg.OBJECT_MODEL;

                // Msg.push({Message:`Object ${modelNameInObject} In Model Invalid !`, status: 'InvalidObject'});
                // return Msg;
            }
        } else {

            /*
                 {
                    status: 500,
                    data:{},
                    message:null,
                    exeption:"آیدی را در مدل بررسی نمایید"
                }
            
            
            */

            msg.RESULT_MSG["status"] = 500,
                msg.RESULT_MSG["data"].push({
                    Message: `Idkey Invalid !`
                });
            msg.RESULT_MSG["message"] = [];
            msg.RESULT_MSG["exeption"].push({
                ERROR: "آیدی را در مدل بررسی نمایید"
            });


            // msg.ID_INVALID["data"] = {Message:`Idkey Invalid !`};
            // return msg.ID_INVALID;

            // console.log('Idkey Invalid !');
            // Msg.push({Message:`Idkey Invalid !`, status: 'InvalidIdKey'});
        }

    } // End For 

    return msg.RESULT_MSG;

    //return Msg;

}

async function SingleFind_New(filter) {

    /*
        How To Run Function : 
    
        let _filter = {
        collectionName:"tst",
        fields:{
            Name:"ali"
        }
    }
    
    singleFind(_filter).then((x)=>{
        console.log("SINGLE_FIND",util.inspect(x, false, null, true))
    })
    
    */



    if (typeof (filter) == "object") {
        let collectionName = filter['collectionName'];
        let collectionTitle = await db.collection(collectionName);
        let fields = filter['fields'];
        var dt = await collectionTitle.find(fields).toArray();
        // let obj = {};
        // obj[collectionName] = dt;
        /*
            { 
                status: 200,
                data:{},
                message:"اطلاعات با موفقیت یافت شد", 
                exeption:null
            }
        
        */
        msg.RESULT_MSG["status"] = 200;
        msg.RESULT_MSG["data"] = dt;
        msg.RESULT_MSG["message"] = ["اطلاعات با موفقیت یافت شد"];
        msg.RESULT_MSG["exeption"] = [];

        // msg.SUCCESS_FIND["data"] = dt;
        // return dt;
        // return msg.SUCCESS_FIND;
    } else {
        /*
             {
                status: 500,
                data:{},
                message:null,
                exeption:"مقدار ورودی یا همان فیلتر از نوع آبجکت نمی باشد"
            }
        */

        msg.RESULT_MSG["status"] = 500;
        msg.RESULT_MSG["data"].push({
            Message: 'filter Invalid'
        });
        msg.RESULT_MSG["message"] = [];
        msg.RESULT_MSG["exeption"] = ["مقدار ورودی یا همان فیلتر از نوع آبجکت نمی باشد"];

        // msg.INVALID_FILTER["data"] = {Message:'filter Invalid'};
        // return msg.INVALID_FILTER;

        //  Msg.push({Message:'filter Invalid' , status: 'InvalidFilter'});
        //  return Msg;
    }
    return msg.RESULT_MSG;

}