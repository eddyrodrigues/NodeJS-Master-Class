import path from 'path';
const _data = {};


_data.baseDir = path.join(__dirname, "./../.data/");



_data.create = (dir, file, data, callback)=>{
  let diseredPath = path.join(_data.baseDir, dir,`${file}.json`);
  console.log(diseredPath);
  fs.open(diseredPath, 'wx', (err, fd) => {
    console.log(f);
    if (!err && fd){
      var stringData = JSON.stringify(data);
      console.log('jidjasijdiasjd');
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
  console.log(diseredPath);
}

export default _data;
