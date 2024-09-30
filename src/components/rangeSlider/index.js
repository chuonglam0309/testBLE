import React, { useCallback, useState } from "react";
import RangeSliderRN from "rn-range-slider";
import { View, Text } from "react-native";

import Label from "./Label";
import Notch from "./Notch";
import Rail from "./Rail";
import RailSelected from "./RailSelected";
import Thumb from "./Thumb";
import styles from './styles';


const RangeSlider = ({ title, from, to, handleChange }) => {
  // const RangeSlider = () => {
  const [low, setLow] = useState(from);
  const [high, setHigh] = useState(to);

  const renderThumb = useCallback(() => <Thumb />, []);
  const renderRail = useCallback(() => <Rail />, []);
  const renderRailSelected = useCallback(() => <RailSelected />, []);
  const renderLabel = useCallback((value) => <Label text={title} />, []);
  const renderNotch = useCallback(() => <Notch />, []);

  const handleValueChange = useCallback(
    (newLow, newHigh) => {
      handleChange(newLow, newHigh);
      setLow(newLow);
      setHigh(newHigh);
    },
    [handleChange]
  );
  // console.log({ high, low });
  return (
    <View style={{margin:5, marginVertical:10}}>
      <Text style={styles.textTitle}>{title}</Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View>

          <Text
            style={[{ fontWeight: "bold" }, { fontSize: 16, color: "#000000" }]}
          >
            {low}
          </Text>
        </View>
        <View>

          <Text
            style={[{ fontWeight: "bold" }, { fontSize: 16, color: "#000000" }]}
          >
            {high}
          </Text>
        </View>
      </View>
      <RangeSliderRN
        // style={styles.slider}
        min={from}
        max={to}
        step={1}
        floatingLabel
        renderThumb={renderThumb}
        renderRail={renderRail}
        renderRailSelected={renderRailSelected}
        // renderLabel={renderLabel}
        renderNotch={renderNotch}
        onValueChanged={handleValueChange}
      />
    </View>
  );
};

export default RangeSlider;
