import md5 from './utils/md5';
import * as parser from './parser';
import type {Readable} from 'stream';

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


export async function read(input: Readable | ArrayBuffer | Buffer, options?: ReadOptions): Promise<Statement[]> {
    let data: Uint8Array | Buffer;

    if (isReadStream(input)) {
        const chunks = [];
        for await (const chunk of input) {
            chunks.push(chunk);
        }
        data = Buffer.concat(chunks);
    } else if (typeof Buffer !== 'undefined' && input instanceof Buffer) {
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