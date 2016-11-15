import * as baseEngine from './engines/base';

const invalidInputMessage :string = 'invalid input';

export interface BalanceInfo {
    isCredit: boolean;
    date: string;
    currency: string;
    value: number;
}

export interface Transaction {
    typeCode: string;
    isCredit: boolean;
    currency: string;
    number: string;
    description: string;
    amount: number;
    valueDate: string;
    entryDate: string;
}

export interface Statement {
    referenceNumber: string;
    accountNumber: string;
    number: string;
    openingBalance: BalanceInfo;
    closingBalance: BalanceInfo;
    transactions: Transaction[];
}

export function read (input: ArrayBuffer|Buffer): Promise<Statement[]> {
    let data: Uint8Array|Buffer;

    if (typeof Buffer !== 'undefined' && input instanceof Buffer) {
        data = input;
    } else if (typeof ArrayBuffer !== 'undefined' && input instanceof ArrayBuffer) {
        data = new Uint8Array(ArrayBuffer);
    } else {
        return Promise.reject(new Error(invalidInputMessage));
    }

    if (baseEngine.test(data)) {
        return baseEngine.read(data);
    }

    return Promise.reject(new Error(invalidInputMessage));
}