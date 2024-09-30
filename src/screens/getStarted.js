import {
    StyleSheet,
    Text,
    View,
    NativeModules,
    NativeEventEmitter,
    Platform,
    PermissionsAndroid,
    FlatList,
    Alert,
    TouchableOpacity,
    ScrollView,
    SafeAreaView
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { Button } from '../components/button'

const GetStarted = (props) => {
    const { navigation, route } = props;
    const { navigate, goBack } = navigation;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.contentTitle}>GET STARTED</Text>
                <Text style={{ fontSize: 14 }}>Please select the application mode you want to operate</Text>
            </View>
            <View style={styles.button}>
                <Button tittle={'Control via Internet'} bgcolors={'#00B8F9'} textcolors={'white'} onPress={() => { navigate('signin') }}/>
                <Button tittle={'Control via Bluetooth'} bgcolors={'white'} textcolors={''} onPress={() => { navigate('scanBLE') }}/>
                <Button tittle={'Control via Bluetooth'} bgcolors={'white'} textcolors={''} onPress={() => { navigate('monitorBLE') }}/>




            </View>
        </SafeAreaView>
    )
}
export default GetStarted
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    content: {
        flex: 5.5,
        // backgroundColor:'red',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    contentTitle: {
        fontWeight: '900',
        fontSize: 25,
        color: 'black'
    },
    button: {
        flex: 4.5,
        // backgroundColor:'blue',
        // justifyContent:'center'
    },
})