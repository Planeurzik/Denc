const fs = require('fs');
const encrypt = require('./encrypt');
const decrypt = require('./decrypt');
const sharding = require('./sharding');
const retrieving = require('./retrieving');
// pull the mode, file and password from the command arguments.
const [mode, file, password] = process.argv.slice(2);
if (mode === 'e' && file !== undefined && password !== undefined) {
    encrypt({ file, password });
} else if (mode === 'd' && file !== undefined && password !== undefined) {
    decrypt({ file, password });
} else if (mode === 's' && file !== undefined) {
    sharding({ file });
} else if (mode === 'r' && file !== undefined) {
    retrieving({ file });
} else {
    console.log("Help examples : \r");
    console.log("denc e file.txt myPassword ");
    console.log("denc d file.txt.enc myPassword ");
    console.log("denc s file.txt");
    console.log("denc r file.txt-manifest.json");
}