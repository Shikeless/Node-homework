const fs = require('fs');
const path = require('path');
const argv = require('yargs').argv
const {promisify} = require('util')
const readdir = promisify(fs.readdir)
const stat = promisify(fs.stat)
const mkdir = promisify(fs.mkdir)
const unlink = promisify(fs.unlink)
const rmdir = promisify(fs.rmdir)

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

function copyFile(source, target) {
    return new Promise((resolve, reject) => {
        try {
      const rd = fs.createReadStream(source);
      rd.on("error", err => reject (err))
    
      const wr = fs.createWriteStream(target);
      wr.on("error", err => reject (err))
        .on("close", () => resolve (null));
    
      rd.pipe(wr);
        } catch(err) {
            console.error(err)
        }
    })
  }

const readDir = async (base) => { 
    try {
        const files = await readdir(base)
        await Promise.all(
            files.map(async item => {
                try {
                    let localDir = path.join(base, item);
                    let statistics = await stat(localDir)
                    if (statistics.isFile()) {
                        let index = item[0].toUpperCase()
                        await mkdir(path.join(sortedFolder, index), { recursive: true})
                        await copyFile(path.join(localDir), path.join(sortedFolder, index, item))
                        argv.d ? await unlink(localDir) : null
                    } else if (statistics.isDirectory()) {
                        await readDir(localDir)
                    }
                } catch(err) {
                    console.error(err)
                }
            })
        )
        argv.d ? await rmdir(base) : null
    } catch(err) {
        console.error(err)
    }
}

readDir(unsortedFolder)


