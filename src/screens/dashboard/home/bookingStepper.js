import React, {useEffect, useState} from 'react';
import {View, BackHandler} from 'react-native';
import SimpleHeader from '../../../components/simpleHeader';
import {Colors, hp} from '../../../constant/colors';
import LinearGradient from 'react-native-linear-gradient';
import StepIndicator from 'react-native-step-indicator';
import MovingForm from './mySelf/movingForm';
import DateOfMovement from './mySelf/dateOfMovement';
import RequirementDetails from './mySelf/requirementDetails';
import InitialQuote from './mySelf/initialQuote';
import Timer from './mySelf/timer';
import LocationDistance from '../../../components/locationDistance';
import FriendsDetails from './mySelf/friendsDetails';
import Feather from 'react-native-vector-icons/Feather';
import ActivePinMap from '../../../assets/svg/active_pin_map.svg';
import FinishMapPin from '../../../assets/svg/finish_map_pin.svg';
import InActiveCalender from '../../../assets/svg/inactive_calender.svg';
import ActiveCalender from '../../../assets/svg/active_calender.svg';
import FinishCalender from '../../../assets/svg/finish_calender.svg';
import InActiveBed from '../../../assets/svg/inactive_bed.svg';
import ActiveBed from '../../../assets/svg/active_bed.svg';
import FinishBed from '../../../assets/svg/finish_bed.svg';
import InActiveRs from '../../../assets/svg/inactive_rs.svg';
import ActiveRs from '../../../assets/svg/active_rs.svg';
import ActiveFriends from '../../../assets/svg/active_friends.svg';
import FinishFriends from '../../../assets/svg/finish_friends.svg';
import {
  CustomAlert,
  CustomConsole,
  resetNavigator,
} from '../../../constant/commonFun';
import {useDispatch} from 'react-redux';
import {APICall, getAllInventories} from '../../../redux/actions/user';
import {STORE} from '../../../redux';
import {STYLES} from '../../../constant/commonStyle';
import BackConfirmation from '../../../components/backConfirmation';

const BookingStepper = (props) => {
  const dispatch = useDispatch();
  const [currentPosition, setCurrentPosition] = useState(0);
  const bookingFor = props?.route?.params?.bookingFor || 'Myself';
  const movementType = props?.route?.params?.movementType || {};
  const booking_id = props?.route?.params?.booking_id || null;
  const [headerText, setHeaderText] = useState(
    bookingFor === 'Myself' ? 'MOVING TO' : '',
  );
  const [movingFrom, setMovingFrom] = useState(false);
  const [confirmationText, setConfirmationText] = useState(
    'We are sorry to see you leave.\n' +
      'You are just few steps away from movement.\n' +
      'Are you sure?',
  );
  const [data, setData] = useState({
    booking_id: booking_id,
    service_id: movementType?.id,
    source: {
      lat: 21.1702,
      lng: 72.8311,
      meta: {
        geocode: '',
        floor: 0,
        city: '',
        state: '',
        pincode: '',
        lift: 0,
        shared_service: false,
        address_line1: '',
        address_line2: '',
      },
    },
    destination: {
      lat: 21.1702,
      lng: 72.8311,
      meta: {
        geocode: '',
        floor: 0,
        city: '',
        state: '',
        pincode: '',
        lift: 0,
        address_line1: '',
        address_line2: '',
      },
    },
    contact_details: {
      name: '',
      phone: '',
      email: '',
    },
    meta: {
      self_booking: bookingFor === 'Myself',
      subcategory: null,
      customer: {
        remarks: '',
      },
      images: [],
    },
    movement_dates: [],
    inventory_items: [],
  });
  const [selectedSubCategory, setSelectedSubCategory] = useState({});
  const [apiResponse, setApiResponse] = useState({});
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  useEffect(() => {
    switch (currentPosition) {
      case 0:
        if (bookingFor === 'Others') {
          setHeaderText("FRIEND'S DETAILS");
        } else {
          setHeaderText('MAKE MOVE');
        }
        break;
      case 1:
        if (bookingFor === 'Others') {
          setHeaderText('MAKE MOVE');
        } else {
          setHeaderText('CHOOSE A DATE');
        }
        break;
      case 2:
        if (bookingFor === 'Others') {
          setHeaderText('CHOOSE A DATE');
        } else {
          setHeaderText('REQUIREMENT DETAILS');
        }
        break;
      case 3:
        if (bookingFor === 'Others') {
          setHeaderText('REQUIREMENT DETAILS');
        } else {
          if (apiResponse?.bid_result_at !== null) {
            setHeaderText('PROCEED FOR BIDDING');
          } else {
            setHeaderText('PRICE ESTIMATION');
          }
        }
        break;
      case 4:
        if (bookingFor === 'Others') {
          if (apiResponse?.bid_result_at !== null) {
            setHeaderText('PROCEED FOR BIDDING');
          } else {
            setHeaderText('PRICE ESTIMATION');
          }
        } else {
          setHeaderText('');
        }
        break;
      default: {
        break;
      }
    }
  }, [currentPosition, apiResponse, movingFrom]);

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backButtonHandler);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', backButtonHandler);
    };
  }, []);

  const backButtonHandler = () => {
    setConfirmationVisible(true);
    return true;
  };

  const onPageChange = (position) => {
    // if (currentPosition > position) {
    setCurrentPosition(position);
    // }
  };

  const renderFriends = (stepStatus) => {
    if (stepStatus === 'current') {
      return <ActiveFriends width={hp(9)} height={hp(9)} />;
    } else if (stepStatus === 'finished') {
      return <FinishFriends width={hp(9)} height={hp(9)} />;
    } else {
      return null;
    }
  };
  const renderMapPin = (stepStatus) => {
    if (stepStatus === 'current') {
      return <ActivePinMap width={hp(3.5)} height={hp(3.5)} />;
    } else if (stepStatus === 'finished') {
      return <FinishMapPin width={hp(3.5)} height={hp(3.5)} />;
    } else {
      return <Feather name={'map-pin'} size={hp(3.5)} color={'#9597B1'} />;
    }
  };
  const renderCalender = (stepStatus) => {
    if (stepStatus === 'current') {
      return <ActiveCalender width={hp(3.5)} height={hp(3.5)} />;
    } else if (stepStatus === 'finished') {
      return <FinishCalender width={hp(3.5)} height={hp(3.5)} />;
    } else {
      return <InActiveCalender width={hp(3.5)} height={hp(3.5)} />;
    }
  };
  const renderBed = (stepStatus) => {
    if (stepStatus === 'current') {
      return <ActiveBed width={hp(3.5)} height={hp(3.5)} />;
    } else if (stepStatus === 'finished') {
      return <FinishBed width={hp(3.5)} height={hp(3.5)} />;
    } else {
      return <InActiveBed width={hp(3.5)} height={hp(3.5)} />;
    }
  };
  const renderRS = (stepStatus) => {
    if (stepStatus === 'current') {
      return <ActiveRs width={hp(3.5)} height={hp(3.5)} />;
    } else if (stepStatus === 'finished') {
      return null;
    } else {
      return <InActiveRs width={hp(3.5)} height={hp(3.5)} />;
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
          return renderFriends(stepStatus);
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
  const handleStateChange = (key, value) => {
    setData({
      ...data,
      [key]: value,
    });
  };
  const handleBooking = (service_type) => {
    //Accept order
    let obj = {
      url: 'bookings/confirm',
      method: 'post',
      headers: {
        Authorization: 'Bearer ' + STORE.getState().Login?.loginData?.token,
      },
      data: {
        service_type: service_type,
        public_booking_id: apiResponse?.public_booking_id,
      },
    };
    APICall(obj)
      .then((res) => {
        if (res?.data?.status === 'success') {
          setApiResponse(res?.data?.data?.booking);
        } else {
          CustomAlert(res?.data?.message);
        }
      })
      .catch((err) => {
        CustomConsole(err);
      });
  };
  const renderStepIndicator = (params: any) =>
    getStepIndicatorIconConfig(params);

  const renderComponent = () => {
    switch (currentPosition) {
      case 0:
        if (headerText !== 'MAKE MOVE') {
          // setHeaderText(headerText);
        }
        if (bookingFor === 'Others') {
          return (
            <FriendsDetails
              data={data}
              handleStateChange={handleStateChange}
              bookingFor={bookingFor}
              movementType={movementType}
              navigation={props.navigation}
              onPageChange={onPageChange}
            />
          );
        }
        return (
          <MovingForm
            data={data}
            handleStateChange={handleStateChange}
            movingFrom={movingFrom}
            changeTo={() => setMovingFrom(true)}
            bookingFor={bookingFor}
            movementType={movementType}
            navigation={props.navigation}
            onPageChange={onPageChange}
          />
        );
      case 1:
        if (headerText !== 'CHOOSE A DATE') {
          // setHeaderText(headerText);
        }
        if (bookingFor === 'Others') {
          return (
            <MovingForm
              data={data}
              handleStateChange={handleStateChange}
              movingFrom={movingFrom}
              changeTo={() => setMovingFrom(true)}
              bookingFor={bookingFor}
              movementType={movementType}
              navigation={props.navigation}
              onPageChange={onPageChange}
            />
          );
        }
        return (
          <DateOfMovement
            data={data}
            handleStateChange={handleStateChange}
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
              data={data}
              handleStateChange={handleStateChange}
              bookingFor={bookingFor}
              movementType={movementType}
              navigation={props.navigation}
              onPageChange={onPageChange}
            />
          );
        }
        return (
          <RequirementDetails
            data={data}
            selectedSubCategory={selectedSubCategory}
            handleSelectedSubCategory={(text) => setSelectedSubCategory(text)}
            apiResponse={apiResponse}
            setApiResponse={setApiResponse}
            handleStateChange={handleStateChange}
            bookingFor={bookingFor}
            movementType={movementType}
            navigation={props.navigation}
            onPageChange={onPageChange}
          />
        );
      case 3:
        if (headerText !== 'PRICE ESTIMATION') {
          // setHeaderText(headerText);
        }
        if (bookingFor === 'Others') {
          return (
            <RequirementDetails
              data={data}
              selectedSubCategory={selectedSubCategory}
              handleSelectedSubCategory={(text) => setSelectedSubCategory(text)}
              apiResponse={apiResponse}
              setApiResponse={setApiResponse}
              handleStateChange={handleStateChange}
              bookingFor={bookingFor}
              movementType={movementType}
              navigation={props.navigation}
              onPageChange={onPageChange}
            />
          );
        }
        if (apiResponse?.bid_result_at !== null) {
          return (
            <Timer
              data={data}
              apiResponse={apiResponse}
              setApiResponse={setApiResponse}
              handleStateChange={handleStateChange}
              bookingFor={bookingFor}
              movementType={movementType}
              navigation={props.navigation}
              onPageChange={onPageChange}
            />
          );
        }
        return (
          <InitialQuote
            data={data}
            apiResponse={apiResponse}
            setApiResponse={setApiResponse}
            handleStateChange={handleStateChange}
            handleBooking={handleBooking}
            bookingFor={bookingFor}
            movementType={movementType}
            navigation={props.navigation}
            onPageChange={onPageChange}
          />
        );
      case 4:
        if (apiResponse?.bid_result_at !== null) {
          return (
            <Timer
              apiResponse={apiResponse}
              setApiResponse={setApiResponse}
              data={data}
              handleStateChange={handleStateChange}
              bookingFor={bookingFor}
              movementType={movementType}
              navigation={props.navigation}
              onPageChange={onPageChange}
            />
          );
        }
        return (
          <InitialQuote
            apiResponse={apiResponse}
            setApiResponse={setApiResponse}
            data={data}
            handleStateChange={handleStateChange}
            handleBooking={handleBooking}
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
        closeIcon={!!apiResponse?.public_booking_id}
        navigation={props.navigation}
        onBack={() => {
          if (apiResponse?.public_booking_id) {
            resetNavigator(props, 'Dashboard');
          } else {
            if (movingFrom) {
              setMovingFrom(false);
            } else {
              if (currentPosition > 0) {
                setCurrentPosition(currentPosition - 1);
              } else {
                setConfirmationText(
                  'We are sorry to see you leave.\n' +
                    'You are just few steps away from movement.\n' +
                    'Are you sure?',
                );
                setConfirmationVisible(true);
                // props.navigation.goBack();
              }
            }
          }
        }}
      />
      <LinearGradient colors={[Colors.pageBG, Colors.white]} style={{flex: 1}}>
        {((bookingFor === 'Others' && currentPosition > 1) ||
          (bookingFor === 'Myself' && currentPosition > 0)) && (
          <LocationDistance
            isEdit={!apiResponse?.public_booking_id}
            onEditClick={() => {
              setMovingFrom(false);
              setCurrentPosition(0);
            }}
            from={data?.source?.meta?.geocode + data?.source?.meta?.city}
            to={
              data?.destination?.meta?.geocode + data?.destination?.meta?.city
            }
            distance={{
              source: {
                lat: data?.source?.lat,
                lng: data?.source?.lng,
              },
              destination: {
                lat: data?.destination?.lat,
                lng: data?.destination?.lng,
              },
            }}
          />
        )}
        <View style={{paddingVertical: hp(2)}}>
          <StepIndicator
            stepCount={bookingFor === 'Myself' ? 4 : 5}
            customStyles={STYLES.stepperStyle}
            currentPosition={currentPosition}
            renderStepIndicator={renderStepIndicator}
            // onPress={onPageChange}
          />
        </View>
        {renderComponent()}
      </LinearGradient>
      <BackConfirmation
        visible={confirmationVisible}
        data={data}
        closeIcon={() => setConfirmationVisible(false)}
        text={confirmationText}
        navigation={props.navigation}
      />
    </View>
  );
};

export default BookingStepper;
