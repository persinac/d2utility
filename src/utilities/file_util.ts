const fs = require("fs");

/* File Utilities */


export const readFile = (path) => {
    return new Promise((resolve, reject) => {
        fs.readFile(path, (err, file) => {
            console.log(path);
            if (err) {
                reject(err);
            } else {
                resolve(file);
            }
        });
    });
};

export const writeFile = (path, data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, data, err => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};