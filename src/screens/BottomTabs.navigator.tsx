import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, {useContext, useEffect, useState} from "react";
import { Home } from "./Home.screen";
import { Page2 } from "./Page2.screen";
import { Page3 } from "./Page3.screen";
import {Collaboration} from "./Collaboration.screen"
import { Authentication } from "./Authentication.screen";
import {RootStackParamsList} from "../types/Types";
import {AppContext} from "../App.provider";
import { Text } from "react-native";
import {HomeIcon} from "../components/HomeIcon";
import {QrScannerIcon} from "../components/QrScannerIcon";
import {NotificationIcon} from "../components/NotificationIcon";




const BottomTab = createBottomTabNavigator<RootStackParamsList>();
const Stack = createNativeStackNavigator<RootStackParamsList>();


export const BottomTabs: React.FC = () => {

  const { zeroconf, agent }     = useContext(AppContext)
  //const [mainPage, setMainPage] = useState<"Home" | "QrScanner">("QrScanner");


  return (
    <Stack.Navigator
      initialRouteName="Main"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen  name="Main">
        { () => (
        <BottomTab.Navigator
          screenOptions = { ({ route }) => ({    
            tabBarIcon: ({ color, size }) => {      

              if (route.name === 'Home') {        
                return <HomeIcon color={color}/>;      
              }
              if (route.name === 'QrScanner') {        
                return <QrScannerIcon color={color}/>;      
              }
              if (route.name === 'Page3') {        
                return <NotificationIcon color={color}/>;      
              }
              return null;    
            },  
          })}
          initialRouteName= {"Home"}>
          <BottomTab.Screen name="Page3"   component= { Page3 }  />
          <BottomTab.Screen name="Home"   component= {Home}  />
          <BottomTab.Screen name="QrScanner"   component= { Page2 }  />
        </BottomTab.Navigator>
        )}
      </Stack.Screen>
      <Stack.Screen 
          name="Collaboration" 
          component={Collaboration} 
          initialParams = {{actionName:"", host:""}}/>
      {
      <Stack.Screen name="Authentication" component={Authentication} />
      }
    </Stack.Navigator>
  )
};
