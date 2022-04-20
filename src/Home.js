import React from "react";
import './Home.css';
import { Box } from "@material-ui/core";
import card1 from "./images/card1.png";
import card2 from "./images/card2.png";
import card3 from "./images/card3.png";
import card4 from "./images/card4.png";
import background from "./images/background.jpeg";
import {  BrowserRouter as Router, Route, Switch,Link, Routes, useNavigate} from "react-router-dom";
import DripGardenTools from "./DripGardenTools";
import Scheduler from "./Scheduler";
import WalletConnectClient from "@walletconnect/client";
            




function Home(){
    const navigate =useNavigate();
    const connectwallet = async ()=>{
      const client = await WalletConnectClient.init({
        projectId: "c4f79cc821944d9680842e34466bfbd",
      });
      }
      
  


 return( 

    <div className="main">
              <div className="Intro"> 
              <div className="para">
              <p>
        Welcome to DewQ Crypto!<br/> We will never ask your seed phrase or private key, NEVER give those anywhere!
        </p>

              </div>

      </div>
  

     
        <div className="thegrid">


          <div className="box" >
          <img src={card1} onClick={()=> navigate('/DripGardenTools', { replace:true})} style={{cursor:"pointer"}} />
          </div>
          <div className="box" >
          <img src={card2}/>
          </div>

          <div className="box">
          <img src={card3}/>

          </div>
          <div className="box" >
          <img src={card4}/>
          </div>
     
        <div className="box"> 
        <img src={card3}/>

        </div>

        <div className="box" >
        <img src={card4}/>

        </div>

      </div> 
 
      
    </div> 








  );

}
export default Home;



