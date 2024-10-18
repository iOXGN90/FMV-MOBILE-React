import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { API_URL } from '../../config';

import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Dashboard = () => {
  const navigation = useNavigation();
  // const route = useRoute();
  const [deliverymanName, setDeliverymanName] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const name = await AsyncStorage.getItem('deliveryman_name');
      const token = await AsyncStorage.getItem('deliveryman_token');
      setDeliverymanName(name);
      setToken(token);
      
      // Log immediately after setting state
      console.log('Fetched Deliveryman Name:', name);
      console.log('Fetched Token:', token);
    };
  
    fetchUserData();
  }, []);
  
  useEffect(() => {
    // Log after the state has updated
    console.log('Deliveryman Name (Updated State):', deliverymanName);
  }, [deliverymanName]);  // This will run every time `deliverymanName` updates
  

  const logout = async () => {
    try {
      const response = await axios.post(`${API_URL}/api/logout`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        console.log('Logout successful');
        navigation.navigate('Login');
      } else {
        Alert.alert('Logout Failed', 'Something went wrong.');
      }
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Unable to log out. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.openDrawer(deliveryman_name)}
          >
            <Ionicons name="menu" size={28} color="black" />
          </TouchableOpacity>
          {/* <Text style={styles.name}>
            {deliverymanName}
          </Text> */}
        </View>

        <View style={styles.content}>
          <View style={styles.detailsContainer}>
            <Text style={styles.detailTitle}>Delivery Number:</Text>
            <Text style={styles.detailText}>9</Text>

            <Text style={styles.detailTitle}>Date:</Text>
            <Text style={styles.detailText}>2024-09-03</Text>

            <Text style={styles.detailTitle}>Address:</Text>
            <Text style={styles.detailText}>Wayayow street</Text>

            <Text style={styles.detailTitle}>Delivered to:</Text>
            <Text style={styles.detailText}>Owen</Text>

            <TouchableOpacity
              style={styles.openButton}
              onPress={() => navigation.navigate('Details')}
            >
              <Text style={styles.buttonText}>Open</Text>
            </TouchableOpacity>
          </View>
          
          {/* More delivery details here */}
          
          <View style={styles.logoutButtonContainer}>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={logout}
            >
              <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    width: '88%',
    position: 'absolute',
    top: 50,
    left: 22,
    flexDirection: 'row',  
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: 'white',
    padding: 15,
    elevation: 6,
    zIndex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginLeft: 10,
  },
  iconButton: {
    paddingHorizontal: -20,
  },
  scrollViewContent: {
    paddingTop: 100,
    paddingBottom: 100,
  },
  content: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  detailsContainer: {
    marginTop: 10,
    padding: 20,
    backgroundColor: '#D3D3D3',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
    marginBottom: 20,
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  detailText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
  },
  openButton: {
    backgroundColor: '#007dff',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 30,
    elevation: 6,
    alignSelf: 'flex-end',
  },
  logoutButtonContainer: {
    alignItems: 'flex-end',
    marginTop: 100,
  },
  logoutButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'red',
    borderRadius: 5,
    paddingVertical: 12,
    paddingHorizontal: 30,
    elevation: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Dashboard;
