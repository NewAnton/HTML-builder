const fs = require('fs');
const path = require('path');
const { readdir } = require('fs/promises')
const { stat } = require('fs');

const dirPath = path.join(__dirname, 'secret-folder');

readdir(dirPath, { withFileTypes: true })
    .then(files => {
        for (let file of files) {
            if (file.isFile()) {
                stat(path.join(__dirname, 'secret-folder', file.name), (error, stats) => {
                    if (error) return console.error(error.message);
                    process.stdout.write(path.basename(file.name, path.extname(file.name)) + ' - ');
                    process.stdout.write((path.extname(file.name) + ' - ').slice(1, -1));
                    console.log(' ' + stats.size / 1000 + 'kb');
                });
            }
        }
    })
    .catch(error => {
        console.log(error)
    });