import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from "react";
import { Home } from "./Home.screen";
import { Page2 } from "./Page2.screen";
import { Page3 } from "./Page3.screen";
import {Collaboration} from "./Collaboration.screen"
import { Authentication } from "./Authentication.screen";



const BottomTab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export const BottomTabs: React.FC = () => {
  return (
    <Stack.Navigator
      //initialRouteName="Home"
      initialRouteName="Authentication"
      screenOptions={{ headerShown: false }}
    >
      
      <Stack.Screen name="Main">
        { () => (

        <BottomTab.Navigator>
        
          <BottomTab.Screen name="Home"     component= { Home }     />
          <BottomTab.Screen name="Page 2"   component= { Page2 }  />
          <BottomTab.Screen name="Page 3"   component= { Page3 }  />
      
        </BottomTab.Navigator>
        )}
      </Stack.Screen>
      <Stack.Screen name="Collaboration" component={Collaboration} />
      <Stack.Screen name="Authentication" component={Authentication} />

    </Stack.Navigator>
  )
};
