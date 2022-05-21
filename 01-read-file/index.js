const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'text.txt');
const readStream = fs.createReadStream(filePath, 'utf-8');
let data = '';

readStream.on('data', chunk => data += chunk);
readStream.on('end', () => process.stdout.write('File data:\n' + data))
readStream.on('error', (error) => process.stdout.write('Error' + error.message));