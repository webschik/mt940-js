import {createReadStream} from 'fs';
import {splitToStatements} from '../../../src/utils/split-to-statements';
import {collect} from '../../../src/utils/collect';
import {join} from 'path';

describe('split statements', () => {
    it('splits a text file into multiple statements', async () => {
        const path = join(__dirname, '..', '..', 'cases', 'performance-test.mt940');
        const unalteredString = await readFile(path);

        const stream = createReadStream(path).pipe(splitToStatements());
        const buffers = await collect(stream);
        const strings = buffers.map((it) => it.toString());
        const actual = strings.join('');

        expect(actual).toEqual(unalteredString);

        strings.slice(1).forEach((str) => {
            expect(str).toMatch(/^:20:/);
        });
    });
});

async function readFile(path: string): Promise<string> {
    const stream = createReadStream(path);
    const buffers = await collect(stream);
    return buffers.map((it) => it.toString()).join('');
}
