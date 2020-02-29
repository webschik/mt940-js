export default function bufferToText(arr: Uint8Array | number[], start?: number, end?: number): string {
    return String.fromCharCode.apply(String, [].slice.call(arr, start, end));
}
