import {BalanceInfo, Tag} from '../index';

export interface BalanceInfoTag extends Tag {
    info: BalanceInfo;
    contentPos: number;
    balance: number[];
    init(): void;
}
