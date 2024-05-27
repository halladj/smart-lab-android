import React from "react";
import { Text } from "react-native";
import WifiManager from "react-native-wifi-reborn";

interface WifiChckerProps {
  wifiCurrentValue: boolean, 
  setWifiCurrentValue: any
}

export const WifiChcker: 
  React.FC<WifiChckerProps> = ({wifiCurrentValue, setWifiCurrentValue}) => {

  const intervalId = setInterval( ()=>{
      if (wifiCurrentValue){
        clearInterval(intervalId);
      }
      WifiManager.isEnabled()
      .then((val) => setWifiCurrentValue(val))
      .catch( (e) => console.log("Error in checking location value"));
    }, 300);

    return(
      <Text>Turn on Wifi Service Please</Text>
    );
}
