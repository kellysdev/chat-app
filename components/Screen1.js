import { useState } from "react";
import { StyleSheet, View, Text, Button, TextInput, TouchableOpacity, ImageBackground } from "react-native";

const Screen1 = ({ navigation }) => {
  const [name, setName] = useState("");

  return (
    <View style={styles.container}>
      <ImageBackground source={BackgroundImage.png} resizeMode="cover">
        <Text style={styles.title}>App Title</Text>
        <View style={styles.box}>
          <TextInput
            style={[styles.text, styles.textInput]}
            value={name}
            onChangeText={setName}
            placeholder="Your Name"
          />
          <Text style={styles.text}>Choose Background Color:</Text>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Screen2", {name: name})}>
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
    justifyContent: "center",
    alignItems: "center"

  },
  title: {
    fontSize: 45,
    fontWeight: "600",
    color: "#FFFFFF"
  },
  box: {
    width: "88%",
    height: "44%",
    backgroundColor: "white"
  },
  text: {
    fontSize: 16,
    fontWeight: "300",
    color: "#757083",
    opacity: 1
  },
  textInput: {
    width: "88%",
    padding: 15,
    borderWidth: 1,
    marginTop: 15,
    marginBottom: 15,
    opacity: 0.5
  },
  button: {
    width: "88%",
    backgroundColor: "#757083",
    alignItems: "center"
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  }
})

export default Screen1;