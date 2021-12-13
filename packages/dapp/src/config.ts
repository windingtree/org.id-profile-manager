export interface NetworkConfig {
  name: string;
  chainId: number;
  blockExplorer: string;
}

export interface DappConfig {
  infuraId: string;
  defaultNetworkId: number;
  networks: NetworkConfig[];
}

if (!process.env.REACT_APP_NETWORK_ID || process.env.REACT_APP_NETWORK_ID === '') {
  throw new Error('REACT_APP_NETWORK_ID must be provided in the ENV');
}

if (!process.env.REACT_APP_INFURA_ID || process.env.REACT_APP_INFURA_ID === '') {
  throw new Error('REACT_APP_INFURA_ID must be provided in the ENV');
}

const config: DappConfig = {
  infuraId: process.env.REACT_APP_INFURA_ID,
  defaultNetworkId: Number(process.env.REACT_APP_NETWORK_ID),
  networks: [
    {
      name: 'rinkeby',
      chainId: 4,
      blockExplorer: 'https://rinkeby.etherscan.io'
    },
    {
      name: 'ropsten',
      chainId: 3,
      blockExplorer: 'https://ropsten.etherscan.io'
    }
  ]
};

export const getInfuraId = (): string => {
  return config.infuraId;
}

export const getNetworks = () => config.networks;

export const getNetworksIds = () => config.networks.map(n => n.chainId);

export const getNetworksNames = () => config.networks.map(n => n.name);

export const getDefaultNetwork = (): NetworkConfig => {
  const network = config.networks
    .filter(n => n.chainId === config.defaultNetworkId)[0];
  if (!network) {
    throw new Error('Network not found in the configuration');
  }
  return network;
}

export default config;
