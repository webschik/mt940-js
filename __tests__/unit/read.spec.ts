import {createReadStream, readFileSync} from 'fs';
import {read} from '../../src';

declare const require: (path: string) => any;

describe('#read', () => {
    describe.each([
        ['ABN AMRO', 'abn-amro-1.STA', 'abn-amro-1.json'],
        ['ING-1', 'ing-1.mta', 'ing-1.json'],
        ['ING-2', 'ing-2.mta', 'ing-2.json'],
        ['BASE-1', 'base-1.mta', 'base-1.json'],
        ['BASE-2', 'base-2.mta', 'base-2.json'],
        ['BASE-3', 'base-3.mta', 'base-3.json']
    ])('Provider: %s', (_, mt940FileName, resultFileName) => {
        describe.each(['Buffer', 'ArrayBuffer', 'ReadStream'])('%s', (type) => {
            it('should parse the file content', async () => {
                const data = getTestData(type as any, mt940FileName);
                const expectedResult = require(`./../cases/${resultFileName}`);

                expect(await read(data)).toEqual(expectedResult);
            });
        });
    });
});

function toArrayBuffer(buffer: Buffer) {
    const length: number = buffer.length;
    const ab: ArrayBuffer = new ArrayBuffer(length);
    const view: Uint8Array = new Uint8Array(ab);

    for (let i = 0; i < length; i++) {
        view[i] = buffer[i];
    }

    return ab;
}

function getTestData(dataType: 'ReadStream' | 'Buffer' | 'ArrayBuffer', mt940FileName: string) {
    switch (dataType) {
        case 'Buffer':
            return readFileSync(`./__tests__/cases/${mt940FileName}`);
        case 'ReadStream':
            return createReadStream(`./__tests__/cases/${mt940FileName}`, {highWaterMark: 32});
        case 'ArrayBuffer':
            return toArrayBuffer(readFileSync(`./__tests__/cases/${mt940FileName}`));
        default: {
            throw new Error(`unrecognised type ${dataType}`);
        }
    }
}
