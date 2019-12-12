import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  Dimensions,
  Alert,
} from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import LogoTitle from './LogoTitle';
// import Map from './Map';
import MyAccount from './account';

// import {createAppContainer} from 'react-navigation';
// import {createStackNavigator} from 'react-navigation-stack';

import Geolocation from 'react-native-geolocation-service';

MapboxGL.setAccessToken(
  'pk.eyJ1IjoiaGFycnlwZnJ5IiwiYSI6ImNrM3EwYTVmYjA4Mzgzbm1vd2h0NjRobDgifQ.ZrK9wTTyKg6YpwI2KGC9bQ',
);

// import EndPointMap from "./endpointmap";

export default class Homepage extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      headerTitle: <LogoTitle />,
      headerRight: (
        <>
          <Button
            color="#2196F3"
            title="Log in"
            onPress={navigation.getParam('LoginPage')}
          />

          <Button
            color="#2196F3"
            title="Map"
            onPress={navigation.getParam('Map')}
          />
          <Button
            color="#2196F3"
            title="MyAccount"
            onPress={navigation.getParam('MyAccount')}
          />
        </>
      ),
      headerStyle: {
        backgroundColor: '#2196F3',
        color: 'white',
      },
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      user: {},
      username: '',
      location: '',
      latitudeDelta: 0.0022,
      longitudeDelta: 0.0121,
      latitude: 0,
      longitude: 0,
      defaultCenter: {
        lat: 53.479915,
        lng: -2.236825,
      },
      zoom: 14,
      markerDropped: false,
      startCoordinates: [],
      endCoordinates: [],
    };
  }

  componentDidMount() {
    this.findCoordinates();
    this.props.navigation.setParams({
      LoginPage: () => this.props.navigation.navigate('LoginPage'),
      Map: () => this.props.navigation.navigate('Map'),
      MyAccount: () => this.props.navigation.navigate('MyAccount'),
    });
    return fetch('https://project-bhilt.appspot.com/api/users')
      .then(response => response.json())
      .then(responseJson => {
        const singleUser = responseJson.users.filter(user => {
          return user.username == 'ben';
        });
        const location = singleUser[0].current_location.split(', ');
        const latitude = Number(location[0]);
        const longitude = Number(location[1]);
        this.setState({
          isLoading: false,
          user: singleUser,
          username: singleUser[0].username,
          location: singleUser[0].current_location,
          latitude: latitude,
          longitude: longitude,
        });
      })
      .catch(error => {
        console.error(error);
      });
  }

  findCoordinates = () => {
    // console.log('Find coordinates running');
    Geolocation.getCurrentPosition(
      location => {
        console.log(location.coords.latitude, location.coords.longitude);
        this.setState({
          startCoordinates: [
            location.coords.latitude,
            location.coords.longitude,
          ],
        });
      },
      error => {
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  mapPressed = e => {
    // console.log(e.geometry.coordinates);
    this.setState({
      endCoordinates: [e.geometry.coordinates[1], e.geometry.coordinates[0]],
      markerDropped: true,
    });
  };

  render() {
    // {
    //   this.state.startCoordinates === null && this.findCoordinates();
    // }
    const username = this.props.navigation.getParam('username');
    // console.log('PROPS =>', this.props.navigation.getParam('username'));
    if (this.state.isLoading) {
      return (
        <View>
          <Text style={styles.loading}>Loading...</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.homepage}>
          <View style={styles.welcome}>
          <Text style={styles.welcomeText}>
                Welcome to Saviar
                {username ? (
                  <Text> {username}</Text>
                ) : (
                  <Text> - Please log in</Text>
                )}
              </Text>
            <Text style={styles.welcomeText}>
              A clean
              route through impure air!{'\n'}
              {'\n'}
              Please, tab on a point, on the map below to select the end point
              for your route. Then, click "Find best route"
            </Text>
          </View>
          <View style={styles.page}>
            <View style={styles.container}>
              <MapboxGL.MapView onPress={this.mapPressed} style={styles.map}>
                <MapboxGL.UserLocation visible={true} />
                <MapboxGL.Camera
                  defaultSettings={{
                    centerCoordinate: [
                      this.state.startCoordinates[1],
                      this.state.startCoordinates[0],
                    ],
                    zoomLevel: this.state.zoom,
                  }}
                />
                {this.state.markerDropped && (
                  <MapboxGL.PointAnnotation
                    id={'1'}
                    coordinate={[
                      this.state.endCoordinates[1],
                      this.state.endCoordinates[0],
                    ]}
                  />
                )}
              </MapboxGL.MapView>
              <Button
                title="Create Route"
                color="#11A0E2"
                onPress={() => {
                  if (!this.state.markerDropped) {
                    Alert.alert('Please drop pin');
                  } else {
                    this.props.navigation.navigate('Map', {
                      endCoordinates: this.state.endCoordinates,
                      startCoordinates: this.state.startCoordinates,
                    });
                  }
                }}
              />
            </View>
          </View>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  homepage: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 30,
    paddingRight: 20,
  },
  loading: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 100,
    fontSize: 40,
    fontWeight: 'bold',
  },
  welcomeText: {
    alignItems: 'center',
    textAlign: 'center',
    padding: 20,
    color: '#24354f',
    fontFamily: 'NotoSantsTC-Black',
    fontSize: 12,
  },
  map: {
    flex: 1,
    height: 100,
    width: Dimensions.get('window').width - 50,
    padding: 0,
  },

  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    padding: 0,
  },
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: '#2196F3',
    padding: 0,
  },
});

const mapStyle = StyleSheet.create({
  annotationContainer: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 15,
  },
  annotationFill: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'green',
    transform: [{scale: 0.6}],
  },
});
