import { useContext } from 'react';
import { Box, Text, Button, ResponsiveContext } from 'grommet';
import { StatusInfo, Alert } from 'grommet-icons';

export type MessageBoxTypes =
 | 'info'
 | 'error';

export interface MessageBoxProps {
  type: MessageBoxTypes;
  message?: string;
  onClose?: () => void
}

export const MessageBox = ({
  type = 'info',
  message,
  onClose
}: MessageBoxProps) => {
  const size = useContext(ResponsiveContext);

  if (!message) {
    return null;
  }

  return (
    <Box
      direction='row'
      background='light-2'
      align='center'
      gap={size}
      pad={size}
    >
      <Box>
        {type === 'info' &&
          <StatusInfo color='status-ok' size={size} />
        }
        {type === 'error' &&
          <Alert color='status-error' size={size} />
        }
      </Box>
      <Box direction='column'>
        <Box>
          <Text>{message}</Text>
        </Box>
        {typeof onClose === 'function' &&
          <Box>
            <Button primary onClick={onClose} label='close' />
          </Box>
        }
      </Box>
    </Box>
  );
};
