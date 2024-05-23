import React, { useContext,useEffect,useState } from "react";
import { 
  FlatList, 
  Text, 
  View, 
  StyleSheet,
  RefreshControl
} from "react-native";
import { AppContext } from "../App.provider"
import {Service} from "react-native-zeroconf";



export const Home:React.FC  = () => {
  const { zeroconf, agent } = useContext(AppContext)
  //const [services, setServices] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [isScanning, setIsScanning] = useState<boolean>(false);

  const type = 'http'; // Service type
  const protocol = 'tcp'; // Protocol
  const domain = 'local.'; // Domain
  const name = 'CalculatePi'; // Name of the service
  const port = 8002; // Port on which your service is running
  const txt = { // TXT record with additional information
    txtvers: '1', // Version of the TXT record format
    Agent_identifier: 'My Sample Service',
  };
  //zeroconf.scan('http', 'tcp', 'local.');

  const refreshData = () => {
    if (isScanning) {
      return
    }
    
    setServices([])
   
    zeroconf.scan('http', 'tcp', 'local.')
    
    setTimeout(() => {
      zeroconf.stop()
    }, 5000)
  }
  
  useEffect( ()=>{

    zeroconf.on(
      'start', 
      () => {
        setIsScanning(true);
        console.log('The scan has started.')
    });

    zeroconf.on(
      'stop', 
      () => {
        setIsScanning(false);
        console.log('The scan has stoped.')
    });

    zeroconf.on(
      'found',
      service => {
        //console.log('Service found (not resolved):', service);
      }
    );

    zeroconf.on('resolved', (service:Service )=> {

      setServices( (services) => [service, ...services] );
      console.log(agent);

      if ( agent.hasInItsSCA( service.host ) ){
        const b = agent.addActionIntoSDA( service.name, service.host );
      }else {
        const b = agent.addActionIntoSDA( service.name, service.host );
      }
    });

    zeroconf.on(
      'error', 
      err => {
        setIsScanning(false);
        console.error('Error occurred:', err);
    });

    zeroconf.publishService(type, protocol, domain, name, port, txt);
    refreshData()
    
  }, [] )

  return (
    <View style={styles.container1}>
      <FlatList
        data={services}
        //keyExtractor={item => item.name}
        keyExtractor={(item, index) => String(index)}
        refreshControl = {
          <RefreshControl
                   refreshing={isScanning}
                   onRefresh={refreshData}
                   tintColor="skyblue"
                 />
        }
        renderItem={({item}) => (

          <View style={styles.serviceContainer}>
            

            <Text style={styles.serviceName}>{item.name}</Text>
            <Text>Host:
              {item.host}</Text>
            <Text>IP: {item.addresses[0]}</Text>
            <Text>Port: {item.port}</Text>
            <Text>Number: {item.name + "_" + item.fullName}</Text>
            
          </View>
        )}
      />
    </View>

  );

  
}

const styles = StyleSheet.create({
  container1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
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
  // done
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
