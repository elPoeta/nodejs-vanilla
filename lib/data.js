const path = require('path');
const fs = require('fs');
const { parseJsonObject } = require('./helpers');

module.exports = {
    baseDir: path.join('__dirname', '/../.data'),
    create: function (dir, file, data, callback) {
        fs.open(`${this.baseDir}/${dir}/${file}.json`, 'wx', (err, fileDescriptor) => {
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
    },
    read: function (dir, file, callback) {
        fs.readFile(`${this.baseDir}/${dir}/${file}.json`, 'utf8', (err, data) => {
            if (err && !data) {
                callback(err, data);
                return;
            }
            const dataParsed = parseJsonObject(data);
            callback(err, dataParsed);
        });
    },
    update: function (dir, file, data, callback) {
        const stringData = JSON.stringify(data);
        fs.open(`${this.baseDir}/${dir}/${file}.json`, 'r+', (err, fileDescriptor) => {
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
    },
    delete: function (dir, file, callback) {
        fs.unlink(`${this.baseDir}/${dir}/${file}.json`, err => {
            if (err) {
                callback('Error to delete the file');
                return;
            }
            callback(false);
        });
    }
}
