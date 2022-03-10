const _data = require("./data.js");
const helpers = require('./helpers');
const uuid = require('uuid');
const fs = require('fs');
const path = require('path');
const { resolve } = require("path");
const { type } = require("os");
const fsPromises = require('fs').promises;

const handlers = {};

handlers.root = (data, callback) => {
  callback(200, {
    index: 'my index page in json object'
  });
};


handlers.notFound = (data, callback) => {
  callback(404, {
    message: 'not found - não encontrado'
  });
};


handlers.users = (data, callback) => {
  let acceptedValues = ['post', 'get', 'delete', 'update'];
  if (acceptedValues.indexOf(data.method) > -1) {
    handlers._users[data.method](data, callback);
  }
};



handlers._users = {};

handlers._users.get = (data, callback) => {
  var userId = null;
  const { guid } = data.queryObject;
  typeof (guid) !== 'undefined' ? userId = guid: null;
  console.log(guid);
  if (userId !== null) {
    _data.read('users', userId, (err, data) => {
      if (!err) {
        helpers.parseJsonObject(data, (err, dataReturn) => {
          if (!err) {
            callback(200, dataReturn);
          } else {
            callback(204, {});
          }
        });
      } else {
        callback(204, {});
      }
    })
  }else{
    return callback(204, {});
  }

}



handlers.postUser = (data, callback) => {
  const allowedMethods = ['post'];
  if (allowedMethods.indexOf(data.method) === -1) {
    callback(400, {
      message: 'this method is not allowed'
    });
    return;
  }
  if (!data.payload) {
    callback(400, {
      message: 'this method needs a body'
    });
    return;
  }

  let pl = {}
  helpers.parseJsonObject(data.payload, (err, data) => {
    if (!err || typef(data) !== 'object') {
      pl = data;
    } else {
      return callback(500, {
        message: "unable to parse json"
      })
    }
  });

  let phonenumber = (typeof (pl.phone) === 'string' && pl.phone.length > 0) || typeof (pl.age) === 'number' ? pl.phone : '';
  let name = typeof (pl.name) === 'string' && pl.name.length > 0 ? pl.name : '';
  let surname = typeof (pl.surname) === 'string' && pl.surname.length > 0 ? pl.surname : '';
  let age = (typeof (pl.age) === 'string' && pl.age.length > 0) || typeof (pl.age) === 'number' ? pl.age : 0;
  let guidUser = helpers.createUniqueId();

  if (phonenumber === '' || name === '' || surname === '' || age === 0) {
    return callback(400, {
      message: "object string is not in the right format"
    });
  }

  let userData = {
    "name": name,
    "surname": surname,
    "phone": phonenumber,
    "age": age,
    "GUID": guidUser
  };

  //  TODO: { Adjust this to continue and post the object to a file }
  _data.create('users', guidUser, userData, (err, data) => {
    if (!err) {
      return callback(200, userData);
    } else {
      return callback(204, {});
    }
  });

}


handlers.tokens = (data, callback) => {
  let acceptedValues = ['post', 'get', 'delete', 'update', "put"];
  if (acceptedValues.indexOf(data.method) > -1) {
    handlers._tokens[data.method](data, callback);
  }else{
    callback(405);
  }
};
handlers._tokens = {};

handlers._tokens.get = (data, callback) =>{
  let { id } = data.queryObject;
  id = typeof(id) === 'string' && id.length === 20 ? id : false;
  if(id){
    _data.read('tokens', id, (err, tokenInfo) => {
      tokenInfo = helpers.parseJsonObjectReturn(tokenInfo);
      if (!err && tokenInfo){
        callback(200, tokenInfo);
      }else{
        callback(400, {message: "Id dont exists or is invalid."})
      }
    })
  }else{
    callback(400, {message: "Id dont exists or is invalid."})
  }

}

handlers._tokens.post = (data, callback) =>{
 
  let { phone, guid } = (helpers.parseJsonObjectReturn(data.payload));
  phone = typeof(phone) === 'undefined' ? null : phone;
  guid = typeof(guid) === 'undefined' ? null : guid;

  // console.log(data);
  if (phone && guid){
    // lookup the user who matchs phone number
    _data.read('users', guid,  (err, userData) => {
      if (!err && userData){
        userData = helpers.parseJsonObjectReturn(userData);
        if (userData.phone === phone){
          let random_token = helpers.createRandomString(20);
          let expiresIn = Date.now() + 1000 *60 * 60;
          let tokenObject = {
            "phone"   : phone,
            "id"      : random_token,
            "expires" : expiresIn
          }
          _data.create('tokens', random_token, tokenObject, (err) => {
            if (!err){
              callback(200, tokenObject);
            }else{
              callback(500, {message: "could not create the token"});
            }
          })
        }else{
          callback(400, {message: "Error: Password did not match the specified users guid."})
        }
      }else{
        callback(400, {message: "could not find the user specified"});
      }
    })
  }else{
    callback(400, {message: "error: missing fields"});
  }
  
}

handlers._tokens.delete = (data, callback) =>{
  let { id } = helpers.parseJsonObjectReturn(data.payload);
  id = typeof(id) !== 'undefined' && id.length == 20 ? id : null;

  if (id){
    _data.read('tokens', id, (err, tokenData) => {
      if (!err && tokenData){
        tokenData = helpers.parseJsonObjectReturn(tokenData);
        if ( tokenData ){
          _data.delete('tokens', id, (err) => {
            if (!err){
              callback(200);
            } else {
              callback(500, {message: 'Could not delete the token'});
            }
          })
        }
      } else {
        callback(400, {message: "the specified token does not exist or is already delete"});
      }
    })
  } else {
    callback(400, {message: "the specified token does not exist"});
  }
}

handlers._tokens.put = (data, callback) =>{
  let { id, extend } = helpers.parseJsonObjectReturn(data.payload);
  id = typeof(id) !== 'undefined' && id.length == 20 ? id : null;
  extend = typeof(extend) === 'boolean' ? extend : null;

  if (id && extend){
    _data.read('tokens', id, (err, tokenData) => {
      if (!err && tokenData){
        tokenData = helpers.parseJsonObjectReturn(tokenData);
        if (tokenData.expires > Date.now() ){
          tokenData.expires = Date.now() + 1000 * 60 * 60;
          _data.update('tokens', id, tokenData, (err) => {
            if (!err){
              callback(200);
            } else {
              callback(500, {message: 'Could not update the token\'s expiration'});
            }
          })
        }
      } else {
        callback(400, {message: "the specified token does not exist"});
      }
    })
  } else {
    callback(400, {message: "the specified token does not exist"});
  }
}




module.exports = handlers;