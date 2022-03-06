const _data = require("./data");
const helpers = require('./helpers');

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
        callbacl(403, {})
}

handlers.getUser = (data, callback) => {
    
    if (data.method == 'get'){
      console.log(data);
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
      callback(400, {message : 'Wrong method - this method is not allowed1'});
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
    if (!err && typef(data) === 'object'){
      pl = data;
    }else {
      callback(500, {message: "unable to parse json"})
    }
  }); 

  let phonenumber = typeof(pl.phone) === 'string' && pl.phone.lenght > 0 ? pl.phone : '';
  let username = typeof(pl.username) === 'string' && pl.username.lenght > 0 ? pl.username : '';
  let surname = typeof(pl.surname) === 'string' && pl.surname.lenght > 0 ? pl.surname : '';
  let age = (typeof(pl.age) === 'string' && pl.age.lenght > 0) || typeof(pl.age) === 'number' ? pl.age : 0;
  

  if ( phonenumber === '' || username === '' || surname === '' || age === 0){
    callback(400, {message: "object string is not in the right format"});
  }

  //  TODO: { Adjust this to continue and post the object to a file }


}

module.exports =  handlers;