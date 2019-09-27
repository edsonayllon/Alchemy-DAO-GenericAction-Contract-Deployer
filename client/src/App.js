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
    daoAddress: '0x72939947e7a1c4ac94bb840e3304b322237ad1a8'
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
    // Refer https://daostack.zendesk.com/hc/en-us/sections/360000535638-Genesis-Protocol
    // current parameters based on https://daotalk.org/t/the-contentious-genesis-parameter-delta/481
    const voteParams = {
      "boostedVotePeriodLimit": 345600, // voting period, boosted votes are fast tracked
      "daoBountyConst": 10, // determines automatic downstaking value by multiplying by average
      "minimumDaoBountyGWei": 150000000000, // minimum amount of GEN a DAO will stake when automatically downstaking each proposal
      "queuedVotePeriodLimit": 2592000, // voting time for nonboosted proposals
      "queuedVoteRequiredPercentage": 50, // quorum to decide votes (nonboosted)
      "preBoostedVotePeriodLimit": 86400, // time proposal must be above boosted threshold before being boosted
      "proposingRepRewardGwei": 50000000000, // controls how much voting power someone who submits a proposal gains
      "quietEndingPeriod": 172800, // time votes need to stay the same to be considered the final result
      "thresholdConst": 1200, // controls rate of required confidence score for boosting rising as currently boosted proposals rises.
      "voteOnBehalf": "0x0000000000000000000000000000000000000000", // https://daotalk.org/t/how-to-use-the-scheme-registrar-in-alchemy/669 kept this as null address
      "votersReputationLossRatio": 4, // percentage lost if vote is against the final outcome for nonboosted
      "activationTime": 0 // time when proposing and voting is activated (unix)
    }

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
    const paramHash = genericScheme.methods.initialize(
      avatar,
      votingMachineAddress,
      voteParams,
      targetContractAddress
    ).call()

    console.log(paramHash)

    // calls initialize method in generic scheme contract 
    /// https://github.com/daostack/arc/blob/master/contracts/schemes/GenericScheme.sol
    genericScheme.methods.initialize(
      avatar,
      votingMachineAddress,
      voteParams,
      targetContractAddress
    ).send()
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
