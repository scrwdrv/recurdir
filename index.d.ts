/// <reference types="node" />
import * as fs from 'fs';
declare type cb = (err: NodeJS.ErrnoException) => void;
export declare function mk(paths: string | string[], callback?: cb): Promise<unknown>;
export declare function rm(paths: string | string[], callback?: cb): Promise<unknown>;
export declare function stats(path: string, callback: (err: NodeJS.ErrnoException, dirStats?: any) => void, formatter?: (stats: fs.Stats) => any): void;
export {};
