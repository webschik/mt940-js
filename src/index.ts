import md5 from './utils/md5';
import * as parser from './parser';
import type {Readable, TransformCallback} from 'stream';
import {Transform} from 'stream';

const invalidInputMessage: string = 'invalid input';

export interface Tag {
    multiline?: boolean;
    open?: (state: State) => void;
    readContent?: (state: State, symbolCode: number) => void;
    close?: (state: State, options: ReadOptions) => void;

    readToken(state: State): number;
}

export interface State {
    pos: number;
    statementIndex: number;
    transactionIndex: number;
    tag?: Tag;
    tagContentStart?: number;
    tagContentEnd?: number;
    data: Uint8Array;
    statements: Statement[];
}

export interface BalanceInfo {
    isCredit: boolean;
    date: string;
    currency: string;
    value: number;
}

export interface Transaction {
    id: string;
    code: string;
    fundsCode: string;
    isCredit: boolean;
    isExpense: boolean;
    currency: string;
    description: string;
    amount: number;
    valueDate: string;
    entryDate: string;
    customerReference: string;
    bankReference: string;
}

export interface Statement {
    transactions: Transaction[];
    referenceNumber?: string;
    relatedReferenceNumber?: string;
    accountId?: string;
    number?: string;
    openingBalance?: BalanceInfo;
    closingBalance?: BalanceInfo;
    closingAvailableBalance?: BalanceInfo;
    forwardAvailableBalance?: BalanceInfo;
    additionalInformation?: string;
}

export interface ReadOptions {
    getTransactionId(transaction: Transaction, index: number): string;
}


export function read(input: Readable | ArrayBuffer | Buffer, options?: ReadOptions): Promise<Statement[]> {
    if (isReadStream(input)) {
        return readStream(input as Readable, options);
    }

    return readAsync(input as ArrayBuffer | Buffer, options);
}

export function readAsync(input: ArrayBuffer | Buffer, options?: ReadOptions): Promise<Statement[]> {
    let data: Uint8Array | Buffer;

    if (typeof Buffer !== 'undefined' && input instanceof Buffer) {
        data = input;
    } else if (typeof ArrayBuffer !== 'undefined' && input instanceof ArrayBuffer) {
        data = new Uint8Array(input);
    } else {
        return Promise.reject(new Error(invalidInputMessage));
    }

    return parser
        .read(
            data,
            Object.assign(
                {
                    getTransactionId(transaction: Transaction) {
                        return md5(JSON.stringify(transaction));
                    }
                },
                options
            )
        )
        .catch(() => {
            return Promise.reject(new Error(invalidInputMessage));
        });
}


// check for fs stream in an isomorphic safe way by Duck typing
const isReadStream = (input: Readable | ArrayBuffer | Buffer) =>
    '_read' in input && typeof (input as Readable)._read === 'function';


async function readStream(input: Readable, options?: ReadOptions): Promise<Statement[]> {
    let statements: Statement[] = [];
    for await (const chunk of input.pipe(splitBy(':20:'))) {
        statements = statements.concat(await readAsync(chunk, options));
    }
    return statements;
}


export const splitBy = (separator: string): Transform => {
    let bufferedChunks: string[] = [];

    return new Transform({
        flush(callback: TransformCallback) {
            return callback(null, bufferedChunks.join(''));
        },
        transform(chunk: any, _encoding: string, callback: TransformCallback) {
            try {
                if (chunk == null) {
                    this.push(null);
                    return;
                }

                if (chunk instanceof Buffer) {
                    chunk = chunk.toString();
                }

                if (typeof chunk !== 'string') {
                    return callback(
                        new Error('invalid data type, only strings and buffer streams are acceptable')
                    );
                }

                if (chunk.includes(separator)) {
                    // Concat the first part to the existing chunks
                    const [head, ...tail] = chunk.split(separator);


                    bufferedChunks.push(head);
                    const newLine = bufferedChunks.join('');
                    bufferedChunks = [separator];
                    this.push(newLine);


                    // Send all new lines, except last one
                    // Last element may be partial
                    const last = tail.pop();
                    if (last) {
                        bufferedChunks.push(last);
                    }
                    // pop() is a mutable method, therefore last is removed
                    tail.forEach(line => this.push(line.concat(separator)));
                } else {
                    bufferedChunks.push(chunk);
                }

                return callback();
            } catch (e) {
                return callback(e);
            }
        }
    });
};