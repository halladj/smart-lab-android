import React, {useCallback, useEffect, useState} from "react";
import { Text, StyleSheet, View, TextInput, Button } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamsList} from "../types/Types";


type AuthScreenProps = 
  NativeStackScreenProps<RootStackParamsList, "Authentication">



export const Authentication: React.FC<AuthScreenProps> = ({navigation}) => {

  const [inputValue, setInputValue] = useState<string>('');
  const [data, SetData] = useState<string>(" ");

  const storeData = useCallback( async( value: string ) => {
    try {

      //const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem('Identifier', value);
      getDate();
    } catch (e) {
      console.log("Error tying to store data in local storage... ", e);
    }
  }, [data]);

  const getDate = useCallback( async()=>{
    const temp = await AsyncStorage.getItem("Identifier");
    if (temp !== null){
      SetData(temp);
    }
  }, [data]);

  const handlePress = useCallback( ()=>{
    storeData(inputValue);
  }, [inputValue]);

  useEffect( () => {
    //getDate();
    console.log(data);
  });


  if (data !== "") {
    navigation.navigate("Main", {screen: "Home"});
    //navigation.navigate('Collaboration', {actionName: "", host:""});
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter some text"
        value={inputValue}
        onChangeText={(newText) => setInputValue(newText)}
      />
      <Button title="Send" onPress={handlePress} />
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
});
