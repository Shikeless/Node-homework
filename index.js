const fs = require('fs');
const path = require('path');
const argv = require('yargs').argv
const copyFile = require('./modules/copyFile.js');
const readDir = require('./modules/readDir.js');

if (!fs.existsSync(argv.s)) {
  console.log('no such source directory')
  process.exit()
} else if (!fs.existsSync(argv.f)) {
  console.log('no such final directory')
  process.exit()
}

const unsortedFolder = argv.s
const sortedFolder = argv.f

readDir(
  unsortedFolder,
  (filePath, cb) => {
    const fileName = path.parse(filePath).base
    const index = fileName[0].toUpperCase()
    fs.mkdir(path.join(sortedFolder, index), (err) => {
      copyFile(filePath, path.join(sortedFolder, index, path.parse(filePath).base), (err) => {
        if (err) { 
          cb(err) 
        } else {
          argv.d ? fs.unlink(filePath, err2 => cb(err2)) : cb(null)
        }
      })
    })  
  },
  base => {
    argv.d ? fs.rmdir(base, err => console.log(err)) : null;
  }, 
  err => {
    console.log('Done:' + err)
  }
);