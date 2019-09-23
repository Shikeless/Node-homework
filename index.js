const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('What do you think of Node.js? ', (answer) => {
  // TODO: Log the answer in a database
  console.log(`Thank you for your valuable feedback: ${answer}`);

  rl.close();
});

const unsortedFolder = './unsortedFolder';
const sortedFolder = __dirname + '/sortedFolder'

console.log(process.argv[2])

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
                            copyFile(path.join(sortedFolder, index), path.join(sortedFolder, index, item), err => {
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
    if (process.argv[2] === '-d') console.log('-d') 
}
  
readDir(unsortedFolder);

// fs.createReadStream(path.join(base, item)).pipe(path.join(sortedFolder, index, item)) 
// TypeError: dest.on is not a function. 
