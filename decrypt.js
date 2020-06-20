const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const getCipherKey = require('./getCipherKey');

function decrypt({ file, password }) {
    if (path.parse(file).ext === '.enc') {
        console.log("Wait until the file is decrypted !");
        const decodedFile = path.parse(file).name;
        // First, get the initialization vector from the file.
        const readInitVect = fs.createReadStream(file, { end: 15 });

        let initVect;
        readInitVect.on('data', (chunk) => {
            initVect = chunk;
        });

        // Once we’ve got the initialization vector, we can decrypt the file.
        readInitVect.on('close', () => {
            const cipherKey = getCipherKey(password);
            const readStream = fs.createReadStream(file, { start: 16 });
            const decipher = crypto.createDecipheriv('aes256', cipherKey, initVect);
            const unzip = zlib.createUnzip();
            const writeStream = fs.createWriteStream(decodedFile);

            readStream
                .pipe(decipher)
                //.pipe(unzip)
                .pipe(writeStream);
        });
    } else {
        console.log("Need a .enc file !!")
    }
}

module.exports = decrypt;