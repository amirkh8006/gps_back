const {Create , MultipleFindArray} = require('./utils/generator');
var isJSON = require('is-json');
const {encode , decode} = require('./utils/custom');
var util = require('util');

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

let res = MultipleFindArray(filters).then(x=>{
    console.log(util.inspect(x, false, null, true /* enable colors */))


})


// let j = {a:'123'};
// let h = JSON.stringify(j);
// // console.log('enc',encode(h));
// let abc = "q5yd5k4e4f4j%g%g$t4y4s4p4z%h2n2vr#w2v#w#t#s2v#s#o#p#l2tl2tq%g5o%p%zx%w%s%q$x4w%x%d_lr2o#q2t#s#t#r2q#o#n2j2k#k2n#f2na5b4x3f2l#r4e5i%m%h_";
// let dec = decode(abc);
// let y = isJSON(dec)
// console.log(y);
// if (JSON.parse(dec) != undefined) {
//     let json = JSON.parse(dec);
//     console.log('dec1',json)
// }


// let _model2 = {
//     tst:{
//         id:null,
//         Name:"qq" ,
//         family:"AHMADI" ,
//         lat:"96.0000000",
//         Address:[ {Title:"@@@@@44" , Street:"$$$$$4"} , {Title:"@@@@fff@deddd" , Street:"$$rrrr$$$r"}  ]
//     },
//     location:{id:null,Lat:"2ss00sqfff44ee" , Lgt:"4044fsffqrr"},
//     loc:{id:null,abc:"222ddd22"}
// }


// Create(_model2 , null).then((dt)=>{
//     console.log('DATA' , dt);
// });