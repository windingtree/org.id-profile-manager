import { Grommet } from 'grommet';
import { grommet } from 'grommet/themes';
import { generate } from 'grommet/themes/base';
import { deepMerge } from 'grommet/utils';
import { useAppState } from './store';

const baseTheme = deepMerge(generate(16), grommet);

export const GlobalStyle:React.FC = ({children}) => {
  const { themeMode } = useAppState();

  return (
    <Grommet
      theme={baseTheme}
      themeMode={themeMode}
      full
    >
      {children}
    </Grommet>
  );
};
