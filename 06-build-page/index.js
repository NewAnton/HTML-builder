const fs = require('fs');
const path = require('path');
const { readdir } = require('fs/promises');
const { copyFile } = require('fs/promises');
const { mkdir } = require('fs/promises');

const dirPath = path.join(__dirname, 'components');
const bundleDirPath = path.join(__dirname, 'project-dist');

//Create bundle directory
mkdir(bundleDirPath, { recursive: true });

//Create list of templates
const listOfTemplates = [];
const readStream = fs.createReadStream(path.join(__dirname, 'template.html'), 'utf-8');
let indexData = ''; //file index.html!!!!!!
readStream.on('data', chunk => indexData += chunk);
readStream.on('end', () => {
    //START GENERATING-------------------
    findTemplatesTag(indexData);
    replaceTemplatesTag(listOfTemplates);
    copyAssets();
    createCSS();
    process.stdout.write('__HTML is ready to use__');
});
readStream.on('error', (error) => process.stdout.write('Error' + error.message));

function replaceTemplatesTag(listOfTemplates) {
    //Create or replace file index.html
    copyFile(path.join(__dirname, 'template.html'), path.join(__dirname, 'project-dist', 'index.html'), fs.constants.COPYFILE_FICLONE);
    //Replace templates by html code
    readdir(dirPath, { withFileTypes: true })
        .then(files => {
            for (let file of files) {
                if (file.isFile()) {
                    try {
                        for (let i = 0; i < listOfTemplates.length; i++) {
                            if ((file.name) === listOfTemplates[i] + '.html') {
                                let templateFileData = '';
                                let readStream = fs.createReadStream(path.join(dirPath, file.name), 'utf-8');
                                readStream.on('data', chunk => templateFileData += chunk);
                                readStream.on('end', () => {
                                    let regex = new RegExp('{{' + listOfTemplates[i] + '}}');
                                    indexData = indexData.replace(regex, templateFileData);
                                    //Write data to index file
                                    fs.writeFile(path.join(__dirname, 'project-dist', 'index.html'), indexData, (error) => {
                                        if (error) return console.error(error.message);
                                    })
                                })
                                readStream.on('error', (error) => process.stdout.write('Error' + error.message));
                                break;
                            }
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

function findTemplatesTag(data) {
    let template = '';
    for (let i = 0; i < data.length; i++) {
        if ((data[i] === '{') && (data[i + 1] === '{')) {
            i += 2;
            for (; i < data.length; i++) {
                if ((data[i] === '}') && (data[i + 1] === '}')) break
                template += data[i];
            }
            listOfTemplates.push(template += ''); //Nice place for replace function i think...
            template = '';
        };
    };
}

function createCSS() {
    const dirPath = path.join(__dirname, 'styles');
    const bundleDirPath = path.join(__dirname, 'project-dist', 'style.css');

    let cssData = '';

    readdir(dirPath, { withFileTypes: true })
        .then(files => {
            for (let file of files) {
                if (file.isFile()) {
                    try {
                        if (path.extname(file.name) === '.css') {
                            let readStream = fs.createReadStream(path.join(dirPath, file.name), 'utf-8');
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

function copyAssets() {
    let copyDirPath = path.join(__dirname, 'assets');
    let pasteDirPath = path.join(__dirname, 'project-dist', 'assets');
    mkdir(pasteDirPath, { recursive: true });

    copyAllFiles(copyDirPath, pasteDirPath);

    function copyAllFiles(copyDirPath, pasteDirPath) {
        readdir(copyDirPath, { withFileTypes: true })
            .then(files => {
                for (let file of files) {
                    if (file.isFile()) {
                        copyFile(path.join(copyDirPath, file.name), path.join(pasteDirPath, file.name), fs.constants.COPYFILE_FICLONE);
                    } else {
                        mkdir(pasteDirPath + '/' + file.name, { recursive: true });
                        arrayOfFiles = copyAllFiles(copyDirPath + '/' + file.name, pasteDirPath + '/' + file.name);
                    }
                }
            })
            .catch(error => {
                console.log(error)
            });
    }
}