import { TouchableOpacity, StyleSheet, View, Text } from "react-native";

const CustomActions = ({ wrapperStyle, iconTextStyle }) => {
  const onActionPress = () => {}
  
  return (
    <TouchableOpacity style={StyleSheet.container} onPress={onActionPress}>
      <View style={[styles.wrapper, wrapperStyle]}>
        <Text style={[styles.iconText, iconTextStyle]}>+</Text>
      </View>
    </TouchableOpacity>
  );
};

export default CustomActions;