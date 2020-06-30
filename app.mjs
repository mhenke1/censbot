import express from 'express';
import bodyParser from 'body-parser';
import uuid58 from 'uuid-base58';
import validator from 'validator';

'use strict';
const app = express();

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.post('/uuid', function (request, response) {
  let reuqestUUID = request.body.text.trim();
  console.log(reuqestUUID);
  let responseText = "No able to convert any namespace name"

  if (validator.isUUID(reuqestUUID)) {
    let base58UUID = uuid58.encode(reuqestUUID);
    responseText = "The namespace name for the UUID `" + reuqestUUID + "` is `" + base58UUID + "`"
  } else if (reuqestUUID.length <= 22) {
    let longUUID = uuid58.decode(reuqestUUID);
    responseText = "The UUID for the namespace `" + reuqestUUID + "` is `" + longUUID + "`"
  }
  
  let responseJSON = {
    "blocks": [
        {
            "type": "section",
            "response_type": "in_channel",
            "text": {
                "type": "mrkdwn",
                "text": responseText
            }
        }
    ],
    "type": "home"
  }
  response.send(responseJSON);
});

// load local VCAP configuration  and service credentials
let vcapLocal;
try {
  vcapLocal = require('./vcap-local.json');
  console.log('Loaded local VCAP', vcapLocal);
}
catch (e) {}

let port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('To view your app, open this link in your browser: http://localhost:' + port);
});

