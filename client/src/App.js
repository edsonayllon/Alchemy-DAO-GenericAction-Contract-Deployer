import React, {useEffect} from 'react';
import logo from './logo.svg';
import Web3 from 'web3';
import './App.css';
const genericSchemeJson = require('@daostack/arc/build/contracts/GenericScheme.json')
// From https://daostack.github.io/DAOstack-Hackers-Kit/gettingStarted/setupGenericScheme/

const web3 = new Web3(Web3.givenProvider);
const optionByNetwork = {
  rinkeby: {
    votingMachineAddress: '0x7648665cda324511b71e002E9C62da98a8E68505', // Genesis Protocol
    targetContractAddress: '0x38f1886081759f7d352c28984908d04e8d2205a6', // standard bounties contract
    daoAddress: '0x72939947e7a1c4ac94bb840e3304b322237ad1a8' // Genesis Alpha 
  },
  main: {
    votingMachineAddress: '0x8DDCEF56944094DF8ef8836A6f8168a75a133192', // Genesis Protocol
    targetContractAddress: '0x43ee232734097B07803Ea605b49C6eE6Bf10f8cc', // standard bounties contract
    daoAddress: '0x294f999356ed03347c7a23bcbcf8d33fa41dc830' // Genesis Alpha DAO
  }
}
const network = 'rinkeby';

function App() {
  const deployScheme = async () => {
    const accounts = await window.ethereum.enable();
    const from = accounts[0];
    const gas = 2000000;
    const gasPrice = await web3.eth.getGasPrice();

    const genericSchemeContract = new web3.eth.Contract(
      genericSchemeJson.abi,
      undefined,
      {
        from,
        gas,
        gasPrice
      }
    )

    // Deploy New GenericScheme Instance
    const genericSchemeDeployedContract = genericSchemeContract.deploy({
      data: genericSchemeJson.bytecode,
      arguments: null
    }).send()

    let genericScheme = await genericSchemeDeployedContract

    // Log Address of new instance to use in next step while registering the scheme to DAO
    console.log(`Deployed new GenericScheme instance at ${genericScheme.options.address}`)

    // Following are example values, Please change appropriately
    // To get, see https://daotalk.org/t/how-to-use-the-scheme-registrar-in-alchemy/669
    // or https://github.com/edsonayllon/Alchemy-DAO-Scheme-Param-Hash-Generator
    // current parameters based on https://daotalk.org/t/the-contentious-genesis-parameter-delta/481
    const voteParams = "0xde924589f841ec9b5ea74a57f0063166c5330e7d40152ebb6d9b8c9f42a89254"

    // Get address from https://github.com/daostack/migration/blob/master/migration.json
    const votingMachineAddress = optionByNetwork[network].votingMachineAddress; // address of voting machine for a network, defaults to Genesis Protocol

    // For eg if you want this Generic Scheme to enable DAO to interact with Bounties Network
    // then targetContract would be the address of Bounties Network's respective contract
    const targetContractAddress = optionByNetwork[network].targetContractAddress; // contract generic scheme queries

    const avatar = optionByNetwork[network].daoAddress; // address of DAO

    // paramHash will be useful in later step so lets log it
    // Mimic getParametersHash(): https://github.com/daostack/infra/blob/master/contracts/votingMachines/GenesisProtocolLogic.sol
    // This method shown here won't work as encodePacked is used: https://ethereum.stackexchange.com/questions/60144/creating-hash-of-a-struct-in-solidity-and-javascript
    // Simpler would be to use the contract deployed, instructions here: https://daotalk.org/t/how-to-use-the-scheme-registrar-in-alchemy/669
    // alternatvely, we can create a copy of that smart contract function, and call it locally
    const paramHash = await genericScheme.methods.initialize(
      avatar,
      votingMachineAddress,
      voteParams,
      targetContractAddress
    ).call((err, result) => {
      console.log(err);
      console.log(result);
    })

    //console.log(paramHash)

    // calls initialize method in generic scheme contract
    /// https://github.com/daostack/arc/blob/master/contracts/schemes/GenericScheme.sol
    const result = await genericScheme.methods.initialize(
      avatar,
      votingMachineAddress,
      voteParams,
      targetContractAddress
    ).send();
    // console.log(result)
  }

  useEffect(()=>{
    deployScheme()
  })

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
