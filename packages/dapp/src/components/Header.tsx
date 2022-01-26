import { useAppState } from '../store';
import { Box } from 'grommet';

import { ThemeMode } from '../hooks/useStyle';
import { Switch } from './Switch';

export const Header = () => {
  const { themeMode, switchThemeMode } = useAppState();

  return (
    <Box
      direction="row-responsive"
      gap="medium"
      justify="end"
      align="center"
      margin="medium"
    >
      <Switch
        checked={themeMode === ThemeMode.dark}
        onChange={switchThemeMode}
      />
    </Box>
  )
};
