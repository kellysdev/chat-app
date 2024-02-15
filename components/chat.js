import { useState, useEffect } from "react";
import { StyleSheet, View, Platform, KeyboardAvoidingView } from "react-native";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import { collection, addDoc, onSnapshot, query, orderBy, where } from "firebase/firestore";

const Chat = ({ route, navigation, db }) => {
  // extract props from navigation:
  const { userID, name, chatBackgroundColor } = route.params;

  // array of messages updated by listener from collection in Firestore database
  const [messages, setMessages] = useState([]);

  // add a listener to the messages collection that will update the messages state when there are new messages
  useEffect(() => {
    navigation.setOptions({ title: name });

    const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
    const unsubMessages = onSnapshot(q, (docs) => {
      let newMessages = [];
      docs.forEach(doc => {
        newMessages.push({
          id: doc.id,
          ...doc.data(),
          createdAt: new Date()
        })
      });
      setMessages(newMessages);
    });

    return () => {
      if (unsubMessages) unsubMessages();
    }
  }, []);

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