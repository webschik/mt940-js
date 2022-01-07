import {createRefreshBuffer} from '../../../src/utils/create-refresh-buffer';
import {Readable} from 'stream';
import {State} from '../../../src';

describe('create refresh buffer', () => {
    it('can be initialized with values in a buffer', async () => {
        const state = await act({pos: 0, data: Buffer.from('XXXXXXXX')});
        expect(state.data).toEqual(Buffer.from('XXXXXXXX'));
    });
    it('fetches more values if initial buffer is empty', async () => {
        const state = await act({pos: 0, data: Buffer.alloc(0)});
        expect(state.data).toEqual(Buffer.from('01234567'));
    });
    it('fetches more values and throws away old data if position is towards the end of the buffer', async () => {
        const state = await act({data: Buffer.from('XXXXXXYZ'), pos: 6});
        expect(state.pos).toEqual(0);
        expect(state.data).toEqual(Buffer.from('YZ01234567'));
    });
    it('sets position correctly if tagContentStart is set', async () => {
        const state = await act({data: Buffer.from('XXXXWXYZ'), pos: 6, tagContentStart: 4});
        expect(state).toHaveProperty('pos', 2);
        expect(state).toHaveProperty('tagContentStart', 0);
        expect(state).toHaveProperty('data', Buffer.from('WXYZ01234567'));
    });
    it('keeps position if tagContentEnd is set', async () => {
        const state = await act({data: Buffer.from('XXXXXXYZ'), tagContentStart: 6, pos: 6, tagContentEnd: 7});
        expect(state).toHaveProperty('pos', 0);
        expect(state).toHaveProperty('tagContentEnd', 1);
        expect(state).toHaveProperty('data', Buffer.from('YZ01234567'));
    });
    it('works if it has to refresh several times to have enough lookahead', async () => {
        // lookahead is greater than the total size of the readable
        const state = await act({data: Buffer.alloc(0), pos: 0, lookahead: 20});
        expect(state).toHaveProperty('data', Buffer.from('0123456789ABCDEFGH'));
    });
});

const STUB_STREAM_TEST_DATA = [Buffer.from('01234567'), Buffer.from('89ABCDEF'), Buffer.from('GH')];

async function act(options: {
    pos: number;
    data?: Buffer;
    lookahead?: number;
    tagContentStart?: number;
    tagContentEnd?: number;
}) {
    const {pos, tagContentStart, tagContentEnd, data = Buffer.alloc(0), lookahead = 4} = options;
    const stream = Readable.from(STUB_STREAM_TEST_DATA);

    const state: State = {
        pos,
        tagContentStart,
        tagContentEnd,
        data,
        prevSymbolCode: -1,
        statementIndex: -1,
        statements: [],
        transactionIndex: -1
    };

    const refresh = createRefreshBuffer(stream, state, {lookahead});
    await refresh();

    return state;
}
