import { useEffect } from "react";
import { useNetInfo } from "@react-native-community/netinfo";
import { StyleSheet, LogBox, Alert } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { initializeApp } from "firebase/app";
import { getFirestore, disableNetwork, enableNetwork } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import Start from "./components/start";
import Chat from "./components/chat";

// create navigator
const Stack = createNativeStackNavigator();

// ignore warning about soon to be deprecated package:
LogBox.ignoreLogs(["AsyncStorage has been extracted from", "@firebase/auth", "You are initializing Firebase Auth"]);

const App = () => {
  // stat that represents network connectivity status, initializes as null
  const connectionStatus = useNetInfo();

  // alerts the user when the network connection is lost and prevents Firebase from trying to connect when no network is available
  // enables Firebase to reconnect when network connection restored
  useEffect(() => {
    if (connectionStatus.isConnected === false) {
      Alert.alert("Connection lost!");
      disableNetwork(db);
    } else if (connectionStatus.isConnected === true) {
      enableNetwork(db);
    }
  }, [connectionStatus.isConnected]);

  const firebaseConfig = {
    apiKey: "AIzaSyD1jFWElNpyLQUhmU7yGI72ZMzyQiofuZo",
    authDomain: "chat-app-kellys.firebaseapp.com",
    projectId: "chat-app-kellys",
    storageBucket: "chat-app-kellys.appspot.com",
    messagingSenderId: "778758330793",
    appId: "1:778758330793:web:b2a5556d8f9e83ad2e4cb8"
  };

  // initialize Firebase
  const app = initializeApp(firebaseConfig);

  // initialize cloud Firestore and get reference to service
  const db = getFirestore(app);

  // initialize cloud Firebase Cloud Storage
  const storage = getStorage(app);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">
        <Stack.Screen 
          name="Start"
          component={Start}
        />
        <Stack.Screen name="Chat" >
          {props => <Chat 
            isConnected={connectionStatus.isConnected}
            db={db} 
            storage={storage}
            {...props} /> }
        </Stack.Screen> 
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default App;