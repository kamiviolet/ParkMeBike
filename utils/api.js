export const fetchParking = (locationParams, limit) => {
    if (locationParams.location) {
        const URL = `https://api.cyclestreets.net/v2/pois.locations?type=cycleparking&longitude=${locationParams.location.longitude}&latitude=${locationParams.location.latitude}&radius=${locationParams.radius}&limit=${limit}`
        return fetch(URL, {
            method: "GET",
            headers: {
                'X-API-KEY': '3c43e5d9434284f2',
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
    }
}

export const fetchPollution = (latitude, longitude)=>{
    const URL = `http://api.openweathermap.org/data/2.5/air_pollution?lat=50&lon=-2&appid=8014378fec4b1f18ce2a4783dda26aa4`
    return fetch(URL,{
        method: 'GET'
    }).then((res)=>res.json())
    
}