import md5 from './utils/md5';
import * as parser from './parser';

const invalidInputMessage: string = 'invalid input';

export interface Tag {
    multiline?: boolean;
    open?: (state: State) => any;
    readContent?: (state: State, symbolCode: number) => any;
    readToken: (state: State) => number;
    close?: (state: State, options?: ReadOptions) => any;
    [key: string]: any;
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
    [key: string]: any;
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
    referenceNumber: string;
    relatedReferenceNumber?: string;
    accountId: string;
    number: string;
    openingBalance: BalanceInfo;
    closingBalance: BalanceInfo;
    closingAvailableBalance?: BalanceInfo;
    forwardAvailableBalance?: BalanceInfo;
    transactions: Transaction[];
    additionalInformation?: string;
}

export interface ReadOptions {
    getTransactionId (transaction: Transaction, index: number): string;
}

export function read (input: ArrayBuffer|Buffer, options?: ReadOptions): Promise<Statement[]> {
    let data: Uint8Array|Buffer;

    if (typeof Buffer !== 'undefined' && input instanceof Buffer) {
        data = input;
    } else if (typeof ArrayBuffer !== 'undefined' && input instanceof ArrayBuffer) {
        data = new Uint8Array(input);
    } else {
        return Promise.reject(new Error(invalidInputMessage)) as any;
    }

    return parser.read(data, Object.assign({
        getTransactionId (transaction: Transaction) {
            return md5(JSON.stringify(transaction));
        }
    }, options)).catch(() => {
        return Promise.reject(new Error(invalidInputMessage));
    });
}