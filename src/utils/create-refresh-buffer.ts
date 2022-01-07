import {Readable} from 'stream';
import {State} from '../index';
import {streamToGenerator} from './stream-to-generator';

export const DEFAULT_LOOKAHEAD = 2048;

interface Options {
    lookahead: number;
}

// keep at least X byes in the buffer as some comparisons involve reading ahead of the current position
// modifies the buffer in State directly
export function createRefreshBuffer(
    input: Readable,
    state: State,
    options: Partial<Options> = {}
): () => Promise<void> {
    const lookahead = options.lookahead ?? DEFAULT_LOOKAHEAD;
    const values = streamToGenerator(input);

    let bufferSize = 0;
    let zeroes: Buffer;
    let isDone = false;

    return async () => {
        while (!isDone && state.data.length - state.pos < lookahead) {
            const hasMoreValues = await fetchMoreValues();
            if (!hasMoreValues) {
                break;
            }
        }
    };

    function resizeBuffer(toSize: number) {
        bufferSize = toSize;

        const newBuffer = Buffer.alloc(bufferSize);
        zeroes = Buffer.alloc(toSize);
        state.data.copy(newBuffer, 0);
        state.data = newBuffer;
    }

    async function fetchMoreValues() {
        const {value, done} = await values.next();
        isDone = Boolean(done);
        if (value) {
            const dropChars = Math.min(state.pos, state.tagContentStart ?? Number.MAX_SAFE_INTEGER);
            const keepChars = state.data.length - dropChars;
            const newSize = value.length + keepChars;
            if (state.data.length < newSize) {
                resizeBuffer(newSize);
            }
            state.data.copy(state.data, 0, dropChars);
            value.copy(state.data, keepChars);
            zeroes.copy(state.data, keepChars + value.length);

            // adjust cursors used in main loop
            state.pos -= dropChars;
            if (state.tagContentStart) {
                state.tagContentStart -= dropChars;
            }
            if (state.tagContentEnd) {
                state.tagContentEnd -= dropChars;
            }
        }

        return !done;
    }
}
