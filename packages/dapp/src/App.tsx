import { Routes, Route } from 'react-router-dom';

import {AppStateProvider} from './store';
import GlobalStyle from './GlobalStyle';
import { TopNavigation } from './components/TopNavigation';

// Pages
import { Main } from './pages/Main';
import { Connect } from './pages/Connect';
import { Settings } from './pages/Settings';

const App = () => {
  return (
    <AppStateProvider>
      <GlobalStyle>
        <TopNavigation />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/connect" element={<Connect />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </GlobalStyle>
    </AppStateProvider>
  );
}

export default App;
