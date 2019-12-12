import axios from 'axios';

export const getRoute = (startCoordinates, endCoordinates, avoidAreas) => {
  console.log('AVOID AREAS =>', avoidAreas);
  if (avoidAreas) {
    console.log(
      `https://route.api.here.com/routing/7.2/calculateroute.json?app_id=Txymz9FTINQege2cDfHs&app_code=IKjwYCNr4_RL87uEk4TvSQ&waypoint0=geo!${startCoordinates}&waypoint1=geo!${endCoordinates}&mode=fastest;pedestrian;traffic:disabled&avoidareas=${avoidAreas}`,
    );
    return axios.get(
      `https://route.api.here.com/routing/7.2/calculateroute.json?app_id=Txymz9FTINQege2cDfHs&app_code=IKjwYCNr4_RL87uEk4TvSQ&waypoint0=geo!${startCoordinates}&waypoint1=geo!${endCoordinates}&mode=fastest;pedestrian;traffic:disabled&avoidareas=${avoidAreas}`,
      // `https://route.api.here.com/routing/7.2/calculateroute.json?app_id=Txymz9FTINQege2cDfHs&app_code=IKjwYCNr4_RL87uEk4TvSQ&waypoint0=geo!${startCoordinates}&waypoint1=geo!${endCoordinates}&mode=fastest;pedestrian;traffic:disabled`
    );
  } else {
    return axios.get(
      `https://route.api.here.com/routing/7.2/calculateroute.json?app_id=Txymz9FTINQege2cDfHs&app_code=IKjwYCNr4_RL87uEk4TvSQ&waypoint0=geo!${startCoordinates}&waypoint1=geo!${endCoordinates}&mode=fastest;pedestrian;traffic:disabled`,
    );
  }
};

export const getPollutionData = () => {
  return axios.get('https://project-bhilt.appspot.com/api/pollution-points/');
};
