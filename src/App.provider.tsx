import React from "react";
import Zeroconf from 'react-native-zeroconf';
import { Agent, State } from "./types/Agent"
import { SafeAreaView } from "react-native-safe-area-context";

// TODO 0: manage wifi-direct.
//
// TODO 1: put a zeroconf object.
//  >>  DONE: Success.
//
// TODO 2: put a Agent into the context.
//

type AppContextType = {
  zeroconf: Zeroconf;
  agent   : Agent;
}


const defaultValue = {
  zeroconf: new Zeroconf(),
  agent   : new Agent("hamza-mobile"),
};

export const AppContext = React.createContext<AppContextType>(defaultValue);

export const AppProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (

    <AppContext.Provider value= {{ 
      zeroconf:new Zeroconf(), 
      agent: new Agent("192.168.1.15"),
      //agent: new Agent("hamza-mobile") 
      }}>
      { children }
    </AppContext.Provider>
  );
}
