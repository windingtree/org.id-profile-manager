import { AppStateProvider } from './store';
import GlobalStyle from './GlobalStyle';
import { Header } from './components/Header';
// Pages
import { Main } from './pages/Main';


const App = () => {

  return (
    <AppStateProvider>
      <GlobalStyle>
        <Header />
        <Main />
      </GlobalStyle>
    </AppStateProvider>
  );
}

export default App;
