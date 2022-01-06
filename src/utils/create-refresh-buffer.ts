import {Readable} from 'stream';
import {State} from '../index';
import {streamToGenerator} from './stream-to-generator';

const MIN_LOOKAHEAD = 16;

// keep at least X byes in the buffer as some comparisons involve reading ahead of the current position
// modifies the buffer in State directly
export function createRefreshBuffer(stream: Readable, state: State): () => Promise<void> {
    const generator = streamToGenerator(stream);
    let isDone: boolean = false;
    return async () => {
        while (!isDone && state.buffer.length - state.pos < MIN_LOOKAHEAD) {
            const {value, done} = await generator.next();
            isDone = Boolean(done);
            if (value) {
                state.buffer = Buffer.concat([state.buffer, value]);
            }
        }
    };
}
