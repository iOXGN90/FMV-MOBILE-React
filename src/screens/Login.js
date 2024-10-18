import { Image, View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from '../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

import axios from 'axios';

const Login = () => {
  const navigation = useNavigation();

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  // const url = 'http://192.168.62.82:3000';

  const login = async () => {
    if (!username || !password) {
      Alert.alert('Error:', 'Please fill in all fields');
      return;
    }
  
    setLoading(true);
  
    try {
      const response = await axios.post(`${API_URL}/api/login`, {
        username: username,
        password: password,
      });
  
      // Log the entire response data for debugging
      console.log('Response data:', JSON.stringify(response.data));
  
      if (response.data.success) {
        const user = response.data.user;
  
        // console.log('Login Successfully, Welcome', user.name);
        // console.log('Token:', response.data.token);
  
        // Store the name and token in AsyncStorage
        await AsyncStorage.setItem('deliveryman_name', user.name);
        await AsyncStorage.setItem('deliveryman_token', response.data.token);
  
        // Navigate to another screen
        navigation.navigate('Dashboard', {
          deliveryman_id: user.id,
        });
      } else {
        console.log('Failed to Login');
        Alert.alert('Login Failed', response.data.message || 'Invalid credentials');
      }
    } catch (e) {
      console.log('Error:', e);
      Alert.alert('Error', 'Something went wrong. Please try again later.');
    } finally {
      setLoading(false); // Ensure loading is reset in all cases
    }
  };
  
  
  


  return (
    <View style = {styles.container}>
    <View style = {styles.textContainer}>
      <Text style = {styles.text}>
        FMV MOBILE APP DELIVERY
      </Text>
    </View>
      <View style = {styles.ImageContainer}>
        {/* <Image source= {require('../assets/daren1.jpg')} style = {styles.Image} resizeMode="contain" /> */}
      </View>
      <View style = {styles.inputContainer}>
        <FontAwesome name={"user"} size={24} style={styles.inputIcon}/>
        <TextInput 
          style = {styles.textInput} 
          placeholder='Username' 
          value={username}
          onChangeText={setUsername}  
        />
      </View>
      <View style = {styles.inputContainer}>
        <FontAwesome name={"lock"} size={24} style={styles.inputIcon}/>
        <TextInput 
          style = {styles.textInput} 
          placeholder='Password'  
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!isPasswordVisible}
        />
        <TouchableOpacity
          style={styles.togglePasswordButton}
          onPress={togglePasswordVisibility}
        >
          <MaterialIcons
            name={isPasswordVisible ? 'visibility-off' : 'visibility'} 
            size={24}
            color="black"
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={login}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          Login
        </Text>
      </TouchableOpacity>
    </View>
  )
}


export default Login

const styles = StyleSheet.create({
      container:{
        backgroundColor: '#F5F5F5',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
      },
      ImageContainer: {
        marginTop: 180,
        marginBottom: 30,
        alignItems: 'center', 
        width: '100%', 
        position: 'relative',

      },
      Image: {
        width: "80%",
        height: 250,

      },
      textContainer:{
        position: 'absolute',
        top: 80,
        alignItems: 'center',
        width: '100%',


      },
      text: {
        fontWeight: 'bold',
        fontSize: 32,
        color: '#000',
        textAlign: 'center',

      },
      inputContainer:{
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        width: '80%',
        backgroundColor: 'white', 
        borderRadius: 20, 
        padding: 12, 
        elevation: 4,

      },
      inputIcon:{
        marginLeft: 9,
      },
      textInput: {
        flex: 1,
        marginLeft: 10,
      },

      togglePasswordButton: {
        marginLeft: 10,
      },
      button: {
        marginTop: 20,
        width: '40%', 
        backgroundColor: '#007BFF', 
        borderRadius: 20, 
        paddingVertical: 15, 
        alignItems: 'center', 
      },
      buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
      },


})