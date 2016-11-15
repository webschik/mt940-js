import {Statement} from './../index';

export function test (data: Uint8Array|Buffer): boolean {
    return true;
}

export function read (data: Uint8Array|Buffer): Promise<Statement[]> {
    let i: number = 0;
    const length: number = data.length;
    const result: Statement[] = [];

    while (i < length) {
        const symbolCode: number = data[i];

        // colon, ":"
        if (symbolCode === 58) {
            const nextSymbolCode: number = data[i + 1];
            const nextAfterNextSymbolCode: number = data[i + 2];

            if (nextSymbolCode === 50 && nextAfterNextSymbolCode === 48) {
                // '20'
            } else if (nextSymbolCode === 50 && nextAfterNextSymbolCode === 53) {
                // '25'
            } else if (nextSymbolCode === 50 && nextAfterNextSymbolCode === 56) {
                // '28'
            } else if (nextSymbolCode === 54 && nextAfterNextSymbolCode === 48) {
                // '60'
            }
        }

        i++;
    }

    return Promise.resolve(result);
}