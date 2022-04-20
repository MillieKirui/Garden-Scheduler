import React from "react";
import './garden.css';
import Web3 from "web3";
import { ABI } from './contracts/contractABI';
import { $Contract, $Contract_LP } from './contracts/contract';
import moment from "moment";


function Scheduler(props){

   

  const [user, setUser] = React.useState({
      wallet: props.collecteddata.wallet,
      plants: 1,
      seeds: 3000000
    
  })

     const [data, setData] = React.useState({
      user_lp: 0,
      user_lp_per_day: 0,
      user_balance: 0,
      rate_plant_lp: props.collecteddata.rate_plant_lp,
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
     const [drip_busd, setdrip_busd ] = React.useState({
      step_calc: 0,
        price: props.collecteddata.busd_price,
        busd_price: 0,
        busd_reserve: 0,
        drip_price: 0,
        drip_reserve: 0,
        supply: null,
        lp_ratio: 0

  })

  
  React.useEffect(()=>{
    
    getdata()
    

  },[])




    




  const getdata = async () =>{
    //get contract balance
    const thecontract_balance = await $Contract.methods.getBalance().call()
    let balanceinEth = Web3.utils.fromWei(thecontract_balance, 'ether')
   let truncatedbalance =  Math.trunc(balanceinEth);
    console.log(truncatedbalance);

    //get wallet address balance

    let walletbalance = await $Contract_LP.methods.balanceOf(user.wallet).call()
    const dwalletbalance = parseFloat(walletbalance).toFixed(2)
    console.log(walletbalance)
//plants
    let userplants = await $Contract.methods.hatcheryPlants(user.wallet).call()
    console.log(userplants)
    
    let uselpperday = await $Contract.methods.calculateSeedSell(parseFloat(userplants) * 86400).call()
     let user_lp_per_dayy = ( parseFloat(uselpperday)* 0.95)/1000000000000000000

    //seeds per day
    let seedsperday = userplants * 86400
    console.log(seedsperday)


    //seeds per plant

    let seedsperplant = await $Contract.methods.SEEDS_TO_GROW_1PLANT().call()
        console.log(seedsperplant)
    //seeds lost

    
    // user seeds
  let userseeds = await $Contract.methods.getUserSeeds(user.wallet).call()
    
    console.log(userseeds)

    // seeds ready
    let planstsready = Math.floor(userseeds / seedsperplant)
   
    console.log(planstsready)
  
//seeds lost
   let seedslost = userseeds - (planstsready * seedsperplant)
   console.log(seedslost)

   // seeds needed
 let seedsneeded = seedsperplant - seedslost
   console.log(seedsneeded)

//seeds available

let userlp = await  $Contract.methods.calculateSeedSell(userseeds).call()
     let etheruserlp =  Web3.utils.fromWei(userlp, 'ether');
     let calculateduserlp = etheruserlp * 0.95
     const cuserlp = parseFloat(calculateduserlp).toFixed(3)

  //

  let  seeds_per_minute = (seedsperday / 24) / 60;
  let plant_next_minute = (seedsneeded) / (seeds_per_minute);
  let plant_full_minute = seedsperplant / seeds_per_minute;

  


    setData(prevState => ({
      ...prevState,
        
      contract_balance: truncatedbalance,
      user_balance : dwalletbalance,
      seeds_per_day: seedsperday,
      seeds_per_plant: seedsperplant,
      seeds_lost: seedslost,
      seeds_needed: seedsneeded,
      plants_ready: planstsready,
      user_lp: cuserlp,
      user_lp_per_day: user_lp_per_dayy,
      plant_full_minute
       
   }
   ));

   setUser(prevState => ({
    ...prevState,
      plants: userplants,
      seeds: userseeds
   
     
 }
 ));
 
  }

  function hourToTime(hour) {
    let days = moment.duration(hour, 'hours').days() + "d ";
    if (days == "0d ") { days = ""; };
    let min = moment.duration(hour, 'hours').minutes();
    if (min <= 9) { min = "0" + min; }
    return days + moment.duration(hour, 'hours').hours() + ":" + min;
  }




    return(
     
      <table className="hometable">
      
               <tbody>
               <tr>
                 <td id='fcolumn' className='balance'></td>
                 <td id='tcolumn' className='balance'></td>
                 <td id='tcolumn' className='balance'><br/>{data.user_balance}LP {((drip_busd.price)* (data.user_balance)).toFixed(2)}$</td>
      
               </tr>
      
              
               <tr>
                 <td id='fcolumn'>Plants grown</td>
                 <td id='tcolumn'>{user.plants}</td>
                 <td id='tcolumn'>Assets  {(parseFloat(user.plants)* parseFloat(data.rate_plant_lp)* parseFloat(drip_busd.price)).toFixed(2)}$</td>
      
               </tr>
               <tr>
                 <td id='fcolumn'>Seeds Available</td>
                 <td id='tcolumn'>{user.seeds}</td>
                 <td id='tcolumn'>Growing <br/>{data.user_lp}LP <br/> { ((drip_busd.price)*(data.user_lp)).toFixed(2)}$</td>
      
               </tr>
      
               <tr>
                 <td id='fcolumn'>Plants/day Your production</td>
                 <td id='tcolumn'>{((data.seeds_per_day)/(data.seeds_per_plant)).toFixed(3)} <br/>{hourToTime(data.plant_full_minute/60)}</td>
                 <td id='tcolumn'>By day  {((drip_busd.price)*(data.user_lp_per_day)).toFixed(2)} $ <br/> {(data.user_lp_per_day).toFixed(3)} LP</td>
                 
      
               </tr>
      
               <tr>
                 <td id='fcolumn'>Seeds/day</td>
                 <td id='tcolumn'>{data.seeds_per_day}</td>
                 
      
               </tr>
      
               <tr>
                 <td id='fcolumn'>Seeds needed For next plant</td>
                 <td id='tcolumn'>{data.seeds_needed}<br/>Next in { hourToTime((data.seeds_needed / (data.seeds_per_day/24))) }</td>
                
      
               </tr>
      
               <tr>
                 <td id='fcolumn'>Seeds lost if planted now</td>
                 <td id='tcolumn'>-{data.seeds_lost}</td>
               
      
               </tr>
      
               <tr>
                 <td id='fcolumn'>Plants ready </td>
                 <td id='tcolumn'>{data.plants_ready}</td>
                 
      
               </tr>
      
               <tr>
                 <td id='fcolumn'>Next Plants Schedule</td>
                 <td id='tcolumn'></td>
                 
      
               </tr>
      
      
      
               </tbody>
      
      
             </table>

    );



}
export default Scheduler;