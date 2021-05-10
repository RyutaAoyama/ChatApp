import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import React, {useState, useEffect, useCallback} from 'react';
import { StyleSheet, TextInput, SafeAreaView, View, Button } from 'react-native';
import { getMessageDocRef, db } from '../lib/firebase';
import firebase from 'firebase';
import axios from 'axios';
import { GiftedChat } from 'react-native-gifted-chat';

export default function ChatScreen3() {
  const [text, setText] = useState([]);
  const [messages, setMessages] = useState([]);
  const [botMessages, setBotMessages] = useState([]);
  // const [responseMessage, setResponseMessage] = useState([])
  const url = 'https://api.a3rt.recruit-tech.co.jp/talk/v1/smalltalk';
  const apiKey = 'DZZ81pdvDyr2GMvnNiBgeW6rymjVQ9ro';

  const sendMessage = () => {

  }
  const getMessage = async() =>{
    const messages = [];
    const docRef = db.collection("message");
    db.collection("message").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            messages.unshift(doc.data());
            setMessages(messages)
            console.log(messages)
            // console.log(doc.id, " => ", doc.data());
        });
    });
  }

  useEffect(() => {
    // const messages = getMessage()
    setMessages([
      {
        _id: 1,
        text: 'Hello',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
    ])
  }, botMessages)

  const onSend = useCallback((messages = []) => {
      let botMessages = [];
    // const docRef = getMessageDocRef();
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages),)
    let params = new FormData();
      params.append("apikey", apiKey);
      params.append("query", messages );
        axios.post(url, params).then((res)=>{
            // console.log(res.data)
            // docRef.set(res.data)
        botMessages = [
            {
              _id: 1,
              text: res.data.results[0].reply,
              createdAt: new Date(),
              user: {
                _id: 2,
                name: 'React Native',
                avatar: 'https://placeimg.com/140/140/any',
              },
            },
        ]
        setBotMessages(previousMessages => GiftedChat.append(previousMessages, res.data.results[0].reply,))
        console.log(botMessages)
      })
  }, [])


  return (
          <GiftedChat
          messages={messages}
          onSend={messages => onSend(messages)}
          user={{
            _id: 1,
          }}
          />
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    textInputContainer: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center'
    },
    inputText: {
      color: '#fff',
      borderWidth: 1,
      borderColor: '#999',
      height: 32,
      flex: 1,
      borderRadius: 5,
      paddingHorizontal: 10
  }
  });
