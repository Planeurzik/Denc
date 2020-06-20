const fs = require('fs');
const path = require('path');
const getCipherKey = require('./getCipherKey');

function sharding({ file }) {
    if (fs.existsSync(file + "-shards")) {
        fs.rmdirSync(file + "-shards", { recursive: true });
    }
    fs.mkdirSync(file + "-shards");
    var readStream = fs.createReadStream(file);
    var fileSize = fs.statSync(file).size;
    var currentProgress = 0;
    var manifest = {
        file: file,
        shards: []
    }
    readStream.on('data', (chunk) => {
        currentProgress += chunk.length;
        var shardName = getCipherKey(chunk).toString('hex');
        var shard = fs.createWriteStream(path.join(file + "-shards", shardName));
        shard.write(chunk);
        manifest.shards.push(shardName);
        console.log("Sharding Progress : ", Math.round((currentProgress / fileSize) * 100), '%');
    });
    readStream.on('end', () => {
        fs.writeFileSync(file + "-manifest.json", JSON.stringify(manifest));
    });
}

module.exports = sharding;