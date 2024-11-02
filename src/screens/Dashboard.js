import React, { useEffect, useState, useRef } from 'react';
import { Image, View, Text, StyleSheet, DrawerLayoutAndroid, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { API_URL } from '../../config';
import axios from 'axios';
import OnGoingDeliveries from './components/OnGoingDeliveries';
import PastDeliveries from './components/PastDeliveries';

const ScreenWidth = Dimensions.get('window').width;

const Dashboard = () => {
  const drawer = useRef(null);
  const navigation = useNavigation();
  const [drawerPosition, setDrawerPosition] = useState('left');
  const [view, setView] = useState('ongoing'); // New state to manage view switching

  const [id, setID] = useState('');
  const [deliverymanName, setDeliverymanName] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const name = await AsyncStorage.getItem('deliveryman_name');
      const id = await AsyncStorage.getItem('deliveryman_id');
      if (id !== null) {
        const parsedID = parseInt(id, 10);
        setID(parsedID);
      }
      const token = await AsyncStorage.getItem('deliveryman_token');
      setDeliverymanName(name);
      setToken(token);
    };
    fetchUserData();
  }, [id, token]);

  const logout = async () => {
    try {
      const response = await axios.post(`${API_URL}/api/logout`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        console.log('Logout successful');

        // Clear AsyncStorage after logout
        await AsyncStorage.removeItem('deliveryman_name');
        await AsyncStorage.removeItem('deliveryman_token');

        // Reset the state
        setDeliverymanName('');
        setToken('');

        // Navigate to login screen
        navigation.navigate('Login');
      } else {
        Alert.alert('Logout Failed', 'Something went wrong.');
      }
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Unable to log out. Please try again.');
    }
  };

  // Drawer Navigation View
  const navigationView = () => (
    <SafeAreaView style={styles.container}>
      <View style={styles.drawerNameAndCloseHolder}>
        <Text style={styles.drawerNameText}>{deliverymanName}</Text>
        <View style={styles.lineBreak} />
      </View>
      <View style={styles.choicesButtonContainer}>
        <Text>Delivery Categories:</Text>
        <TouchableOpacity style={styles.CategoriesButton} onPress={() => {
            setView('ongoing');
            drawer.current.closeDrawer(); // Close the drawer
        }}>
          <Text style={styles.choicesText}>On-Going Delivery</Text>
          <Image
            source={require('./../assets/dashboard/modal/arrow-right-to-line-svgrepo-com.png')}
            style={styles.drawerImage}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.CategoriesButton} onPress={() => {
            setView('past');
            drawer.current.closeDrawer(); // Close the drawer
        }}>
          <Text style={styles.choicesText}>Past Deliveries</Text>
          <Image
            source={require('./../assets/dashboard/modal/arrow-right-to-line-svgrepo-com.png')}
            style={styles.drawerImage}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.logoutButtonContainer}>
        <View style={styles.lineBreak} />
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  // Content rendering logic based on the current view selected
  const renderContent = () => {
    if (view === 'ongoing') {
      return <OnGoingDeliveries />;
    } else if (view === 'past') {
      return <PastDeliveries />;
    }
  };

  return (
    <DrawerLayoutAndroid
      ref={drawer}
      drawerWidth={ScreenWidth * 0.8}
      drawerPosition={drawerPosition}
      renderNavigationView={navigationView}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerNav}>
            <TouchableOpacity style={styles.iconButton} onPress={() => drawer.current.openDrawer()}>
              <Image
                style={styles.menuIcon}
                source={require('./../assets/dashboard/menu-svgrepo-com.png')}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <Text style={styles.name}>
              {view === 'ongoing' ? 'On-Going Deliveries' : 'Past Deliveries'}
            </Text>
          </View>
          <View style={{
            width: '20%',
          }}>
            <Image
              source={require('./../assets/login/Logo.png')}
              style={{
                marginLeft: '20%',
                width: 50,
                height: 50,
              }}
            />
          </View>
        </View>
        <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
          {renderContent()}
        </ScrollView>
      </SafeAreaView>
    </DrawerLayoutAndroid>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display:'flex',
    // justifyContent:'center',
    backgroundColor: 'white',
  },
  header: {
    display:'flex',
    flexDirection: 'row',
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 100,
    elevation: 5,
    zIndex: 99,
    padding: 15,
    // borderWidth:0.1
  },
  headerNav: {
    width: '80%',
    display:'flex',
    flexDirection:'row',
    // justifyContent:'center',
    alignItems:'center',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    marginLeft: 5,
  },
  iconButton: {
    paddingHorizontal: -20,
  },
  scrollViewContent: {
    marginTop: 20,
    paddingBottom: 100,
  },
  openButton: {
    backgroundColor: '#2955BB',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 30,
    elevation: 6,
    alignSelf: 'flex-end',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  drawerContent: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
  },
  drawerText: {
    fontSize: 18,
    marginBottom: 20,
    color: '#333',
  },
  menuIcon: {
    width: 30,
    height: 30,
  },
  drawerNameAndCloseHolder: {
    width: '100%',
    flexDirection: 'column',
    marginTop: 10,
    paddingHorizontal: 10,
  },
  drawerNameText: {
    fontWeight: 'bold',
    paddingVertical: 10,
    paddingHorizontal: 5,
    fontSize: 20,
  },
  drawerImage: {
    width: 20,
    height: 20,
  },
  choicesButtonContainer: {
    flexDirection: 'column',
    padding: 10,
    marginTop: 10,
    width: '100%',
    height:'80%'
  },
  CategoriesButton: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    elevation: 10,
    backgroundColor: '#2955BB',
  },
  choicesText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: 'white',
  },
  lineBreak: {
    width: '100%',
    height: 1,
    backgroundColor: 'black',
  },
  logoutButtonContainer: {
    padding: 10,
    marginTop: 10,
    width: '100%',
  },
  logoutButton: {
    width: '100%',
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    elevation: 10,
    backgroundColor: 'red',
  },
  logoutButtonText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: 'white',
  },
});

export default Dashboard;
