import { useState, useMemo } from 'react';

export type UseDappConfigHook = [
  dappConfig: string,
  setDappConfig: Function
];

let initialDappConfig = localStorage.getItem("dappConfig") as string;
if (!initialDappConfig) {
  initialDappConfig = "";
}

export const useDappConfig = (): UseDappConfigHook => {
  const [dappConfig, setDappConfig] = useState(initialDappConfig);

  const switchDappConfig = useMemo(() => function (newDappConfig: string) {
    setDappConfig(newDappConfig);
    localStorage.setItem("dappConfig", newDappConfig);
  },[setDappConfig])

  return [dappConfig, switchDappConfig];
};
