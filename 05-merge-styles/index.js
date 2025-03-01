const fs = require('fs');
const path = require('path');
const { readdir } = require('fs/promises');

const dirPath = path.join(__dirname, 'styles');
const bundleDirPath = path.join(__dirname, 'project-dist', 'bundle.css');

fs.access(bundleDirPath, (error) => {
    if (error) {
        mergeStyles();
    } else {
        fs.rm(bundleDirPath, { recursive: true }, (error) => {
            if (error) console.error(error.message);
            mergeStyles();
        });
    };
})

function mergeStyles() {
    readdir(dirPath, { withFileTypes: true })
        .then(files => {
            for (let file of files) {
                if (file.isFile()) {
                    try {
                        if (path.extname(file.name) === '.css') {
                            let readStream = fs.createReadStream(path.join(dirPath, file.name), 'utf-8');
                            let cssData = '';
                            readStream.on('data', chunk => cssData += chunk);
                            readStream.on('end', () => {
                                fs.appendFile(bundleDirPath, cssData, (error) => {
                                    if (error) return console.error(error.message);
                                })
                            })
                            readStream.on('error', (error) => process.stdout.write('Error' + error.message));
                        }
                    } catch (error) {
                        console.log(error.message);
                    }
                }
            }
        })
        .catch(err => {
            console.log(err)
        });
}