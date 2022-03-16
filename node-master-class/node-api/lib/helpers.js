const uuid = require('uuid');
const fs = require('fs');
const path = require('path');


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

helpers.getTemplate = (template_name, userpath='', callback) => {
  let defaultPathTemplates = path.join(__dirname, "./../templates/");
  if (userpath == ''){
    defaultPathTemplates = path.join(defaultPathTemplates, userpath);
  } else {
    defaultPathTemplates = userpath;
  }

  if (template_name.length <= 0) return callback(true, 'no template name defined');

  if ( defaultPathTemplates.length <= 0 ) return callback(true, 'default template path wrong defined');  
  else{
    pathOfFileTemplate = path.join(defaultPathTemplates, `${template_name}.html`);
    fs.readFile(pathOfFileTemplate, (err, data) => {
      if (!err && data){
        callback(false, data);
      } else {
        callback(true, "error in processing template from file");
      }
    });
  }
;}


helpers.getStaticAsset = (assetName, callback) => {
  if (assetName.length <= 0) callback(true, 'assetname empty');
  const assetPath = path.join(__dirname, "./../public/", assetName);
  fs.readFile(assetPath, (err, data) => {
    if (!err && data) {
      callback(false, data );
    } else {
      callback(true, 'not asset fuound on the folder');
    }
  });

}


module.exports = helpers;