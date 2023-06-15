**Collection: Users**

Document ID: userId (from Firebase Authentication)

Fields - email, username, avatar, active (boolean), bikeId (can be null or an id), history (an array of parkingSpotIds)

**Collection: Bikes**

Document ID: bikeId

Fields - userId, details (could be an object with bike details), parkedSpotId 

**Collection: ParkingSpots**

Document ID - parkingSpotId

Fields - details (object with parking spot details), ratings (array of objects with userId and rating), comments (array of objects with userId and comment)