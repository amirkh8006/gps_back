const {Create} = require('./generator');


let _model2 = {
    tst:{
        id:null,
        Name:"qq" ,
        family:"AHMADI" ,
        lat:"96.0000000",
        Address:[ {Title:"@@@@@44" , Street:"$$$$$4"} , {Title:"@@@@fff@deddd" , Street:"$$rrrr$$$r"}  ]
    },
    location:{id:null,Lat:"2ss00sqfff44ee" , Lgt:"4044fsffqrr"},
    loc:{id:null,abc:"222ddd22"}
}


Create(_model2 , null).then((dt)=>{
    console.log('DATA' , dt);
});