import * as Location from 'expo-location';
import WifiManager from "react-native-wifi-reborn";


export function handleLocationPermissions (setLocationValue: any){
  Location.enableNetworkProviderAsync()
    .then( ()=> {
      console.log("Checking the GeoLocatoin");
      setLocationValue(true);
    })
    .catch ( (e) => {
      console.log("Error in setting the GeoLocation on: ", e);
      setLocationValue(false);
    });
}


export function handleWifiPermissions (setwifiValue:any){
  WifiManager.isEnabled()
  .then(()=> {
      console.log("Checking the Wifi Status");
      setwifiValue(true);
    })
  .catch( (e) => {
      console.log("Error in setting the Wifi Status on: ", e);
      setwifiValue(false);
  });
}

