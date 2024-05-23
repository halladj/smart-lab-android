import {NavigationContainer} from "@react-navigation/native";
import React, {useCallback, useEffect, useState}  from "react";
import {BottomTabs} from "./screens/BottomTabs.navigator";
import { AppProvider } from "./App.provider";
import { StatusBar } from 'expo-status-bar';
import * as Location from 'expo-location';
import WifiManager from "react-native-wifi-reborn";
import { ActivityIndicator, PermissionsAndroid, StyleSheet, Text, View } from 'react-native';
import {TCPServer} from "./sockets/server";
import {
  connect,
  initialize,
  startDiscoveringPeers,
  subscribeOnPeersUpdates,
} from "react-native-wifi-p2p"


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
  const [permissions, setPermissions] = useState<boolean>(); 
  const [ip, setIp]                   = useState<string>("")
  


  const p2p_intialization = useCallback( ()=> {
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
      .catch((err: any) => console.log('initialization was failed. Err: ', err));
  },[]);

  const locationPermission = useCallback( ()=>{
    Location.enableNetworkProviderAsync()
      .then(()=>{
        console.log("Started The service !!!");

        WifiManager.isEnabled()
          .then((status:boolean) => {
            console.log(`the wifi staus is = ${status}`);
            if(status !== true){
              //TODO make this a Promise.
              //WifiManager.setEnabled(true);
            }
            //TODO get ip address
            
            WifiManager.getIP()
            .then((value)=>{
              console.log(value);

              const a:string = value;
              setIp(a);
            })
            .catch((err => console.log("Error retreiving ip address, ", err)));
            const server= new TCPServer(7070, ip);
            server.start()
          })
          .catch(()=>{
            console.log(`Something wrong happened while Disconnecting wifi`);
          });

        
        startDiscoveringPeers()
          .then(() => {
            console.log('Starting of discovering was successful')
          })
          .catch(err => {
            console.error(
              `Something is gone wrong. Maybe your WiFi is disabled? Error details: ${err}`)}
          );
        setPermissions(true);
      })
      .catch((err) => {
        //TODO: redirect to a page that asks fot permissions to be turened on.
        console.error("could not provide the permissions" );
      });
  },[ip]);


  useEffect(()=>{
    p2p_intialization();
    locationPermission();
    
    const subscription = subscribeOnPeersUpdates(({ devices }) => {
      devices.map( (device) => {
        WifiManager.getBSSID()
        .then( (bssid:string) =>{
          WifiManager.disconnectFromSSID(bssid)
          .then(()=>{ console.log(`Disconnected from ${bssid} successfuly`) })
          .catch(()=>{ console.log(`could not disconnect from ssid:${bssid}`) });
        })
        .catch(()=>{console.log("can not get current ssid")});

        connect(device.deviceAddress)
          .then(() => {
            subscription.remove();
            console.log('Successfully connected')
          })
          .catch(( err:Error ) => console.error('Something gone wrong. Details: ', err));
      })
      console.log(`New devices available: ${devices[0].deviceName}`);
    });

  },[]);

  //const client = new TCPClient('192.168.1.18', 7070);
  //console.log(client)
  //client.connect();
  //
  //

  if (!permissions){
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }


  return (
    <AppProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <BottomTabs/>
      </NavigationContainer>
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
