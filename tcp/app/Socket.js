const {
    Create,
    SingleFind
} = require('../utils/generator');

module.exports = {

    TCP_SERVER(tcp_socket) {



        sockets = [];
        // tcp_socket.setEncoding('UTF-8');
        tcp_socket.on('data', function (data) {

            // 1. Read data And Save To  Database .
            // console.log('DATA_FUN' , data.toString());
            // 2. send to Client json MC60

            let str = data.toString('utf8');

            if (/^[\],:{}\s]*$/.test(str.replace(/\\["\\\/bfnrtu]/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

                //the json is ok
                let json = JSON.parse(str);

                console.log('JSON OK', json);

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
                } = json

                let createData = {
                    location: {
                        id: null,
                        uid: uid,
                        pn1: pn1,
                        pn2: pn2,
                        pn3: pn3,
                        rly: rly,
                        inp: inp,
                        lgt: lgt,
                        lat: lat,
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


                Create(createData, null).then(result => {
                    console.log("DATA CREATED" , result);
                });

            } else {

                //the json is not ok
                console.log('JSON NOT OK');

            }

            // let json = JSON.parse(str);
            // console.log('AAA' , json);

            // console.log( "String = %s", str );
            // let obj = JSON.parse( str.substring(0, str.length-1) );
            // console.log('DDD' , obj);

            // let str2 = JSON.stringify(obj, null, 4); // Reverse conversion
            // console.log("Obj = %s", str2);           // and output to inspect

            tcp_socket.write("SEND");
            tcp_socket.end();

        });

        tcp_socket.on('close', function () {

            sockets.splice(sockets.indexOf(tcp_socket), 1);
            // console.info('Sockets connected: ' + sockets.length);

        });

        sockets.push(tcp_socket);
    },
}