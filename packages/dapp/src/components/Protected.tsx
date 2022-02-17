import type { ReactNode } from 'react';
import {
  Navigate
} from 'react-router-dom';
import { useAppState } from '../store';

export interface ProtectedProps {
  component: ReactNode;
  path?: string;
}

export const Protected = ({
    component,
    path = '/'
  }: ProtectedProps) => {
  const { account } = useAppState();
  return (
    <>
      {
        account !== undefined
          ? component
          : <Navigate to={path} />
      }
    </>
  );
}
