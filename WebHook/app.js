const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
var bodyParser = require('body-parser')
const app = express();

const {Create} = require('./generator');

app.use(cors());

app.use(bodyParser.json())
// Allow Cross-Origin requests


// Set security HTTP headers
app.use(helmet());

// Data sanitization against XSS(clean user input from malicious HTML code)
app.use(xss());

// Prevent parameter pollution
app.use(hpp());



app.get('/getMsg_webHook',async (req,res)=>{
    // console.log('Req.query',req.query);
    let _MessageWebHook = {
        MessageWebHook:{
            id:null,
            from:req.query['from'],
            message:req.query['message'],
            to:req.query['to'],
            messageid:req.query['messageid'],
            receivTime: new Date().getTime()
        }
      }
   let result = await Create(_MessageWebHook , null);
   res.send(result);
});


module.exports = app;