const path = require('path');
var fs = require('fs')
const _data = {};


_data.baseDir = path.join(__dirname, "./../.data/");



_data.create = (dir, file, data, callback)=>{
  let diseredPath = path.join(_data.baseDir, dir,`${file}.json`);
  fs.open(diseredPath, 'wx', (err, fd) => {
    if (!err && fd){
      var stringData = JSON.stringify(data);
      fs.writeFile(fd, stringData, (err) =>{
        if (!err)
          fs.close(fd, (err) => {
            if (!err) callback(false);
            else callback('could not close the file correctly');
          });
        else callback('could not write on file - error on writing');
      })
    }else
      callback('could not open the file: may this file already exists')

  });
};

_data.update = (dir, file, data, callback) => {
  let diseredPath = path.join(_data.baseDir, dir,`${file}.json`);
  fs.open(diseredPath, 'r+', (err, fd) => {
    if (!err && fd){
     
      fs.ftruncate(fd, (err) => {
        if (!err){
          var stringData = JSON.stringify(data);
          fs.writeFile(fd, stringData, (err) =>{
            if (!err){
              fs.close(fd, (err) => {
                if (!err) callback(false);
                else callback('could not close the file correctly');
              });
            }
            else{
              callback('could not write on file - error on writing');
            }
          });
        }else {
          callback('error on truncate de file');
        }
      });
    }else{
      callback('could not open the file: may this file already in use');
    }
  });
};

// Delete a file
_data.delete = function(dir,file,callback){
  let diseredPath = path.join(_data.baseDir, dir,`${file}.json`);
  // Open the file for writing
  fs.unlink(diseredPath, 'r+', function(err, fileDescriptor){
    if(!err && fileDescriptor){
      // Convert data to string
      var stringData = JSON.stringify(data);

      // Write to file and close it
      fs.writeFile(fileDescriptor, stringData,function(err){
        if(!err){
          fs.close(fileDescriptor,function(err){
            if(!err){
              callback(false);
            } else {
              callback('Error closing existing file');
            }
          });
        } else {
          callback('Error writing to existing file');
        }
      });
    } else {
      callback('Could not open file for updating, it may not exist yet');
    }
  });


};

_data.read = function(dir,file,callback){
  let diseredPath = path.join(_data.baseDir, dir,`${file}.json`);
  fs.readFile(diseredPath, 'utf8', function(err,dataFromFile){
    if (err)
      callback(err,{});
    else
      callback(err, dataFromFile);
  });
};

module.exports = _data;
