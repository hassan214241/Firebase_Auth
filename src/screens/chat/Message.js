import React, {useState, useCallback, useEffect} from 'react';
import {View} from 'react-native';
import {
  GiftedChat,
  Bubble,
  Send,
  MessageImage,
  MessageImageProps,
  BubbleProps,
} from 'react-native-gifted-chat';
// import storage from '@react-native-firebase/storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
// import {firebase} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useRoute} from '@react-navigation/native';

export const Message = () => {
  const [messages, setMessages] = useState([]);
  const {params} = useRoute();
  console.log(params.users, 'params user');

  const me = {
    id: 'user1',
    name: 'User 1',
    avatar: 'https://placeimg.com/140/140/any',
  };

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('chats')
      .doc(params?.chatId)
      .collection('messages')
      .onSnapshot(querysnapshot => {
        const _messages = querysnapshot.docs.map(doc => {
          let _user = params.users
            // .push(me)
            .find(({id}) => doc.data().user === id);
          _user = _user ? _user : me;

          return {
            _id: doc.id,
            ...doc.data(),
            createdAt: new Date(parseInt(doc.data()?.createdAt)),
            user: {
              _id: _user.id,
              name: _user.name,
              avatar: _user.avatar,
            },
          };
        });
        setMessages([..._messages]);
      });
    return unsubscribe;
  }, []);

  // useEffect(() => {
  //   setMessages([
  //     {
  //       _id: 1,
  //       // text: 'Hello developer',
  //       image:
  //         'file:///data/data/com.firebaseauth/cache/rn_image_picker_lib_temp_c0df8231-0cb3-42c5-a524-b4101d86d011.jpg',
  //       createdAt: new Date(),
  //       user: {
  //         _id: 2,
  //         name: 'React Native',
  //         avatar: 'https://placeimg.com/140/140/any',
  //       },
  //     },
  //   ]);
  // }, []);

  const onSend = useCallback(async (messages = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages),
    );
    // console.log(messages, 'messages');
    const message = messages[0];
    const _date = new Date(message.createdAt);
    const createdAt = parseInt(_date.getTime() / 1000);
    await firestore()
      .collection('chats')
      .doc(params?.chatId)
      .collection('messages')
      .add({
        ...(message?.text && {text: message?.text}),
        ...(message?.image && {image: message?.image}),
        createdAt,
        user: message.user._id,
      });
  }, []);

  const CustomMessageImage = props => {
    React.useEffect(() => {
      // const unsubscribe = firestore().collection('users').doc('users').add({});
      // return unsubscribe;
    }, []);
    // console.log(props.currentMessage.image, 'props');
    return <MessageImage {...props} />;
  };

  //   custom function
  const renderBubble = props => {
    return (
      <Bubble
        {...props}
        renderMessageImage={messageImageProps => (
          <CustomMessageImage {...messageImageProps} />
        )}
        wrapperStyle={{
          right: {
            backgroundColor: '#2e64e5',
          },
        }}
        textStyle={{
          right: {
            color: '#fff',
          },
        }}
      />
    );
  };
  // upload Image

  // const UploadImage = async () => {
  //   const [image, setImage] = useState(null);
  //   const [uploading, setUploading] = useState(false);
  //   const [transferred, setTransferred] = useState(0);

  //   const {uri} = image;
  //   const filename = uri.substring(uri.lastIndexOf('/') + 1);
  //   const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
  //   setUploading(true);
  //   setTransferred(0);
  //   const task = storage().ref(filename).putFile(uploadUri);
  //   // set progress state
  //   task.on('state_changed', snapshot => {
  //     setTransferred(
  //       Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 10000,
  //     );
  //   });
  //   try {
  //     await task;
  //   } catch (e) {
  //     console.error(e);
  //   }
  //   setUploading(false);
  //   Alert.alert(
  //     'Photo uploaded!',
  //     'Your photo has been uploaded to Firebase Cloud Storage!',
  //   );
  //   setImage(null);
  // };

  //   send render function
  const renderSend = props => {
    return (
      <Send {...props}>
        <View style={{display: 'flex', flexDirection: 'row'}}>
          <MaterialCommunityIcons
            name="send-circle"
            style={{marginBottom: 5, marginRight: 5}}
            size={38}
            color="#2e64e5"
          />
          <MaterialCommunityIcons
            name="camera"
            style={{marginBottom: 5, marginRight: 5, marginTop: 5}}
            size={34}
            color="black"
            onPress={_launchCamera}
          />
          <MaterialCommunityIcons
            name="google-photos"
            style={{marginBottom: 5, marginRight: 5, marginTop: 5}}
            size={34}
            color="black"
            onPress={_launchImageLibrary}
          />
        </View>
      </Send>
    );
  };
  //   scrollToBottomComponent function
  const scrollToBottomComponent = () => {
    return <FontAwesome name="angle-double-down" size={22} color="#333" />;
  };

  // lunch camera

  const _launchCamera = async () => {
    try {
      let options = {
        storageOptions: {
          skipBackup: true,
          path: 'images',
        },
      };
      const response = await launchCamera(options);
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        const ClickImage = response.assets;
        console.log('ClickImage', ClickImage);

        // setIsCamera({
        //   filePath: response,
        //   fileData: response.data,
        //   fileUri: response.uri,
        // });
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  // lunch gallery
  const _launchImageLibrary = async () => {
    try {
      let options = {
        storageOptions: {
          skipBackup: true,
          path: 'images',
        },
      };
      const response = await launchImageLibrary(options);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        const selectedImages = response.assets;
        console.log(selectedImages);
        // const source = {uri: response.assets[0].uri};
        // console.log('response', JSON.stringify(response));
        // setIsGallery({
        //   filePath: response,
        //   fileData: response.data,
        //   fileUri: response.uri,
        // });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <GiftedChat
      messages={messages}
      onSend={messages => onSend(messages)}
      user={{
        _id: 'user1',
      }}
      placeholder="Type a message"
      renderBubble={renderBubble}
      renderSend={renderSend}
      scrollToBottom
      scrollToBottomComponent={scrollToBottomComponent}
      alwaysShowSend={true}
    />
  );
};
