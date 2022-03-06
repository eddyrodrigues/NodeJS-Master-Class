const helpers = {}


helpers.parseJsonObject = (json, cb) => {
  try{
    var objectParsed = JSON.parse(json);
    cb(null,json);
  }
  catch(ex){
    cb(ex, {});
  }
}


export default helpers;