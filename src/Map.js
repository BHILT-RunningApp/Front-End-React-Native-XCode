/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
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

import {makeAvoidString} from '../utils/utils';

import {getRoute, getPollutionData} from '../api/api';
import PollutionPointCard from './pp-card';

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
  annotationContainerPollution: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
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
    markers: {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: [],
          },
        },
      ],
    },
    zoom: 14,
    // startCoordinates: [53.457915, -2.226825],
    // endCoordinates: [53.487144, -2.248454],
    // startCoordinates: [],
    // endCoordinates: [],
    pollutionData: [],
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

  static navigationOptions = {
    title: 'Saviar',
  };

  fetchRoute = (startCoordinates, endCoordinates, avoidAreas) => {
    getRoute(startCoordinates, endCoordinates, avoidAreas).then(({data}) => {
      const markerArr = [];
      data.response.route[0].leg[0].maneuver.forEach(point => {
        markerArr.push([point.position.longitude, point.position.latitude]);
      });
      this.setState({
        markers: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: {},
              geometry: {type: 'LineString', coordinates: markerArr},
            },
          ],
        },
      });
    });
  };

  fetchPollutionData = () => {
    getPollutionData().then(({data: {pollutionPoints}}) => {
      this.setState({pollutionData: pollutionPoints});
      this.fetchRoute();
    });
  };

  showPollutionData = () => {
    const TOD = 'am';
    return this.state.pollutionData.map((point, index) => {
      return (
        <MapboxGL.PointAnnotation
          key={index}
          id={String(index)}
          coordinate={[point.pp_coordinates.long, point.pp_coordinates.lat]}
          title={''}>
          <View style={mapStyle.annotationContainerPollution}>
            {/* <View style={mapStyle.annotationFill} /> */}
          </View>
          <MapboxGL.Callout
            title={`Name: ${point.name}\n\nCurrent AQI: ${point[TOD].aqi}\nNitrogen Dioxide: ${point[TOD].pollutants.no2}\nPM10: ${point[TOD].pollutants.pm10}\nSulphur Dioxide: ${point[TOD].pollutants.so2}\nOzone: ${point[TOD].pollutants.o3}\nPM2.5: ${point[TOD].pollutants.pm25}`}
            // style={mapStyle.annotationFill}
          />
        </MapboxGL.PointAnnotation>
      );
    });
  };

  componentDidMount() {
    console.log('MOUNT PD', this.state.pollutionData);

    MapboxGL.setTelemetryEnabled(false);
    // this.fetchPollutionDat

    getPollutionData().then(({data: {pollutionPoints}}) => {
      this.setState({pollutionData: pollutionPoints}, () => {
        this.fetchRoute(
          this.props.navigation.getParam('startCoordinates'),
          this.props.navigation.getParam('endCoordinates'),
          makeAvoidString(this.state.pollutionData),
        );
      });
      // this.setState({pollutionData: pollutionPoints}, () => {
      //   this.fetchRoute(
      //     this.props.navigation.getParam('startCoordinates'),
      //     this.props.navigation.getParam('endCoordinates'),
      //     makeAvoidString(this.state.pollutionData),
      //   );
      // });
    });

    // this.fetchRoute(
    //   this.props.navigation.getParam('startCoordinates'),
    //   this.props.navigation.getParam('endCoordinates'),
    //   makeAvoidString(this.state.pollutionData),
    // );
  }

  componentDidUpdate(prevprops, prevstate) {
    // console.log('MARKERS', this.state.markers);
    // if (prevstate.markers.values() !== this.state.markers.values()) {
    //   this.fetchRoute(
    //     this.props.navigation.getParam('startCoordinates'),
    //     this.props.navigation.getParam('endCoordinates'),
    //     makeAvoidString(this.state.pollutionData),
    //   );
    // }
  }

  //   render() {
  //     return <PollutionPointCard />;
  //   }

  render() {
    console.log(
      'End Coords => ',
      this.props.navigation.getParam('endCoordinates'),
    );
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

            {/* {this.state.markers.features[0].geometry.coordinates.map(
              (marker, index) => {
                return (
                  <MapboxGL.PointAnnotation
                    key={index}
                    id={String(index)}
                    coordinate={[marker[0], marker[1]]}
                    title={''}>
                    <View style={mapStyle.annotationContainer}>
                      <View style={mapStyle.annotationFill} />
                    </View>
                  </MapboxGL.PointAnnotation>
                );
              },
            )} */}
            <MapboxGL.PointAnnotation
              id={'End Point'}
              coordinate={[
                this.props.navigation.getParam('endCoordinates')[1],
                this.props.navigation.getParam('endCoordinates')[0],
              ]}
            />
            {this.state.pollutionData.map(point => {
              console.log('PP =>', point.am.top_corner.lat);
            })}
            {this.showPollutionData()}
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
                    'rgb(51,255,20,0)',
                    0.2,
                    'rgb(51,255,20,0)',
                    0.4,
                    'rgb(209,229,240,0)',
                    0.6,
                    'rgb(253,219,199,0)',
                    0.8,
                    'rgb(239,138,98,0)',
                    1,
                    'rgb(178,24,43,0)',
                  ],
                  heatmapRadius: 100,
                  heatmapIntensity: 0.4,
                  heatmapOpacity: 0.8,
                }}
              />
            </MapboxGL.ShapeSource>
            {/* <MapboxGL.ShapeSource id="route-shape" shape={this.state.markers}>
              <MapboxGL.LineLayer
                id="route-line"
                style={{
                  lineColor: 'red',
                  lineWidth: 5,
                  lineOpacity: 0.5,
                  lineJoin: 'round',
                }}
              />
            </MapboxGL.ShapeSource> */}
          </MapboxGL.MapView>
        </View>
      </View>
    );
  }
}

// const style = StyleSheet.create({});

export default Map;
