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


module.exports = helpers;