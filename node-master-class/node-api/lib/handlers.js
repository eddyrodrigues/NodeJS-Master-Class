const _data = require("./data.js");
const helpers = require('./helpers');
const uuid = require('uuid');

const handlers = {};

handlers.root = (data, callback) => {
    callback(200, {index: 'my index page in json object'});
};


handlers.notFound = (data, callback) => {
    callback(404, {message: 'not found - não encontrado'});
};

handlers.getAllUsers = (data, callback) => {
    if (data.method === 'get')
        callback(200, modeled_db);
    else
        callback(403, {})
}

handlers.getUser = (data, callback) => {
    
    if (data.method == 'get'){
        var userId = null;
        typeof(data.queryObject.guid) !== 'undefined' ? userId = data.queryObject.guid : null;
        
        
        if (userId === null){
            callback(204, {});
        }

        _data.read('users', userId, (err, data) =>{
          if (!err){
            helpers.parseJsonObject(data, (err, dataReturn) =>{
              if (!err){
                callback(200, dataReturn);
              }else{
                callback(204, {});
              }
            });
          }else{
            callback(204, {});
          }
        })
    }else{
      callback(400, {message : 'this method is not allowed'});
    }
}


handlers.postUser = (data, callback) =>{
  const allowedMethods = ['post'];
  if (allowedMethods.indexOf(data.method) === -1){
    callback(400, {message:'this method is not allowed'});
    return;
  }
  if (!data.payload){
    callback(400, {message:'this method needs a body'});
    return;
  }

  let pl = {}
  helpers.parseJsonObject(data.payload, (err, data) => {
    if (!err || typef(data) !== 'object'){
      pl = data;
    }else {
      return callback(500, {message: "unable to parse json"})
    }
  }); 

  let phonenumber = (typeof(pl.phone) === 'string' && pl.phone.length > 0) || typeof(pl.age) === 'number' ? pl.phone : '';
  let name = typeof(pl.name) === 'string' && pl.name.length > 0 ? pl.name : '';
  let surname = typeof(pl.surname) === 'string' && pl.surname.length > 0 ? pl.surname : '';
  let age = (typeof(pl.age) === 'string' && pl.age.length > 0) || typeof(pl.age) === 'number' ? pl.age : 0;
  let guidUser = helpers.createUniqueId();

  if ( phonenumber === '' || name === '' || surname === '' || age === 0){
    return callback(400, {message: "object string is not in the right format"});
  }

  let userData = {
    "name": name,
    "surname": surname,
    "phone": phonenumber,
    "age": age,
    "GUID": guidUser
  };

  //  TODO: { Adjust this to continue and post the object to a file }
  _data.create('users', guidUser, userData,(err, data) => {
    if (!err){
      return callback(200, userData);
    }else{
      return callback(204,{});
    }
  });

}



module.exports =  handlers;