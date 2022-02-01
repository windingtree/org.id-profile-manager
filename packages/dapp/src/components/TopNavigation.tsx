import {useNavigate} from "react-router-dom";
import {useAppState} from '../store';
import {Avatar, Button, Header, Nav} from 'grommet';

import {ThemeMode} from '../hooks/useStyle';
import {CurrentPage} from '../hooks/usePageNav';
import {Switch} from './Switch';

const logoLink = 'wt-logo.png';

export const TopNavigation = () => {
  const navigate = useNavigate();

  const { themeMode, switchThemeMode, currentPage, switchCurrentPage } = useAppState();

  const gotoPage = (page: CurrentPage) => {
    switchCurrentPage(page);

    if (page === CurrentPage.home) {
      navigate(`/`);
    } else {
      navigate(`/${page}`);
    }
  };

  return (
    <Header background="light-1" pad="small">
      <Avatar src={logoLink} />
      <Nav direction="row">
        <Button primary active={currentPage === CurrentPage.home} label="Home" onClick={() => { gotoPage(CurrentPage.home); }} />
        <Button primary active={currentPage === CurrentPage.connect} label="Wallet Connect" onClick={() => { gotoPage(CurrentPage.connect); }} />
        <Button primary active={currentPage === CurrentPage.settings} label="Settings" onClick={() => { gotoPage(CurrentPage.settings); }} />
      </Nav>
      <Switch
        checked={themeMode === ThemeMode.dark}
        onChange={switchThemeMode}
      />
    </Header>
  )
};
