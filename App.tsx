import {NavigationContainer, DefaultTheme} from "@react-navigation/native";
import React, {useCallback, useEffect, useState}  from "react";
import {BottomTabs} from "./src/screens/BottomTabs.navigator";
import { AppProvider } from "./src/App.provider";
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, EmitterSubscription,  PermissionsAndroid,  StyleSheet,  View } from 'react-native';
import {connectToPeers, discoverPeers, initailizeP2P} from "./src/utility/peer-to-peer";
import {handleLocationPermissions} from "./src/utility/permissions";
import {LocationChcker} from "./src/components/LocationChecker";
import {WifiChcker} from "./src/components/WifiChcker";


export default function App() {
  const [ip, setIp]                   = useState<string>("")
  

  const [locatoinCurrentValue, setLocationCurrentValue] = useState<boolean>(false);
  const [wifiCurrentValue, setWifiCurrentValue]         = useState<boolean>(false);
  const [newPeerSubscription, setNewPeerSubscription]   = useState<EmitterSubscription>();
  const [peers, setPeers]                               = useState<any>();


  useEffect(()=>{

    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      {
        'title': 'Access to wi-fi P2P mode',
        'message': 'ACCESS_COARSE_LOCATION',
        buttonPositive:""
      }
    )
    .then(granted => {
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("You can use the p2p mode")
    } else {
      console.log("Permission denied: p2p mode will not work")
    }
    }).catch(()=>console.log("Error: Permission denied"));

    // handle regualr wifi.

  },[]);

  
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

    return (
    <AppProvider>
      <NavigationContainer theme={MyTheme}>
        <StatusBar style="auto" />
        <BottomTabs />
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

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'black',
  },
};
