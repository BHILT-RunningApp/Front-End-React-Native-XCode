
export const retrieveNestedData = (pp) => {
    const pairs = [];
    const renderData = Object.keys(pp).map(item => {
        const tempArr = []
        if (pp[item].pollutants) {
            tempArr.push(item)
        }
        const pollutants = pp[item].pollutants;
        if (pp[item].aqi) {
            tempArr.push(`aqi: ${pp[item].aqi}`)
        }
        if (pollutants) {
            const eachPollutant = Object.keys(pollutants).map(item => {
                const onePoll = pollutants[item]
                tempArr.push(`${item}:${onePoll}`)
            })
        }
        if (tempArr.length > 0) {
            pairs.push(tempArr)
        }
    })
    return pairs
}
