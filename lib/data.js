const path = require('path');
const fs = require('fs');

const lib = {};

lib.baseDir = path.join('__dirname', '/../.data/');

lib.create = (dir, file, data, callback) => {
    fs.open(lib.baseDir + dir + '/' + file + '.json', 'wx', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
            const stringData = JSON.stringify(data);
            fs.writeFile(fileDescriptor, stringData, err => {
                if (!err) {
                    fs.close(fileDescriptor, err => {
                        if (!err) {
                            callback(false);
                        } else {
                            callback('Error to close file');
                        }
                    });
                } else {
                    callback('Error to writting new file');
                }
            });
        } else {
            callback('Colud not create a new file, already exits');
        }
    })
};

lib.read = () => {

};

module.exports = lib;