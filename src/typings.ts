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
    data: Uint8Array|Buffer;
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
    code: string;
    fundsCode: string;
    isCredit: boolean;
    currency: string;
    description: string;
    amount: number;
    valueDate: string;
    entryDate: string;
}

export interface Statement {
    referenceNumber: string;
    relatedReferenceNumber?: string;
    accountId: string;
    number: string;
    openingBalance?: BalanceInfo;
    closingBalance?: BalanceInfo;
    closingAvailableBalance?: BalanceInfo;
    forwardAvailableBalance?: BalanceInfo;
    transactions: Transaction[];
}