import { useState, useMemo } from 'react';

export enum CurrentPage {
  home = 'home',
  connect = 'connect',
  settings = 'settings'
}

export type UsePageNavHook = [
  currentPage: CurrentPage,
  setCurrentPage: Function
];

let initialCurrentPage = localStorage.getItem("currentPage") as CurrentPage;
if (!initialCurrentPage) {
  initialCurrentPage = CurrentPage.home;
}

export const usePageNav = (): UsePageNavHook => {
  const [currentPage, setCurrentPage] = useState(initialCurrentPage);

  const switchCurrentPage = useMemo(() => function (newCurrentPage: CurrentPage) {
    setCurrentPage(newCurrentPage);
    localStorage.setItem("currentPage", newCurrentPage);
  },[setCurrentPage])

  return [currentPage, switchCurrentPage];
};
