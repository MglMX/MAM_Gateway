var Ajv = require("ajv");

function validateMessage(schemaName, message) {
  var ajv = new Ajv();

  const schema = require("../schemas/" + schemaName);

  var validate = ajv.compile(schema);

  // Predefined values of the response
  let valid = true;
  let errors = "";
  let fieldsToEncrypt = [];

  // Check if the message complies with the schema
  if (!validate(message)) {
    valid = false;
    errors = ajv.errorsText(validate.errors);
  }

  //Check if the schema has fields that need to be encrypted
  if (schema["properties"]["encrypted"]) {
    fieldsToEncrypt = schema["properties"]["encrypted"]["const"];
  }

  return { valid, errors, fieldsToEncrypt };
}

module.exports = validateMessage
