const fs = require('fs');
const path = require('path');
const { readdir } = require('fs/promises');
const { mkdir } = require('fs/promises');
const { copyFile } = require('fs/promises');

const copyDirPath = path.join(__dirname, 'files');
const pasteDirPath = path.join(__dirname, 'files-copy');

copyFiles();

function copyFiles() {
    mkdir(pasteDirPath, { recursive: true });
    readdir(copyDirPath, { withFileTypes: true })
        .then(files => {
            for (let file of files) {
                try {
                    copyFile(path.join(__dirname, 'files', file.name), path.join(__dirname, 'files-copy', file.name), fs.constants.COPYFILE_FICLONE);
                } catch (error) {
                    console.log(error.message);
                }
            }
        })
        .catch(err => {
            console.log(err)
        });
}