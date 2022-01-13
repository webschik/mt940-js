import md5 from './utils/md5';
import * as parser from './parser';
import {Readable} from 'stream';
import {Buffer} from 'buffer';

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
    statementSplitSequence: string;

    getTransactionId(transaction: Transaction, index: number): string;
}

const TRANSACTION_REFERENCE_NUMBER = ':20:' as const;

const defaultOptions: ReadOptions = {
    statementSplitSequence: TRANSACTION_REFERENCE_NUMBER,

    getTransactionId(transaction: Transaction) {
        return md5(JSON.stringify(transaction));
    }
};

/**
 * Asynchronously reads the input stream, emitting Statement objects as they are parsed
 * @param {Readable} input stream emitting Buffer (e.g. created from fs.createReadStream)
 * @param {ReadOptions} [options]
 *
 * @returns {Readable<Statement>} a stream emitting Statement objects as they are parsed
 *
 * @example
 *
 *      const stream = readStream(createReadStream("mt940.sta"))
 *      stream.on("data", (statement: Statement) => console.log(statement))
 *      stream.on("error", e => console.error(e))
 *      stream.on("end", () => console.log("finished parsing")
 *
 *      // or
 *
 *      for await (const statement of readStream(createReadStream("mt940.sta", {encoding: 'utf-8'}))) {
 *          console.log(statement)
 *      }
 */
export function readStream(input: Readable, options: Partial<ReadOptions> = {}): Readable {
    return parser.read(input, {...defaultOptions, ...options});
}

/**
 * Synchronously reads a buffer and returns an array of Statements
 * @param {ArrayBuffer | Buffer} input
 * @param {ReadOptions} [options]
 *
 * @returns {Array<Statement>} parsed statement objects
 *
 * @example
 *
 *      const statements = read(readFileSync("mt940.sta"))
 *      for (const statement of statements) {
 *          console.log(statement)
 *      }
 */
export function read(input: ArrayBuffer | Buffer, options: Partial<ReadOptions> = {}): Statement[] {
    let data: Buffer;

    if (typeof Buffer !== 'undefined' && input instanceof Buffer) {
        data = input;
    } else {
        // noinspection SuspiciousTypeOfGuard
        if (typeof ArrayBuffer !== 'undefined' && input instanceof ArrayBuffer) {
            data = Buffer.from(input);
        } else {
            throw new Error(invalidInputMessage);
        }
    }

    try {
        return parser.readChunk(data, {...defaultOptions, ...options});
    } catch (e) {
        throw new Error(invalidInputMessage);
    }
}
