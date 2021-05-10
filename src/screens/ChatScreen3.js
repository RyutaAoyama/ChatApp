import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import React, {useState, useEffect, useCallback} from 'react';
import { StyleSheet, TextInput, SafeAreaView, View, Button } from 'react-native';
import { getMessageDocRef, db } from '../lib/firebase';
import firebase from 'firebase';
import axios from 'axios';
import { GiftedChat } from 'react-native-gifted-chat';
import uuid from 'react-uuid';

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
    // const docRef = db.collection("message");
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
    // setMessages([
    //   {
    //     _id: 1,
    //     text: 'Hello',
    //     createdAt: new Date(),
    //     user: {
    //       _id: 2,
    //       name: 'React Native',
    //       avatar: 'https://placeimg.com/140/140/any',
    //     },
    //   },
    // ])
  }, [])

  const onSend = useCallback((messages = []) => {
      let botMessages = [];
    // const docRef = getMessageDocRef();
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages[0]),)
    // db.collection('message').doc().set({messages})

    let params = new FormData();
      params.append("apikey", apiKey);
      params.append("query", messages[0].text );
      console.log(messages)
        axios.post(url, params).then((res)=>{
            // console.log(res.data)
            // docRef.set(res.data)
        botMessages = [
            {
              _id: uuid(),
              text: res.data.results[0].reply,
              createdAt: new Date(),
              user: {
                _id: 2,
                name: 'React Native',
                avatar: 'https://placeimg.com/140/140/any',
              },
            },
        ]
        setMessages(previousMessages => GiftedChat.append(previousMessages, botMessages))
        // db.collection('message').doc().set({botMessages})

        console.log(botMessages)
      })
  }, [])

  const reset = () =>{
      location.reload();
  }


  return (
      <>
        <GiftedChat
        messages={messages}
        placeholder="テキストを入力してください"
        label="送信"
        onSend={messages => onSend(messages)}
        user={{
        _id: 1,
        }}
        textInputStyle={styles.textInput}
        containerStyle={{backgroundColor: 'hsl(0, 0%, 90%)'}}
        textStyle={{color: "black"}}
        />
        <Button title="リセット" onPress={() => {reset()}} />
     </>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    textInput: {
        borderColor: "green",
        borderWidth: 1,
        borderRadius: 10,
        paddingLeft: 5,
        paddingTop: 7,
        backgroundColor: "white"
    }
  }
  );
