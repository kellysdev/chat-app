import { useState } from "react";
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ImageBackground, Image } from "react-native";

const Start = ({ navigation }) => {
  const [name, setName] = useState("");
  const [chatBackgroundColor, setChatBackgroundColor] = useState("");
  const colors = ["#090C08", "#474056", "#8A95A5", "#B9C6AE"];
  const backgroundImage = require("../assets/BackgroundImage.png");

  return (
    <View style={styles.container}>
      {/* background image container: */}
      <ImageBackground source={backgroundImage} resizeMode="cover" style={styles.bkgrImg} >

        {/* application title component: */}
        <Text style={styles.title}>App Title</Text>

        {/* White box containing input field, option to change chat background color, and button to enter chat */}
        <View style={styles.whiteBox}>
          <TextInput
            style={[styles.text, styles.textInput]}
            value={name}
            onChangeText={setName}
            placeholder="Your Name"
          />

          <Text style={styles.chooseText}>Choose Background Color:</Text>

          {/* buttons to change the background color of the chat screen: */}
          <View style={styles.colorsBox}>
            {/* display a button for each color in the colors array: */}
            {colors.map((color, index) => (
              <TouchableOpacity 
                key={index} 
                style={[styles.colorOptions, { backgroundColor: color }]}
                onPress={() => setChatBackgroundColor(color)}
              ></TouchableOpacity>
            ))}
          </View>

          {/* button to enter chat: */}
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Screen2", {name: name, backgroundColor: chatBackgroundColor})}>
            <Text style={styles.buttonText}>Start Chatting</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bkgrImg: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  title: {
    fontSize: 45,
    fontWeight: "600",
    color: "#FFFFFF",
    marginTop: "15%"
  },
  whiteBox: {
    width: "88%",
    height: "44%",
    paddingTop: 15,
    paddingBottom: 15,
    marginTop: "70%",
    backgroundColor: "white",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "center"
  },
  textInput: {
    width: "88%",
    height: 50,
    padding: 10,
    borderWidth: 1,
    borderRadius: 2,
    opacity: 0.5
  },
  chooseText: {
    fontSize: 16,
    fontWeight: "300",
    marginLeft: 20,
    color: "#757083",
    opacity: 1,
    alignSelf: "flex-start"
  },
  colorsBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 0,
  },
  colorOptions: {
    width: 50,
    height: 50,
    marginRight: 25,
    borderRadius: 25
  },
  button: {
    width: "88%",
    height: 50,
    backgroundColor: "#757083",
    alignItems: "center",
    justifyContent: "center"
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  }
})

export default Start;