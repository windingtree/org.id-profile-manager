import { Grommet } from 'grommet';
import { useStyle } from '../src/hooks/useStyle';

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

export const decorators = [
  Story => {
    const [theme, themeMode] = useStyle();

    return  <>
      <Grommet theme={theme} themeMode={themeMode}>
        <Story />
      </Grommet>
    </>
  },
];
