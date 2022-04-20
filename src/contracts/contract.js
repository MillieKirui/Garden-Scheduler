import Web3 from "web3";
import { $ABI } from "./contractABI";
import { $ABI_LP } from "./LP_ABI";



var $WEB3 = new Web3(new Web3.providers.HttpProvider("https://bsc-dataseed1.defibit.io:443"));
var $Contract = new $WEB3.eth.Contract($ABI, "0x685BFDd3C2937744c13d7De0821c83191E3027FF");
var $Contract_LP = new $WEB3.eth.Contract($ABI_LP, "0xa0feB3c81A36E885B6608DF7f0ff69dB97491b58");


export {$WEB3, $Contract, $Contract_LP}