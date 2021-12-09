# An ORGiD Profile Manager MVP

## Sign-in

### Wallet options:

- Metamask
- WalletConnect

### Networks

Pre-configured test networks:

- Sokol (xDAI)
- Rinkeby
- Ropsten
- Arbitrum

### Sign-in workflow

```mermaid
sequenceDiagram
  actor Customer
  participant Dapp
  participant Metamask
  participant WalletConnect
  Dapp ->>+ Dapp: Checks for known provider
  alt Known provider exists
    Dapp ->>+ Dapp: Restores connection from the known provider
  else
    Dapp ->>+ Customer: Asking Sign-In
    Customer ->>+ Dapp: Starts Sign-In
    activate Dapp
    Dapp ->>+ Customer: Asking Sign-in options
    note left of Dapp: Popup window
    deactivate Dapp
    opt Metamask case
      Customer -->>+ Dapp: Choose Metamask
      activate Metamask
      Dapp ->>+ Metamask: Event: Connect
      Metamask ->>+ Customer: Confirm the connection of the Dapp and account
      Customer -->>+ Metamask: Confirms
      Metamask -->>+ Dapp: Event: Account changed
        loop Network check
          Dapp ->>+ Dapp: Checks network
          alt Wrong network
            Dapp ->>+ Customer: Asking to choose the right network
            Customer ->>+ Metamask: Selects the right network
            Metamask -->>+ Dapp: Event: Network changed
            Dapp ->+ Customer: Message: You are connected
            Dapp ->>+ Dapp: Save known provider to a local storage
            Dapp ->>+ Dapp: Fetching registered ORGiDs
          else Right network
            Dapp ->+ Customer: Message: You are connected
            Dapp ->>+ Dapp: Save known provider to a local storage
            Dapp ->>+ Dapp: Fetching registered ORGiDs
          end
        end
      deactivate Metamask
    end
    opt WalletConnect case
      Customer -->>+ Dapp: Choose WalletConnect
      activate WalletConnect
      Dapp ->>+ WalletConnect: Event: Connect
      note right of Customer: The same flow as for Metamask
      deactivate WalletConnect
    end
  end
```

## Dapp configuration

### Storage options

#### Configuration storage

- Web browser `LocalStorage`

#### Files storage

> The Dapp must provide configurable storage options (at least one) for files storing that can be extended in the future.

- Infura IPFS API
- Custom WindingTree IPFS API. Default for MVP only (**It is recommended to remove this storage option from the next version of Dapp!**)
- *(not a part of MVP)* Custom IPFS API URI that supports IPNS
- *(not a part of MVP)* Custom API URI that supports hosting files over HTTPS

> The Infura IPFS API does not support IPNS. So stored files cannot be updated and every new deployment will generate a new CID.<br>
> If a customer will choose this storage option the Dapp must show a notification to the customer that he had to send a transaction to the smart contract to update a link to the ORG.JSON.

## Organization profiles

When a customer sign in the Dapp fetches owned organization profiles from the smart contract and shows a simple list of cards labelled with organization name and logotype.

By clicking on an organization card the Dapp opens a profile editor view with a loaded organization profile.

## ORGiD profile creation/editing

A new profile creation consist of the following steps:

- Choose the profile type: legal entity, organizational unit, personal
- filling the automatically generated forms
- Adding of verification methods
- saving of the profile

The list of forms is dynamically generated from a profile configuration. For forms generation [JSON forms package](https://jsonforms.io/) will be used.

To make it possible to generate a UI from the JSON schema the schema must be extended with some custom parameters that can help to make difference between regular fields and fields that require file uploads.

The MVP version of the profile UI will have a **vertical layout only**. The next version will have a custom UI schema that will be integrated into the ORG.JSON schema package.

### Adding of verification methods

#### Default verification method

The default verification method is belonging to the current organization owner. The public key of this method must be tagged as `ownerKey_1`.

#### ORGiD Delegates

If the selected organization has configured delegated verification methods these methods will be displayed as a form with fields. Each field will contain one verification method that can be edited.

> The feature of adding verification method delegates is not accessible if ORGiD is not registered yet.

##### Adding of delegated verification method

To add new methods the customer must press the `add method` button then fill the field.

To save a new verification method a customer must send a transaction to the smart contract.

> If a customer updated the verification methods list but has not sent a transaction the Dapp must show to him a proper notification.

### Saving of the profile

A customer saves a profile using a selected storage method. After the profile is saved the Dapp must compare the URIs of the saved profile with the link stored in the smart contract. If URIs are different the Dapp must propose to a customer to update the stored link by sending a transaction to the smart contract.

## Creation of an ORGiD

The feature of an ORGiD creation is not accessible until the profile is saved.
