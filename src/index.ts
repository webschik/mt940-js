import * as parser from './parser';
import {Statement} from './typings';

const invalidInputMessage: string = 'invalid input';

export function read (input: ArrayBuffer|Buffer): Promise<Statement[]|any> {
    let data: Uint8Array|Buffer;

    if (typeof Buffer !== 'undefined' && input instanceof Buffer) {
        data = input;
    } else if (typeof ArrayBuffer !== 'undefined' && input instanceof ArrayBuffer) {
        data = new Uint8Array(input);
    } else {
        return Promise.reject(new Error(invalidInputMessage));
    }

    return parser.read(data).catch(() => Promise.reject(new Error(invalidInputMessage)));
}