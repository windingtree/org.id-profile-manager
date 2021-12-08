import { StrictMode } from 'react';
import { render } from 'react-dom';
import reportWebVitals from './reportWebVitals';
import { createGlobalStyle } from 'styled-components';
import { globalStyle } from './styles';
import App from './App';

const GlobalStyle = createGlobalStyle`
  ${globalStyle}
`;

const renderApp = () => {
  render(
    <StrictMode>
      <GlobalStyle />
      <App />
    </StrictMode>,
    document.getElementById('root')
  );
};

renderApp();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
