import { useState, useMemo } from 'react';

export type UseEncryptionKeyHook = [
  encryptionKey: string,
  setEncryptionKey: Function
];

const initialEncryptionKey = "";

export const useEncryptionKey = (): UseEncryptionKeyHook => {
  const [encryptionKey, setEncryptionKey] = useState(initialEncryptionKey);

  const switchEncryptionKey = useMemo(() => function (newEncryptionKey: string) {
    setEncryptionKey(newEncryptionKey);
  },[setEncryptionKey])

  return [encryptionKey, switchEncryptionKey];
};
