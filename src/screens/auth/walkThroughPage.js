import React, {Component} from 'react';
import {AppRegistry, Alert} from 'react-native';
import AppIntro from 'react-native-app-walkthrough';
import {resetNavigator} from '../../constant/commonFun';

const WalkThroughPage = (props) => {
  const pageArray = [
    {
      title: 'Page 1',
      description: 'Description 1',
      img: 'https://goo.gl/Bnc3XP',
      imgStyle: {
        height: 80 * 2.5,
        width: 109 * 2.5,
      },
      backgroundColor: '#fa931d',
      fontColor: '#fff',
      level: 10,
    },
    {
      title: 'Page 2',
      description: 'Description 2',
      img: require('../../assets/images/coupon.png'),
      imgStyle: {
        height: 93 * 2.5,
        width: 103 * 2.5,
      },
      backgroundColor: '#a4b602',
      fontColor: '#fff',
      level: 10,
    },
  ];
  const onSkipBtnHandle = (index) => {
    resetNavigator(props, 'Dashboard');
  };
  const doneBtnHandle = () => {
    Alert.alert('Done');
  };
  const nextBtnHandle = (index) => {
    Alert.alert('Next');
    console.log(index);
  };
  const onSlideChangeHandle = (index, total) => {
    console.log(index, total);
  };
  return (
    <AppIntro
      onNextBtnClick={nextBtnHandle}
      onDoneBtnClick={doneBtnHandle}
      onSkipBtnClick={onSkipBtnHandle}
      onSlideChange={onSlideChangeHandle}
      pageArray={pageArray}
    />
  );
};

export default WalkThroughPage;
