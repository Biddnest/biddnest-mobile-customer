import React from 'react';
import {Pressable} from 'react-native';
import {hp} from '../constant/colors';
import ChatBot from '../assets/svg/chat_bot.svg';

const ChatBotButton = (props) => {
  return (
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
  );
};

export default ChatBotButton;
