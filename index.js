const fs = require('fs');
const path = require('path');
const argv = require('yargs').argv

console.log(argv.s, argv.f, argv.d);

if (!fs.existsSync(argv.s)) {
  console.log('no such source directory')
  process.exit()
} else if (!fs.existsSync(argv.f)) {
  console.log('no such final directory')
  process.exit()
}

const unsortedFolder = argv.s
const sortedFolder = argv.f


function copyFile(source, target, cb) {
  let cbCalled = false;

  const rd = fs.createReadStream(source);
  rd.on("error", err => done (err))

  const wr = fs.createWriteStream(target);
  wr.on("error", err => done (err))
    .on("close", () => done (null));

  rd.pipe(wr);

  function done(err) {
    if (!cbCalled) {
      cb(err);
      cbCalled = true;
    }
  }
}

const readDir = (base, callbackOnFile, callbackOnFolder, done) => {
    fs.readdir(base, (err, files) => {
        if (err) return done(err)
        let i = 0
        
        const next = (listDone) => { 
            if (err) return listDone(err);

            let filePath = files[i++];

            if (!filePath) return listDone(null);

            filePath = path.join(base, filePath);

            fs.stat(filePath, (_, stat) => {
                if (stat && stat.isDirectory()) {
                    readDir(
                      filePath, 
                      callbackOnFile,
                      callbackOnFolder,
                      next.bind(null, listDone))
                } else {
                    callbackOnFile(filePath, next.bind(null, listDone))
                }
            })
        }

        next(err => {
          if (!err) callbackOnFolder(base);
          done(err);
        });
    })
}

const deleteIfD = (filePath, cb) => {
  if (argv.d) {fs.unlink(filePath), err => {
    cb()
  }}
  cb()
}

readDir(
  unsortedFolder,
  (filePath, cb) => {
    const fileName = path.parse(filePath).base
    const index = fileName[0].toUpperCase()
    console.log(fileName)
    console.log(index);
    fs.mkdir(path.join(sortedFolder, index), (err) => {
      copyFile(filePath, path.join(sortedFolder, index, path.parse(filePath).base), (err) => {
          deleteIfD(filePath, cb)
          })
    })  
  },
  base => {
    if (argv.d) fs.rmdir(base), err => {
      console.log(err);
    }
  }, 
  err => {
    if (!err && argv.d) return console.log('ready for delete')
    console.log('type d for delete delete')
  }
);