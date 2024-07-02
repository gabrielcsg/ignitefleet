# Vehicle Usage Management App

## Overview

This project is a Vehicle Usage Management App designed to help users track and manage their vehicle usage efficiently. The application leverages modern technologies and frameworks to provide a seamless and robust user experience.

## Features

- **Social Login**: Simplified user authentication using Google Authentication.
- **Online and Offline Database**: Data storage and synchronization with MongoDB Atlas and RealmDB.
- **Map and Geolocation**: Real-time user location tracking and display using maps.
- **Background Task**: Execute tasks in the background for continuous tracking and updates.

## Technologies Used

- **Expo**: For building cross-platform mobile applications.
- **Google Authentication**: For secure and easy social login.
- **MongoDB Atlas**: For online database management.
- **RealmDB**: For offline data storage and synchronization.
- **Map and Geolocation Services**: For tracking and displaying user locations.
- **Background Task Management**: For running tasks in the background.

## Getting Started

### Prerequisites

- Node.js
- Expo CLI
- MongoDB Atlas account
- Google Developer account (for Google Authentication setup)

### Installation

**Clone the repository:**
```bash
git clone https://github.com/gabrielcsg/ignitefleet.git
cd ignitefleet
```

**Install dependencies:**
```bash
npm install
```

**Set up environment variables:**

Create a .env file in the root directory and add your MongoDB Atlas and Google Authentication credentials.
```bash
# Google Cloud Platform
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=

# MongoDB Atlas
EXPO_PUBLIC_REALM_APP_ID=
```

**Start the development server:**
```bash
npx expo start
```

### Usage
- Login: Users can log in using their Google account.
- Track Usage: Track and manage vehicle usage, including start and end locations.
- View Map: See the current location and route on the map.
- Offline Support: Data is synchronized and available even when offline.

### Contributing
We welcome contributions! Please fork the repository and submit pull requests.

### License
This project is licensed under the MIT License.