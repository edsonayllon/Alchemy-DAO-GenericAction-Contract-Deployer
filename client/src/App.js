import React, {useEffect} from 'react';
import logo from './logo.svg';
import Web3 from 'web3';
import './App.css';
const genericSchemeJson = require('@daostack/arc/build/contracts/GenericScheme.json')
// From https://daostack.github.io/DAOstack-Hackers-Kit/gettingStarted/setupGenericScheme/

const web3 = new Web3(Web3.givenProvider);

function App() {
  const deployScheme = async () => {
    const accounts = await window.ethereum.enable();
    const from = accounts[0];
    const gas = 5000000;
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
    // Genesis DAO Decision https://daotalk.org/t/the-contentious-genesis-parameter-delta/481
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

    /*
    // Get address from https://github.com/daostack/migration/blob/master/migration.json
    const votingMachineAddress = "0xaddress-of-VotingMachine-of-DAO-on-given-network"

    // For eg if you want this Generic Scheme to enable DAO to interact with Bounties Network
    // then targetContract would be the address of Bounties Network's respective contract
    const targetContractAddress = "0xaddress-of-contract-this-will-interact-with"

    const avatar = "0xaddres-of-DAO"

    // paramHash will be useful in later step so lets log it
    const paramHash = genericScheme.methods.initialize(
      avatar,
      voteParams,
      votingMachineAddress,
      targetContractAddress
    ).call()

    console.log(paramHash)

    genericScheme.methods.initialize(
      avatar,
      voteParams,
      votingMachineAddress,
      targetContractAddress
    ).send()
    */
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
