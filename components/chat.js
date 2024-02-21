import { useState, useEffect } from "react";
import { StyleSheet, View, Platform, KeyboardAvoidingView, Alert } from "react-native";
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
import { collection, addDoc, onSnapshot, query, orderBy, where } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MapView from "react-native-maps";
import CustomActions from "./custom-actions";

const Chat = ({ route, navigation, db, isConnected }) => {
  // extract props from navigation:
  const { userID, name, chatBackgroundColor } = route.params;

  // array of messages updated by listener from collection in Firestore database
  const [messages, setMessages] = useState([]);

  // component level reference to listener to prevent memory leak when unsubscribing and resubscribing to listener depening on network connection status
  let unsubMessages;

  useEffect(() => {
    navigation.setOptions({ title: name });

    if (isConnected === true) {
      // disable existing listener to avoid multiple when useEffect is re-executed
      if (unsubMessages) unsubMessages();
      unsubMessages = null;
      // add a listener to the messages collection
      // update messages state when there are new messages and cache messages
      const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
      unsubMessages = onSnapshot(q, (docs) => {
        let newMessages = [];
        docs.forEach(doc => {
          newMessages.push({
            id: doc.id,
            ...doc.data(),
            createdAt: new Date()
          })
        });
        cacheMessages(newMessages);
        setMessages(newMessages);
      });
    } else loadCachedMessages();

    return () => {
      if (unsubMessages) unsubMessages();
    }
  }, [isConnected]);

  // cache messages when fetched from lsitener
  const cacheMessages = async (messagesToCache) => {
    try {
      await AsyncStorage.setItem("cached_messages", JSON.stringify(messagesToCache));
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  // load cached messages if there is no network connection
  const loadCachedMessages = async () => {
    const cachedMessages = await AsyncStorage.getItem("cached_messages") || [];
    setMessages(JSON.parse(cachedMessages));
  };

  // save sent message to Firestore database
  const onSend = (newMessages) => {
    addDoc(collection(db, "messages"), newMessages[0]);
  };

  // Only render input toolbar / allow user to send messages if there is network connection
  const renderInputToolbar = (props) => {
    if (isConnected) return <InputToolbar {...props} />;
    else return null;
  };

  // change color of message bubbles
  const renderBubble = (props) => {
    return <Bubble 
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: "#6C6A57"
        },
        left: {
          backgroundColor: "#FFF"
        }
      }}
    />
  };

  // render CustomActions component which allows the user to send an image from library or camera or to send their location
  const renderCustomActions = (props) => {
    return <CustomActions storage={storage} {...props} />;
  };

  // will render a map with the users coordinates if the current message contains location data
  const renderCustomView = (props) => {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{
            width: 150,
            height: 100,
            borderRadius: 13,
            margin: 3,
          }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  };

  return (
    <View style={[styles.container, {backgroundColor: chatBackgroundColor}]} >
      <GiftedChat 
        messages={messages}
        renderInputToolbar={renderInputToolbar}
        renderBubble={renderBubble}
        renderActions={renderCustomActions}
        renderCustomView={renderCustomView}
        onSend={messages => onSend(messages)}
        user={{
          _id: userID,
          name: name
        }}
      />
      { Platform.OS === "android" ? <KeyboardAvoidingView behavior="height" /> : null }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default Chat;