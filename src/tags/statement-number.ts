import {compareArrays} from './../utils';
import {colonSymbolCode} from './../tokens';
import {Tag, State} from './../typings';

/**
 * @description :28:
 * @type {Uint8Array}
 */
const token1: Uint8Array = new Uint8Array([colonSymbolCode, 50, 56, colonSymbolCode]);

/**
 * @description :28C:
 * @type {Uint8Array}
 */
const token2: Uint8Array = new Uint8Array([colonSymbolCode, 50, 56, 67, colonSymbolCode]);
const token1Length: number = token1.length;
const token2Length: number = token2.length;
const statementNumberTag: Tag = {
    open (state: State): boolean {
        const isToken1: boolean = compareArrays(token1, 0, state.data, state.pos, token1Length);
        const isToken2: boolean = !isToken1 && compareArrays(token2, 0, state.data, state.pos, token2Length);

        if (!isToken1 && !isToken2) {
            return false;
        }

        state.statements[state.statementIndex].number = '';
        state.pos += (isToken1 ? token1Length : token2Length) - 1;
        return true;
    },

    read (state: State, symbolCode: number) {
        state.statements[state.statementIndex].number += String.fromCharCode(symbolCode);
    }
};

export default statementNumberTag;