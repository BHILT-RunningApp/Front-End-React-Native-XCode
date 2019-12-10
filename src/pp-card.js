import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import axios from 'axios';
import {retrieveNestedData} from '../utils/utils';

export default class PollutionPointCard extends React.Component {
  state = {
    pollution_point: {},
    isLoading: true,
  };
  //to add:
  // pass the pollution point id on props to the end point below
  componentDidMount() {
    axios
      .get(
        'https://project-bhilt.appspot.com/api/pollution-points/5def94a1d5e6bb4ecb429416',
      )
      .then(response => {
        this.setState({
          pollution_point: response.data.pollutionPoint,
          isLoading: false,
        });
      });
  }

  render() {
    const {pollution_point} = this.state;
    //util function manipulates the nested object into arrays
    const pollutionPairs = retrieveNestedData(pollution_point);
    const amArr = pollutionPairs[0];
    // const midday = pollutionPairs[1];
    // const pm = pollutionPairs[2];
    let aqi = 0;
    let no2 = 0;
    let pm10 = 0;
    let so2 = 0;
    let o3 = 0;
    let pm25 = 0;

    if (!this.state.isLoading) {
      amArr.map(element => {
        if (element.includes('aqi:')) {
          let score = element.split(':');
          aqi = score[1];
        }
        if (element.includes('no2:')) {
          let score = element.split(':');
          no2 = score[1];
        }
        if (element.includes('pm10:')) {
          let score = element.split(':');
          pm10 = score[1];
        }
        if (element.includes('so2:')) {
          let score = element.split(':');
          so2 = score[1];
        }
        if (element.includes('o3:')) {
          let score = element.split(':');
          o3 = score[1];
        }
        if (element.includes('pm25:')) {
          let score = element.split(':');
          pm25 = score[1];
        }
      });
    }

    return (
      <View style={styles.container}>
        {!this.state.isLoading && (
          <>
            <Text>Station: {pollution_point.name}:</Text>
            <Text>Current AQI: {aqi}</Text>
            <Text>Nitrogen Dioxide: {no2}</Text>
            <Text>PM10: {pm10}</Text>
            <Text>Sulfur Dioxide: {so2}</Text>
            <Text>Ozone: {o3}</Text>
            <Text>PM2.5: {pm25}</Text>
          </>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(232, 232, 232, 1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
