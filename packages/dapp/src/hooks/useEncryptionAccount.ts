import { useState, useMemo } from 'react';

export type UseEncryptionAccountHook = [
  encryptionAccount: string,
  setEncryptionAccount: Function
];

let initialEncryptionAccount = localStorage.getItem("encryptionAccount") as string;
if (!initialEncryptionAccount) {
  initialEncryptionAccount = "";
}

export const useEncryptionAccount = (): UseEncryptionAccountHook => {
  const [encryptionAccount, setEncryptionAccount] = useState(initialEncryptionAccount);

  const switchEncryptionAccount = useMemo(() => function (newEncryptionAccount: string) {
    setEncryptionAccount(newEncryptionAccount);
    localStorage.setItem("encryptionAccount", newEncryptionAccount);
  }, [setEncryptionAccount]);

  return [encryptionAccount, switchEncryptionAccount];
};
