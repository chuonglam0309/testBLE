import React, { useEffect, useState, useCallback } from 'react';
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
  SafeAreaView,
  Modal,
  TextInput,
  Image,
  Switch,
} from 'react-native'
import BleManager from 'react-native-ble-manager';




const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

export default function App() {



  const handleAndroidPermissions = () => {
    if (Platform.OS === 'android' && Platform.Version >= 31) {
      PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]).then(result => {
        if (result) {
          console.debug(
            '[handleAndroidPermissions] User accepts runtime permissions android 12+',
          );
        } else {
          console.error(
            '[handleAndroidPermissions] User refuses runtime permissions android 12+',
          );
        }
      });
    } else if (Platform.OS === 'android' && Platform.Version >= 23) {
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ).then(checkResult => {
        if (checkResult) {
          console.debug(
            '[handleAndroidPermissions] runtime permission Android <12 already OK',
          );
        } else {
          PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          ).then(requestResult => {
            if (requestResult) {
              console.debug(
                '[handleAndroidPermissions] User accepts runtime permission android <12',
              );
            } else {
              console.error(
                '[handleAndroidPermissions] User refuses runtime permission android <12',
              );
            }
          });
        }
      });
    }
  };




  // đọc dữ liệu 1 lần
  const readFromDevice = (device) => {
    BleManager.read(
      device,
      '0000180f-0000-1000-8000-00805f9b34fb',
      '00002a19-0000-1000-8000-00805f9b34fb'
    )
      .then((readData) => {
        // Success code
        console.log('New data:', readData);
        // https://github.com/feross/buffer
        // https://nodejs.org/api/buffer.html#static-method-bufferfromarray

      })
      .catch((error) => {
        // Failure code
        console.log(error);
      });
  }

// hàm kết nối đến thiết bị
  const connectToDevice = (macDevice) => {
    // A8:81:7E:6B:45:6C
    BleManager.connect(macDevice)
      .then(() => {
        // Success code
        console.log("Connected");
        // setDeviceSelected(device)

        BleManager.retrieveServices(macDevice).then(
          (peripheralInfo) => {
            // Success code
            console.log("Peripheral info:", peripheralInfo);
            console.log('Retrieved services');
            readFromDevice(macDevice)
          }
        );

      })
      .catch((error) => {
        // Failure code
        console.log('error');
      });
  }








  useEffect(()=>{
    handleAndroidPermissions()
    BleManager.start({showAlert:false})
    .then(()=>{
      //Success code
      console.log("Module initialized");
      bleManagerEmitter.addListener("BleManagerDiscoverPeripheral",(device)=>{
        console.log(device)
      })
      BleManager.scan([],5,true).then(()=>{
        //Success Scan
        console.log('Scan Started');
      })
    })
  })


  return(
    <View>
      <TouchableOpacity
      onPress={()=>{
        connectToDevice('90:E1:7B:09:21:1E')
      }}
      >
      <Text>
        Test
      </Text>
      </TouchableOpacity>
    </View>


  )}