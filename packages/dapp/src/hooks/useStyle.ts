import type { ThemeType } from 'grommet/themes';
import { useState, useMemo, useCallback } from 'react';
import { grommet } from 'grommet/themes';
import { generate } from 'grommet/themes/base';
import { deepMerge } from 'grommet/utils';

export enum ThemeMode {
  light = 'light',
  dark = 'dark'
}

export type UseStyleHook = [
  theme: ThemeType,
  themeMode: ThemeMode,
  setThemeMode: Function
];
// ORGID-80: Implement an internal API for working with storage variables
const initalThemeMode =  localStorage.getItem("themeMode") as ThemeMode;

// useStyle react hook
export const useStyle = (): UseStyleHook => {
  const [themeMode, setThemeMode] = useState(initalThemeMode);
  const theme = useMemo(
    () => deepMerge(generate(16), grommet),
    [],
  );
  const switchThemeMode = useCallback(() => {
    const newThemeMode = themeMode === ThemeMode.dark ? ThemeMode.light : ThemeMode.dark
    setThemeMode(newThemeMode);
    localStorage.setItem("themeMode", newThemeMode);
  },[themeMode])

  return [theme, themeMode, switchThemeMode];
};
