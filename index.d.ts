/// <reference types="node" />
declare type cb = (err?: NodeJS.ErrnoException) => void;
export declare function mk(paths: string | string[], callback?: cb): Promise<unknown>;
export declare function rm(paths: string | string[], callback?: cb): Promise<unknown>;
export {};
