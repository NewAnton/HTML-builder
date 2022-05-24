const fs = require('fs');
const path = require('path');
const { readdir } = require('fs/promises');
const { mkdir } = require('fs/promises');
const { copyFile } = require('fs/promises');

const copyDirPath = path.join(__dirname, 'files');
const pasteDirPath = path.join(__dirname, 'files-copy');

async function copyDirectory() {
    const files = await readdir(copyDirPath, { withFileTypes: true });
    await mkdir(pasteDirPath, { recursive: true }, (error) => {
        if (error) console.error(error.message);
    });
    for (let file of files) {
        try {
            await copyFile(path.join(copyDirPath, file.name), path.join(pasteDirPath, file.name), fs.constants.COPYFILE_FICLONE);
        } catch (error) {
            console.log(error.message);
        }
    }
}

fs.access(pasteDirPath, (error) => {
    if (error) {
        copyDirectory();
    } else {
        fs.rm(pasteDirPath, { recursive: true }, (error) => {
            if (error) console.error(error.message);
            copyDirectory();
        });
    };
})