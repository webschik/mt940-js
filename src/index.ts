import * as parser from './parser';

const invalidInputMessage: string = 'invalid input';

export interface Tag {
    multiline?: boolean;
    open?: (state: State) => any;
    readContent?: (state: State, symbolCode: number) => any;
    readToken: (state: State) => number;
    close?: (state: State) => any;
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
}

export function read (input: ArrayBuffer|Buffer): Promise<Statement[]> {
    let data: Uint8Array|Buffer;

    if (typeof Buffer !== 'undefined' && input instanceof Buffer) {
        data = input;
    } else if (typeof ArrayBuffer !== 'undefined' && input instanceof ArrayBuffer) {
        data = new Uint8Array(input);
    } else {
        return Promise.reject(new Error(invalidInputMessage)) as any;
    }

    return parser.read(data).catch(() => Promise.reject(new Error(invalidInputMessage)));
}