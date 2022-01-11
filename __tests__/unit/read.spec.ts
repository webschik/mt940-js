import {createReadStream, readFileSync, writeFileSync} from 'fs';
import {join} from 'path';
import * as mt940 from '../../src';
import {collect} from '../../src/utils/collect';
import {Statement} from '../../src';

if (process.env.RUN_PERFORMANCE_TESTS) {
    jest.setTimeout(1000 * 60 * 2);
}

const FIXTURES = [
    ['ABN AMRO', 'abn-amro-1.STA'],
    ['ING-1', 'ing-1.mta'],
    ['ING-2', 'ing-2.mta'],
    ['BASE-1', 'base-1.mta'],
    ['BASE-2', 'base-2.mta'],
    ['BASE-3', 'base-3.mta'],
    ['PERFORMANCE', 'performance-test.mt940']
];

describe.each(FIXTURES)('Provider: %s', (name, mt940FileName) => {
    const isPerformanceTest = name.includes('PERFORMANCE');
    const inputPath = join(__dirname, '..', 'cases', `${mt940FileName}`);
    const snapshotPath = join(__dirname, '..', 'cases', `${mt940FileName}.snapshot.json`);

    if (isPerformanceTest && !process.env.RUN_PERFORMANCE_TESTS) {
        // only run the performance test if we mean to
        return;
    }

    describe('#read', () => {
        describe.each(['Buffer', 'ArrayBuffer'] as const)('%s', (type) => {
            it('should parse the file content', () => {
                const actual = mt940.read(getTestData(type, inputPath));

                // snapshots run out of memory in performance test, so we use the following as an approximation
                if (process.env.WRITE_SNAPSHOT) {
                    writeFileSync(snapshotPath, str(actual));
                }

                const expected = require(snapshotPath);
                expect(actual).toEqual(expected);
            });
        });
    });

    describe('#readStream', () => {
        it('returns a stream of Statement objects', async () => {
            const actual = await collect(mt940.readStream(createReadStream(inputPath, {encoding: 'utf-8'})));
            expect(actual[0]).toHaveProperty('transactions', expect.any(Array));

            const expected: Statement[] = require(snapshotPath);
            expect(actual).toHaveLength(expected.length);
            expected.forEach((expectedStatement, i) => {
                const actualStatement = actual[i];
                expect(actualStatement).toEqual(expectedStatement);
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

function getTestData(dataType: 'Buffer' | 'ArrayBuffer', testCasePath: string) {
    switch (dataType) {
        case 'Buffer':
            return readFileSync(testCasePath);
        case 'ArrayBuffer':
            return toArrayBuffer(readFileSync(testCasePath));
        default: {
            throw new Error(`unrecognised type ${dataType}`);
        }
    }
}

function str(actual: any) {
    return JSON.stringify(actual, null, 4);
}
