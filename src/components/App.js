import { Tabs, Tab } from 'react-bootstrap'
import dBank from '../abis/dBank.json'
import React, { Component } from 'react';
import Token from '../abis/Token.json'
import dbank from '../dbank.png';
import Web3 from 'web3';
import './App.css';

//h0m3w0rk - add new tab to check accrued interest

class App extends Component {

  async componentWillMount() {
    await this.loadBlockchainData(this.props.dispatch)
  }

  async loadBlockchainData(dispatch) {

    if(typeof window.ethereum !== 'undefined'){ //2   //window.ethereum give metamask to connected matamask or not
      //assign to values to variables: web3, netId, accts
      const  web3=new  Web3(window.ethereum)     //1  // Web3 make the browser in to blockchain browser
      const netId = await web3.eth.net.getId()   //3   //get metamask network id
       console.log(netId)
       const accts = await web3.eth.getAccounts()  //4  //to connect the account address where your browser connected
       console.log(accts[0])
        
       
      //check if account is detected, then load balance&setStates, elsepush alert
      if(typeof accts[0]!=='undefined'){
        const balance= await web3.eth.getBalance(accts[0]) //5  // to get the balace pf this perticular account 
        console.log(balance)
        this.setState({account: accts[0], balance: balance, web3: web3})   //6  // add account ,balance ,web3 in to state variable
      }
      else{
        window.alert('please login with metamask')
      }
       
    //in try block load contracts
       try {
          //  connect token
      const token=new web3.eth.Contract(Token.abi, Token.networks[netId].address)   //7-  //web3.eth.Contract is for connect your contract to website .it take abi and current network token address
      // connect Bank
      const dbank=new web3.eth.Contract(dBank.abi, dBank.networks[netId].address)  //8- //web3.eth.Contract is for connect your contract to website .it take abi and current network dbank address
      const dBankAddress=dBank.networks[netId].address            // dbank address save in to variable
      console.log(dBankAddress)
      this.setState({token:token , dbank:dbank, dBankAddress: dBankAddress})     //9- //put all value into state variables
       } catch (error) {
          console.log('Error', error)
          window.alert('contracts not deployed to the current network')
       }
    
    }
      //if MetaMask not exists push alert
    else{
      window.alert('please install metamask')    //check if MetaMask exists

    }

    

  
  }

  async deposit(amount) {
    //check if this.state.dbank is ok
    if(this.state.dbank!=='undefined'){
      try{
        await this.state.dbank.methods.deposit().send({value: amount.toString(), from: this.state.account})
      } catch (e) {
        console.log('Error, deposit: ', e)
      }
    }
      //in try block call dBank deposit();
  }

  async withdraw(e) {

    e.preventDefault()
    if(this.state.dbank!=='undefined'){
      try{
        await this.state.dbank.methods.withdraw().send({from: this.state.account})
      } catch(e) {
        console.log('Error, withdraw: ', e)
      }
    }
    //prevent button from default click
    //check if this.state.dbank is ok
    //in try block call dBank withdraw();
  }
   

  constructor(props) {
    super(props)
    this.state = {
      web3: 'undefined',
      account: '',
      token: null,
      dbank: null,
      balance: 0,
      dBankAddress: null
    }
  }

  render() {
    return (
      <div className='text-monospace'>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href=" "
            target="_blank"
            rel="noopener noreferrer"
          >
        <img src={dbank} className="App-logo" alt="logo" height="32"/>
          <b>dBank</b>
        </a>
        </nav>
        <div className="container-fluid mt-5 text-center">
        <br></br>
          <h1>Welcome to Bank</h1>
          <h2>{this.state.account}</h2>
          <br></br>
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
              <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
              <Tab eventKey="deposit" title="Deposit">
                  <div>
                  <br></br>
                    How much do you want to deposit?
                    <br></br>
                    (min. amount is 0.01 ETH)
                    <br></br>
                    (1 deposit is possible at the time)
                    <br></br>
                    <form onSubmit={(e) => {
                      e.preventDefault()
                      let amount = this.depositAmount.value
                      amount = amount * 10**18 //convert to wei
                      this.deposit(amount)
                    }}>
                      <div className='form-group mr-sm-2'>
                      <br></br>
                        <input
                          id='depositAmount'
                          step="0.01"
                          type='number'
                          ref={(input) => { this.depositAmount = input }}
                          className="form-control form-control-md"
                          placeholder='amount...'
                          required />
                      </div>
                      <button type='submit' className='btn btn-primary'>DEPOSIT</button>
                    </form>

                  </div>
                </Tab>
                <Tab eventKey="withdraw" title="Withdraw">
                  <br></br>
                    Do you want to withdraw + take interest?
                    <br></br>
                    <br></br>
                  <div>
                    <button type='submit' className='btn btn-primary' onClick={(e) => this.withdraw(e)}>WITHDRAW</button>
                  </div>
                </Tab>
                 
              </Tabs>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;