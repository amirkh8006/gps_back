const {
    Create,
    SingleFind,
    SingleFind_V2
} = require('../utils/generator');

var isJSON = require('is-json');


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



            let stringData = data.toString('utf8').trim();
            let isJson = isJSON(stringData);

            if (isJson) {
            let parsedData = JSON.parse(stringData)

            let {
                uid,
                pn1,
                pn2,
                pn3,
                rly,
                inp,
                lgt,
                lat,
                sp,
                bp,
                td,
                cs,
                dc,
                ns,
                fs,
                gf,
                gfs,
                sv,
                ft,
                ed,
                lp,
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
                    lp: lp
                }
            }

            if (result.data.length > 0) {

                collectionData.location["id"] = result.data[0]._id;

            } else {
                collectionData.location["id"] = null;
            }

            await Create(collectionData, null)

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
            }

            tcp_socket.write(JSON.stringify(jsonValues));
            tcp_socket.end();

            if (resultRequests.data.length > 0) {

                let requestCollectionData = {
                    Requests: {
                        id: resultRequests.data[0]._id,
                        status: true
                    }
                }

                await Create(requestCollectionData, null)

            }


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