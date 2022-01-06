import {createRefreshBuffer} from '../../../src/utils/create-refresh-buffer';
import {Readable} from 'stream';
import {State} from '../../../src';

describe('create refresh buffer', () => {
    it('fetches value to buffer if position is at start', async () => {
        const state = await act({pos: 0});
        expect(state).toHaveProperty('pos', 0);
        expect(state).toHaveProperty('buffer', Buffer.from('01234567'));
        expect(state.buffer).toHaveLength(8);
    });
    it('fetches more values if buffer is at the end', async () => {
        const state = await act({pos: 6});
        expect(state).toHaveProperty('pos', 0);
        expect(state).toHaveProperty('buffer', Buffer.from('6789012345'));
        expect(state.buffer).toHaveLength(10);
    });
    it('keeps position if tagContentStart is set', async () => {
        const state = await act({pos: 6, tagContentStart: 4});
        expect(state).toHaveProperty('pos', 2);
        expect(state).toHaveProperty('tagContentStart', 0);
        expect(state).toHaveProperty('buffer', Buffer.from('456789012345'));
    });
    it('keeps position if tagContentEnd is set', async () => {
        const state = await act({pos: 6, tagContentEnd: 7});
        expect(state).toHaveProperty('pos', 0);
        expect(state).toHaveProperty('tagContentEnd', 1);
        expect(state).toHaveProperty('buffer', Buffer.from('6789012345'));
    });
    it('works if it has to refresh several times to have enough lookahead', async () => {
        const state = await act({pos: 0, lookahead: 17});
        expect(state).toHaveProperty('buffer', Buffer.from('01234567890123456'));
    });
});

async function act(options: {
    pos: number;
    buffer?: Buffer;
    lookahead?: number;
    tagContentStart?: number;
    tagContentEnd?: number;
}) {
    const {pos, tagContentStart, tagContentEnd, buffer = Buffer.from([]), lookahead = 4} = options;
    const stream = Readable.from([Buffer.from('01234567'), Buffer.from('89012345'), Buffer.from('6')]);

    const state = ({pos, buffer, tagContentStart, tagContentEnd} as Partial<State>) as State;

    const refresh = createRefreshBuffer(stream, state, {lookahead});
    await refresh();

    return state;
}
