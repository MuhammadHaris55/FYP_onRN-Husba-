import React from 'react';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import {View, Text, Button, StyleSheet} from 'react-native';

const ExploreScreen = () => {
  return (
    <MapView
      provider={PROVIDER_GOOGLE} // remove if not using Google Maps
      style={styles.map}
      region={{
        latitude: 24.8245547,
        longitude: 67.082216,
        latitudeDelta: 24.8245547,
        longitudeDelta: 67.082216,
      }}>
      <Marker
        coordinate={{
          latitude: 31.8245547,
          longitude: 72.082216,
        }}
        image={require('../assets/map_marker.png')}
        title="Here I Am"
        description="this is a place u located"
      />
    </MapView>
  );
};

export default ExploreScreen;

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
