import React, {useEffect} from 'react';
import logo from './logo.svg';
import Web3 from 'web3';
import './App.css';
const genericSchemeJson = require('@daostack/arc/build/contracts/GenericScheme.json');
const uGenericSchemeJson = require('@daostack/arc/build/contracts/UGenericScheme.json')
// From https://daostack.github.io/DAOstack-Hackers-Kit/gettingStarted/setupGenericScheme/

const web3 = new Web3(Web3.givenProvider);
const optionByNetwork = {
  rinkeby: {
    votingMachineAddress: '0x7648665cda324511b71e002E9C62da98a8E68505', // Genesis Protocol
    targetContractAddress: '0x38f1886081759f7d352c28984908d04e8d2205a6', // standard bounties contract
    daoAddress: '0x72939947e7a1c4ac94bb840e3304b322237ad1a8', // Genesis Alpha 
    uGenericAddr: '0x72dB54E63B3004a4bd030E5E0333579C1d54B863'
  },
  main: {
    votingMachineAddress: '0x8DDCEF56944094DF8ef8836A6f8168a75a133192', // Genesis Protocol
    targetContractAddress: '0x43ee232734097B07803Ea605b49C6eE6Bf10f8cc', // standard bounties contract
    daoAddress: '0x294f999356ed03347c7a23bcbcf8d33fa41dc830', // Genesis Alpha DAO
    uGenericAddr: '0xB00230dB44150862791fFd7CD56E3993d44A0d9c'
  }
}
const network = 'rinkeby';

function App() {
  const deployGenericScheme = async () => {
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

    // Get address from https://github.com/daostack/migration/blob/master/migration.json
    const votingMachineAddress = optionByNetwork[network].votingMachineAddress; // address of voting machine for a network, defaults to Genesis Protocol

    // For eg if you want this Generic Scheme to enable DAO to interact with Bounties Network
    // then targetContract would be the address of Bounties Network's respective contract
    const targetContractAddress = optionByNetwork[network].targetContractAddress; // contract generic scheme queries

    const avatar = optionByNetwork[network].daoAddress; // address of DAO

    // Following are example values, Please change appropriately
    // To get, see https://daotalk.org/t/how-to-use-the-scheme-registrar-in-alchemy/669
    // or https://github.com/edsonayllon/Alchemy-DAO-Scheme-Param-Hash-Generator
    // current parameters based on https://daotalk.org/t/the-contentious-genesis-parameter-delta/481
    const paramHash = "0xde924589f841ec9b5ea74a57f0063166c5330e7d40152ebb6d9b8c9f42a89254"

    const estimate = await genericScheme.methods.initialize(
      avatar,
      votingMachineAddress,
      paramHash,
      targetContractAddress
    ).estimateGas();

    // calls initialize method in generic scheme contract
    /// https://github.com/daostack/arc/blob/master/contracts/schemes/GenericScheme.sol
    const result = await genericScheme.methods.initialize(
      avatar,
      votingMachineAddress,
      paramHash,
      targetContractAddress
    ).send({ from, gas: estimate });
    console.log(result)
  }

  const deployUniversalScheme = async () => {
    const accounts = await window.ethereum.enable();
    const from = accounts[0];
    const gas = 2000000;
    const gasPrice = await web3.eth.getGasPrice();

    const uGenericScheme = new web3.eth.Contract(
      uGenericSchemeJson.abi,
      optionByNetwork[network].uGenericAddr, // address from https://github.com/daostack/migration/blob/master/migration.json
      {
        from,
        gas,
        gasPrice
      }
    )

    // Get address from https://github.com/daostack/migration/blob/master/migration.json
    const votingMachineAddress = optionByNetwork[network].votingMachineAddress; // address of voting machine for a network, defaults to Genesis Protocol

    // For eg if you want this Generic Scheme to enable DAO to interact with Bounties Network
    // then targetContract would be the address of Bounties Network's respective contract
    const targetContractAddress = optionByNetwork[network].targetContractAddress; // contract generic scheme queries

    // Following are example values, Please change appropriately
    // To get, see https://daotalk.org/t/how-to-use-the-scheme-registrar-in-alchemy/669
    // or https://github.com/edsonayllon/Alchemy-DAO-Scheme-Param-Hash-Generator
    // current parameters based on https://daotalk.org/t/the-contentious-genesis-parameter-delta/481
    const params = "0xde924589f841ec9b5ea74a57f0063166c5330e7d40152ebb6d9b8c9f42a89254";

    const paramHash = await uGenericScheme.methods.setParameters(
      params,
      votingMachineAddress,
      targetContractAddress
    ).call();

    console.log(paramHash);

    const result = await uGenericScheme.methods.setParameters(
      params,
      votingMachineAddress,
      targetContractAddress
    ).send();

    console.log(result);
  }

  useEffect(()=>{
    deployUniversalScheme();
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
