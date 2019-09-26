import React, {useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
const genericSchemeJson = require('@daostack/arc/build/contracts/GenericScheme.json')

// From https://daostack.github.io/DAOstack-Hackers-Kit/gettingStarted/setupGenericScheme/

function App() {
  const deployScheme = () => {
    
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
    const voteParams = {
      "boostedVotePeriodLimit": 345600,
      "daoBountyConst": 10,
      "minimumDaoBountyGWei": 150000000000,
      "queuedVotePeriodLimit": 2592000,
      "queuedVoteRequiredPercentage": 50,
      "preBoostedVotePeriodLimit": 86400,
      "proposingRepRewardGwei": 50000000000,
      "quietEndingPeriod": 172800,
      "thresholdConst": 1200,
      "voteOnBehalf": "0x0000000000000000000000000000000000000000",
      "votersReputationLossRatio": 4,
      "activationTime": 0
    }

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
  }

  useEffect(()=>{
    // deployScheme()
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
