import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { View, Image, TouchableOpacity, Text, TextInput, StyleSheet, Modal, ScrollView } from 'react-native';
import axios from 'axios';
import { API_URL } from '../../../config';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';

export const OnGoingDeliveries = () => {
    const [id, setID] = useState('');
    const [token, setToken] = useState('');
    const [deliveries, setDeliveries] = useState([]); // State to store all deliveries
    const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
    const [selectedDelivery, setSelectedDelivery] = useState(null); // State to store selected delivery
    const [selectedImage, setSelectedImage] = useState(null); // State to store captured image
    const [fullImageModalVisible, setFullImageModalVisible] = useState(false); // State to control full-image modal visibility
    const [notes, setNotes] = useState('');

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
                    setDeliveries(response.data); // Store all deliveries in state
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

    // const sendUpdateToDelivery = async () => {
    //   try{
    //     const response = await axios.post(`${API_URL}/api/update-delivery/${id}`)
    //   }
    // }

    const openViewOrder = (delivery) => {
        setSelectedDelivery(delivery); // Store the selected delivery
        setModalVisible(true); // Open the modal
    };

    const closeModal = () => {
        setModalVisible(false); // Close the modal
        setSelectedDelivery(null); // Clear the selected delivery
        setSelectedImage(); // Clear the captured image
    };

    const takePhoto = async () => {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (permissionResult.granted === false) {
          alert("You've refused to allow this app to access your camera!");
          return;
      }
  
      const result = await ImagePicker.launchCameraAsync();
      if (!result.canceled && result.assets && result.assets.length > 0) {
          console.log("Captured Image URI:", result.assets[0].uri); // Log the URI
          setSelectedImage(result.assets[0].uri); // Set image URI to display in the modal
      }
  };

    const removeImage = () => {
        setSelectedImage(null); // Clear the selected image
    };

    return (
        <View style={styles.content}>
            {deliveries.length > 0 ? (
                deliveries.map((delivery, index) => (
                    <View key={index} style={styles.detailsContainer}>
                      <View style={styles.detailContainer}>
                        <Text style={styles.detailTitle}>
                          POID No:
                        </Text>
                        <Text style={styles.detailText}>
                          {delivery.purchase_order_id}
                        </Text>
                      </View>
                      <View style={styles.detailContainer}>
                        <Text style={styles.detailTitle}>
                          Address:
                        </Text>
                        <Text style={styles.detailText}>
                          {delivery.address.street}, {delivery.address.barangay}, {delivery.address.city}, {delivery.address.province}, {delivery.address.zip_code}
                        </Text>
                      </View>
                      <View style={styles.detailContainer}>
                        <Text style={styles.detailTitle}>
                          Status:
                        </Text>
                        <Text style={styles.detailText}>
                          {delivery.status}
                        </Text>
                      </View>
                      <View style={styles.detailContainer}>
                        <Text style={styles.detailTitle}>
                          Customer Name:
                        </Text>
                        <Text style={styles.detailText}>
                          {delivery.customer_name}
                        </Text>
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
                <Text>
                  No ongoing deliveries found.
                </Text>
            )}

            {/* Modal for viewing order details */}
            <Modal
              animationType="slide"
              transparent={false}
              visible={modalVisible}
              onRequestClose={closeModal} // Handle Android back button
            >
              <SafeAreaView style={styles.modalContent}>
                <ScrollView
                  showsVerticalScrollIndicator={false} // Hide the vertical scroll indicator
                >
                  {selectedDelivery && (
                    <>
                      <Text style={styles.modalTitle}>
                        Order Details:
                      </Text>
                      <Text style={styles.modalDetail}>
                        Purchase Order ID: {selectedDelivery.purchase_order_id}
                      </Text>
                      <Text style={styles.modalDetail}>
                        Customer: {selectedDelivery.customer_name}
                      </Text>
                      <Text style={styles.modalDetail}>
                        Address: {selectedDelivery.address.street}, {selectedDelivery.address.barangay}, {selectedDelivery.address.city}, {selectedDelivery.address.province}, {selectedDelivery.address.zip_code}
                      </Text>
                      <Text style={styles.modalDetail}>
                        Status: "{selectedDelivery.status}"
                      </Text>

                      {/* Display each product in the products array */}
                      <View style={styles.separator} />
                      <Text style={styles.modalSubTitle}>
                        Products listed by this delivery:
                      </Text>
                      {selectedDelivery.products.map((product, prodIndex) => (
                        <TouchableOpacity key={prodIndex} style={styles.productContainerModal}>
                          <Text style={styles.modalProductListedText}>
                            ${product.price}
                            </Text>
                          <Text style={styles.modalProductListedText}>
                            {product.product_name}
                          </Text>
                          <Text style={styles.modalProductListedText}>
                            {product.quantity}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </>
                  )}
                  {/* <View style={styles.separator} /> */}
                  
                  {/* Take Photo button and display captured image */}
                  <Text style={styles.modalSubTitle}>
                    Report:
                  </Text>
                  <View style={styles.imageButtonContainer}>
                    <TouchableOpacity style={styles.imageButton} onPress={takePhoto}>
                      <Text style={styles.buttonText}>
                        Take Photo
                      </Text>
                      <Image
                        source={require('./../../assets/dashboard/modal/camera-svgrepo-com.png')}
                        style={{
                          width: 25,
                          height: 25,
                          marginLeft: 10,
                        }}
                      />
                    </TouchableOpacity>
                  </View>

                  {/* Display captured image if available */}
                  {selectedImage ? (
                      <TouchableOpacity onPress={() => setFullImageModalVisible(true)} style={styles.imageContainer}>
                          <Image 
                            source={{ uri: selectedImage }} 
                            style={styles.selectedImage} 
                          />
                          <TouchableOpacity style={styles.deleteImageButton} onPress={() => setSelectedImage(null)}>
                            <Text style={styles.deleteButtonText}>
                              X
                            </Text>
                          </TouchableOpacity>
                          <Text>
                            (Press the image to see the full size)
                          </Text>
                      </TouchableOpacity>
                  ) : (
                      <View style={{
                        display:'flex',
                        flexDirection:'row',
                        marginBottom: 30,
                        justifyContent:'center',
                        backgroundColor: '#BCBCBC',
                        height: 200,
                        alignItems:'center',
                        borderRadius: 15,
                      }}>
                        <Text style={{
                          fontWeight:'bold',
                          color: 'white',
                          fontSize: 18,
                        }}>
                          Image will display here
                        </Text>
                        <Text style={{
                          color:'red',
                        }}>
                          *
                        </Text>
                      </View>
                      
                  )}

                  <TouchableOpacity style={styles.damageReportButton} onPress={takePhoto}>
                    <Text style={styles.damageButtonText}>
                      Damage Report (optional)
                    </Text>
                  </TouchableOpacity>

                  <View style={{
                    display:'flex',
                    marginTop: 15,
                  }}>
                    <Text style={styles.modalSubTitle}>
                      Submit a note: (optional)
                    </Text>
                    <TextInput
                        style={styles.notes}
                        placeholder="Message to the admin (Optional)"
                        placeholderTextColor="#888"
                        value={notes}
                        multiline={true} // Enable multiple lines
                        onChangeText={(text) => setNotes(text)} // Update state on text change
                    />
                  </View>

                  <View style={{
                    display:'flex',
                    flexDirection:'row',
                    justifyContent:'space-evenly',
                  }}>
                    <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                      <Text style={styles.closeConfirmButton}>
                        Close
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                      <Text style={styles.closeConfirmButton}>
                        Confirm
                      </Text>
                    </TouchableOpacity>
                  </View>

                </ScrollView>
              </SafeAreaView>
            </Modal>

            {/* Full-size image modal */}
            <Modal
              visible={fullImageModalVisible}
              transparent={true}
              onRequestClose={() => setFullImageModalVisible(false)}
            >
              <View style={styles.fullImageModal}>
                {selectedImage && (
                  <Image source={{ uri: selectedImage }} style={styles.fullImage} />
                )}
                <TouchableOpacity style={{
                  backgroundColor:'gray',
                  paddingHorizontal: 60,
                  paddingVertical: 10,
                  borderRadius: 10,
                }} onPress={() => setFullImageModalVisible(false)}>
                  <Text style={styles.buttonText}>
                    Close
                  </Text>
                </TouchableOpacity>
              </View>
            </Modal>
            
        </View>
    );
};

const styles = StyleSheet.create({
  productContainerModal:{
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-around',
    padding: 15,
    marginVertical: 5,
    borderWidth: 0.5,
    backgroundColor:'white',
    elevation: 5,
    borderRadius: 15,
  },

  content: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
  
  detailsContainer: {
    width:'100%',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 10,
    marginBottom: 10,
  },
  detailContainer:{
    width: '80%',
    marginVertical:4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: '#2955BB',
    borderRadius: 5,
    paddingHorizontal: 5,
  },
  detailText: {
    marginLeft: 5,
    fontSize: 18,
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
    fontSize: 18,
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
    marginVertical: 5,
    textAlignVertical:'center',
  },
  modalProductListedText: {
    fontSize: 18,
    textAlignVertical:'center',
    fontWeight:'bold'
  },
  modalSubTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  separator: {
    height: 1,
    backgroundColor: 'black',
    marginVertical: 20,
  },

  // Image AREA
    imageButtonContainer: {
      display:'flex',
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      marginVertical: 10,
    },
    imageButton: {
      display:'flex',
      backgroundColor: '#2955BB',
      borderRadius: 15,
      paddingVertical: 15,
      paddingHorizontal: 125,
      elevation: 3,
      flexDirection:'row',
      alignSelf:'center',
      justifyContent:'flex-end',
    },

    imageContainer: {
      position: 'relative',
      marginVertical: 10,
      marginBottom: 30,
      alignItems: 'center',
    },
    selectedImage: {
      width: '100%',
      height: 200,
      borderRadius: 15,
      marginBottom: 10,
    },
    deleteImageButton: {
      position: 'absolute',
      top: 5,
      right: 10,
      backgroundColor: 'red',
      borderRadius: 10,
      padding: 10,
    },
    deleteButtonText: {
      color: 'white',
      // fontWeight: 'bold',
      fontSize:16,
    },
  // Image AREA 

  // Damage AREA 
    damageReportButton: {
      backgroundColor: '#FF5454',
      borderRadius: 15,
      alignItems:'center',
      paddingVertical: 15,
      paddingHorizontal: 20,
      elevation: 3,
    },

    damageButtonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
  // Damage AREA 

// Close / Send Area
  fullImageModal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: '100%',
    height: '90%',
    resizeMode: 'contain',
    borderRadius: 10,
  },

  closeButton: {
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 50,
    alignSelf: 'center',
    elevation: 5,
    marginBottom: 20
  },
  
  closeConfirmButton: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
  
// Close / Send Area

  notes:{
    width: '100%',
    height: 100,
    borderWidth: 0.5,
    borderRadius: 10,
    textAlignVertical:'top',
    padding: 10,
    fontSize: 16
  }
});

export default OnGoingDeliveries;
