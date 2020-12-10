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
import {GiftedChat} from 'react-native-gifted-chat';
import Geolocation from '@react-native-community/geolocation';
import {Alert} from 'react-native';
import {useTheme} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';

const {width, height} = Dimensions.get('window');

const reasons = ['Road Construction', 'Accident', 'High Traffic'];

const ExploreScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentLongitude, setCurrentLongitude] = useState('');
  const [currentLatitude, setCurrentLatitude] = useState('');
  const [locationStatus, setLocationStatus] = useState('');
  const [latlng, setLatlng] = useState('');
  const {colors} = useTheme();
  const [region, setRegion] = useState({
    latitude: 24.8245547,
    longitude: 67.082216,
    latitudeDelta: 0.12,
    longitudeDelta: 0.12,
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
            setLocationStatus('Permission Denied');
          }
        } catch (err) {
          console.warn(err);
        }
      }
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
    setLocationStatus('Getting Location ...');
    Geolocation.getCurrentPosition(
      //Will give you the current location
      position => {
        setLocationStatus('You are Here');
        setRegion({...region, ...position.coords});

        //getting the Longitude from the location json
        const currentLongitude = JSON.stringify(position.coords.longitude);

        //getting the Latitude from the location json
        const currentLatitude = JSON.stringify(position.coords.latitude);

        // setLocationStatus(currentLongitude+","+currentLatitude)
        //Setting Longitude state
        setCurrentLongitude(currentLongitude);

        //Setting Longitude state
        setCurrentLatitude(currentLatitude);
        // setLatlng(24.8245547+","+67.082216)
      },
      error => {
        setLocationStatus(error.message);
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 1000,
      },
    );
  };
  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages),
    );
  }, []);

  // const coordinate = {
  //   latitude: setCurrentLongitude,
  //   longitude: setCurrentLatitude,
  // },
  console.log(setLatlng);
  return (
    <>
      <MapView
        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
        style={styles.map}
        showsUserLocation
        region={region}>
        {/* <Marker coordinate={setLatlng} 
      title={"My Location "}
      description={"Karachi,Pakistan "}
    /> */}
      </MapView>

      <ActionButton buttonColor="rgba(231,76,60,1)">
        <ActionButton.Item
          buttonColor="#9b59b6"
          title="Add Trafic Reason "
          onPress={() => setModalVisible(true)}>
          <Icon name="md-create" style={styles.actionButtonIcon} />
        </ActionButton.Item>
      </ActionButton>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
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
            <TextInput
              placeholder="Please enter reason.."
              placeholderTextColor="#666666"
              style={[
                styles.textInput,
                {
                  color: colors.text,
                },
              ]}
              autoCapitalize="none"
              // onChangeText={val => handlePasswordChange(val)}
            />
            <ScrollView horizontal contentContainerStyle={{height: 40}}>
              {reasons.map(item => (
                <Text style={styles.chipStyles}>{item}</Text>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.signIn} onPress={() => {}}>
              <LinearGradient
                colors={['#08d4c4', '#01ab9d']}
                style={styles.signIn}>
                <Text
                  style={[
                    styles.textSign,
                    {
                      color: '#fff',
                    },
                  ]}>
                  Sign In
                </Text>
              </LinearGradient>
            </TouchableOpacity>
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
    height: 300,
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
    backgroundColor: '#F194FF',
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
    backgroundColor: 'rgba(242, 38, 19, 0.6)',
    borderColor: 'rgba(242, 38, 19, 1)',
    borderWidth: 3,
    color: '#fff',
    borderRadius: 18,
    margin: 10,
    height: 30,
  },
  signIn: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 20,
  },
});
