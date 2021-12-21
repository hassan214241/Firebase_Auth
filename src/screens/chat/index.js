import React, {useState} from 'react';
import {View, FlatList} from 'react-native';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import {ActivityIndicator, Button} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  Container,
  Card,
  UserInfo,
  UserImgWrapper,
  UserImg,
  UserInfoText,
  UserName,
  PostTime,
  MessageText,
  TextSection,
} from '../../styles/ChatStyle';
// import {MessageData} from './MessageData';
// import {Searchbar} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';

const LogoutUser = async () => {
  try {
    let logout = await auth().signOut();
  } catch (error) {
    console.log('error', error);
  }
};
export const Chat = () => {
  const {navigate} = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [chats, setChats] = useState([]);
  // const [profiles, setProfiles] = useState([]);

  const me = 'user1';

  const fetchUserProfiles = (user_ids = []) => {
    return new Promise(async (res, rej) => {
      try {
        const promises = user_ids.map(user_id => {
          return firestore()
            .collection('users')
            .doc(user_id)
            .get()
            .then(doc => {
              return {
                ...doc.data(),
                id: user_id,
              };
            });
        });
        const profiles = await Promise.all(promises);
        // console.log(profiles);
        res(profiles);
      } catch (error) {
        rej(error);
      }
    });
  };

  React.useEffect(() => {
    console.log(chats, 'users');
  }, [chats]);

  React.useEffect(() => {
    const unsubscribe = firestore()
      .collection('chats')
      .where('participants', 'array-contains', me)
      .onSnapshot(async documentSnapshot => {
        const _chats = documentSnapshot.docs.map(doc => {
          return {
            ...doc.data(),
            id: doc.id,
          };
        });
        // console.log(_chats);
        const userIdsRawArray = _chats.map(chat => {
          return chat?.participants;
        });
        const userIds = [...new Set(userIdsRawArray.flat())];
        const profiles = await fetchUserProfiles(userIds);
        // console.log(profiles);
        setChats([
          ..._chats.map(({participants, id}) => {
            const otherUsers = participants.filter(id => id !== me);
            const otherUsersProfiles = otherUsers.map(otherUserId => {
              return profiles.find(({id}) => otherUserId === id);
            });
            console.log(otherUsersProfiles, 'profiles');
            return {
              id,
              users: [...otherUsersProfiles],
            };
          }),
        ]);
        setIsLoading(false);
      });
    return unsubscribe;
  }, []);

  if (isLoading) {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator />
      </View>
    );
  }
  return (
    <React.Fragment>
      {/* <View style={{flex: 1}}>
         <Searchbar
          style={{margin: 8, height: 45}}
          placeholder="Search"
          onChangeText={onChangeSearch}
          value={searchQuery}
        /> 
      </View> */}
      <View style={{flex: 1}}>
        <Container>
          <FlatList
            data={chats}
            keyExtractor={item => item.id}
            renderItem={({item}) => {
              // console.log(item);
              return (
                <Card
                  onPress={() =>
                    navigate('Message', {chatId: item.id, users: item.users})
                  }>
                  <UserInfo>
                    <UserImgWrapper>
                      <UserImg source={{uri: item.users[0].avatar}} />
                    </UserImgWrapper>
                    <TextSection>
                      <UserInfoText>
                        <UserName>{item.users[0].name}</UserName>
                        <PostTime>{'Today'}</PostTime>
                      </UserInfoText>
                      <MessageText>{'Hello there!'}</MessageText>
                    </TextSection>
                  </UserInfo>
                </Card>
              );
            }}
          />

          <Button
            icon={({color, size}) => (
              <Icon name="exit-to-app" color={'#fff'} size={25} />
            )}
            contentStyle={{
              borderWidth: 2,
              width: 200,
              padding: 5,
              borderRadius: 25,
              borderColor: '#fff',
              backgroundColor: 'red',
            }}
            labelStyle={{color: '#fff'}}
            onPress={() => LogoutUser()}>
            SIGN OUT
          </Button>
        </Container>
      </View>
    </React.Fragment>
  );
};
