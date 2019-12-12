export const retrieveNestedData = pp => {
  const pairs = [];
  const renderData = Object.keys(pp).map(item => {
    const tempArr = [];
    if (pp[item].pollutants) {
      tempArr.push(item);
    }
    const pollutants = pp[item].pollutants;
    if (pp[item].aqi) {
      tempArr.push(`aqi: ${pp[item].aqi}`);
    }
    if (pollutants) {
      const eachPollutant = Object.keys(pollutants).map(item => {
        const onePoll = pollutants[item];
        tempArr.push(`${item}:${onePoll}`);
      });
    }
    if (tempArr.length > 0) {
      pairs.push(tempArr);
    }
  });
  return pairs;
};

export const makeAvoidString = pollutionData => {
  //TL LAT, TL LONG;BR LAT, BR LONG!

  let output = '';

  pollutionData.forEach(item => {
    output += `${item.am.top_corner.lat},${item.am.top_corner.long};${item.am.bottom_corner.lat},${item.am.bottom_corner.long}!`;
  });

  // output

  return output.substring(0, output.length - 1);
};
