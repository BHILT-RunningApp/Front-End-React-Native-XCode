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
  ImageBackground,
} from 'react-native';

import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

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
import LoginPage from './src/LoginPage';
import MyAccount from './src/account';

const appStackNavigator = createStackNavigator(
  {Homepage, Map, LoginPage, MyAccount},
  {initialRouteName: 'Homepage'},
);

const Application = createAppContainer(appStackNavigator);

class App extends Component {
  state = {
    latitude: null,
    longitude: null,
    endCoordinates: [],
  };

  changeEndCoordinates = endcoords => {
    this.setState({endCoordinates: []});
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
    if (Platform.OS !== 'ios') {
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
  }

  render() {
    {
      this.state.latitude === null && this.findCoordinates();
    }
    // console.log('STATE => ', this.state);
    return (
      <ImageBackground
        source={require('./assets/pics/running.jpeg')}
        style={styles.imgBackground}
        resizeMode="cover"
        imageStyle={{opacity: 0.2}}>
        {/* <Map /> */}
        {/* <Homepage /> */}
        <Application />
        {/* <LoginPage /> */}

        {/* <Map latitude={this.state.latitude} longitude={this.state.longitude} /> */}
        {/* <Homepage changeEndCoordinates={this.changeEndCoordinates} /> */}

        {/* <Text>Hello</Text> */}
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  imgBackground: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
});

export default App;
