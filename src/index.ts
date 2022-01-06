import md5 from './utils/md5';
import * as parser from './parser';
import {Readable} from 'stream';

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
    statements: Statement[];
    buffer: Buffer;
    prevSymbolCode: number;
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

type InputType = Readable | ArrayBuffer | Buffer | Uint8Array;

export async function read(input: InputType, options?: ReadOptions): Promise<Statement[]> {
    try {
        return await parser.read(getReadable(input), {
            getTransactionId(transaction: Transaction) {
                return md5(JSON.stringify(transaction));
            },
            ...options
        });
    } catch (e) {
        return Promise.reject(new Error(invalidInputMessage));
    }
}

// check for fs stream in an isomorphic safe way by Duck typing
const isReadStream = (input: unknown): input is Readable => '_read' in (input as Readable);

function getReadable(input: Readable | ArrayBuffer | Buffer | Uint8Array) {
    if (isReadStream(input)) {
        return input;
    } else if (typeof Buffer !== 'undefined' && input instanceof Buffer) {
        return Readable.from(input);
    } else {
        // noinspection SuspiciousTypeOfGuard
        if (typeof ArrayBuffer !== 'undefined' && input instanceof ArrayBuffer) {
            return Readable.from(Buffer.from(input));
        }
    }

    throw new Error(invalidInputMessage);
}
