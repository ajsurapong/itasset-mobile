import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from './Page/splash'
import LoginScreen from './Page/login'
import HomeScreen from './Page/home'
import InformationScreen from './Page/information'
import UpdateScreen from './Page/update'
import ScanqrScreen from './Page/camera'
import CameraScreen from './Page/capture'
import LogoutScreen from './Page/logout';

const Stack = createStackNavigator();

function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Splash"
                screenOptions={{
                    headerShown: false
                }}
            >
                <Stack.Screen name="Splash" component={SplashScreen}/>
                <Stack.Screen name="Login" component={LoginScreen}/>
                <Stack.Screen name="Home" component={HomeScreen}/>
                <Stack.Screen name="Information" component={InformationScreen}/>
                <Stack.Screen name="Update" component={UpdateScreen}/>
                <Stack.Screen name="Scan" component={ScanqrScreen}/>
                <Stack.Screen name="Capture" component={CameraScreen}/>
                <Stack.Screen name="Logout" component={LogoutScreen}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
}


export default App;