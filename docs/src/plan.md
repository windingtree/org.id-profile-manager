# ORGiD Profile Manager Development Plan

## Steps

- Dapp bootstrap: Repository, Metamask & WalletConnect, State management (`done`)
- CI/CD for the Dapp: Publishing of the Dapp on GitHub pages by on `release` event (or on `merge`). `est. 2 days`

> How to staging?

- Flow diagrams, algorithms (`est. 4 days` but this time can be distributed)
- UI/UX design (`est. 1,5 week`)
- LogIn feature: a user must log in to the Dapp using a password. This password is used for Dapp storage encryption/decryption. (`est. 2 days`)
- Adding of network providers (`est. 2 days`)
- Files upload management:
  - Extracting of the WT IPFS node into a separate service (repository, CI/CD), `est. 3 days`

  > IPFS node access on the basis of API key? (not sure)

  > IPNS support? I think we must add such a feature to the WT node. (`est. 2-3 days`)

  > Should we allow Infura IPFS API usage instead of WT node?

  > Pinning nodes?

  > Alternative files hosting options? Google drive? DropBox?

  - Files management Dapp UI (`est. 3 days`)
- Keys management. There are two ways:
  1) manual adding of existed keys (like in the CLI, `est. 2 days`) + keys generation (`est. 2 days`)
  2) wallet with a seed phrase (not implemented yet in the SDK but it is possible to implement in approx 4 days). Wallet UI (`est. 1 week`)
- Organization profile:
  - Setup of mandatory ORG.JSON fields (context, verificationMethods, etc) `est. 1 day`
  - Profile form generation on the basis of the ORG.JSON schema (est. 1 week)
- Creation of an ORGiD VC (`est. 2 days`)
- Creation of an ORGiD (interaction with the smart contract) `est. 2 days`
- Organizations view (`est. 2 days`)
- ORGiD update flow (`est. 2 days`)
- ORGiD ownership transfer (to the another owner of to the own multisig wallet) `est. 3 days`
- ORGiD delegates management:
  - Adding and removal of delegates (interaction with the smart contract) `est. 2 days`
  - Granting access to an ORGiD VC file management (quite a complex task in the case when a delegate is another ORGiD, no yet ideas how to implement it in a frame of the Dapp) `est. ???`
