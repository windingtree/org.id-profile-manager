import { useContext } from 'react';
import { Main, ResponsiveContext } from 'grommet';
import { AppStateProvider } from './store';
import { GlobalStyle } from './GlobalStyle';
import { AppHeader } from './components/AppHeader';
import { AppRoutes } from './components/Routes';

const App = () => {
  const size = useContext(ResponsiveContext);

  return (
    <AppStateProvider>
      <GlobalStyle>
        <AppHeader />
        <Main pad={size}>
          <AppRoutes />
        </Main>
      </GlobalStyle>
    </AppStateProvider>
  );
}

export default App;
