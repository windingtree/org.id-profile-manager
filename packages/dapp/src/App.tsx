import { AppStateProvider } from './store';

// Pages
import { Main } from './pages/Main';

const App = () => {

  return (
    <AppStateProvider>
      <Main />
    </AppStateProvider>
  );
}

export default App;
