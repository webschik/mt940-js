import {Tag} from '../index';
import transactionReferenceNumber from './transaction-reference-number';
import relatedReferenceNumber from './related-reference-number';
import accountId from './account-id';
import statementNumber from './statement-number';
import informationForAccountOwner from './information-for-account-owner';
import openingBalance from './opening-balance';
import closingBalance from './closing-balance';
import closingAvailableBalance from './closing-available-balance';
import forwardAvailableBalance from './forward-available-balance';
import transactionInfo from './transaction-info';

export const tags: Tag[] = [
    transactionReferenceNumber,
    relatedReferenceNumber,
    accountId,
    statementNumber,
    informationForAccountOwner,
    openingBalance,
    closingBalance,
    closingAvailableBalance,
    forwardAvailableBalance,
    transactionInfo
];