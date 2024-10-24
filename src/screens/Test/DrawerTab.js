import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '../../../config';

const DrawerHeader = ({ navigation }) => {
  const [deliverymanName, setDeliverymanName] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const name = await AsyncStorage.getItem('deliveryman_name');
      const token = await AsyncStorage.getItem('deliveryman_token');
      setDeliverymanName(name);
      setToken(token);
    };

    fetchUserData();
  }, []);



  return (
    <View style={styles.headerContainer}>
      <View style={styles.nameContainer}>
        <Text style={styles.nameText}>
          {deliverymanName || 'Loading...'} 
        </Text>
      </View>

      <View style={styles.logoutButtonContainer}>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={logout}
        >
          <Text style={styles.buttonText}>
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginTop: 30,
  },

  nameContainer: {
    backgroundColor: 'white',
    padding: 15, 
    marginRight: 8,   
    borderRadius: 5,
    shadowOffset: { width: 0, height: 5 }, 
    shadowColor: '#000',       
    shadowOpacity: 0.3,        
    shadowRadius: 4,
    elevation: 4,
  },
  nameText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  logoutButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutButton: {
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DrawerHeader;
