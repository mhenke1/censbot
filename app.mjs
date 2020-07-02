import express from 'express';
import bodyParser from 'body-parser';
import validator from 'validator';
import UuidEncoder from 'uuid-encoder';

'use strict';
const app = express();
const base36Encoder = new UuidEncoder('base36');

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.post('/uuid', function (request, response) {
  let reuqestUUID = request.body.text.trim();
  console.log(reuqestUUID);

  let responseText = "No able to convert the given input `" + reuqestUUID + "`";

  if (validator.isUUID(reuqestUUID)) {
    let base36UUID = base36Encoder.encode(reuqestUUID);
    responseText = "The namespace name for the UUID `" + reuqestUUID + "` is `" + base36UUID + "`";
  } else if (reuqestUUID.length <= 25) {
    let longUUID = base36Encoder.decode(reuqestUUID);
    if (validator.isUUID(longUUID)) {
      responseText = "The UUID for the namespace `" + reuqestUUID + "` is `" + longUUID + "`";
    } else {
      responseText = "No able to convert the namespace name `" + reuqestUUID + "` to a valid UUID";
    }
  }
  
  let responseJSON = {
    "blocks": [
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": responseText
            }
        }
    ],
    "response_type": "in_channel"
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

