const fs = require('fs');
const path = require('path');
const argv = require('yargs').argv

console.log(argv.s, argv.f, argv.d);

// if (!fs.existsSync(argv.s)) {
//   console.log('no such source directory')
//   process.exit()
// } else if (!fs.existsSync(argv.f)) {
//   console.log('no such final directory')
//   process.exit()
// }

const unsortedFolder = argv.s;
const sortedFolder = __dirname + '/sortedFolder'


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

const readDir = (base) => {
  fs.readdir(base, (err, files) => {
      if (err) console.log('readdir err ' + err); 
      files.forEach(item => {
          let localDir = path.join(base, item);
          fs.stat(localDir, (err, stats) => {
              if (err) console.log('stat err ' + err);
              if (stats.isFile()) {
                  const accept = ['.jpg', '.png', '.jpeg']
                  const ext = path.extname(item)
                  if (accept.includes(ext)) {
                      var index = item[0].toUpperCase();
                      fs.mkdir(path.join(sortedFolder, index), (err) => {
                          copyFile(path.join(base, item), path.join(sortedFolder, index, item), err => {
                              console.log('done', err)
                          })  
                      })
                  }
              } else {
                  readDir(localDir);
              }
          })
      })
  })
}

async function copyProcess(base) {
  return readDir(base)
}

copyProcess(unsortedFolder)
  .then() 
    if (argv.d) console.log(argv.d)
;
