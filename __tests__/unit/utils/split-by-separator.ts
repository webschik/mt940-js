import {createReadStream} from 'fs';
import {splitBySeparator} from '../../../src/utils/split-by-separator';
import {collect} from '../../../src/utils/collect';
import {join} from 'path';
import {Readable} from 'stream';

describe('split statements', () => {
    it('splits a stream into chunks by a separator, that remains in the text', async () => {
        const path = join(__dirname, '..', '..', 'cases', 'performance-test.mt940');
        const unalteredString = await readFile(path);

        const stream = createReadStream(path, {encoding: 'utf-8'}).pipe(splitBySeparator(':20:'));
        const buffers = await collect(stream);
        const strings = buffers.map((it) => it.toString());
        const actual = strings.join('');

        expect(actual).toEqual(unalteredString);

        strings.slice(1).forEach((str) => {
            expect(str).toMatch(/^:20:/);
        });
    });

    test('still emits the contents if the separator is not present', async () => {
        const inputString = 'lorem ipsum … dolor sit amet';
        const stream = Readable.from(inputString);
        const buffers = await collect(stream.pipe(splitBySeparator(':20:')));
        const strings = buffers.map((it) => it.toString());
        expect(strings.join('')).toEqual(inputString);
    });
});

async function readFile(path: string): Promise<string> {
    const stream = createReadStream(path, {encoding: 'utf-8'});
    const buffers = await collect(stream);
    return buffers.map((it) => it.toString()).join('');
}
