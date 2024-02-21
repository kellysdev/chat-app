import { useState } from "react";
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ImageBackground, Platform, KeyboardAvoidingView, Alert } from "react-native";
import { getAuth, signInAnonymously } from "firebase/auth";

const Start = ({ navigation }) => {
  // background image for start screen:
  const backgroundImage = require("../assets/BackgroundImage.png");

  // initialize Firebase authentication handler
  const auth = getAuth();
  // allow anonymous sign in
  const signInUser = () => {
    signInAnonymously(auth)
    .then(result => {
      if (result.user.uid) {
        navigation.navigate("Chat", { userID: result.user.uid, name: name, chatBackgroundColor: chatBackgroundColor });
        Alert.alert("Signed in successfully!");
      }
    })
    .catch((error) => {
      Alert.alert("Unable to sign in.  Try again later.");
    })
  };

  // pass user name from input to be the title of the chat screen
  const [name, setName] = useState("");

  // user can change the background color of the chat screen
  const [chatBackgroundColor, setChatBackgroundColor] = useState("");
  const colors = ["#090C08", "#474056", "#8A95A5", "#B9C6AE"];
  const handleSelection = (color) => {
    const colorIndex = colors.indexOf(color);
    const selectedColor = colors[colorIndex];
    setChatBackgroundColor(selectedColor);
  };

  return (
    <View style={styles.container}>
      {/* background image container: */}
      <ImageBackground source={backgroundImage} resizeMode="cover" style={styles.bkgrImg} >

        {/* application title component: */}
        <Text style={styles.title}>Chat App</Text>

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
            {colors.map((color) => (
              <TouchableOpacity 
                accessible={true}
                accessibilityLabel="Chat background color option"
                accessibilityHint="Let's you change the background color of the chat screen."
                accessibilityRole="imagebutton"
                key={color} 
                style={[styles.colorOptions, { backgroundColor: color }]}
                onPress={() => handleSelection(color)}
              ></TouchableOpacity>
            ))}
          </View>

          {/* button to enter chat: */}
          <TouchableOpacity 
            accessible={true}
            accessibilityRole="button"
            style={styles.button} 
            onPress={signInUser}>
            <Text style={styles.buttonText}>Start Chatting</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
      { Platform.OS === "ios" ? <KeyboardAvoidingView behavior="padding" /> : null }
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
    marginTop: "70%",
    marginBottom: "5%",
    backgroundColor: "white",
    justifyContent: "space-evenly",
    alignItems: "center",
    alignSelf: "center"
  },
  textInput: {
    width: "88%",
    height: 50,
    padding: 10,
    marginTop: -15,
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
    marginRight: 25,
    marginTop: -16,
    padding: 0,
  },
  colorOptions: {
    width: 48,
    height: 48,
    marginRight: 18,
    borderRadius: 25
  },
  button: {
    width: "88%",
    height: 50,
    marginBottom: -15,
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