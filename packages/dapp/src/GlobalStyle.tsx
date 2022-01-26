import { Grommet } from 'grommet';
import styled from 'styled-components';

import { useAppState } from './store';

const GrommetWrapper = styled(Grommet)`
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const GlobalStyle:React.FC = ({children}) => {
  const { theme, themeMode } = useAppState();

  return (
    <GrommetWrapper theme={theme} themeMode={themeMode}>
      {children}
    </GrommetWrapper>
  );
};

export default GlobalStyle;
