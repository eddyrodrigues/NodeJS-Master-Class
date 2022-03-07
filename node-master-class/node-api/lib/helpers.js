const uuid = require('uuid');
const helpers = {}


helpers.parseJsonObject = (json, cb) => {
  try{
    var objectParsed = JSON.parse(json);
    cb(false,objectParsed);
  }
  catch(ex){
    cb(ex, {});
  }
}

helpers.createUniqueId = ()=>{
  return uuid.v1();
}

module.exports = helpers;