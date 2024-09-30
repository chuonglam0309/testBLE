import {
  StyleSheet,
  Text,
  View,
  NativeModules,
  NativeEventEmitter,
  Platform,
  PermissionsAndroid,
  Button,
  FlatList,
  Alert,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Modal,
  TextInput
} from 'react-native'
import React, { useEffect, useState } from 'react'
import BleManager from 'react-native-ble-manager';
import { BLEDevice } from '../components/bleDevices';


const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);


const serviceUUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b"; // UUID của service cần đọc
const characteristicUUID = "beb5483e-36e1-4688-b7f5-ea07361b26a8"; // UUID của characteristic cần đọc
const receiveUUID = "beb5483e-36e1-4688-b7f5-ea07361b26a9";

const ScanBLE = (props) => {
  // nhận param liên quan đến navigation
  const { navigation, route } = props;
  // //functions of navigate to/back
  const { navigate, goBack } = navigation;

  const [isBLE, setIsBLE] = useState(false)
  const [isScanning, setIsScanning] = useState(false)//Kiểm tra xem có đang scan tìm thiết bị không??
  const [refreshing, setRefreshing] = useState(false)
  const [devices, setDevices] = useState([])// Lưu danh sách tạm của các tb BLE quét được
  const [isConnected, setIsConnected] = useState(true)// Kiểm tra xem đã kết nối thiết bị nào chưa??
  const array = [];
  const [value, setValue] = useState(0)// giá trị thông qua BLE







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
  const renderItem = ({ item }) => (
    <BLEDevice device={item} onPress={() => {
      connectToDevice(item)
      // console.log('nó đây', item);
    }} />
  );

  const startScan = () => {
    // setRefreshing(true)
    if (!isScanning) {
      BleManager.scan([], 5, false).then(() => {
        // Success code
        console.log("Scan started");
        setRefreshing(false)
      })
        .catch(e => console.log(e))

    }
  };


  // quét lại danh sách thiết bị ble
  const reScan = () => {
    BleManager.start({ showAlert: false })
      .then(() => {
        // Success code
        console.log("Module initialized");
        bleManagerEmitter.addListener("BleManagerDiscoverPeripheral", (device) => {
          handleDiscoverDevice(device)
        });
        startScan()
        console.log('scan!!');

      });
  }

  // đọc dữ liệu 1 lần
  const readFromDevice = (device) => {
    BleManager.read(
      device.mac,
      serviceUUID,
      characteristicUUID
    )
      .then((readData) => {
        // Success code
        console.log('New data:', readData[0]);
        setValue(readData[0])
        // https://github.com/feross/buffer
        // https://nodejs.org/api/buffer.html#static-method-bufferfromarray

      })
      .catch((error) => {
        // Failure code
        console.log(error);
      });
  }

  const isBleEnable = () => {
    BleManager.checkState().then((state) => {
      setIsBLE((prevIsBLE) => {
        if (state === 'on') {
          console.log('on');
          return true;
        } else {
          console.log('off');
          return false;
        }
      });
    });
  };
  // đọc dữ liệu pin từ thiết bị đọc liên tục
  const startStreamingData = async (device) => {
    BleManager.startNotification(device.mac, serviceUUID, characteristicUUID)
      //'0000180f-0000-1000-8000-00805f9b34fb','00002a19-0000-1000-8000-00805f9b34fb'
      .then(() => {
        console.log('Started continuous reading');

        // Lắng nghe sự kiện khi có dữ liệu mới
        bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', handleNewData);
      })
      .catch((error) => {
        console.log('Error starting continuous reading:', error);
      });



    // gọi hàm set dữ liệu cho biến value
    const handleNewData = (data) => {
      setValue(data)
      // setTest(data)
      // let stringData = '';

      // for (let i = 0; i < (data.value).length; i++) {
      //   stringData += String.fromCharCode(data.value[i]);
      // }
      // console.log(Number(stringData.split("|")[0]));
      // setValue(Number(stringData.split("|")[0]));

    };




    // BleManager.read(// đây là đọc dữ liệu 1 lần
    //   item.mac,
    //   "0000180f-0000-1000-8000-00805f9b34fb",
    //   "00002a19-0000-1000-8000-00805f9b34fb"
    // )
    //   .then((readData) => {
    //     // Success code
    //     console.log("Read: " + readData);

    //     // https://github.com/feross/buffer
    //     // https://nodejs.org/api/buffer.html#static-method-bufferfromarray
    //     // const buffer = Buffer.from(readData);
    //     // const sensorData = buffer.readUInt8(1, true);
    //   })
    //   .catch((error) => {
    //     // Failure code
    //     console.log(error);
    //   });
  }
  // ngưng kết nối với thiết bị đó 
  const disconnecToDevice = (mac) => {
    // A8:81:7E:6B:45:6C

    BleManager.disconnect(mac)
      .then(() => {
        // Success code
        console.log("Disconnected");
      })
      .catch((error) => {
        // Failure code
        console.log(error);
      });
  }
  const enableBluetooth = () => {
    BleManager.enableBluetooth()
      .then(() => {
        console.log('Bluetooth is enabled');
        setIsBLE(true)
      })
      .catch((error) => {
        console.log('Error enabling Bluetooth:', error);
      });
  };


  // kết nối thiết bị được chọn trên flatlist dựa vào macAddress
  const connectToDevice = (device) => {
    // A8:81:7E:6B:45:6C
    // setDeviceSelected(device.mac)
    BleManager.connect(device.mac)
      .then(() => {
        // Success code
        console.log("Connected");
        navigate('monitorBLE',{
          deviceInfo : device
        })
        
        // setDeviceSelected(device)
        // setIsConnected(true)
// // hàm nhận dữ liệu từ thiết bị
//         BleManager.retrieveServices(device.mac).then(
//           (peripheralInfo) => {
//             // Success code
//             // console.log("Peripheral info:", peripheralInfo);
//             console.log('Retrieved services');
//             startStreamingData(device)
//             // readFromDevice(device)
//           }
//         );

      })
      .catch((error) => {
        // Failure code
        console.log('error');
      });
  }
  //phát hiện thiết bị sau khi scan
  const handleDiscoverDevice = (device) => {
    const { name, rssi, id: mac } = device;
    setDevices((prevDevices) => {
      const isExist = prevDevices.some(d => d.mac === mac);
      if (!isExist) {
        return [...prevDevices, { name: name || '', rssi: rssi || '', mac }];
      }
      return prevDevices;
    });
  };



  
  useEffect(() => {
    isBleEnable()
    handleAndroidPermissions();
    if (isBLE) {
      BleManager.start({ showAlert: false })
        .then(() => {
          console.log("Module initialized");
          bleManagerEmitter.addListener("BleManagerDiscoverPeripheral", (device) => {
            handleDiscoverDevice(device);
          });
          startScan();
        });
    }
  }, [isBLE]);

  return (
    <SafeAreaView>
      {
        isBLE ?
          undefined
          :
          <View>
            <Text style={{ textAlign: 'center' }}>Please click <Text>" Enable Bluetooth "</Text></Text>
            <Button title="Enable Bluetooth" onPress={enableBluetooth} />
          </View>

      }
   

     
        <FlatList
          contentContainerStyle={{ paddingBottom: 30 }}
          data={devices}
          renderItem={renderItem}
          keyExtractor={(item, index) => item.mac}
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            reScan()
          }}
        />

     

    </SafeAreaView>
  )
}
export default ScanBLE