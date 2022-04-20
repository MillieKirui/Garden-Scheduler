import React from "react";
import './App.css';
import {  BrowserRouter as Route,Routes, useNavigate} from "react-router-dom";
import Home from "./connector";
import DripGardenTools from "./DripGardenTools";
import Scheduler from "./Scheduler";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { $WEB3 } from "./contracts/contract";

const provider = $WEB3;


   
function App(){

  
return(
   
  <div>
    
    <Routes>
    
    <Route path="/" element={<Home/>}/>
    
    <Route path="/DripGardenTools" element={<DripGardenTools/>}/>
    <Route path="/Scheduler" element={<Scheduler/>}/>
   

    </Routes>
    
       


     </div>
 
  


   
  


   

  );

}
export default App;



