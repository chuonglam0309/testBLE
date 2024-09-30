import React, { useEffect, useState, useCallback, useRef } from 'react';
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
  useWindowDimensions
} from 'react-native'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import RangeSlider from '../components/rangeSlider';
import UIHeader from '../components/UIHeader';
import DatePicker from 'react-native-date-picker';
import { Button } from '../components/button';
import { Buffer } from 'buffer';
import { error } from 'console';
import { LogBox } from 'react-native';
import BleManager from 'react-native-ble-manager';
import { BLEDevice } from '../components/bleDevices';
import { stringToBytes } from "convert-string";




// khai báo autoscreen
const AutoScreen = ({handleTempChange, handleHumChange, handleCoChange}) => {
  return(
    <View style={{ flex: 1, paddingHorizontal: 10,}}>
 
      <View style={{ flex: 1, justifyContent: 'space-around' }}>
        <View style={styles.controlAutoViews}>
        <RangeSlider
       title={'Temperature(°C)'}
        from={0}
        to={200}
        handleChange={(low, high) => {
          handleTempChange(low,high)
        }}
      />
          </View>
        <View style={styles.controlAutoViews}>
        <RangeSlider
       title={'Humidity(%RH)'}
        from={0}
        to={100}
        handleChange={(low, high) => {
          handleHumChange(low,high)
         }}
      />
     
        </View>
        <View style={styles.controlAutoViews}>
        <RangeSlider
       title={'CO2(PPM)'}
        from={0}
        to={1000}
        handleChange={(low, high) => {
          handleCoChange(low, high)
        }}
      />
         
        </View>
      </View>
      <View style={{ flex: 1 }}>

      </View>
    </View>
);
}



// khai báo timerScreen
const TimerScreen = () => {
  const [isEnabled, setIsEnabled] = useState(false);


  const [showOnTimePicker, setShowOnTimePicker] = useState(false);
  const [showOffTimePicker, setShowOffTimePicker] = useState(false);

  // const [selectedTime, setSelectedTime] = useState(new Date()); // Thêm biến trạng thái

  const [rangeTimer,setRangeTimer] =useState({
    onTime: new Date(),
    offTime: new Date(),
  })
  return (
    <View style={{ flex: 1, paddingHorizontal: 10, margin: 10 }}>
      <View style={{ flex: 1, justifyContent: 'space-around', }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
          <Text style={styles.textControlPower} >Timer</Text>
        </View>
        <View style={{ height: '50%', justifyContent: 'space-evenly' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 16, fontWeight: '600' }}>On</Text>
            <TouchableOpacity
              onPress={() => {
                setShowOnTimePicker(!showOnTimePicker)
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#B3B3B3' }}>{rangeTimer.onTime.getHours()}:{rangeTimer.onTime.getMinutes()}</Text>
            </TouchableOpacity>
            <DatePicker
              modal
              is24hourSource="locale"
              mode="time"
              open={showOnTimePicker}
              date={rangeTimer.onTime}
              onConfirm={(date) => {
                setRangeTimer((prevRangeTimer) => ({
                  ...prevRangeTimer,
                  onTime: date,
                }));
              }}
              onCancel={() => {
                setShowOnTimePicker(false)
              }}
            />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 16, fontWeight: '600' }}>Off</Text>
            <TouchableOpacity
              onPress={() => {
                setShowOffTimePicker(!showOffTimePicker)
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#B3B3B3' }}>{rangeTimer.offTime.getHours()}:{rangeTimer.offTime.getMinutes()}</Text>
            </TouchableOpacity>
            <DatePicker
              modal
              is24hourSource="locale"
              mode="time"
              open={showOffTimePicker}
              date={rangeTimer.offTime}
              onConfirm={(date) => {
                setRangeTimer((prevRangeTimer) => ({
                  ...prevRangeTimer,
                  offTime: date,
                }));
              }}
              onCancel={() => {
                setShowOffTimePicker(false)
              }}
            />
          </View>

        </View>

      </View>
      <View style={{ flex: 3, }}>
        {/* <Button tittle={'Receive BLE'} bgcolors={'white'} textcolors={''} onPress={() => {
          BleManager.retrieveServices(deviceInfo.mac).then(
            (peripheralInfo) => {
              // Success code
              console.log("Peripheral info:", peripheralInfo);
              console.log('Retrieved services');
              startStreamingData(deviceInfo)
              readFromDevice(deviceInfo)
            }
          );
        }} /> */}

        {/* <Button tittle={'Send data'} bgcolors={'white'} textcolors={''} onPress={() => {
          BleManager.write(
            deviceInfo.mac,
            '7905f431-b5ce-4e99-a40f-4b1e122d00d0',
            '69d1d8f3-45e1-49a8-9821-9bbdfdaad9d9',
            [83, 0, 101, 0, 110, 0, 100, 0]
          )
            .then(() => {
              // Success code
              console.log("Writed: ");
            })
            .catch((error) => {
              // Failure code
              console.log(error);
            });
        }} /> */}

      </View>


      {/* <View style={{ flexDirection:'row', justifyContent:'space-between' }}>
        <Text style={styles.textControlPower} >Scheduled Time</Text>
        <Switch
        trackColor={{false: '#767577', true: '#34C759'}}
        thumbColor={isEnabled ? '#f4f3f4' : '#f4f3f4'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch}
        value={isEnabled}
        style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }}
      />
        </View>
        <View>
        <Text style={{fontSize:16, fontWeight:'600'}}>Power On</Text>
        <Text style={{fontSize:16, fontWeight:'600',color:'#B3B3B3'}}>07:00</Text>
        </View> */}

    </View>
  );
}

//khai báo manualscreen
const ManualScreen = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  return (
    <View style={{ flex: 1, paddingHorizontal: 10, marginVertical: 10 }}>

      <View style={styles.mainControlManual}>
        <View style={styles.controlPowerView}>
          <Text style={styles.textControlPower}>Power</Text>
          <Switch
            trackColor={{ false: '#767577', true: '#34C759' }}
            thumbColor={isEnabled ? '#f4f3f4' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
            style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }}
          />
        </View>
        <View style={styles.controlScheduleView}>

        </View>
      </View>
      <View style={styles.blankControlManual}>
      </View>
    </View>
  );
};








const MonitorBLE = (props) => {
// hàm để lưu giá trị đang ở màn hình nào 
const [index, setIndex] = useState(0);

const layout = useWindowDimensions();

// nhận param liên quan đến navigation
const { navigation, route } = props;
// //functions of navigate to/back
const { navigate, goBack } = navigation;
const { deviceInfo } = route?.params || {};


// hàm để lấy giá trị của rangeSlider từ AutoScreen
const [minTemp, setMinTemp] = useState(0);
const [maxTemp, setMaxTemp] = useState(0);


//khai báo nơi lưu trữ dữ liệu nhiệt độ, độ ẩm CO2
const [thresholds, setThresholds] = useState({
  temperature: { min: 0, max: 0 },
  humidity: { min: 0, max: 0 },
  co2: { min: 0, max: 0 }
});






//route của tabview
const [routes] = useState([
  { key: 'first', title: 'Auto' },
  { key: 'second', title: 'Timer' },
  { key: 'third', title: 'Manual' },
]);

const renderScene = ({ route }) => {
  switch (route.key) {
    case 'first':
      return <AutoScreen handleTempChange={handleTempChange} handleHumChange={handleHumChange} handleCoChange={handleCoChange}/>;
    case 'second':
      return <TimerScreen />;
      case 'third':
        return <ManualScreen />;
    default:
      return null;
  }
};


  

const handleTempChange = (minValue, maxValue) => {
  setMinTemp(minValue)
  setMaxTemp(maxValue)
  console.log('mainMin'+minValue);
  console.log('mainMax'+maxValue);
}
const handleHumChange = (minValue, maxValue) => {

  console.log('mainHumMin'+minValue);
  console.log('mainHumMax'+maxValue);
}
const handleCoChange = (minValue, maxValue) => {

  console.log('mainCoMin'+minValue);
  console.log('mainCoMax'+maxValue);
}

  const renderTabBar = (props) => (
    <TabBar
      style={{
        backgroundColor: '#d5d5d2',
        borderRadius: 10,
        width: '70%',
        alignSelf: 'center'
      }}
      {...props}
      indicatorStyle={{ backgroundColor: 'none' }}
      renderLabel={({ route, focused, color }) => (
        <View style={{ backgroundColor: focused ? '#333333' : undefined, width: '100%', borderRadius: 8 }}>
          <Text style={{ width: '100%', fontWeight: focused ? '900' : 'normal', margin: 8, color: focused ? '#F4F4F4' : 'gray', fontSize: 18 }}>
            {route.title}
          </Text>
        </View>
      )}


    />
  );
  return (
    <SafeAreaView style={styles.container}>
      <UIHeader
        title={'Factory'}
        leftIconName={"chevron-left"}
        onPressLeftIcon={() =>
          goBack()
        }
      />
      <View style={styles.contentView}>
        <View style={[styles.viewDeviceName]}>
          <Text style={styles.textDeviceName}>{deviceInfo ? deviceInfo.name : 'name'}</Text>
        </View>
        <Text style={styles.textDeviceName}>{index}</Text>
        <View style={styles.displayValue}>
          <View style={styles.displayValueChild}>
            <Image style={styles.imageDisplayValueChild} source={require('../../assets/images/temperature.png')} />
            <Text style={styles.textDisplayValueChild}>26.5<Text style={{ fontSize: 11 }}>°C</Text></Text>
          </View>
          <View style={styles.displayValueChild}>
            <Image style={styles.imageDisplayValueChild} source={require('../../assets/images/humidity.png')} />
            <Text style={styles.textDisplayValueChild}>26.5<Text style={{ fontSize: 11 }}>%</Text></Text>
          </View>
          <View style={styles.displayValueChild}>
            <Image style={styles.imageDisplayValueChild} source={require('../../assets/images/co2.png')} />
            <Text style={styles.textDisplayValueChild}> 550<Text style={{ fontSize: 11 }}>PPM</Text></Text>
          </View>
        </View>
      </View>

      <View style={[styles.controlView]}>
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          renderTabBar={renderTabBar}
          onIndexChange={setIndex}
          swipeEnabled={false}  // Tắt chức năng vuốt giữa các tab
          initialLayout={{ width: layout.width }}
          style={{
            borderRadius: 10
          }}
        />
      </View>

    </SafeAreaView>
  )
}
export default MonitorBLE
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'red'
  },
  contentView: {
    flex: 2,
    backgroundColor: 'white',
    justifyContent: 'space-evenly'
  },
  viewDeviceName: {
    borderBottomWidth: 0.8,
    // width:'30%'
    alignSelf: 'center'
  },
  textDeviceName: {
    color: 'black',
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },
  displayValue: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  displayValueChild: {
    flexDirection: 'row',
    maxWidth: '30%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageDisplayValueChild: {
    maxWidth: 35,
    maxHeight: 35,
  },
  textDisplayValueChild: {
    fontWeight: '500',
    fontSize: 16,
    color: '#B3B3B3',
  },
  controlView: {
    flex: 8,
    // backgroundColor: 'blue',
  },
  controlAutoViews: {
    borderRadius: 8,
    backgroundColor: 'white',
  },
  mainControlManual: {
    flex: 1,
    // backgroundColor:'red'
  },
  blankControlManual: {
    flex: 2,
    // backgroundColor:'blue'
  },
  controlPowerView: {
    // backgroundColor:'red'
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  textControlPower: {
    color: 'black',
    fontSize: 20,
    fontWeight: '600'
  },
  controlScheduleView: {
    flex: 2,
    justifyContent: 'space-between',
    // backgroundColor:'blue'
  },
});
