const express = require('express')
const middleware = require('@line/bot-sdk').middleware
const JSONParseError = require('@line/bot-sdk').JSONParseError
const SignatureValidationFailed = require('@line/bot-sdk').SignatureValidationFailed
const bodyParser = require('body-parser');
const app = express();
require('dotenv').config();
const translate = require('translate');
const Client = require('@line/bot-sdk').Client;

const config = {
  channelAccessToken: process.env.ACCESS_TOKEN,
  channelSecret: process.env.SECRET_KEY
}

const client = new Client({
    channelAccessToken: process.env.ACCESS_TOKEN,
    channelSecret: process.env.SECRET_KEY
})

app.post('/chatbot/message', middleware(config), async (req, res) => {
    const event = req.body.events[0];
        if (event.type === 'message') {
            const message = event.message.text;
            
            const result = await translate(message, {
                from : 'id',
                to   : 'es'
            });

            client.replyMessage(event.replyToken, {
                type: 'text',
                text: result
        });
        
    }
});

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use((err, req, res, next) => {
    if (err instanceof SignatureValidationFailed) {
      res.status(401).send(err.signature)
      return
    } else if (err instanceof JSONParseError) {
      res.status(400).send(err.raw)
      return
    }
    next(err) // will throw default 500
  })

app.listen(process.env.PORT || 8001, () => console.log("Running on port 8001"));