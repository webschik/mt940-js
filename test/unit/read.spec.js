import fs from 'fs';
import {read} from './../../src/index';

function toArrayBuffer (buffer) {
    const length = buffer.length;
    const ab = new ArrayBuffer(length);
    const view = new Uint8Array(ab);

    for (let i = 0; i < length; i++) {
        view[i] = buffer[i];
    }

    return ab;
}

describe('#read', () => {
    function getTestData (mt940FileName, resultFileName, isBuffer = false) {
        const buffer = fs.readFileSync(`./test/docs/${ mt940FileName }`);
        const json = require(`./../docs/${ resultFileName }`);

        return [isBuffer ? buffer : toArrayBuffer(buffer), json];
    }

    describe('ABN AMRO', () => {
        function test ([data, expectedResult]) {
            it('should parse the file content', () => {
                const promise = read(data).then((statements) => {
                    expect(statements.length).toBe(expectedResult.length);

                    statements.forEach((statement, index) => {
                        const expectedStatement = expectedResult[index];

                        for (const prop in statement) {
                            if (statement.hasOwnProperty(prop)) {
                                expect(statement[prop]).toEqual(expectedStatement[prop]);
                            }
                        }
                    });
                });

                return promise;
            });
        }

        describe('Buffer', () => {
            test(getTestData('abn-amro-1.STA', 'abn-amro-1.json', true));
        });

        describe('ArrayBuffer', () => {
            test(getTestData('abn-amro-1.STA', 'abn-amro-1.json', false));
        });
    });
});