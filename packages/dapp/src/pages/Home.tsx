import { Text } from 'grommet';
import { useAppState } from '../store';
import { PageWrapper } from '../pages/PageWrapper';
import { getNetworksNames } from '../config';
import { DidResolverForm } from '../components/DidResolverForm';

const allowedNetworksNames = getNetworksNames();

export const Home = () => {
  const { isRightNetwork } = useAppState();


  return (
    <PageWrapper>
      {!isRightNetwork &&
        <Text>
          You are connected to a wrong network. Please switch to one of: {allowedNetworksNames.join(', ')}
        </Text>
      }
      <DidResolverForm />
    </PageWrapper>
  );
};
