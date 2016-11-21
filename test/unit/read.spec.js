import fs from 'fs';
import {read} from './../../src/index';

describe('#read', () => {
    describe('ABN AMRO', () => {
        describe('Buffer', () => {
            const data = fs.readFileSync('./test/docs/abn-amro-1.STA');

            it('should parse the file content', () => {
                return read(data).then((statements) => {
                    expect(statements.length).toBe(2);

                    expect(statements[0]).toEqual({
                        referenceNumber: 'ABN AMRO BANK NV',
                        accountId: '123456789',
                        number: '12345',
                        openingBalance: {
                            isCredit: true,
                            date: '2011-07-13',
                            currency: 'EUR',
                            value: 3148.49
                        },
                        closingBalance: {
                            isCredit: true,
                            date: '2011-07-13',
                            currency: 'EUR',
                            value: 2940.39
                        },
                        transactions: [
                            {
                                typeCode: 'N',
                                isCredit: true,
                                currency: 'EUR',
                                number: 'NONREF',
                                description: '/TRTP/SEPA OVERBOEKING/IBAN/NL****/BIC/ABNA***/NAME/TT TEST/REMI/TRANSFER OWN MONEY/EREF/NOTPROVIDED',
                                amount: 5.41,
                                valueDate: '2011-07-14',
                                entryDate: '2011-07-15',
                            }
                        ]
                    });

                    expect(statements[1]).toEqual({
                        referenceNumber: 'ABN AMRO BANK NV',
                        accountId: '123456777',
                        number: '12345',
                        openingBalance: {
                            isCredit: false,
                            date: '2011-06-12',
                            currency: 'EUR',
                            value: 3148.49
                        },
                        closingBalance: {
                            isCredit: false,
                            date: '2011-06-12',
                            currency: 'EUR',
                            value: 1862.36
                        },
                        transactions: [
                            {
                                typeCode: 'TRF',
                                number: 'NONREF',
                                description: 'BEA   NR:2XW218   12.06.11/10.36 PARKEREN',
                                amount: 1,
                                isCredit: false,
                                currency: 'EUR',
                                valueDate: '2011-06-14',
                                entryDate: '2011-07-15',
                            }
                        ]
                    });
                });
            });
        });
    });
});