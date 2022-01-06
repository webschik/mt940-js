import {Readable} from 'stream';
import {State} from '../index';
import {streamToGenerator} from './stream-to-generator';

export const MIN_LOOKAHEAD = 16;

interface Options {
    lookahead: number;
}

// keep at least X byes in the buffer as some comparisons involve reading ahead of the current position
// modifies the buffer in State directly
export function createRefreshBuffer(
    stream: Readable,
    state: State,
    options: Partial<Options> = {}
): () => Promise<void> {
    const lookahead = options.lookahead ?? MIN_LOOKAHEAD;

    const generator = streamToGenerator(stream);
    let isDone: boolean = false;
    return async () => {
        while (!isDone && state.buffer.length - state.pos < lookahead) {
            const {value, done} = await generator.next();
            isDone = Boolean(done);
            if (value) {
                // if (state.buffer.length === 0) {
                //     state.buffer = value;
                // } else {
                //     state.buffer = Buffer.concat([state.buffer, value]);
                // }
                if (state.buffer.length > 0) {
                    const dropChars = Math.min(state.pos, state.tagContentStart ?? Number.MAX_SAFE_INTEGER);
                    // unparsed buffer
                    state.buffer = Buffer.concat([state.buffer.slice(dropChars), value]);
                    state.pos -= dropChars;
                    if (state.tagContentStart) {
                        state.tagContentStart -= dropChars;
                    }
                    if (state.tagContentEnd) {
                        state.tagContentEnd -= dropChars;
                    }
                } else {
                    state.buffer = value;
                }
            }
        }
    };
}
