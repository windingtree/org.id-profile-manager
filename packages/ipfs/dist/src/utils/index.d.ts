import type { IPFS } from 'ipfs-core';
import { File } from '@web-std/file';
export declare const startIpfsGateway: () => Promise<IPFS>;
export declare const obj2File: (obj: unknown, fileName: string) => File;
export declare const getIpfsChunks: (asyncIterator: AsyncIterable<Uint8Array>) => Promise<string>;
export { IPFS };
//# sourceMappingURL=index.d.ts.map