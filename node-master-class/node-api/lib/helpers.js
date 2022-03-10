const uuid = require('uuid');
const helpers = {}


helpers.parseJsonObject = (json, cb) => {
  try{
    var objectParsed = JSON.parse(json);
    cb(false,objectParsed);
    return objectParsed;
  }
  catch(ex){
    cb(ex, {});
    return {};
  }
}

helpers.parseJsonObjectReturn = (json, cb) => {
  try{
    var objectParsed = JSON.parse(json);
    return objectParsed;
  }
  catch(ex){
    return {};
  }
}




helpers.createUniqueId = ()=>{
  return uuid.v1();
}

helpers.createRandomString  = (length) => {
  length = typeof(length) == 'number' && length > 0 ? length : false;
  if (length){
    let possibleCaracters = "abcdefghijklmnopqrstuvxwyz1234567890";
    let stringFinal = "";
    for(i = 1; i <= length; i++){
      var randomChar = possibleCaracters.charAt(Math.floor(Math.random() * possibleCaracters.length));
      stringFinal += randomChar;
    }
    return stringFinal;
  }
}

module.exports = helpers;