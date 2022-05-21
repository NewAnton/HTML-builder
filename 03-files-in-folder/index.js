const fs = require('fs');
const path = require('path');
const { readdir } = require('fs/promises')
const { stat } = require('fs');

const dirPath = path.join(__dirname, 'secret-folder');

findAllFiles(dirPath, []);

function findAllFiles(dirPath, arrayOfFiles) {
    readdir(dirPath, { withFileTypes: true })
        .then(files => {
            for (let file of files) {
                if (file.isFile()) {
                    arrayOfFiles.push(file);

                    stat(dirPath, (error, stats) => {
                        process.stdout.write(path.basename(file.name, path.extname(file.name)) + ' - ');
                        process.stdout.write((path.extname(file.name) + ' - ').slice(1, -1));
                        console.log(stats.size / 1000 + 'kb');
                    });
                } else {
                    arrayOfFiles = findAllFiles(dirPath + '/' + file.name, arrayOfFiles);
                }
            }
        })
        .catch(err => {
            console.log(err)
        });

    return arrayOfFiles;
}