import React from "react";
import { Text } from "react-native";
import * as Location from 'expo-location';


interface LocationChckerProps {
  locatoinCurrentValue: boolean, 
  setLocationCurrentValue: any
}

export const LocationChcker: 
  React.FC<LocationChckerProps> = ({locatoinCurrentValue, setLocationCurrentValue}) => {

  const intervalId = setInterval( ()=>{
      if (locatoinCurrentValue){
        clearInterval(intervalId);
      }
      Location.hasServicesEnabledAsync()
      .then((val) => setLocationCurrentValue(val))
      .catch( (e) => console.log("Error in checking location value"));
    }, 300);

    return(
      <Text>Turn on Location Service Please</Text>
    );
}
