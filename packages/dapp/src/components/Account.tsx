import Blockies from 'react-blockies';
import styled from 'styled-components';
import { Box, Text } from 'grommet';
import { centerEllipsis, copyToClipboard } from '../utils/strings';

export interface AccountProps {
  account?: string;
}

const AccountIcon = styled(Blockies)`
  border-radius: 50%;
`;

const AccountHash = styled(Text)`
  margin-left: 8px;
  cursor: pointer;
`;

export const Account = ({ account }: AccountProps) => {

  if (!account) {
    return null;
  }

  return (
    <Box direction="row" align="center" pad='medium'>
      <Box>
        <AccountIcon
          seed={account}
          size={7}
          scale={4}
        />
      </Box>
      <AccountHash
        onClick={() => copyToClipboard(account)}
      >
        {centerEllipsis(account)}
      </AccountHash>
    </Box>
  );
};
