import {Transform} from 'stream';

export function splitToStatements() {
    const separator = ':20:';
    let buffer = '';
    return new Transform({
        transform(chunk, _, callback) {
            const str = buffer + chunk.toString();
            if (!str.includes(separator)) {
                buffer = str;
                return callback();
            }
            const split = str.split(separator);

            for (let i = 0; i < split.length; i++) {
                if (i === 0) {
                    this.push(split[i]);
                } else if (i === split.length - 1) {
                    buffer = separator + split[i];
                } else {
                    this.push(separator + split[i]);
                }
            }

            callback();
        },
        flush(callback) {
            if (buffer.length) {
                this.push(buffer);
            }
            callback();
        }
    });
}
