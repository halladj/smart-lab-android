import {NavigationContainer} from "@react-navigation/native";
import React, {useCallback, useEffect, useState}  from "react";
import {BottomTabs} from "./screens/BottomTabs.navigator";
import { AppProvider } from "./App.provider";
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, PermissionsAndroid, StyleSheet, Text, View } from 'react-native';
import {TCPServer} from "./sockets/server";
import {
  connect,
  initialize,
  startDiscoveringPeers,
  subscribeOnPeersUpdates,
} from "react-native-wifi-p2p"
import {initailizeP2P} from "./utility/peer-to-peer";
import {handleLocationPermissions, handleWifiPermissions} from "./utility/permissions";
import {LocationChcker} from "./components/LocationChecker";
import {WifiChcker} from "./components/WifiChcker";


//const wifiPromise: Promise<number> = new Promise((resolve, reject) => {
  //WifiManager.setEnabled(true);
  //WifiManager.isEnabled()
  //.then( (value:boolean) => {
    //if (value === true){
      //resolve(1);
    //}else {
      //reject(0);
    //}
  //});
//});


export default function App() {
  const [ip, setIp]                   = useState<string>("")
  

  const [locatoinCurrentValue, setLocationCurrentValue] = useState<boolean>(false);
  const [wifiCurrentValue, setWifiCurrentValue]         = useState<boolean>(false);

  const p2p_intialization = useCallback( ()=> {
    initailizeP2P();
  },[]);

  //const locationPermission = useCallback( ()=>{
        //startDiscoveringPeers()
          //.then(() => {
            //console.log('Starting of discovering was successful')
          //})
          //.catch(err => {
            //console.error(
              //`Something is gone wrong. Maybe your WiFi is disabled? Error details: ${err}`)}
          //);
        //setPermissions(true);
      //})
      //.catch((err) => {
        ////TODO: redirect to a page that asks fot permissions to be turened on.
        //console.error("could not provide the permissions" );
      //});
  //},[ip]);


  useEffect(()=>{
    handleLocationPermissions(setLocationCurrentValue);
    //handleWifiPermissions(setWifiCurrentValue);
    
    //const subscription = subscribeOnPeersUpdates(({ devices }) => {
      //devices.map( (device) => {
        //WifiManager.getBSSID()
        //.then( (bssid:string) =>{
          //WifiManager.disconnectFromSSID(bssid)
          //.then(()=>{ console.log(`Disconnected from ${bssid} successfuly`) })
          //.catch(()=>{ console.log(`could not disconnect from ssid:${bssid}`) });
        //})
        //.catch(()=>{console.log("can not get current ssid")});

        //connect(device.deviceAddress)
          //.then(() => {
            //subscription.remove();
            //console.log('Successfully connected')
          //})
          //.catch(( err:Error ) => console.error('Something gone wrong. Details: ', err));
      //})
      //console.log(`New devices available: ${devices[0].deviceName}`);
    //});

  },[]);

  //const client = new TCPClient('192.168.1.18', 7070);
  //console.log(client)
  //client.connect();
  //

  
  if( !locatoinCurrentValue ){
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <LocationChcker 
              locatoinCurrentValue ={locatoinCurrentValue}
              setLocationCurrentValue = {setLocationCurrentValue}
            />
      </View>
    );
  }


  if( !wifiCurrentValue){
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <WifiChcker
              wifiCurrentValue ={wifiCurrentValue}
              setWifiCurrentValue = {setWifiCurrentValue}
            />
      </View>
    );
  }

  if(wifiCurrentValue && locatoinCurrentValue){

    p2p_intialization();
    return (
    <AppProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <BottomTabs/>
      </NavigationContainer>
    </AppProvider>
    );
  }
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
