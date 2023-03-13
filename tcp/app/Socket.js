const {
    Create,
    SingleFind,
    SingleFind_V2
} = require('../utils/generator');


var isJSON = require('is-json');
const path = require('path');
let counter_Mohammad = 0;
let counter_Ebadi = 0;
let counter_AmirHossein = 0;
let interval_Mohammad;
let interval_Ebadi;
let interval_AmirHossein;



module.exports = {

    TCP_SERVER(tcp_socket) {





        sockets = [];
        // tcp_socket.setEncoding('UTF-8');
        tcp_socket.on('data', async function (data) {

            // 1. Read data And Save To  Database .
            // console.log('DATA_FUN' , data.toString());
            // 2. send to Client json MC60


            // let sample = {
            //     "uid": "1234",
            //     "pn1": "09383102777",
            //     "pn2": "09351371050",
            //     "pn3": "09351234569",
            //     "rly": "0001",
            //     "inp": "1001",
            //     "lat": "23.556487",
            //     "lgt": "52.145879",
            //     "sp": "70",
            //     "bp": "45",
            //     "td": "10",
            //     "cs": "1",
            //     "dc": "3",
            //     "ns": "2",
            //     "fs": "3",
            //     "gf": "23.2332*23.12313*41.12313*45.123132",
            //     "gfs": "1",
            //     "sv": "3.1.6",
            //     "ft": "0",
            //     "ed": "0",
            //     "lp": "80"
            // }


           

            let stringData = data.toString('utf8').trim().toLowerCase()
            let isJson = isJSON(stringData);

          

            if (isJson) {
                let parsedData = JSON.parse(stringData)
                

                let {
                    uid, // OK
                    pn1, // OK
                    pn2, // OK
                    pn3, // OK
                    rly, // OK
                    inp, // OK
                    lgt, // OK
                    lat, // OK
                    sp, // OK
                    bp, // OK
                    td, // OK
                    cs, // OK
                    dc, // OK
                    ns, // OK
                    fs, // OK
                    gf, // OK
                    gfs, // OK
                    sv, // OK
                    ft, // OK
                    ed, // OK 
                    lp, // OK
                    qm, // OK
                    sc, // OK
                    ac // OK
                } = parsedData

              


                let collectionFilter = {
                    collectionName: "location",
                    fields: {
                        uid: uid
                    }
                }

                let result = await SingleFind(collectionFilter, null);

                let collectionData = {
                    location: {
                        uid: uid,
                        pn1: pn1,
                        pn2: pn2,
                        pn3: pn3,
                        rly: rly,
                        inp: inp,
                        location: {
                            type: "Point",
                            coordinates: [Number(lat), Number(lgt)]
                        },
                        sp: sp,
                        bp: bp,
                        td: td,
                        cs: cs,
                        dc: dc,
                        ns: ns,
                        fs: fs,
                        gf: gf,
                        gfs: gfs,
                        sv: sv,
                        ft: ft,
                        ed: ed,
                        lp: lp,
                        qm: qm, // OK
                        sc: sc, // OK
                        ac: ac // OK
                    }
                }

                if (result.data.length > 0) {

                    collectionData.location["id"] = result.data[0]._id;

                }else {
                    collectionData.location["id"] = null;
                }

                let resultCreate = await Create(collectionData, null)
                // console.log("RESULT", resultCreate);

                let createLogData = {
                    locationLog: {
                        id: null,
                        uid: uid,
                        pn1: pn1,
                        pn2: pn2,
                        pn3: pn3,
                        rly: rly,
                        inp: inp,
                        location: {
                            type: "Point",
                            coordinates: [Number(lat), Number(lgt)]
                        },
                        sp: sp,
                        bp: bp,
                        td: td,
                        cs: cs,
                        dc: dc,
                        ns: ns,
                        fs: fs,
                        gf: gf,
                        gfs: gfs,
                        sv: sv,
                        ft: ft,
                        ed: ed,
                        lp: lp,
                        qm: qm, // OK
                        sc: sc, // OK
                        ac: ac // OK
                    }
                }


                await Create(createLogData, null)

                let requestCollectionFilter = {
                    collectionName: "Requests",
                    fields: {
                        uid: uid,
                        status: false
                    }
                }



                let resultRequests = await SingleFind_V2(requestCollectionFilter, null);
                let jsonValues = {}
                if (resultRequests.data.length > 0) {

                    jsonValues = Object.assign({}, resultRequests.data[0]);

                    delete jsonValues['_id'];
                    delete jsonValues['createdAt'];
                    delete jsonValues['updatedAt'];
                    delete jsonValues['shamsi_createAt'];
                    delete jsonValues['status'];
                    delete jsonValues['request_type'];

                    let isEqual = true;

                    for (let i = 0; i < Object.keys(jsonValues).length; i++) {
                        let dataValues = parsedData[Object.keys(jsonValues)[i]]
                        let requestValues = jsonValues[Object.keys(jsonValues)[i]]
                        if (dataValues != requestValues) {
                            isEqual = false
                        }
                    }

                    if (isEqual) {
                        let requestCollectionData = {
                            Requests: {
                                id: resultRequests.data[0]._id,
                                status: true
                            }
                        }

                        await Create(requestCollectionData, null)

                        jsonValues = {}

                    } else {
                        jsonValues = Object.assign({}, resultRequests.data[0]);

                        delete jsonValues['_id'];
                        delete jsonValues['createdAt'];
                        delete jsonValues['updatedAt'];
                        delete jsonValues['shamsi_createAt'];
                        delete jsonValues['status'];
                        delete jsonValues['request_type'];
                    }
                }

                // let resultRequests = await SingleFind_V2(requestCollectionFilter, null);
                // let jsonValues = {}
                // if (resultRequests.data.length > 0) {
                //     if (resultRequests.data[0].rly === rly) {

                //         let requestCollectionData = {
                //             Requests: {
                //                 id: resultRequests.data[0]._id,
                //                 status: true
                //             }
                //         }

                //         await Create(requestCollectionData, null)

                //     } else {
                //         jsonValues = Object.assign({}, resultRequests.data[0]);

                //         delete jsonValues['_id'];
                //         delete jsonValues['createdAt'];
                //         delete jsonValues['updatedAt'];
                //         delete jsonValues['shamsi_createAt'];
                //         delete jsonValues['status'];
                //         delete jsonValues['request_type'];
                //     }
                // }

                tcp_socket.write(JSON.stringify(jsonValues));

                //********************* Log To Text File *************** */
                let fs_file = require('fs');
                if(uid == "6e90229ee444704eb11fe5ec234730d5"){ 
                // Mohammad Car 
                clearInterval(interval_Mohammad);

                interval_Mohammad = setInterval(() => {
                    counter_Mohammad = counter_Mohammad + 1;
                }, 1000);

                let year = new Date().getFullYear().toString();
                let month = (new Date().getMonth() + 1).toString();
                let day = new Date().getDate().toString();
                let hour = new Date().getHours().toString();
                let minute = new Date().getMinutes().toString();
                let secound = new Date().getSeconds().toString();
                let fullDate = year + '/' + month + '/' + day + '  ' + hour + ':' + minute + ':' + secound;
                let location = lat + ',' + lgt;
                let json_log = {date: fullDate , location:location , counter_secound:counter_Mohammad};
                let str = JSON.stringify(json_log);
                let result = str + '\n'
                fs_file.appendFile("./app/mohammad.txt", result, err => {
                    if (err) {
                      console.error(err);
                    }
                    // file written successfully
                  });    
            
                
            

                }else if(uid == "aec929d22cb014f2809d1818a238902c"){
                // Ebadi Car    
                
                clearInterval(interval_Ebadi);

                interval_Ebadi = setInterval(() => {
                    counter_Ebadi = counter_Ebadi + 1;
                }, 1000);
                let year = new Date().getFullYear().toString();
                let month = (new Date().getMonth() + 1).toString();
                let day = new Date().getDate().toString();
                let hour = new Date().getHours().toString();
                let minute = new Date().getMinutes().toString();
                let secound = new Date().getSeconds().toString();
                let fullDate = year + '/' + month + '/' + day + '  ' + hour + ':' + minute + ':' + secound;
                let location = lat + ',' + lgt;
                let json_log = {date: fullDate , location:location , counter_secound:counter_Ebadi};
                let str = JSON.stringify(json_log);
                let result = str + '\n'
                fs_file.appendFile("./app/mr_Ebadi.txt", result, err => {
                    if (err) {
                      console.error(err);
                    }
                    // file written successfully
                  });    

                }else if(uid == "a6c9d34e51f699abd8f747856adaec5e"){
                // Amirhossein Car   
                
                clearInterval(interval_AmirHossein);

                interval_AmirHossein = setInterval(() => {
                    counter_AmirHossein = counter_AmirHossein + 1;
                }, 1000);
                let year = new Date().getFullYear().toString();
                let month = (new Date().getMonth() + 1).toString();
                let day = new Date().getDate().toString();
                let hour = new Date().getHours().toString();
                let minute = new Date().getMinutes().toString();
                let secound = new Date().getSeconds().toString();
                let fullDate = year + '/' + month + '/' + day + '  ' + hour + ':' + minute + ':' + secound;
                let location = lat + ',' + lgt;
                let json_log = {date: fullDate , location:location , counter_secound:counter_AmirHossein};
                let str = JSON.stringify(json_log);
                let result = str + '\n'
                fs_file.appendFile("./app/amirhossein.txt", result, err => {
                    if (err) {
                      console.error(err);
                    }
                    // file written successfully
                  });    


                }

                //********************* Log To Text File *************** */
                tcp_socket.end();


            } else {
                console.log('JSON NOT OK');
            }

            // let json = JSON.parse(str);
            // console.log('AAA' , json);

            // console.log( "String = %s", str );
            // let obj = JSON.parse( str.substring(0, str.length-1) );
            // console.log('DDD' , obj);

            // let str2 = JSON.stringify(obj, null, 4); // Reverse conversion
            // console.log("Obj = %s", str2);           // and output to inspect

        });

        tcp_socket.on('close', function () {

            sockets.splice(sockets.indexOf(tcp_socket), 1);
            // console.info('Sockets connected: ' + sockets.length);

        });

        sockets.push(tcp_socket);
    },
}