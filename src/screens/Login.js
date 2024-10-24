import { Image, View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import React, { useState } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from '../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
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
  
      if (response.status === 200 && response.data.success) {
        const user = response.data.user;
  
        await AsyncStorage.setItem('deliveryman_name', user.name);
        await AsyncStorage.setItem('deliveryman_id', user.id.toString());
        await AsyncStorage.setItem('deliveryman_token', response.data.token);
  
        navigation.navigate('Dashboard', {
          deliveryman_id: user.id,
        });
      } else if (response.status === 401) {
        Alert.alert('Error', 'Invalid credentials. Please try again.');
      } else if (response.data) {
        Alert.alert('Login Failed', response.data.message || 'Login failed for unknown reasons.');
      } else {
        Alert.alert('Login Failed', 'Invalid credentials');
      }
    } catch (e) {
      // Handle the error if the response isn't available
      if (e.response && e.response.status === 401) {
        Alert.alert('Error', 'Unauthorized: Incorrect username or password.');
      } else {
        Alert.alert('Error', 'Something went wrong. Please try again later.');
      }
    } finally {
      setLoading(false); // Ensure loading is reset in all cases
    }
  };
  

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'Android' ? 'padding' : 'height'} // Adjust for iOS or Android
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent} keyboardShouldPersistTaps="handled">
          <View style={styles.textContainer}>
            <Text style={styles.text}>
              FMV MOBILE APP DELIVERY
            </Text>
          </View>

          <View style={styles.ImageContainer}>
            <Image 
              source={require('./../assets/login/Logo.png')} 
              style={styles.Image} 
              resizeMode="contain" 
            />
          </View>

          <View style={styles.inputContainer}>
            <FontAwesome name={"user"} size={24} style={styles.inputIcon}/>
            <TextInput 
              style={styles.textInput} 
              placeholder='Username' 
              value={username}
              onChangeText={setUsername}  
            />
          </View>
            
          <View style={styles.inputContainer}>
            <FontAwesome name={"lock"} size={24} style={styles.inputIcon}/>
            <TextInput 
              style={styles.textInput} 
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
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginTop: 40,
    backgroundColor: '#ffffff',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ImageContainer: {
    marginTop: 50,
    marginBottom: 30,
    alignItems: 'center', 
    width: '100%', 
    position: 'relative',
  },
  Image: {
    width: "80%",
    height: 250,
  },
  textContainer: {
    alignItems: 'center',
    width: '100%',
  },
  text: {
    fontWeight: 'bold',
    fontSize: 32,
    color: '#000',
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    width: '90%',
    backgroundColor: 'white', 
    borderRadius: 20, 
    padding: 20, 
    elevation: 4,
  },
  inputIcon: {
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
    marginTop: 45,
    width: '90%',
    backgroundColor: '#007BFF', 
    borderRadius: 20, 
    padding: 20, 
    alignItems: 'center', 
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Login;
