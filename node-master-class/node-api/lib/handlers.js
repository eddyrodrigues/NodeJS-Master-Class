const _data = require("./data.js");
const helpers = require('./helpers');
const path = require('path');
const handlers = {};

// HTML HANDLERS

handlers.index = (data, callback) => {
  if (data.method == 'get') {
    let token = typeof(data.headers.token) == 'undefined' ? false : data.headers.token;
    if (!token) {
      token = typeof(data.queryObject.token) == 'undefined' ? '' : data.queryObject.token;
    }
    if (token.length > 0){
      _data.read('tokens', token, (err, tokenData) => {
        if (!err && tokenData){
          if (tokenData.expires > Date.now()){
            helpers.getTemplate('painel/index', '', (err, data) => {
              if (!err && data){
                callback(200, data, 'html');
              } else {
                callback(500, "not found the template", 'html');
              }
            }); 
          }else {
            helpers.getTemplate('painel/pages-login', '', (err, data) => {
              if (!err && data){
                callback(200, data, 'html');
              } else {
                callback(500, "not found the template", 'html');
              }
            });    
          }
        } else {
          helpers.getTemplate('painel/pages-login', '', (err, data) => {
            if (!err && data){
              callback(200, data, 'html');
            } else {
              callback(500, "not found the template", 'html');
            }
          });  
        }
      });
    } else {
     helpers.getTemplate('painel/pages-login', '', (err, data) => {
          if (!err && data){
            callback(200, data, 'html');
          } else {
            callback(500, "not found the template", 'html');
          }
        }); 
    }
    
  } else {
    callback(405, '', 'html');
  }
};

handlers.login = (data, callback) => {
  if (data.method == 'get'){
      helpers.getTemplate('painel/pages-login', '', (err, templateData)=>{
        console.log(err, templateData)
        if (!err && templateData) {
          callback(200, templateData, 'html');
        } else {
          handlers.notFound(data, callback);
        }
      });
    }
};

handlers.logout = (data, callback) => {
  let token = typeof(data.headers.token) == 'undefined' ? false : data.headers.token;
  if (!token) {
    token = typeof(data.queryObject.token) == 'undefined' ? '' : data.queryObject.token;
    if (token.length > 0) {
      _data.delete('tokens', token, (err, ...rest) => {
        if (!err) {
          helpers.getTemplate('painel/pages-faq', '', (err, templateData) => {
            if (!err && templateData) {
              callback(200, templateData, 'html');
            } else {
              callback(404, 'not found', 'html');
            }
          });
        } else {
          callback(404, 'token already dot not exists', 'html')
        }
      });
    } else {
      callback(404, 'token not provided', 'html');
    }
  }
};

handlers.user_profile = (data, callback) => {
  if (data.method == 'get') {
    let token = typeof(data.headers.token) == 'undefined' ? false : data.headers.token;
    if (!token) {
      token = typeof(data.queryObject.token) == 'undefined' ? '' : data.queryObject.token;
    }
    if (token.length > 0){
      _data.read('tokens', token, (err, tokenData) => {
        if (!err && tokenData){
          if (tokenData.expires > Date.now()){
            helpers.getTemplate('painel/users-profile', '', (err, data) => {
              if (!err && data){
                callback(200, data, 'html');
              } else {
                callback(500, "not found the template", 'html');
              }
            }); 
          }else {
            helpers.getTemplate('painel/pages-login', '', (err, data) => {
              if (!err && data){
                callback(200, data, 'html');
              } else {
                callback(500, "not found the template", 'html');
              }
            });    
          }
        } else {
          helpers.getTemplate('painel/pages-login', '', (err, data) => {
            if (!err && data){
              callback(200, data, 'html');
            } else {
              callback(500, "not found the template", 'html');
            }
          });  
        }
      });
    } else {
     helpers.getTemplate('painel/pages-login', '', (err, data) => {
          if (!err && data){
            callback(200, data, 'html');
          } else {
            callback(500, "not found the template", 'html');
          }
        }); 
    }
    
  } else {
    callback(405, '', 'html');
  }
}

handlers.public = (data, callback) => {
  if(data.method == 'get') {
    const assetName = data.path.replace("public/", "").trim();
    helpers.getStaticAsset(assetName, (err, data)=>{
      if(!err && data){
        fileExt = path.extname(assetName).replace('.', '');
        callback(200, data, fileExt);
      } else {
        callback(404);
      }
    })
  } else {
    callback(405, '', 'html');    
  }
};

handlers.notFound = (data, callback) => {
  callback(404, {
    message: 'not found - não encontrado'
  });
};


/*
 * JSON API HANDLERS
*/

handlers.users = (data, callback) => {
  let acceptedValues = ['post', 'get', 'delete', 'update', 'put'];
  if (acceptedValues.indexOf(data.method) > -1) {
    handlers._users[data.method](data, callback);
  }
};

handlers._users = {};

handlers._users.get = (data, callback) => {
  var userId = null;
  const { guid } = data.queryObject;
  userId = typeof (guid) !== 'undefined' ? guid : null;

  tokenProvided = typeof(data.headers.token) === 'undefined' ? null : data.headers.token;
  if (tokenProvided) {
    _data.read('tokens', tokenProvided, (err, tokenData) => {
      if (!err && tokenData){
        if (tokenData.expires >= Date.now()){
          _data.read('users', tokenData.guid, (err, userData) => {
            if (!err && userData) {
              if (data){
                callback(200, userData);
              } else {
                callback(204, {});
              }
            } else {
              callback(204, {});
            }
          });
        } else {
          callback(401, {message: "token has been expired"});
        }
      } else {
        callback(400, {message: "provided token is not valid"})
      }
    })
  } else {
    callback(404, {message: "token not provided"});
  }


};

handlers._users.post = (data, callback) => {

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

  let phonenumber = (typeof (pl.phone) === 'string' && pl.phone.length > 0) || typeof (pl.phone) === 'number' ? pl.phone : '';
  let name = typeof (pl.name) === 'string' && pl.name.length > 0 ? pl.name : '';
  let surname = typeof (pl.surname) === 'string' && pl.surname.length > 0 ? pl.surname : '';
  let age = (typeof (pl.age) === 'string' && pl.age.length > 0) || typeof (pl.age) === 'number' ? pl.age : 0;
  let password = typeof (pl.password) === 'string' && pl.password.length > 0 ? pl.password : '';
  let guidUser = helpers.createUniqueId();

  console.log(pl);
  if (phonenumber === '' || name === '' || surname === '' || age === 0 || password == '') {
    return callback(400, {
      message: "object string is not in the right format or missing some required field"
    });
  } else {
    let userData = {
      "name": name,
      "surname": surname,
      "phone": phonenumber,
      "age": age,
      "password": password,
      "guid": guidUser
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


};

handlers._users.put = (data, callback) => {
  let headers = data.headers;
  let payload = helpers.parseJsonObjectReturn(data.payload);

  let token = typeof(headers.token) === 'undefined' ? null : headers.token;
  let phone = typeof(payload.phone) === 'undefined' ? null : payload.phone;
  let name = typeof(payload.name) === 'undefined' ? null : payload.name;
  let surname = typeof(payload.surname) === 'undefined' ? null : payload.surname;
  let age = typeof(payload.age) === 'undefined' ? null : payload.age;
  let password = typeof(payload.password) === 'undefined' ? null : payload.password;


  if (token) {
    _data.read('tokens', token, (err, tokenData) => {
      if(!err && tokenData){
        if (tokenData.expires > Date.now()) {
          _data.read('users', tokenData.guid, (err, userData) => {
            if (!err && userData){
              userData.name    = userData.name != name ? name : userData.name;
              userData.phone   = userData.phone != phone ? phone : userData.phone;
              userData.surname = userData.surname != surname? surname : userData.surname;
              userData.age     = userData.age != age ? age : userData.age;
              userData.password = userData.password != password ? password : userData.password;
  
              _data.update('users', tokenData.guid, userData, (err, data) => {
                if (!err) {
                  callback(200, userData);
                } else {
                  callback(500, {message: err});
                }
              });
            } else {
              callback(500, {message: "It was not possible to read the user info"});
            }
          });
        } else {
          callback(401, {message: "token already expired"})
        }
      } else {
        callback(401, {});
      }
    });
  } else {
    callback(401, {message: "token is invalid or not provided"});
  }

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
      if (!err && tokenInfo){
        callback(200, tokenInfo);
      }else{
        callback(401, {message: "Id dont exists or is invalid."})
      }
    })
  }else{
    callback(400, {message: "Id dont exists or is invalid."})
  }

};

handlers._tokens.post = (data, callback) =>{
 
  let { password, guid } = (helpers.parseJsonObjectReturn(data.payload));
  password = typeof(password) === 'undefined' ? null : password;
  guid = typeof(guid) === 'undefined' ? null : guid;

  // console.log(data);
  if (password && guid){
    // lookup the user who matchs phone number
    _data.read('users', guid,  (err, userData) => {
      if (!err && userData){
        if (userData.password === password){
          let random_token = helpers.createRandomString(20);
          let expiresIn = Date.now() + 1000 *60 * 60;
          let tokenObject = {
            "guid"   : userData.guid,
            "id"      : random_token,
            "expires" : expiresIn
          };
          _data.create('tokens', random_token, tokenObject, (err) => {
            console.log(err);
            if (!err){
              
              callback(200, tokenObject);
            }else{
              callback(500, {message: "could not create the token"});
            }
          })
        }else{
          callback(401, {message: "Error: Password did not match the specified users guid."})
        }
      }else{
        callback(401, {message: "could not find the user specified"});
      }
    })
  }else{
    callback(404, {message: "error: missing fields"});
  }  
};

handlers._tokens.delete = (data, callback) =>{
  let { id } = helpers.parseJsonObjectReturn(data.payload);
  id = typeof(id) !== 'undefined' && id.length == 20 ? id : null;

  if (id){
    _data.read('tokens', id, (err, tokenData) => {
      if (!err && tokenData){
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
    callback(400, {
      message: "the specified token does not exist"
    });
  }
};

handlers._tokens.put = (data, callback) =>{
  let { id, extend } = helpers.parseJsonObjectReturn(data.payload);
  id = typeof(id) !== 'undefined' && id.length == 20 ? id : null;
  extend = typeof(extend) === 'boolean' ? extend : null;

  if (id && extend){
    _data.read('tokens', id, (err, tokenData) => {
      if (!err && tokenData){
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
};

handlers._tokens.verify = (tokenId, guid, callback) =>{
  let userguid = typeof(guid) === 'undefined' ? false : guid;
  let token = typeof(tokenId) === 'undefined' ? false : tokenId;
  
  if (token){
    console.log('aaa');
    _data.read('tokens', token, (err, tokenData) => {
      if (!err) {
        if (tokenData.expires > Date.now()){
          _data.read('users', tokenData.guid, (err, userData) => {
            if (!err && userData) {
              if (tokenData.guid == userData.guid){
                callback(true);
              } else {
                callback(false);
              }
            } else {
              callback(false);
            }
          })
        } else {
          callback(false);
        }
      } else {
        callback(false);
      }
    });  
  } else {
    callback(false);
  }
};

module.exports = handlers;
