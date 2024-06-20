import {PermissionsAndroid} from "react-native";
import {
  connect,
  initialize,
  startDiscoveringPeers,
  subscribeOnPeersUpdates,
  createGroup,
  connectWithConfig
} from "react-native-wifi-p2p"
import {TCPServer} from "../sockets/server";
import WifiManager from "react-native-wifi-reborn";


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

export const discoverPeers = () => {
  startDiscoveringPeers()
    .then(() => {
      console.log('Starting of discovering was successful')
    })
    .catch(err => {
      console.error(`Something is gone wrong. Maybe your WiFi is disabled? Error details: ${err}`)
      console.log(err);
    });
}


//TODO when its is disconnected make server = undefined.
//TODO publish service here.
let server:TCPServer|undefined = undefined;
export const connectToPeers = (peers:any, setPeers:any)=>{

//export const connectToPeers = ()=>{
  console.log("im here")

  const subscription = subscribeOnPeersUpdates(({ devices }) => {
    console.log(`New devices available: ${devices}`);
    //setPeers(devices)

    console.log(devices);
    try {
      if(devices[0] !== undefined){

      
        //connectWithConfig({
          //deviceAddress:devices[0].deviceAddress,
          //groupOwnerIntent:15
        //})
      connect(devices[0].deviceAddress)
        .then(() => {
        //if (server === undefined){
          //WifiManager.getIP()
          //.then(( val)=> {

            //console.log("my Val ", val);
            //server = new TCPServer(7070, val);
            //server.start();
            console.log('Successfully connected hopfully !');
          //})
          //.catch( (err)=>{
            //console.log("Error in creating TcpServer: ", err);
          //});
        //}
      }).catch( (e)=>{
        console.log("Could not Connect:" );
        console.log(e);
      } )
      }    //.catch( (a:any) => console.log("Error: here") );
    }catch(e){
      console.log("Error: can not connect to the Peer using P2P");
      console.log(e);
    }
  });

  return subscription;
}


