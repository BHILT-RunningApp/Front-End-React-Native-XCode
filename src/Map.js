import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import {getRoute} from '../api/api';

import MapboxGL from '@react-native-mapbox-gl/maps';

MapboxGL.setAccessToken(
  'pk.eyJ1IjoiaGFycnlwZnJ5IiwiYSI6ImNrM3EwYTVmYjA4Mzgzbm1vd2h0NjRobDgifQ.ZrK9wTTyKg6YpwI2KGC9bQ',
);

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: 'tomato',
  },

  map: {
    flex: 1,
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

class Map extends Component {
  state = {
    //CURRENTLY REQUIRED
    defaultCenter: {
      lat: 53.479915,
      lng: -2.236825,
    },
    markers: [[-2, 53]],
    zoom: 12,
    startCoordinates: [53.457915, -2.226825],
    endCoordinates: [53.487144, -2.248454],
    //NOT REQUIRED CURRENTLY
    directions: [],
    rectangle: [
      [53.447967, -2.260778],
      [53.443699, -2.25168],
    ],
    isLoading: true,
    avoidAreaToggle: true,
    radius: 64,
    blur: 8,
    max: 0.5,
    pollutionCoeff: 0.8,
  };

  fetchRoute = (startCoordinates, endCoordinates, avoidAreas) => {
    // console.log('in fetch route');
    getRoute(startCoordinates, endCoordinates, avoidAreas).then(({data}) => {
      // console.log(data.response.route[0].leg[0]);
      const markerArr = [];
      data.response.route[0].leg[0].maneuver.forEach(point => {
        markerArr.push([point.position.longitude, point.position.latitude]);
      });
      // console.log(markerArr);
      this.setState({markers: markerArr});
    });
  };

  componentDidMount() {
    MapboxGL.setTelemetryEnabled(false);
    this.fetchRoute(this.state.startCoordinates, this.state.endCoordinates);
  }

  render() {
    return (
      <View style={styles.page}>
        <View style={styles.container}>
          <MapboxGL.MapView style={styles.map}>
            <MapboxGL.UserLocation visible={true} />
            <MapboxGL.Camera
              defaultSettings={{
                centerCoordinate: [
                  this.state.defaultCenter.lng,
                  this.state.defaultCenter.lat,
                ],
                zoomLevel: this.state.zoom,
              }}
            />
            {this.state.markers.map((marker, index) => {
              return (
                <MapboxGL.PointAnnotation
                  key={index}
                  id={String(index)}
                  coordinate={[marker[0], marker[1]]}
                  title={'no me toques los huevos'}>
                  <View style={mapStyle.annotationContainer}>
                    <View style={mapStyle.annotationFill} />
                  </View>
                  <MapboxGL.Callout
                    title="no me toques los huevos"
                    // style={mapStyle.annotationFill}
                  />
                </MapboxGL.PointAnnotation>
              );
            })}
            <MapboxGL.ShapeSource
              id="earthquakes"
              url="https://project-bhilt.appspot.com/api/pollution-points">
              <MapboxGL.HeatmapLayer
                id="earthquakes"
                sourceID="earthquakes"
                style={{
                  heatmapColor: [
                    'interpolate',
                    ['linear'],
                    ['heatmap-density'],
                    0,
                    'rgba(33,102,172,0)',
                    0.2,
                    'rgb(103,169,207)',
                    0.4,
                    'rgb(209,229,240)',
                    0.6,
                    'rgb(253,219,199)',
                    0.8,
                    'rgb(239,138,98)',
                    1,
                    'rgb(178,24,43)',
                  ],
                  heatmapRadius: 100,
                  heatmapOpacity: 0.8,
                }}
              />
            </MapboxGL.ShapeSource>
          </MapboxGL.MapView>
        </View>
      </View>
    );
  }
}

export default Map;
