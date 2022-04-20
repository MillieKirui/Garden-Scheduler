import './garden.css';
import Web3 from 'web3';
import React,  {useEffect, useState} from 'react';
import { ABI } from './contracts/contractABI';
import { $Contract, $Contract_LP } from './contracts/contract';
import Scheduler from './Scheduler';
import axios from 'axios';
import {WalletLinkConnector} from "@web3-react/walletlink-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { InjectedConnector } from "@web3-react/injected-connector";
import { useWeb3React } from '@web3-react/core'


const Injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42]
 });

const $PCS_API = "https://api.pancakeswap.info/api/v2/tokens/";

function DripGardenTools() {
  
    
const [user, setUser] = useState({
    wallet: null,
    walletexits: false,
      plants: 1,
      seeds: 3000000
    
  })

  const [data, setData] = useState({
    user_lp: 0,
    user_lp_per_day: 0,
    user_balance: 0,
    rate_plant_lp: 0,
    contract_balance: 0,
    seeds_per_plant: 2592000,
    seeds_per_day: 0,
    plant_per_day:0,
    plants_ready: 0,
    seeds_lost: 0,
    seeds_needed: 0,
    plant_next_date: [],
    plant_full_minute: 0,
    license: {},
      log: []

  })

  const [drip_busd, setdrip_busd ] = useState({
      step_calc: 0,
        price: 0,
        busd_price: 0,
        busd_reserve: 0,
        drip_price: 0,
        drip_reserve: 0,
        supply: null,
        lp_ratio: 0

  })

 
  useEffect(()=>{
    
    updatedrip_busd()
    

  },[])
  

  // const checkWallet= (e)=>{
  //   console.log(e.target.value)
  //   const walletadd = e.target.value
  //   let address = walletadd.replaceAll(" ", "");
    
  //   if ( address.length != 42 || address.indexOf("0x") == -1) {alert('Input correct address'); }
  //   setUser(prevState => ({
  //     ...prevState,
  //       wallet: account,
  //       walletexits:true   
  //  }
  //  ));
  
      
  // }

  const updatedrip_busd = async()=> {

  const thecontract_balance = await $Contract.methods.getBalance().call()
  let balanceinEth = Web3.utils.fromWei(thecontract_balance, 'ether')
  let truncatedbalance =  Math.trunc(balanceinEth);

  let seedsell = await $Contract.methods.calculateSeedSell(2592000).call()  
  let rate_plant_lpp =(seedsell * 0.95)/1000000000000000000
  console.log(rate_plant_lpp)



  let getsupply = await $Contract_LP.methods.totalSupply().call() 
  let lsupply = parseFloat (Web3.utils.fromWei(getsupply, 'ether')).toFixed(18)
  //let vsupply = {supply:lsupply}
  
    //console.log(lsupply)
    /*
    setdrip_busd(prevState => ({
      ...prevState,
      ...vsupply     
   }
   )); */
   //console.log(drip_busd.supply)
    
    let gettingreserve = await $Contract_LP.methods.getReserves().call() 

      //if (error) { console.log(error); return false; };
   
        let drip_reserve = parseFloat(gettingreserve._reserve0)/1000000000000000000
        
        console.log(drip_reserve)
        let busd_reserve =parseInt(gettingreserve._reserve1)/1000000000000000000
        console.log(busd_reserve )
        //step_calc:+1
       
   
     //console.log(drip_busd.busd_reserve)
          //if (drip_busd.step_calc == 4) { calcDripBusd(); }
    //});

      let tokens = await $Contract_LP.methods.token0().call() 
      //if (error) { console.log(error); return false; };  

      let tkns = await axios.get($PCS_API + tokens)
      console.log(tkns)
     let  drip_price= parseFloat(tkns.data.data.price)
     console.log(drip_price)
       /*
        setdrip_busd(prevState => ({
          ...prevState,
          ),
        step_calc:+1
         
       }
       )); 
       
        if (drip_busd.step_calc == 4) { calcDripBusd(); }
      });
    });
*/
    let  token = await $Contract_LP.methods.token1().call() 
    console.log(token)
      //if (error) { console.log(error); return false; };
      let tttokens = await axios.get($PCS_API + token)
      console.log(tttokens)
      let busd_price = parseFloat(tttokens.data.data.price)
      console.log(busd_price)
       /* setdrip_busd(prevState => ({
          ...prevState,
        busd_price: parseFloat(data.data.price),
        step_calc:+1
         
       }
       )); 
        if (drip_busd.step_calc == 4) { calcDripBusd(); }
      });
    });
*/
    let lp_ratio = 1 / lsupply
    console.log(drip_reserve)
    let Price = (drip_reserve * lp_ratio * drip_price)
      + (busd_reserve * lp_ratio * busd_price);
      console.log(Price)

  
    setdrip_busd(prevState => ({
      ...prevState,
      supply:lsupply,
      price:Price,
      


   }
   ));
  
  //console.log(drip_busd.supply)
  setData(prevState=>({
    ...prevState,
    contract_balance: truncatedbalance,
    rate_plant_lp: rate_plant_lpp



  }));
 
  }
  const { activate, deactivate } = useWeb3React();
    const { active, chainId, account, networkName } = useWeb3React();
    const { library } = useWeb3React();

// example of switching or adding network with Harmony Mainnet
const switchNetwork = async () => {
   try {
     await library.provider.request({
       method: "wallet_switchEthereumChain",
       params: [{chainId: "0x38"  }],
     });
   } catch (switchError) {
     
     // 4902 error code indicates the chain is missing on the wallet
     if (switchError.code === 4902) {
       try {
         await library.provider.request({
           method: "wallet_addEthereumChain",
           params: [
             {
              chainId: `0x38`,
              chainName: "Binance Smart Chain Mainnet",
              nativeCurrency: {
                name: "Binance Chain Native Token",
                symbol: "BNB",
                decimals: 18,
                rpcUrls: [
                  "https://bsc-dataseed1.binance.org",
                  "https://bsc-dataseed2.binance.org",
                  "https://bsc-dataseed3.binance.org",
                  "https://bsc-dataseed4.binance.org",
                  "https://bsc-dataseed1.defibit.io",
                  "https://bsc-dataseed2.defibit.io",
                  "https://bsc-dataseed3.defibit.io",
                  "https://bsc-dataseed4.defibit.io",
                  "https://bsc-dataseed1.ninicoin.io",
                  "https://bsc-dataseed2.ninicoin.io",
                  "https://bsc-dataseed3.ninicoin.io",
                  "https://bsc-dataseed4.ninicoin.io",
                  "wss://bsc-ws-node.nariox.org"
                ],
                blockExplorerUrls: ["https://bscscan.com"]

              }
            }
           ]
         });
       } catch (error) {
         console.log(error)

       }
     }
   }
 };
 console.log(account)
 setUser(prevState=>({
  ...prevState,
  wallet: account,
  walletexits:true 

}));

  
  return (
    <div>
      {user.walletexits 
      ?<header className="App-header">
           DRIP GARDERN SCHEDULER
            </header>  
      :   <div className='head'>
            <div className='title'>
            Welcome!
            Please paste your PUBLIC wallet address in the field below and click anywhere after.
            This is a read only application, NO wallet connection or transaction involved. We will never ask your seed phrase or private key, NEVER give those anywhere!
            </div>
            <div className="connect"> 
            <button onClick={() => { activate(Injected) }}>Metamask connection</button>
            <button onClick={deactivate}>Disconnect</button>

              </div>

         
          </div> 
          
      }
  
       
   <table className="hometable">
     <tbody>
       <tr>



           <td id='fcolumn'>Contract Balance</td>
           <td id='tcolumn'>{data.contract_balance}LP</td>
           <td id='tcolumn'>DRIP/BUSD <br/>{drip_busd.price.toFixed(4)}</td>

       </tr>

       <tr>
           <td id='fcolumn'> 1 Plant Info</td>
           <td id='tcolumn'>{data.seeds_per_plant}  seeds make 1 Plant <br/> 1 plant produces 86.4k seeds / day</td>
           <td id='tcolumn'>2.592M seeds =<br/>{((data.rate_plant_lp)*(drip_busd.price)).toFixed(2) }$ = {data.rate_plant_lp.toFixed(3)}LP</td>
       </tr>
       
       <tr > 
           <td id='fcolumn' className='balance'>Wallet Address</td>
           {/* <td id='tcolumn' className='balance'><input onChange={checkWallet} /></td> */}
           <td id='tcolumn' className='balance'>Balance</td>
       </tr>
       </tbody>

   </table>
   <div>Connection Status: ${active}</div>
    <div>Account: ${account}</div>
    <div>Network ID: ${chainId}</div>
    <div>{networkName}</div>
  
  

   {user.walletexits ? <Scheduler collecteddata = {{busd_price:drip_busd.price, rate_plant_lp: data.rate_plant_lp, wallet: user.wallet}}/> : null}

   </div>
   
   

    

    
   
  );

  }


export default DripGardenTools;
