import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from "react";
import { Home } from "./Home.screen";
import { Page2 } from "./Page2.screen";
import { Page3 } from "./Page3.screen";
import {Collaboration} from "./Collaboration.screen"
import { Authentication } from "./Authentication.screen";
import {RootStackParamsList} from "../types/Types";



const BottomTab = createBottomTabNavigator<RootStackParamsList>();
const Stack = createNativeStackNavigator<RootStackParamsList>();

export const BottomTabs: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false }}
    >
      
      <Stack.Screen name="Main">
        { () => (

        <BottomTab.Navigator initialRouteName="Home">
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
