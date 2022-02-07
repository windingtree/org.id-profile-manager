/* eslint-disable no-native-reassign */
import { TextEncoder, TextDecoder, Blob } from '@web-std/blob';
import { File } from '@web-std/file';
import { randomBytes } from 'crypto';

window.TextEncoder = TextEncoder;
window.TextDecoder = TextDecoder;
window.Blob = Blob;
window.File = File;

// getRandomValues shim for ethers.js
function getRandomValues(buffer) {
  if (!(buffer instanceof Uint8Array)) {
    throw new TypeError('expected Uint8Array');
  }
  if (buffer.length > 65536) {
    const e = new Error();
    e.code = 22;
    e.message = 'Failed to execute \'getRandomValues\' on \'Crypto\': The ' +
      'ArrayBufferView\'s byte length (' + buffer.length + ') exceeds the ' +
      'number of bytes of entropy available via this API (65536).';
    e.name = 'QuotaExceededError';
    throw e;
  }
  const bytes = randomBytes(buffer.length);
  buffer.set(bytes);
  return buffer;
}

window.crypto = typeof window.crypto !== 'undefined' ? window.crypto : {};
window.crypto.getRandomValues = getRandomValues;
