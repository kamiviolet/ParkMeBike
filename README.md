# ParkMeBike

## Whats all this then?

Out somewhere new on the bike and need a snack? Need somewhere decent to park your bike?

The ParkMeBike allows users to find cycle parking spaces nearby or anywhere you look on the map.

For privacy concerns and security reasons, users must sign up to the app before the first use and sign in if they signed out previously.

(Currently ParkMeBike is under reviewing and refactoring for better performance. Any updates will be released on README.md here.)

## Features of the app:

- Users can view their current location.
- Users can find any cycle parkings on the map.
- Users can preview the street view of the location of the parking.
- Users can adjust the search radius and number of parking spots within the control panel. 
- Users can ask for real-time traffic level on the map. 
- Users can get the suggested route between their current location and any targeted parking lot with distance (in kilometers).
- Users can track back their past record of parking lots in their profile page.
- Users can edit their email and avatar.
- Users can keep photo of their bicycle (only one) in their account.

Possible features (under development):
- Users can rate and leave comments to any parking lots they have used.
- Users can view any local bike shops.
- Users can bookmark any parking lots as their favourite one.
- Users can store more than one bicycle in their account.
- Community/Channel function for more user interactions.

## Tech stacks used for ParkMeBike development

### Frameworks/Libraries:
React Native, Expo (Go, Location, etc), React Navigation, Formik

### Styling
Nativewind(TailwindCSS)

### Backend support:
Firebase(Firebase Authentication & Firestore)

### Third-parties APIS:
Google Map SDK, Google Directions, Google Street View Static, CycleStreet

## To Run ParkMeBike

ParkMeBike is tested to run in iOS devices and Android devices. Yet the interface may be adapted to different models.

As the app has not yet been deployed to be in apk format, in order to run it, please follow the steps as below.

### Clone this repo
```
https://github.com/kamiviolet/ParkMeBike.git
```
### Go to the folder you made
```
cd ParkMeBike
```
### Install the dependencies
```
npm install
```
#Download Expo Go for your mobile device
Please go to your usual app provider service e.g. app store (apple) or google play (android) and download the expo go app more info [here](https://expo.dev/client)

### Run the app
```
npm start
```
or
```
npx expo start
```
