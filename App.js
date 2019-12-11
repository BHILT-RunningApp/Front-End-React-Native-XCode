/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';

import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Platform,
  Alert,
  TouchableOpacity,
  PermissionsAndroid,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import Geolocation from 'react-native-geolocation-service';

import Map from './src/Map';
import Homepage from './src/Homepage';

class App extends Component {
  state = {
    latitude: null,
    longitude: null,
  };

  findCoordinates = () => {
    console.log('Find coordinates running');
    Geolocation.getCurrentPosition(
      location => {
        console.log(location.coords.latitude, location.coords.longitude);
        this.setState({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      },
      error => {
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  componentDidMount() {
    async function requestLocationPermission() {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'Running App needs access to your camera ',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Location Permission Granted');
        } else {
          console.log('Location permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    }
    requestLocationPermission();
  }

  render() {
    {
      this.state.latitude === null && this.findCoordinates();
    }
    return (
      <>
        {/* <Map /> */}
        <Homepage />
        {/* <Text>Hello</Text> */}
      </>
    );
  }
}

export default App;
