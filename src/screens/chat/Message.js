import React, {useState, useCallback, useEffect} from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import {
  GiftedChat,
  Bubble,
  Send,
  MessageImage,
  MessageImageProps,
  BubbleProps,
} from 'react-native-gifted-chat';
import storage from '@react-native-firebase/storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ImagePicker from 'react-native-image-crop-picker';
import firestore from '@react-native-firebase/firestore';
import {useRoute} from '@react-navigation/native';
import DocumentPicker from 'react-native-document-picker';
import {Modal, Portal, Button, Provider} from 'react-native-paper';
// import {Modal, Portal, Text, Button, Provider} from 'react-native-paper';

export const Message = () => {
  const [messages, setMessages] = useState([]);
  const [mediaUri, setMediaUri] = useState(null);
  const [isUploadLoading, setIsUploadLoading] = useState(false);
  const [mediaType, setMediaType] = useState(null);
  const {params} = useRoute();
  // console.log(params.users, 'params user');

  // modal states
  // const [visible, setVisible] = React.useState(false);
  // const showModal = () => setVisible(true);
  // const hideModal = () => setVisible(false);
  // const containerStyle = {backgroundColor: 'red', padding: 20};

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
            // media: mediaType === 'video' ? mediaUri.video : mediaUri.image,
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

    await firestore()
      .collection('chats')
      .doc(params?.chatId)
      .collection('messages')
      .add({
        ...(message?.text && {text: message?.text}),
        ...(message?.image && {image: message?.image}),
        // ...(message?.video && {video: message?.video}),
        createdAt: Date.now(),
        user: message.user._id,
      });
  }, []);

  const CustomMessageImage = props => {
    React.useEffect(() => {}, []);
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

  //   send render function
  const renderSend = props => {
    return (
      <>
        <Send {...props}>
          <View
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              width: 50,
              height: 48,
            }}>
            <MaterialCommunityIcons
              name="send-circle"
              style={{marginBottom: 10, marginRight: 10}}
              size={38}
              color="#2e64e5"
            />

            {/*
          <MaterialCommunityIcons
            name="camera"
            style={{marginBottom: 5, marginRight: 5, marginTop: 5}}
            size={34}
            color="black"
            // onPress={_launchCamera}
          />
           */}
          </View>
        </Send>
        <View
          style={{
            display: 'flex',
            width: 50,
            height: 48,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <MaterialCommunityIcons
            name="plus"
            size={34}
            color="#49b7e4"
            onPress={openGallery}
          />
        </View>
      </>
    );
  };
  //   scrollToBottomComponent function
  const scrollToBottomComponent = () => {
    return <FontAwesome name="angle-double-down" size={22} color="#333" />;
  };

  // open document functin

  const openDocument = async () => {
    try {
      setIsUploadLoading(true);
      const res = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.allFiles],
      });
      console.log('res document', res);
      console.log(
        res.uri,
        res.fileCopyUri,
        res.type, // mime type
        res.name,
        res.size,
      );
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('document cancle ');
      } else if (DocumentPicker.isInProgress(err)) {
        console.log('document in process');
      } else {
        console.log(err, 'error');
      }
    } finally {
      setIsUploadLoading(false);
    }
  };

  // Open Gallery function

  const openGallery = () => {
    ImagePicker.openPicker({
      mediaType: 'any',
    }).then(response => {
      if (response.didCancel) {
        console.log('didcancle');
      } else if (response.error) {
        console.log('error');
      } else if (Platform.OS === 'ios') {
        const _path = response.sourceURL;
      } else {
        const selectedImages = response.path;
        console.log('selectedImages', selectedImages);
        const _type = response.mime.split('/')[0];
        console.log('media type', _type);
        setMediaType(_type);
        // setMediaUri(null);
        uploadMedia(selectedImages);
      }
    });
  };

  // uniqueId create
  const uniqueId = () => {
    var S4 = function () {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (
      S4() +
      S4() +
      '-' +
      S4() +
      '-' +
      S4() +
      '-' +
      S4() +
      '-' +
      S4() +
      S4() +
      S4()
    );
  };

  // upload Media to firebase

  const uploadMedia = file => {
    setIsUploadLoading(true);
    const reference = storage().ref(uniqueId());
    const task = reference.putFile(file);
    task
      .then(async () => {
        const downloadURL = await reference.getDownloadURL();
        console.log('firebase url', downloadURL);
        setMediaUri(downloadURL);
      })
      .finally(() => {
        setIsUploadLoading(false);
      });
  };

  return (
    <React.Fragment>
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
        // alwaysShowSend={true}
      />
    </React.Fragment>
  );
};
