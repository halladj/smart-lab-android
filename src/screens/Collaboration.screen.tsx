import React, {useEffect, useState} from "react";
import { Text, StyleSheet } from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {TCPClient} from "../sockets/client";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamsList} from "../types/Types";
//import TcpSocket from "react-native-tcp-socket"


type CollaborationScreenProps = 
  NativeStackScreenProps<RootStackParamsList, "Collaboration">

    
export const Collaboration: React.FC<CollaborationScreenProps> = ( props ) => {

  const [result, setResult]= useState<{value:string | Error} >({value:""});

  const [actionName ]      = useState<string>(props.route.params.actionName);
  const [host]             = useState<string>(props.route.params.host.split(":")[0]);
  const [port]             = useState<string>(props.route.params.host.split(":")[1]);
  //const [actionName, setActionName] useState<string>(navigation.hey)
  useEffect( ()=>{

    const client = new TCPClient(host, parseInt(port), actionName, setResult);

    client.connect();
    //setResult( client.result );

    // TODO: put the collaboration logic A.K.A [ event 7 ]
    // here and remove it from TCPClient, but make utility funcs.

    //const options = {
      //port: 7070,
      //host: "172.20.10.12",
    //}

    //const client = TcpSocket.createConnection(options, () => {
      //client.write("hello server");

      //client.destroy()
    //})
    //client.on("connect", () => console.log("connection"))

    //client.on("error", (error) => console.log(error))
    //client.on("close", () => console.log("closed"))
  }, []);
  
  return (
    <SafeAreaView style = { styles.conatiner }>
      <Text style={ styles.result }>{ 
        result.value !== "" ? 
          "Result is: "+result.value.toString() : 
          "Waiting..." }</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  conatiner: { 
    flex:1,
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  result:{
    fontSize:25,
    fontWeight:"bold"
  }
})



