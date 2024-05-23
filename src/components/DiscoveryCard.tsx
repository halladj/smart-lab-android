import React from "react";
import {View, Text, StyleSheet} from "react-native";

type DiscoveryCardProps = {
  name: string;
  host: string;
  addresses: string[];
  port: number;
}

export const DiscoveryCard: React.FC<DiscoveryCardProps> = ({ 
  name, 
  host, 
  addresses, 
  port, 
  })=>{

  return(
    <View style={styles.serviceContainer}>
      <Text style={styles.serviceName}>{name}</Text>
      <Text>Host:
      {host}</Text>
      <Text>IP: {addresses[0]}</Text>
      <Text>Port: {port}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
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
