import * as fs from 'fs';
import * as PATH from 'path';

function make(path: string) {
    return new Promise((resolve, reject) =>
        fs.mkdir(path, { recursive: true }, (err) => {
            if (err)
                if (err.code === 'EEXIST') return resolve();
                else return reject(err);
            resolve();
        })
    );
}

function remove(path: string) {
    return new Promise((resolve, reject) =>
        fs.readdir(path, (err, files) => {
            if (err)
                if (err.code === 'ENOENT') return resolve();
                else return reject(err);

            let promises = [];

            for (let i = files.length, p = Promise.resolve(); i--;)
                promises.push(
                    p = p.then(() => new Promise((resolve, reject) => {
                        const p = PATH.join(path, files[i]);
                        fs.stat(p, (err, stats) => {
                            if (err) reject(err);
                            else if (stats.isDirectory()) remove(p).then(resolve).catch(reject);
                            else fs.unlink(p, err => {
                                if (err) return reject(err);
                                resolve();
                            });
                        });
                    }))
                );

            Promise.all(promises).then(() => fs.rmdir(path, err => {
                if (err) return reject(err);
                resolve();
            })).catch(reject);
        })
    );
}

type cb = (err: NodeJS.ErrnoException) => void;

export function mk(paths: string | string[], callback?: cb) {
    return new Promise((resolve, reject) => {
        function tryCallback(err: NodeJS.ErrnoException) {
            if (callback) callback(err);
            else err ? reject(err) : resolve();
        }

        if (typeof paths === 'string') paths = [paths];

        let promises = [];

        for (let i = 0, l = paths.length; i < l; i++) promises.push(make(paths[i]));
        Promise.all(promises).then(() => tryCallback(null)).catch(tryCallback);
    });
}

export function rm(paths: string | string[], callback?: cb) {
    return new Promise((resolve, reject) => {
        function tryCallback(err: NodeJS.ErrnoException) {
            if (callback) callback(err);
            else err ? reject(err) : resolve();
        }

        if (typeof paths === 'string') paths = [paths];

        let promises = [];

        for (let i = 0, l = paths.length; i < l; i++) promises.push(remove(paths[i]));
        Promise.all(promises).then(() => tryCallback(null)).catch(tryCallback);
    });
}

export function stats(path: string, callback: (err: NodeJS.ErrnoException, dirStats?: any) => void, formatter?: (stats: fs.Stats, path: string) => any) {
    fs.stat(path, (err, s) => {
        if (err) return callback(err);

        if (s.isDirectory()) {
            let result = {};

            fs.readdir(path, (err, files) => {
                if (err) return callback(err);

                const l = files.length;

                if (!l) return callback(null, result);

                let t = 0;

                for (let i = l; i--;) {
                    const file = files[i];
                    stats(PATH.join(path, file), (err, s) => {
                        if (err) return callback(err);
                        result[file] = s;
                        t++;
                        if (t === l) callback(null, result);
                    }, formatter);
                }

            });

        } else callback(null, formatter ? formatter(s, path) : s);
    });
}