import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import axios from 'axios';
import { API_URL } from '../../../config';
import { SafeAreaView } from 'react-native-safe-area-context';

export const OnGoingDeliveries = () => {
    const [id, setID] = useState('');
    const [token, setToken] = useState('');
    const [deliveries, setDeliveries] = useState([]); // State to store all deliveries
    const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
    const [selectedDelivery, setSelectedDelivery] = useState(null); // State to store selected delivery

    useEffect(() => {
        const fetchUserData = async () => {
            const id = await AsyncStorage.getItem('deliveryman_id');
            const token = await AsyncStorage.getItem('deliveryman_token');
            if (id !== null) {
                const parsedID = parseInt(id, 10);
                setID(parsedID);
            }
            setToken(token);
        };

        const fetchOnGoingDelivery = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/my-deliveries/on-deliveryman/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`, // Security Reason || Checks if the user is still logged in
                    },
                });
                if (response.status === 200) {
                    const deliveriesData = response.data;
                    if (deliveriesData.length > 0) {
                        setDeliveries(deliveriesData); // Store all deliveries in state
                    }
                } else {
                    console.log('Failed to fetch ongoing deliveries.');
                }
            } catch (error) {
                console.log('Error fetching ongoing deliveries:', error);
            }
        };

        fetchUserData();
        fetchOnGoingDelivery();
    }, [id, token]);

    const openViewOrder = (delivery) => {
        setSelectedDelivery(delivery); // Store the selected delivery
        setModalVisible(true); // Open the modal
    };

    const closeModal = () => {
        setModalVisible(false); // Close the modal
        setSelectedDelivery(null); // Clear the selected delivery
    };

    return (
        <View style={styles.content}>
            {/* Map through the deliveries array and display each delivery */}
            {deliveries.length > 0 ? (
                deliveries.map((delivery, index) => (
                    <View key={index} style={styles.detailsContainer}>
                      <View style={styles.detailContainer}>
                        <Text style={styles.detailTitle}>POID No:</Text>
                        <Text style={styles.detailText}>{delivery.purchase_order_id}</Text>
                      </View>
                      <View style={styles.detailContainer}>
                        <Text style={styles.detailTitle}>Address:</Text>
                        <Text style={styles.detailText}>
                          {delivery.address.street}, {delivery.address.barangay}, {delivery.address.city}, {delivery.address.province}, {delivery.address.zip_code}
                        </Text>
                      </View>
                      <View style={styles.detailContainer}>
                        <Text style={styles.detailTitle}>Status:</Text>
                        <Text style={styles.detailText}>{delivery.status}</Text>
                      </View>
                      <View style={styles.detailContainer}>
                        <Text style={styles.detailTitle}>Customer Name:</Text>
                        <Text style={styles.detailText}>{delivery.customer_name}</Text>
                      </View>
                      <TouchableOpacity 
                        style={styles.openButton}
                        onPress={() => openViewOrder(delivery)} // Open modal on click
                      >
                          <Text style={styles.buttonText}>View</Text>
                      </TouchableOpacity>
                    </View>
                ))
            ) : (
                <Text>No ongoing deliveries found.</Text>
            )}

            {/* Modal for viewing order details */}
            <Modal
              animationType="slide"
              transparent={false}
              visible={modalVisible}
              onRequestClose={closeModal} // Handle Android back button
            >
              <SafeAreaView style={styles.modalContent}>
                <ScrollView>
                  {selectedDelivery && (
                    <>
                      <Text style={styles.modalTitle}>Order Details</Text>
                      <Text style={styles.modalDetail}>Purchase Order ID: {selectedDelivery.purchase_order_id}</Text>
                      <Text style={styles.modalDetail}>Customer: {selectedDelivery.customer_name}</Text>
                      <Text style={styles.modalDetail}>Address: {selectedDelivery.address.street}, {selectedDelivery.address.barangay}, {selectedDelivery.address.city}, {selectedDelivery.address.province}, {selectedDelivery.address.zip_code}</Text>
                      <Text style={styles.modalDetail}>Status: {selectedDelivery.status}</Text>
                      {/* You can add more details here */}
                    </>
                  )}
                  <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                      <Text style={styles.buttonText}>Close</Text>
                  </TouchableOpacity>
                </ScrollView>
              </SafeAreaView>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    content: {
      flex: 1,
      paddingHorizontal: 20,
      backgroundColor: 'white',
    },
    detailsContainer: {
      padding: 15,
      backgroundColor: '#fff',
      borderRadius: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      elevation: 10,
      marginBottom: 20, // Add margin for spacing between deliveries
    },
    detailContainer:{
      display:'flex',
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
    },
    detailTitle: {
      marginVertical: 2,
      fontSize: 16,
      fontWeight: 'bold',
      backgroundColor: '#2955BB',
      borderRadius: 5,
      paddingHorizontal: 5,
      color: 'white',
    },
    detailText:{
      marginVertical: 2,
      marginLeft: 5,
      width: '70%',
      fontSize: 16,
    },
    openButton: {
      marginTop: 20,
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
    modalContent: {
      flex: 1,
      padding: 20,
      backgroundColor: 'white',
    },
    modalTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    modalDetail: {
      fontSize: 18,
      marginBottom: 10,
    },
    closeButton: {
      marginTop: 20,
      backgroundColor: '#2955BB',
      borderRadius: 5,
      paddingVertical: 10,
      paddingHorizontal: 30,
      elevation: 6,
      alignSelf: 'center',
    },
});

export default OnGoingDeliveries;
