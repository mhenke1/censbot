import validator from 'validator';
import UuidEncoder from 'uuid-encoder';
const base36Encoder = new UuidEncoder('base36');

'use strict';

function convertId(params) {

  const reuqestUUID = params.text.trim();
  console.log(reuqestUUID);

  let responseText = 'No able to convert the given input `' + reuqestUUID + '`';

  if (validator.isUUID(reuqestUUID)) {
    const base36UUID = base36Encoder.encode(reuqestUUID);
    responseText = 'The namespace name for the UUID `' + reuqestUUID + '` is `' + base36UUID + '`';
  }
  else if (reuqestUUID.length <= 25) {
    const longUUID = base36Encoder.decode(reuqestUUID);
    if (validator.isUUID(longUUID)) {
      responseText = 'The UUID for the namespace `' + reuqestUUID + '` is `' + longUUID + '`';
    } else {
      responseText = 'No able to convert the namespace name `' + reuqestUUID + '` to a valid UUID';
    }
  }

  const responseJSON = {
    'blocks': [
      {
        'type': 'section',
        'text': {
          'type': 'mrkdwn',
          'text': responseText,
        },
      },
      {
        'type': 'section',
        'text': {
          'type': 'mrkdwn',
          'text': '_powered by IBM Cloud Functions_ :cloudfunctions-whitecircle:',
        },
      },
    ],
  };

  return responseJSON;
}

global.main = convertId;