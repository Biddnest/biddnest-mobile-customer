import React from 'react';
import {Pressable} from 'react-native';
import {hp} from '../constant/colors';
import ChatBot from '../assets/svg/chat_bot.svg';
import {useSelector} from 'react-redux';

const ChatBotButton = (props) => {
  const token = useSelector((state) => state.Login?.loginData?.token) || '';
  return token ? (
    <Pressable
      onPress={props.onPress}
      style={{
        position: 'absolute',
        height: 80,
        width: 80,
        bottom: hp(10),
        right: hp(1),
      }}>
      <ChatBot width={80} height={80} />
    </Pressable>
  ) : null;
};

export default ChatBotButton;
