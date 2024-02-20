import { useState, useEffect } from "react";
import { StyleSheet, View, Platform, KeyboardAvoidingView, Alert } from "react-native";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import { collection, addDoc, onSnapshot, query, orderBy, where } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

  return (
    <View style={[styles.container, {backgroundColor: chatBackgroundColor}]} >
      <GiftedChat 
        messages={messages}
        renderBubble={renderBubble}
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