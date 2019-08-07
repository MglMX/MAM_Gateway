const crypto = require("crypto");
var models = require("../models");

function hash(algorithm, data) {
  const hashAlgorithm = algorithm;
  const salt = crypto.randomBytes(16).toString("hex");
  var hash = crypto.createHmac(hashAlgorithm, salt);
  hash.update(data.toString());
  var hashedData = hash.digest("hex");

  return { hashedData, salt };
}

const numberMap = {
  '0' : 'A',
  '1' : 'B',
  '2' : 'C',
  '3' : 'D',
  '4' : 'E',
  '5' : 'F',
  '6' : 'G',
  '7' : 'H',
  '8' : 'I',
  '9' : 'J'

}

function generateSecret(length){
  const str = crypto.randomBytes(length).toString("hex");

  let strArray = [...str]

  // Converting numbers into letters
  for (var i = 0; i < strArray.length; i++) {
    if(!isNaN(strArray[i])){
      strArray[i] = numberMap[strArray[i]]
    }else{
      strArray[i] = strArray[i].toUpperCase()
    }    
  }


  return strArray.join("")
}


function changeValue(obj, key, val, newVal) {
  var newValue = newVal;
  var objects = [];
  for (var i in obj) {
      if (!obj.hasOwnProperty(i)) continue;
      if (typeof obj[i] == 'object') {
          objects = objects.concat(changeValue(obj[i], key, val, newValue));
      } else if (i == key && obj[key] == val) {
          obj[key] = newValue;
      }
  }
  return obj;
}

async function decryptObject(object,messageId){
  const { EncryptedData } = models


  const encryptedFields = await EncryptedData.findAll({where:{messageId}})

  encryptedFields.forEach(encryptedField=>{
    const {field,hash,data} = encryptedField;

    changeValue(object,field,hash,data) 


  })

  return object
  
}

function encryptObject(object,fieldsToEncrypt,encryptedFields = []){

    let objectCopy = {...object}

    fieldsToEncrypt.forEach(field => {
        if (typeof objectCopy[field] == "string") {
          const data = objectCopy[field];
          const { hashedData, salt } = hash("sha256", objectCopy[field]);
          objectCopy[field] = hashedData;
          encryptedFields.push({
            hash: hashedData,
            salt,
            algorithm: "sha256",
            field,
            data
          });
        } else if (typeof objectCopy[field] == "object") {
          objectCopy[field] = encryptNestedObject(
            objectCopy[field],
            encryptedFields
          )[0];
        }
      });

      return [objectCopy, encryptedFields];
}

function encryptNestedObject(object, encryptedFields = []) {
  let objectCopy = { ...object };
  const properties = Object.entries(object);

  properties.forEach(property => {
    const field = property[0];
    const data = property[1];


    if (typeof data == "object") {
      objectCopy[field] = encryptNestedObject(objectCopy[field], encryptedFields)[0];
    } else {
      const { hashedData, salt } = hash("sha256", data);
      objectCopy[field] = hashedData;
      encryptedFields.push({
        hash: hashedData,
        salt,
        algorithm: "sha256",
        field,
        data
      });
    }
  });

  return [objectCopy, encryptedFields];
}

module.exports = { hash, encryptNestedObject,encryptObject,decryptObject,generateSecret };
