export function compareArrays (array1: Uint8Array, array2: Uint8Array): boolean {
    const len: number = array1.length;

    for (let i = 0; i < len; i++) {
        if (array1[i] !== array2[i]) {
            return false;
        }
    }

    return true;
}