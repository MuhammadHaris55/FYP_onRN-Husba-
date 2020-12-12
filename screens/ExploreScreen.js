import React, {useState, useEffect, useCallback} from 'react';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Dimensions,
  Modal,
  TouchableHighlight,
  PermissionsAndroid,
  TextInput,
  TouchableOpacity,
  Platform,
  ScrollView,
} from 'react-native';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import Geolocation from '@react-native-community/geolocation';
import {useTheme} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';

import firebase from '../config/firebase';
import {ActivityIndicator} from 'react-native';

const {width, height} = Dimensions.get('window');

const reasons = ['Road Construction', 'Accident', 'High Traffic'];

const ExploreScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentLongitude, setCurrentLongitude] = useState('');
  const [currentLatitude, setCurrentLatitude] = useState('');
  const [allMarkers, setMarkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState('');
  const {colors} = useTheme();
  const [region, setRegion] = useState({
    latitude: 24.8245547,
    longitude: 67.082216,
    latitudeDelta: 0.14,
    longitudeDelta: 0.14,
  });

  useEffect(() => {
    // Geolocation.getCurrentPosition(info => console.log(info));
    const requestLocationPermission = async () => {
      if (Platform.OS === 'ios') {
        getOneTimeLocation();
        subscribeLocationLocation();
      } else {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Access Required',
              message: 'This App needs to Access your location',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            //To Check, If Permission is granted
            getOneTimeLocation();
            // subscribeLocationLocation();
          } else {
            // setLocationStatus('Permission Denied');
          }
        } catch (err) {
          console.warn(err);
        }
      }
      getLocations();
    };
    requestLocationPermission();
    getOneTimeLocation();
    setMessages([
      {
        _id: 1,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
    ]);
  }, []);
  const getOneTimeLocation = () => {
    // setLocationStatus('Getting Location ...');
    Geolocation.getCurrentPosition(
      position => {
        setRegion({...region, ...position.coords});
      },
      error => {
        // setLocationStatus(error.message);
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 1000,
      },
    );
  };

  const getLocations = async () => {
    try {
      firebase
        .firestore()
        .collection('locations')
        .onSnapshot(docs => {
          const markers = [];
          docs.forEach(doc => {
            var startDate = new Date(doc.data().time);
            var endDate = new Date();
            var diff =
              (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
            if (diff >= 24) {
              firebase
                .firestore()
                .collection('locations')
                .doc(doc.id)
                .delete();
            } else {
              markers.push(doc.data());
            }
          });
          console.log(
            '🚀 ~ file: ExploreScreen.js ~ line 115 ~ getLocations ~ markers',
            markers,
          );
          setMarkers(markers);
        });
    } catch (error) {
      alert('Sorry, Something went wrong');
    }
  };

  const addLocation = () => {
    if (reason == '') {
      return alert('Error, Kindly add a reason.');
    }
    setLoading(true);
    Geolocation.getCurrentPosition(
      ({coords: {latitude, longitude}}) => {
        firebase
          .firestore()
          .collection('locations')
          .add({latitude, longitude, time: new Date().toString(), reason})
          .then(() => {
            setModalVisible(false);
            setLoading(false);
          })
          .catch(e => {
            setLoading(false);
            alert('Sorry, Something went wrong');
          });
      },
      error => {
        setLoading(false);
        alert('Sorry, Something went wrong');
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 1000,
      },
    );
  };

  return (
    <>
      <MapView
        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
        style={styles.map}
        showsUserLocation
        region={region}>
        {allMarkers.map(marker => (
          <Marker
            key={Math.random().toString()}
            coordinate={marker}
            title={marker.reason}
            description={`${new Date(
              marker.time,
            ).toLocaleTimeString()} ${new Date(
              marker.time,
            ).toLocaleDateString()}`}
          />
        ))}
      </MapView>

      <ActionButton buttonColor="rgba(231,76,60,1)">
        <ActionButton.Item
          buttonColor="#9b59b6"
          title="Add Traffic Jam Reason "
          onPress={() => setModalVisible(true)}>
          <Icon name="md-create" style={styles.actionButtonIcon} />
        </ActionButton.Item>
      </ActionButton>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableHighlight
              style={{...styles.openButton, backgroundColor: '#2196F3'}}
              onPress={() => {
                setModalVisible(!modalVisible);
              }}>
              <Text style={styles.textStyle}> x </Text>
            </TouchableHighlight>
            <View>
              <Text>Reason</Text>
              <TextInput
                placeholder="Please enter reason.."
                placeholderTextColor="#666666"
                style={[styles.textInput, {color: colors.text}]}
                value={reason}
                onChangeText={val => setReason(val)}
              />
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {reasons.map(item => (
                  <TouchableOpacity onPress={() => setReason(item)}>
                    <Text style={styles.chipStyles}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity style={styles.signIn} onPress={addLocation}>
                <LinearGradient
                  colors={['#2196F3', '#69b7f7']}
                  style={styles.signIn}>
                  <Text
                    style={[
                      styles.textSign,
                      {
                        color: '#fff',
                      },
                    ]}>
                    Add
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
            {loading && (
              <View style={styles.indicator}>
                <ActivityIndicator size="large" />
              </View>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
};

export default ExploreScreen;

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalView: {
    width: '100%',
    height: 240,
    // margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 15,
    justifyContent: 'center',
    // alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    borderRadius: 20,
    width: 40,
    height: 40,
    elevation: 2,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: width * 0.04,
    top: height * 0.016,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 20,
  },
  textInput: {
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    height: 60,
    color: '#05375a',
    borderBottomWidth: 1,
    borderBottomColor: '#a3a3a3',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  chipStyles: {
    padding: 6,
    paddingHorizontal: 12,
    // backgroundColor: 'rgba(242, 38, 19, 0.6)',
    borderColor: '#2196F3',
    borderWidth: 2,
    borderRadius: 18,
    margin: 10,
    height: 30,
  },
  signIn: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 20,
    alignSelf: 'flex-end',
  },
  indicator: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
