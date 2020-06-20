const fs = require('fs');
const path = require('path');

function retrieving({ file }) {
    var manifest = JSON.parse(fs.readFileSync(file).toString('utf-8'));
    if (fs.existsSync(manifest.file)) {
        fs.unlinkSync(manifest.file);
    }
    var writeStream = fs.createWriteStream(manifest.file);
    var currentShard = 0;
    processArray(manifest.shards, (shard) => {
        var readStream = fs.createReadStream(path.join(manifest.file + '-shards', shard));
        readStream.on('data', (chunk) => {
            writeStream.write(chunk);
        });
        readStream.on('end', () => {
            currentShard++;
            console.log("Retrieving Progress : ", Math.round((currentShard / manifest.shards.length) * 100), '%');
        });
    });
}

function processArray(items, process) {
    var todo = items.concat();

    setTimeout(function() {
        process(todo.shift());
        if (todo.length > 0) {
            setTimeout(arguments.callee, 0.001);
        }
    }, 0.001);
}

module.exports = retrieving;