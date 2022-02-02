"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIpfsChunks = exports.obj2File = exports.startIpfsGateway = void 0;
const blob_1 = require("@web-std/blob");
const file_1 = require("@web-std/file");
const ipfs_core_1 = require("ipfs-core");
const startIpfsGateway = async () => (0, ipfs_core_1.create)();
exports.startIpfsGateway = startIpfsGateway;
const obj2File = (obj, fileName) => {
    const blob = new blob_1.Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' });
    return new file_1.File([blob], fileName);
};
exports.obj2File = obj2File;
const getIpfsChunks = async (asyncIterator) => {
    const data = [];
    for await (const chunk of asyncIterator) {
        data.push(chunk);
    }
    const length = data.reduce((acc, curr) => acc + curr.length, 0);
    const concatenatedData = new Uint8Array(length);
    let offset = 0;
    for (const arr of data) {
        concatenatedData.set(arr, offset);
        offset += arr.length;
    }
    const decoder = new blob_1.TextDecoder();
    return decoder.decode(concatenatedData);
};
exports.getIpfsChunks = getIpfsChunks;
//# sourceMappingURL=index.js.map