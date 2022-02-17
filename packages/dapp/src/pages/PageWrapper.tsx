import type { ReactNode } from 'react';
import { useContext } from 'react';
import { Box, ResponsiveContext } from 'grommet';

export interface PageWrapperProps {
  children: ReactNode
}

export const PageWrapper = ({ children }: PageWrapperProps) => {
  const size = useContext(ResponsiveContext);

  return (
    <Box pad={size}>
      {children}
    </Box>
  );
};
