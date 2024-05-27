import {PermissionsAndroid} from "react-native";
import {
  connect,
  initialize,
  startDiscoveringPeers,
  subscribeOnPeersUpdates,
} from "react-native-wifi-p2p"


export const initailizeP2P = () => {
  initialize() 
    .then(() => {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION)
    }) 
    .then(() => {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
    }) 
    .then(() => {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.NEARBY_WIFI_DEVICES)
    }) 
    .then((isInitializedSuccessfully) => {
      console.log('isInitializedSuccessfully: ', isInitializedSuccessfully)
    })
    .catch((err: any) => {
      console.log('initialization was failed. Err: ', err);
    });
}


