import React from 'react';
import {View, StyleSheet, Text, Pressable, Platform, Image} from 'react-native';
import SimpleHeader from '../../../components/simpleHeader';
import {Colors, hp, wp, boxShadow} from '../../../constant/colors';
import LinearGradient from 'react-native-linear-gradient';
import StepIndicator from 'react-native-step-indicator';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import MovingForm from './moveForm/movingForm';
import DateOfMovement from './moveForm/dateOfMovement';
import RequirementDetails from './moveForm/requirementDetails';
import InitialQuote from './moveForm/initialQuote';
import Timer from './moveForm/timer';

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
  const [currentPosition, setCurrentPosition] = React.useState(0);
  let headerText = 'MOVING TO';

  const onPageChange = (position) => {
    // if (currentPosition > position) {
      setCurrentPosition(position);
    // }
  };

  const getStepIndicatorIconConfig = ({
    position,
    stepStatus,
  }: {
    position: number,
    stepStatus: string,
  }) => {
    const iconConfig = {
      name: 'feed',
      color: stepStatus === 'finished' ? Colors.darkBlue : '#fe7013',
      size: 15,
    };
    switch (position) {
      case 0: {
        iconConfig.name = 'shopping-cart';
        break;
      }
      case 1: {
        iconConfig.name = 'location-on';
        break;
      }
      case 2: {
        iconConfig.name = 'assessment';
        break;
      }
      case 3: {
        iconConfig.name = 'payment';
        break;
      }
      default: {
        break;
      }
    }
    return iconConfig;
  };
  const renderStepIndicator = (params: any) => (
    <MaterialIcons {...getStepIndicatorIconConfig(params)} size={30} />
  );
  const renderComponent = () => {
    switch (currentPosition) {
      case 0:
        return (
          <MovingForm
            navigation={props.navigation}
            onPageChange={onPageChange}
          />
        );
      case 1:
        headerText = 'DATE OF MOVEMENT';
        return (
          <DateOfMovement
            navigation={props.navigation}
            onPageChange={onPageChange}
          />
        );
      case 2:
        headerText = 'REQUIREMENT DETAILS';
        return (
          <RequirementDetails
            navigation={props.navigation}
            onPageChange={onPageChange}
          />
        );
      case 3:
        headerText = 'Initial Quote';
        return (
          <Timer navigation={props.navigation} onPageChange={onPageChange} />
        );
        return (
          <InitialQuote
            navigation={props.navigation}
            onPageChange={onPageChange}
          />
        );
    }
  };
  return (
    <View style={{flex: 1, backgroundColor: Colors.pageBG}}>
      <SimpleHeader headerText={headerText} navigation={props.navigation} />
      <LinearGradient colors={[Colors.pageBG, Colors.white]} style={{flex: 1}}>
        {currentPosition !== 0 && (
          <View
            style={{
              backgroundColor: Colors.white,
              marginTop: hp(2),
              padding: hp(2),
              flexDirection: 'row',
            }}>
            <View />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                flex: 1,
              }}>
              <View>
                <Text style={styles.locationText}>CHENNAI</Text>
                <Text style={styles.locationText}>BENGALURU</Text>
              </View>
              <View>
                <Text style={styles.locationText}>DISTANCE</Text>
                <Text
                  style={{
                    fontFamily: 'Roboto-Bold',
                    fontSize: wp(5),
                    color: Colors.inputTextColor,
                    marginTop: hp(2),
                  }}>
                  314KM
                </Text>
              </View>
            </View>
          </View>
        )}
        <View style={{paddingVertical: hp(2)}}>
          <StepIndicator
            stepCount={4}
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

const styles = StyleSheet.create({
  locationText: {
    fontFamily: 'Gilroy-Light',
    color: Colors.inputTextColor,
    fontSize: wp(4.5),
    marginTop: hp(2),
  },
});
