import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, View, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Signin from '../../screens/signin';
import ScanBLE from '../../screens/scanBLE';
import GetStarted from '../../screens/getStarted';
import MonitorBLE from '../../screens/monitorBLE';




const Stack = createNativeStackNavigator();
export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName='getStarted'
                screenOptions={{
                    headerShown: false,
                    gestureEnabled: false, // Disable swipe gesture for all screens
                }}
            >
                <Stack.Screen name='getStarted' component={GetStarted} />
                <Stack.Screen name='signin' component={Signin} />
                <Stack.Screen name='scanBLE' component={ScanBLE} />
                <Stack.Screen name='monitorBLE' component={MonitorBLE} />

            </Stack.Navigator>
        </NavigationContainer>
    )
}
