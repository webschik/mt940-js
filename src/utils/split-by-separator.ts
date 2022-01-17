import {Transform} from 'stream';

export function splitBySeparator(separator: string) {
    // private mutable member variable of our Transform stream
    let tail = '';

    return new Transform({
        transform(chunk, _, callback) {
            const str = tail + chunk.toString();
            if (!str.includes(separator)) {
                tail = str;
                return callback();
            }
            const split = str.split(separator);

            for (let i = 0; i < split.length; i++) {
                if (i === 0) {
                    // head
                    this.push(split[i]);
                } else if (i < split.length - 1) {
                    // main loop
                    this.push(separator + split[i]);
                } else {
                    // tail
                    // save chars remaining to stateful tail variable to be
                    // read in the next iteration or this.flush method
                    tail = separator + split[i];
                }
            }

            callback();
        },
        flush(callback) {
            if (tail.length) {
                this.push(tail);
            }
            callback();
        }
    });
}
