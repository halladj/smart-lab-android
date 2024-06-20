import React, {useCallback, useEffect, useState} from "react";
import Zeroconf from 'react-native-zeroconf';
import { Agent } from "./types/Agent"
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {ServiceDescriptor} from "./types/Types";
import EventEmitter, {EmitterSubscription} from "react-native/Libraries/vendor/emitter/EventEmitter";
import {TCPServer} from "./sockets/server";
import {connectToPeers} from "./utility/peer-to-peer";

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
  server  : TCPServer | null;
}

const defaultValue = {
  zeroconf: new Zeroconf(),
  agent   : new Agent("hamza-mobile"),
  server  : null
};

export const AppContext = React.createContext<AppContextType>(defaultValue);
export const AppProvider: React.FC<React.PropsWithChildren> = ({ children }) => {

  
  const [data, setData] = useState<any>("");
  const [zeroconf, _]   = useState<any>(new Zeroconf());
  

  useEffect( ()=>{


    ( async ()=>{
      const temp = await AsyncStorage.getItem("Identifier");
      setData(temp);

    })();
  },[data]);


  if(data !== ""){
    const myService: ServiceDescriptor= { 
      type    : 'http',
      protocol: 'tcp',
      domain  : 'local.',
      name    : 'identify',
      port    : 7070,
      txt     : { 
        Agent_identifier: data,
      }
  };
    zeroconf.publishService(
      myService.type, 
      myService.protocol, 
      myService.domain, 
      myService.name, 
      myService.port, 
      myService.txt
    );
  }

  return (

    <AppContext.Provider value= {{ 
      zeroconf: zeroconf, 
      agent   : new Agent(data!=null ? data : ""),
      server  : null
      }}>
      { children }
    </AppContext.Provider>
  );
}
