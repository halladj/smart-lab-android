import React, { useCallback, useContext,useEffect,useState } from "react";
import { 
  FlatList, 
  View, 
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { AppContext } from "../App.provider"
import {Service} from "react-native-zeroconf";
import {DiscoveryCard} from "../components/DiscoveryCard";
import {Action} from "../types/Agent";
import {RootStackParamsList, ServiceDescriptor} from "../types/Types";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {discoverPeers} from "../utility/peer-to-peer";
import {connectWithConfig, subscribeOnPeersUpdates} from "react-native-wifi-p2p";


type HomeScreenProps = 
  NativeStackScreenProps<RootStackParamsList, "Home">


export const Home: React.FC<HomeScreenProps> = ({navigation}) => {

  const { zeroconf, agent } = useContext(AppContext)
  const [services, setServices] = useState<Action[]>([]);
  const [isScanning, setIsScanning] = useState<boolean>(false);

  

  const onPress = useCallback( (actionName:string, host:string) => {
    navigation.push("Collaboration", {actionName : actionName, host:host })
  }, [] )

  
  //const refreshData = () => {
    //if (isScanning) {
      //return
    //}
    
    //setServices([])
   
    //zeroconf.scan('http', 'tcp', 'local.')
    
    //setTimeout(() => {
      //zeroconf.stop()
    //}, 3000)
  //}


  const discoveryRoutine = useCallback( ()=>{

    if (isScanning) {
      return
    }
    setServices([])
    zeroconf.scan('http', 'tcp', 'local.')
    //setTimeout(() => {
      //zeroconf.stop()
    //}, 10000)
  }, [services]);

  
  const storeData = useCallback( async( value: string ) => {
    try {
      await AsyncStorage.setItem('Identifier', value);
    } catch (e) {
      console.log("Error tying to store data in local storage... ", e);
    }
  }, []);
  
  useEffect( () => {

    
    storeData("191934032196");
    zeroconf.on('start', () => {setIsScanning(true);console.log('The scan has started.');});
    zeroconf.on('stop', () =>  {setIsScanning(false);console.log('The scan has stoped.');});

    //zeroconf.on('found',(service) => {
      //console.log('Service found (not resolved):', service);
      //console.log(zeroconf.getServices())
    //});

    zeroconf.on('resolved', (service:Service )=> {

      console.log(`Resolved but now put in SDA:
                  ${service.host}  ${service.name} 
                  txt: ${service.txt.Agent_identifier}`);

      if (service.txt.Agent_identifier !== undefined){
        agent.addToSCA(service.host+":"+service.port.toString(), service.name);
        setServices(agent.getAvailableActions());
      }
      //
      //setServices(agent.getAvailableActionsDictionary());

      //agent.getAvailableActionsDictionary()
      //console.log(agent.getAvailableActionsDictionary()["192.168.1.15"][0].name)
    });
    zeroconf.on(
      'error', 
      err => {
        setIsScanning(false);
        console.error('Error occurred:', err);

    });
    discoveryRoutine()
  }, []);

  return (

    //<View>
    //<DiscoveryCard 
        //name={ "Identification Service"} 
        //host= {"172.16.0.4"}
        //addresses={["172.16.0.4"]} 
      //port = {3000}/>

      //<DiscoveryCard 
       //name={ "Face Recognition Service"} 
        //host= {"172.16.0.9"}
        //addresses={["172.16.0.9"]} 
      //port = {3000}/>

      
    //</View>
        //{
    <View style={styles.container}>
      <FlatList
        data = {services}
        //data = { Object.keys(services) }
        //refreshControl = {
          //<RefreshControl
                   //refreshing={isScanning}
                   //onRefresh={refreshData}
                   //tintColor="skyblue"
                 ///>
        //}
        keyExtractor={(item, index) => String(index)}
        renderItem = { ({ item }) => {
          return  (
            <TouchableOpacity
              onPress = { () => onPress(item.name, item.SCA.values().next()["value"])}
              >
              <DiscoveryCard 
                //name={ services.length === 0 ? "hamza":  services[item].name } 
                name={ item.name} 
                host= {item.SCA.values().next()["value"]}
                //host= { services.length === 0 ? "hamza":  item}
                addresses={[item.SCA.values().next()["value"]]} 
                port = {1000}
            />
            </TouchableOpacity>
          ); 
        } }
      >
      </FlatList>
    </View>
//}
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 20,
    marginBottom: 10,
  },
  connected: {
    marginBottom: 20,
    color: 'green',
  },
  disconnected: {
    marginBottom: 20,
    color: 'red',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 20,
  },
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  text: {
    fontSize: 22,
    marginBottom: 20,
    textAlign: 'center',
  },
  serviceContainer: {
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
