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
    markers: [[-2, 53]],
    zoom: 12,
    startCoordinates: [53.457915, -2.226825],
    endCoordinates: [53.487144, -2.248454],
    pollutionData: [
      {
        pp_coordinates: {
          lat: 53.481471,
          long: -2.242734,
        },
        am: {
          pollutants: {
            no2: 86.44,
            pm10: 43.33,
            so2: 0.44,
            o3: 2.59,
            pm25: 25.3,
          },
          top_corner: {
            lat: 53.458971,
            long: -2.250234,
          },
          bottom_corner: {
            lat: 53.503971,
            long: -2.235234,
          },
          aqi: 3,
        },
      },
    ],
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
    getRoute(startCoordinates, endCoordinates, avoidAreas).then(({data}) => {
      const markerArr = [];
      data.response.route[0].leg[0].maneuver.forEach(point => {
        markerArr.push([point.position.longitude, point.position.latitude]);
      });
      this.setState({markers: markerArr});
    });
  };

  fetchPollutionData = () => {
    getPollutionData().then(({data: {pollutionPoints}}) => {
      this.setState({pollutionData: pollutionPoints});
    });
  };

  showPollutionData = () => {
    const TOD = 'am';
    return this.state.pollutionData.map((point, index) => {
      // console.log(point);
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
    MapboxGL.setTelemetryEnabled(false);
    this.fetchRoute(
      [this.props.latitude, this.props.longitude],
      this.state.endCoordinates,
    );
    this.fetchPollutionData();
  }

  //   render() {
  //     return <PollutionPointCard />;
  //   }

  render() {
    // console.log('PP => ', this.state.pollutionData);
    console.log(this.props.latitude);
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
                  title={''}>
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
