import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { StyleSheet, TextInput, SafeAreaView, View, Button } from 'react-native';
import { getMessageDocRef } from '../lib/firebase';
import firebase from 'firebase';
import axios from 'axios';
import { GiftedChat } from 'react-native-gifted-chat';

export default function ChatScreen() {
  const [text, setText] = useState([]);
  const [messages, setMessages] = useState([]);
  // const [responseMessage, setResponseMessage] = useState([])
  const url = 'https://api.a3rt.recruit-tech.co.jp/talk/v1/smalltalk';
  const apiKey = 'DZZ81pdvDyr2GMvnNiBgeW6rymjVQ9ro';
  const sendMessage = async (value) =>{
    if(value !== ''){
      const docRef = await getMessageDocRef();
      const newMessage = {
        text: value,
        created_at: firebase.firestore.Timestamp.now(),
        userId: '1'
      }
      await docRef.set(newMessage)
      setText(newMessage.text)
      // console.log(newMessage);
      const messages=[];
      setText((previousState) => {
        messages: GiftedChat.append(previousState.messages, value)
      })
      let params = new FormData();
      params.append("apikey", apiKey);
      params.append("query", newMessage.text );
      const response = await axios.post(url,params)
      const responseMessage = ({text: response.data.results[0].reply,
            created_at: firebase.firestore.Timestamp.now(),
            userId: 'TalkAPI'})
            setMessages(responseMessage);
      // await docRef.set(responseMessage);
      setText('');
    }else{
      alert('error')
    }
    // axios.post('https://api.a3rt.recruit-tech.co.jp/talk/v1/smalltalk', {query: newMessage.text, apikey: 'DZZ81pdvDyr2GMvnNiBgeW6rymjVQ9ro'})
    //   .then((res)=>{
    //     docRef.set(res.reply)
    //     console.log(res.reply)
    //   }).catch(error => console.log(error));
  }

  const getMessage = async() =>{
    const messages = [];
        await firebase
            .firestore()
            .collection('messages')
            .orderBy('createdAt')
            .onSnapshot((snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (change.type === 'added') {
                        messages.unshift(change.doc.data());
                    }
                });
                setMessages(messages);
            });
  }

  useEffect(() => {
    getMessage()
  })

  return (
    <SafeAreaView style={styles.container}>
        <ExpoStatusBar style="light" />
        <View style={styles.inputTextContainer}>
          <TextInput
            styls={styles.inputText}
            onChangeText={(value)=>{
              setText(value)
            }}
            value={text}
            placeholder="Plese enter a message"
            placeholderTextColor="#777"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="done"
          />
          <Button title="send" onPress={() => {sendMessage(text)}} />
          <GiftedChat messages={messages}/>
        </View>
    </SafeAreaView>
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
