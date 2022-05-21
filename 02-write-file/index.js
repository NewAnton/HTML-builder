const fs = require('fs');
const path = require('path');
const readline = require('readline');

const filePath = path.join(__dirname, 'text.txt');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

writeTextToFile();

function writeTextToFile() {
    rl.question('Write some text, please...\n', (answer) => {
        if (answer === 'exit') process.exit();

        fs.appendFile(filePath, answer + '\n', (error) => {
            if (error) return console.error(error.message);
        })
        writeTextToFile();
    })
};

process.on('exit', code => {
    if (code === 0) process.stdout.write('\n--Program finished--');
    else process.stderr.write(`Something went wrong. Error code: ${code}`);
});