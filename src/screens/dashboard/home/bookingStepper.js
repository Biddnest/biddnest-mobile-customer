import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, Pressable, Platform, Image} from 'react-native';
import SimpleHeader from '../../../components/simpleHeader';
import {Colors, hp, wp, boxShadow} from '../../../constant/colors';
import LinearGradient from 'react-native-linear-gradient';
import StepIndicator from 'react-native-step-indicator';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import MovingForm from './mySelf/movingForm';
import DateOfMovement from './mySelf/dateOfMovement';
import RequirementDetails from './mySelf/requirementDetails';
import InitialQuote from './mySelf/initialQuote';
import Timer from './mySelf/timer';
import LocationDistance from '../../../components/locationDistance';
import FriendsDetails from './mySelf/friendsDetails';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';

const customStyles = {
  stepIndicatorSize: 45,
  currentStepIndicatorSize: 45,
  separatorStrokeWidth: 1,
  currentStepStrokeWidth: 1,
  stepStrokeCurrentColor: Colors.darkBlue,
  stepStrokeWidth: 1,
  stepStrokeFinishedColor: Colors.darkBlue,
  stepStrokeUnFinishedColor: '#DEDEDE',
  separatorFinishedColor: Colors.darkBlue,
  separatorUnFinishedColor: '#aaaaaa',
  stepIndicatorFinishedColor: Colors.white,
  stepIndicatorUnFinishedColor: '#DEDEDE',
  stepIndicatorCurrentColor: Colors.darkBlue,
};
const BookingStepper = (props) => {
  const [currentPosition, setCurrentPosition] = useState(0);
  const bookingFor = props?.route?.params?.bookingFor || 'Myself';
  const movementType = props?.route?.params?.movementType || 'Residential';
  const [headerText, setHeaderText] = useState(
    bookingFor === 'Myself' ? 'MOVING TO' : '',
  );
  const [orderBooked, setOrderBooked] = useState(false);

  useEffect(() => {
    switch (currentPosition) {
      case 0:
        if (bookingFor === 'Others') {
          setHeaderText("FRIEND'S DETAILS");
        } else {
          setHeaderText('MOVING TO');
        }
        break;
      case 1:
        if (bookingFor === 'Others') {
          setHeaderText('MOVING TO');
        } else {
          setHeaderText('DATE OF MOVEMENT');
        }
        break;
      case 2:
        if (bookingFor === 'Others') {
          setHeaderText('DATE OF MOVEMENT');
        } else {
          setHeaderText('REQUIREMENT DETAILS');
        }
        break;
      case 3:
        if (bookingFor === 'Others') {
          setHeaderText('REQUIREMENT DETAILS');
        } else {
          if (orderBooked) {
            setHeaderText('TIMER');
          } else {
            setHeaderText('INITIAL QUOTE');
          }
        }
        break;
      case 4:
        if (bookingFor === 'Others') {
          if (orderBooked) {
            setHeaderText('TIMER');
          } else {
            setHeaderText('INITIAL QUOTE');
          }
        } else {
          setHeaderText('');
        }
        break;
      default: {
        break;
      }
    }
  }, [currentPosition, orderBooked]);

  const onPageChange = (position) => {
    // if (currentPosition > position) {
    setCurrentPosition(position);
    // }
  };
  const renderImage = (uri) => {
    return (
      <Image
        source={uri}
        resizeMode={'contain'}
        style={{height: '60%', width: '60%'}}
      />
    );
  };
  const renderMapPin = (stepStatus) => {
    if (stepStatus === 'current') {
      return renderImage(require('../../../assets/images/active_pin_map.png'));
    } else if (stepStatus === 'finished') {
      return renderImage(require('../../../assets/images/finish_map_pin.png'));
    } else {
      return <Feather name={'map-pin'} size={25} color={'#9597B1'} />;
    }
  };
  const renderCalender = (stepStatus) => {
    if (stepStatus === 'current') {
      return renderImage(require('../../../assets/images/active_calender.png'));
    } else if (stepStatus === 'finished') {
      return renderImage(require('../../../assets/images/finish_calender.png'));
    } else {
      return renderImage(
        require('../../../assets/images/inactive_calender.png'),
      );
    }
  };
  const renderBed = (stepStatus) => {
    if (stepStatus === 'current') {
      return renderImage(require('../../../assets/images/active_bed.png'));
    } else if (stepStatus === 'finished') {
      return renderImage(require('../../../assets/images/finish_bed.png'));
    } else {
      return renderImage(require('../../../assets/images/inactive_bed.png'));
    }
  };
  const renderRS = (stepStatus) => {
    if (stepStatus === 'current') {
      return renderImage(require('../../../assets/images/active_rs.png'));
    } else if (stepStatus === 'finished') {
      return null;
    } else {
      return renderImage(require('../../../assets/images/inactive_rs.png'));
    }
  };
  const getStepIndicatorIconConfig = ({
    position,
    stepStatus,
  }: {
    position: number,
    stepStatus: string,
  }) => {
    switch (position) {
      case 0:
        if (bookingFor === 'Others') {
          return null;
        }
        return renderMapPin(stepStatus);
      case 1:
        if (bookingFor === 'Others') {
          return renderMapPin(stepStatus);
        }
        return renderCalender(stepStatus);
      case 2:
        if (bookingFor === 'Others') {
          return renderCalender(stepStatus);
        }
        return renderBed(stepStatus);
      case 3:
        if (bookingFor === 'Others') {
          return renderBed(stepStatus);
        }
        return renderRS(stepStatus);
      case 4:
        if (bookingFor === 'Others') {
          return renderRS(stepStatus);
        }
        return null;
      default: {
        break;
      }
    }
  };
  const renderStepIndicator = (params: any) =>
    getStepIndicatorIconConfig(params);

  const renderComponent = () => {
    switch (currentPosition) {
      case 0:
        if (headerText !== 'MOVING TO') {
          // setHeaderText(headerText);
        }
        if (bookingFor === 'Others') {
          return (
            <FriendsDetails
              bookingFor={bookingFor}
              movementType={movementType}
              navigation={props.navigation}
              onPageChange={onPageChange}
            />
          );
        }
        return (
          <MovingForm
            bookingFor={bookingFor}
            movementType={movementType}
            navigation={props.navigation}
            onPageChange={onPageChange}
          />
        );
      case 1:
        if (headerText !== 'DATE OF MOVEMENT') {
          // setHeaderText(headerText);
        }
        if (bookingFor === 'Others') {
          return (
            <MovingForm
              bookingFor={bookingFor}
              movementType={movementType}
              navigation={props.navigation}
              onPageChange={onPageChange}
            />
          );
        }
        return (
          <DateOfMovement
            bookingFor={bookingFor}
            movementType={movementType}
            navigation={props.navigation}
            onPageChange={onPageChange}
          />
        );
      case 2:
        if (headerText !== 'REQUIREMENT DETAILS') {
          // setHeaderText(headerText);
        }
        if (bookingFor === 'Others') {
          return (
            <DateOfMovement
              bookingFor={bookingFor}
              movementType={movementType}
              navigation={props.navigation}
              onPageChange={onPageChange}
            />
          );
        }
        return (
          <RequirementDetails
            bookingFor={bookingFor}
            movementType={movementType}
            navigation={props.navigation}
            onPageChange={onPageChange}
          />
        );
      case 3:
        if (headerText !== 'Initial Quote') {
          // setHeaderText(headerText);
        }
        if (bookingFor === 'Others') {
          return (
            <RequirementDetails
              bookingFor={bookingFor}
              movementType={movementType}
              navigation={props.navigation}
              onPageChange={onPageChange}
            />
          );
        }
        if (orderBooked) {
          return (
            <Timer
              bookingFor={bookingFor}
              movementType={movementType}
              navigation={props.navigation}
              onPageChange={onPageChange}
            />
          );
        }
        return (
          <InitialQuote
            orderBooked={orderBooked}
            handleBooking={() => setOrderBooked(true)}
            bookingFor={bookingFor}
            movementType={movementType}
            navigation={props.navigation}
            onPageChange={onPageChange}
          />
        );
      case 4:
        if (orderBooked) {
          return (
            <Timer
              bookingFor={bookingFor}
              movementType={movementType}
              navigation={props.navigation}
              onPageChange={onPageChange}
            />
          );
        }
        return (
          <InitialQuote
            orderBooked={orderBooked}
            handleBooking={() => setOrderBooked(true)}
            bookingFor={bookingFor}
            movementType={movementType}
            navigation={props.navigation}
            onPageChange={onPageChange}
          />
        );
    }
  };
  return (
    <View style={{flex: 1, backgroundColor: Colors.pageBG}}>
      <SimpleHeader
        headerText={headerText}
        navigation={props.navigation}
        onBack={() => {
          if (currentPosition > 0) {
            setCurrentPosition(currentPosition - 1);
          } else {
            props.navigation.goBack();
          }
        }}
      />
      <LinearGradient colors={[Colors.pageBG, Colors.white]} style={{flex: 1}}>
        {currentPosition !== 0 && (
          <LocationDistance onEditClick={() => setCurrentPosition(0)} />
        )}
        <View style={{paddingVertical: hp(2)}}>
          <StepIndicator
            stepCount={bookingFor === 'Myself' ? 4 : 5}
            customStyles={customStyles}
            currentPosition={currentPosition}
            onPress={(text) => onPageChange(text)}
            renderStepIndicator={renderStepIndicator}
          />
        </View>
        {renderComponent()}
      </LinearGradient>
    </View>
  );
};

export default BookingStepper;

const styles = StyleSheet.create({});
