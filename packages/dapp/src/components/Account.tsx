import Blockies from 'react-blockies';
import styled from 'styled-components';
import { centerEllipsis, copyToClipboard } from '../utils/strings';
import { colors, fonts } from '../styles';

export interface AccountProps {
  account?: string;
}

const AccountWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 8px;
  border-radius: 8px;
  background-color: rgb(${colors.light});
`;

const AccountIconWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const AccountIcon = styled(Blockies)`
  border-radius: 50%;
`;

const AccountHash = styled.div`
  margin-left: 8px;
  font-size: ${fonts.size.small};
  font-weight: ${fonts.weight.medium};
  color: rgb(${colors.dark});
  cursor: pointer;
`;

export const Account = ({ account }: AccountProps) => {

  if (!account) {
    return null;
  }

  return (
    <AccountWrapper>
      <AccountIconWrapper>
        <AccountIcon
          seed={account}
          size={7}
          scale={4}
        />
      </AccountIconWrapper>
      <AccountHash
        onClick={() => copyToClipboard(account)}
      >
        {centerEllipsis(account)}
      </AccountHash>
    </AccountWrapper>
  );
};
