const fs = require('fs');
const path = require('path');


module.exports = readDir = (base, callbackOnFile, callbackOnFolder, done) => {
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