"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const PATH = require("path");
function make(path) {
    return new Promise((resolve, reject) => fs.mkdir(path, { recursive: true }, (err) => {
        if (err)
            if (err.code === 'EEXIST')
                return resolve();
            else
                return reject(err);
        resolve();
    }));
}
function remove(path) {
    return new Promise((resolve, reject) => fs.readdir(path, (err, files) => {
        if (err)
            if (err.code === 'ENOENT')
                return resolve();
            else
                return reject(err);
        let promises = [];
        for (let i = files.length, p = Promise.resolve(); i--;)
            promises.push(p = p.then(() => new Promise((resolve, reject) => {
                const p = PATH.join(path, files[i]);
                fs.stat(p, (err, stats) => {
                    if (err)
                        reject(err);
                    else if (stats.isDirectory())
                        remove(p).then(resolve).catch(reject);
                    else
                        fs.unlink(p, err => {
                            if (err)
                                return reject(err);
                            resolve();
                        });
                });
            })));
        Promise.all(promises).then(() => fs.rmdir(path, err => {
            if (err)
                return reject(err);
            resolve();
        })).catch(reject);
    }));
}
function mk(paths, callback) {
    return new Promise((resolve, reject) => {
        function tryCallback(err) {
            if (callback)
                callback(err);
            else
                err ? reject(err) : resolve();
        }
        if (typeof paths === 'string')
            paths = [paths];
        let promises = [];
        for (let i = 0, l = paths.length; i < l; i++)
            promises.push(make(paths[i]));
        Promise.all(promises).then(() => tryCallback()).catch(tryCallback);
    });
}
exports.mk = mk;
function rm(paths, callback) {
    return new Promise((resolve, reject) => {
        function tryCallback(err) {
            if (callback)
                callback(err);
            else
                err ? reject(err) : resolve();
        }
        if (typeof paths === 'string')
            paths = [paths];
        let promises = [];
        for (let i = 0, l = paths.length; i < l; i++)
            promises.push(remove(paths[i]));
        Promise.all(promises).then(() => tryCallback()).catch(tryCallback);
    });
}
exports.rm = rm;
