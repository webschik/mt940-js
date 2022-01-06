import {Readable} from 'stream';

export async function* streamToGenerator(readable: Readable): AsyncGenerator<string> {
    for await (const chunk of readable) {
        yield chunk;
    }
}
