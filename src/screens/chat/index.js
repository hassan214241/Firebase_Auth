import React from 'react';
import {View, FlatList} from 'react-native';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import {Button} from 'react-native-paper';
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
import {MessageData} from './MessageData';

const LogoutUser = async () => {
  try {
    let logout = await auth().signOut();
  } catch (error) {
    console.log('error', error);
  }
};
export const Chat = () => {
  const {navigate} = useNavigation();
  return (
    <View style={{flex: 1}}>
      <Container>
        <FlatList
          data={MessageData}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <Card
              onPress={() => navigate('Message', {userName: item.userName})}>
              <UserInfo>
                <UserImgWrapper>
                  <UserImg source={item.userImg} />
                </UserImgWrapper>
                <TextSection>
                  <UserInfoText>
                    <UserName>{item.userName}</UserName>
                    <PostTime>{item.messageTime}</PostTime>
                  </UserInfoText>
                  <MessageText>{item.messageText}</MessageText>
                </TextSection>
              </UserInfo>
            </Card>
          )}
        />
      </Container>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#ffffff',
        }}>
        <Button
          icon={({color, size}) => (
            <Icon name="exit-to-app" color={'#fff'} size={25} />
          )}
          contentStyle={{
            borderWidth: 2,
            width: 200,
            borderRadius: 25,
            borderColor: '#fff',
            backgroundColor: 'red',
          }}
          labelStyle={{color: '#fff'}}
          onPress={() => LogoutUser()}>
          SIGN OUT
        </Button>
      </View>
    </View>
  );
};
