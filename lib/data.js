const path = require('path');
const fs = require('fs');

const lib = {};

lib.baseDir = path.join('__dirname', '/../.data');

lib.create = (dir, file, data, callback) => {
    fs.open(`${lib.baseDir}/${dir}/${file}.json`, 'wx', (err, fileDescriptor) => {
        if (err && !fileDescriptor) {
            callback('Colud not create a new file, already exits');
            return
        }
        const stringData = JSON.stringify(data);
        fs.writeFile(fileDescriptor, stringData, err => {
            if (err) {
                callback('Error to writting new file');
                return;
            }
            fs.close(fileDescriptor, err => {
                if (err) {
                    callback('Error to close file');
                    return;
                }
                callback(false);
            });
        });

    });
};

lib.read = (dir, file, callback) => {
    fs.readFile(`${lib.baseDir}/${dir}/${file}.json`, 'utf8', (err, data) => {
        callback(err, data);
    });
};

lib.update = (dir, file, data, callback) => {
    const stringData = JSON.stringify(data);
    fs.open(`${lib.baseDir}/${dir}/${file}.json`, 'r+', (err, fileDescriptor) => {
        if (err && !fileDescriptor) {
            callback('Could not open the file, may not exist yet');
            return;
        }
        fs.ftruncate(fileDescriptor, err => {
            if (err) {
                callback('Error truncating file');
                return;
            }
            fs.writeFile(fileDescriptor, stringData, err => {
                if (err) {
                    callback('Error to writing file');
                    return;
                }
                fs.close(fileDescriptor, err => {
                    if (err) {
                        callback('Error to close the file');
                        return;
                    }
                    callback(false);
                });
            });
        });
    });
}

lib.delete = (dir, file, callback) => {
    fs.unlink(`${lib.baseDir}/${dir}/${file}.json`, err => {
        if (err) {
            callback('Error to delete the file');
            return;
        }
        callback(false);
    });
}

module.exports = lib;