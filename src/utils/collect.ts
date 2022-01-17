import {Readable} from 'stream';

export async function collect<T = Buffer>(stream: Readable): Promise<T[]> {
    return new Promise((resolve, reject) => {
        const result: T[] = [];
        stream.on('data', (data) => {
            result.push(data);
        });
        stream.on('error', reject);
        stream.on('end', () => {
            resolve(result);
        });
    });
}
