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